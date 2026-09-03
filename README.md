# Mikhael Hilaly — personal portfolio

Live site: https://mhilaly.github.io/Mikhael-Hilaly-Website/

A professional portfolio focused on data analytics, applied AI, and opportunities across industries. Sports research is one application area alongside business forecasting, nonprofit analysis, and professional work in AI evaluation and data quality. The static HTML, CSS, and JavaScript site is hosted at the existing GitHub Pages address. No Cursor account, paid development service, framework, or package installation is needed to maintain it.

## Files

- `index.html`: all public content, navigation, project links, resume links, and social/search metadata.
- `styles.css`: warm ivory surfaces, wine/gold/teal/blue accents, a connected work-experience timeline and education cards, responsive layout, focus states, and reduced-motion support.
- `script.js`: accessible mobile navigation, active section indication, and Formspree submission handling.
- `assets/Mikhael_Hilaly_Resume.pdf`: the current public resume, used by every resume button.
- `Mikhael_Hilaly_Resume.docx.pdf`: compatibility copy of the current resume for previously shared links.
- `assets/profile.webp`: optimized copy of the original portrait; the original JPEG remains available.
- `assets/wbb-contender-projections.png`: chart from the WBB project.
- `assets/social-preview-data-ai.png`: current social sharing image for the data and AI positioning.
- `assets/social-preview.png`: retained previous sharing image for existing links.
- `assets/favicon.svg`: MH favicon.
- `scripts/validate.py`: dependency-free content and asset checks.
- `.github/workflows/validate.yml`: validation on pushes to main and pull requests.

The other original root-level resume PDFs and photographs are retained for existing links. New links should always use the canonical PDF in `assets/`.

## Local development

From this repository directory:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Edit the source and refresh the page. All site assets use relative paths so the GitHub Pages repository subpath continues to work.

Validate before publishing:

```sh
python scripts/validate.py
node --check script.js
node --test scripts/contact-form.test.cjs
```

The checks cover HTML structure, unique anchors, linked local files, PDF signatures, form labels, image dimensions, social metadata, JavaScript syntax, and contact form failure handling. They do not submit a real contact message. Visual browser checks and end-to-end delivery require separate manual review.

## Updating content

1. Preserve the cross-industry career positioning: lead with data analytics, applied AI, business problem-solving, and transferable skills. Keep sports as a project domain and personal interest. Use a timeline only for work experience: Scoop, PlanYear, and Galileo. COOP is education/training, alongside USC and Sports Business Classroom in Education & professional development. Present those programs and the separate Chess Club leadership role as ordinary cards. Use dates from the approved source. Verify new facts against the latest resume or project source. Do not invent results, employment dates, or links. A fellowship with an expected completion date must remain described as in progress.
2. Keep WBB inside the Sports analytics section, with all sports projects above Business & nonprofit analytics. Add new research to the featured area, move the previous feature into the project collection, and keep the total analytics-project count consistent. Include a research question, clear result, methods, and a working source link. State model limitations next to performance metrics.
3. Replace both current resume copies with the same approved PDF. Verify it opens, then align experience, education, skills, and contact details in the HTML. Do not overwrite the other archived PDFs unless requested.
4. Preserve section IDs (`home`, `projects`, `about`, `experience`, `education`, `leadership`, `resume`, `contact`) and the GitHub Pages address. Keep personal contact details intentional and avoid adding analytics/tracking services without a request.
5. Run validation, review the diff, commit, and push to `main`. GitHub Pages publishes the updated branch through the existing configuration. Check the public page and PDF after deployment; a successful push alone is not evidence that Pages has finished.
6. If a release needs to be undone, revert its commit and publish the revert. Do not force-push shared history.

## Content sources for the September 2026 update

- WBB project: https://github.com/MHilaly/usc-womens-basketball-analytics
- WBB article: https://usc-2027-title-case.mikhael-hilaly.chatgpt.site/
- WBB model: 3,607 Division I team-seasons, 22 preseason features, Ridge regression, rolling validation on 1,990 held-out observations, MAE 4.63 SRS points, USC projection 35.53 SRS. This is a team-strength estimate, not a title probability.
- WBB chart: `figures/model-contender-projections.png` from the project, by Mikhael Hilaly. Other teams in the chart are the four modeled contenders, not a full Division I ranking.
- NFL project: https://github.com/MHilaly/QB-Mobility-Analysis
- Resume: `Mikhael_Hilaly_Resume_Final_Polished_Linked.pdf`, latest local version dated August 31, 2026. Published without changing the document.
- Other project summaries and older leadership experience: retained from the previous website.
- LinkedIn profile: https://www.linkedin.com/in/mhilaly — public profile reviewed September 2026 for six Dean's List honors, volunteering, the karate credential, and the NBA CBA, field-goal, and Peregrine project dates.
- LinkedIn graduation post: https://www.linkedin.com/posts/mhilaly_in-january-of-2023-i-moved-across-the-country-activity-7462223524947013632-GdLs — degree wording, two intramural football championships, and team leadership.
- USC Chess Club sports website: https://mhilaly.github.io/Chess-Club-IM-Sports/ — linked from the profile and confirmed available.
- The approved resume takes priority when dates differ: the quarterback and NBA position-prediction projects retain the resume's dates. Public LinkedIn did not expose the Palo Alto Investors title, dates, or responsibilities, so no role was inferred from the employer name. The supplied resume PDF remains unchanged.

The September 2026 narrative leads with AI/data experience. The project collection presents Sports analytics first, with WBB as its featured article and the other four sports projects beneath it; the hotel and nonprofit projects follow in Business & nonprofit analytics. Career interests reflect the user’s explicit direction; professional claims and project results retain their existing sources. The approved resume PDF has not been rewritten. The subsequent visual refresh uses warmer surfaces and connected, dated role cards; The work-experience timeline contains Scoop, PlanYear, and Galileo. USC, COOP, and SBC appear as education/development cards; Chess Club is a separate leadership card. COOP is not employment.

## Contact form

The existing endpoint is `https://formspree.io/f/xanjbojz`. Native POST works without JavaScript. JavaScript adds an in-page status, duplicate-send prevention, and a timeout. A successful HTTP response is required before showing success or clearing the form. On failure, entered text stays available and the visitor can use the email link. Changes to the Formspree account or email delivery must be verified in that service; local validation does not prove inbox delivery.

## Future maintenance

This repository is the source of truth for continued development in Codex or any editor. Automated validation runs when code changes. It does not autonomously monitor new projects or revise career claims; future content updates should be grounded in the user's supplied material.
