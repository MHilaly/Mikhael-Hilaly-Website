'use strict';
// Content, hash links and the native form work without JavaScript.
const navbar = document.querySelector('.navbar');
const menuButton = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const mobileView = window.matchMedia('(max-width: 760px)');
function setMenu(open) {
    navMenu.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
if (navbar && menuButton && navMenu) {
    navbar.classList.add('nav-enhanced');
    menuButton.hidden = false;
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    navMenu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menuButton.focus();
        }
    });
    document.addEventListener('click', event => { if (!navbar.contains(event.target)) setMenu(false); });
    navbar.addEventListener('focusout', event => {
        if (mobileView.matches && !navbar.contains(event.relatedTarget)) setMenu(false);
    });
    mobileView.addEventListener('change', () => setMenu(false));
}
// Native anchor behavior preserves history, deep links and reduced motion.
if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.nav-link')];
    const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (!visible.length) return;
        const id = visible[visible.length - 1].target.id;
        const current = ['more-projects', 'other-projects'].includes(id) ? 'projects' : id;
        links.forEach(link => {
            if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
}
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const status = document.getElementById('form-status');
    const button = contactForm.querySelector('button[type="submit"]');
    contactForm.addEventListener('submit', async event => {
        event.preventDefault();
        if (button.disabled || !contactForm.reportValidity()) return;
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);
        const originalLabel = button.innerHTML;
        button.disabled = true;
        button.textContent = 'Sending…';
        status.dataset.state = 'pending';
        status.textContent = 'Sending your message…';
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST', body: new FormData(contactForm),
                headers: { Accept: 'application/json' }, signal: controller.signal
            });
            if (!response.ok) throw new Error('Submission failed');
            status.dataset.state = 'success';
            status.textContent = 'Thanks! Your message was sent. I’ll get back to you soon.';
            contactForm.reset();
        } catch (error) {
            status.dataset.state = 'error';
            status.textContent = error.name === 'AbortError'
                ? 'The request timed out. Delivery could not be confirmed. Please email me directly at mikhael@hilaly.com.'
                : 'Your message could not be sent. Please try again or email mikhael@hilaly.com.';
        } finally {
            window.clearTimeout(timeout);
            button.disabled = false;
            button.innerHTML = originalLabel;
        }
    });
}
