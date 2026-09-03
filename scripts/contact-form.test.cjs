// Exercise submission outcomes without sending any network request.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');

function harness(fetchResponse) {
    const status = { dataset: {}, textContent: '' };
    const button = { disabled: false, innerHTML: 'Send Message', textContent: '' };
    let submit, resets = 0, requests = 0;
    const form = {
        action: 'https://example.test/contact',
        reportValidity: () => true,
        querySelector: () => button,
        addEventListener: (_, listener) => { submit = listener; },
        reset: () => { resets++; }
    };
    vm.runInNewContext(source, {
        document: {
            querySelector: () => null,
            getElementById: id => id === 'contactForm' ? form : status
        },
        window: { matchMedia: () => ({}), setTimeout, clearTimeout },
        FormData: class {}, AbortController,
        fetch: async () => { requests++; return fetchResponse(); }
    });
    return { status, button, submit: () => submit({ preventDefault() {} }),
        get resets() { return resets; }, get requests() { return requests; } };
}

test('HTTP failures preserve the message and never claim delivery', async () => {
    const form = harness(() => ({ ok: false }));
    await form.submit();
    assert.equal(form.resets, 0);
    assert.equal(form.status.dataset.state, 'error');
    assert.match(form.status.textContent, /could not be sent/);
    assert.equal(form.button.disabled, false);
});

test('network interruption restores the submit control and preserves text', async () => {
    const form = harness(() => { throw Object.assign(new Error('Timed out'), { name: 'AbortError' }); });
    await form.submit();
    assert.equal(form.resets, 0);
    assert.match(form.status.textContent, /Delivery could not be confirmed/);
    assert.equal(form.button.disabled, false);
});

test('success clears the form once and repeated clicks do not resend', async () => {
    let finish;
    const form = harness(() => new Promise(resolve => { finish = resolve; }));
    const pending = form.submit();
    await form.submit();
    assert.equal(form.requests, 1);
    finish({ ok: true });
    await pending;
    assert.equal(form.resets, 1);
    assert.equal(form.status.dataset.state, 'success');
    assert.equal(form.button.disabled, false);
});
