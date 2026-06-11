# Plan · EDU Lead Magnet Landing Page

## Brief
A standalone landing page for the new "30-Day Brand Audit Checklist" lead magnet, built so visitors can download the PDF in exchange for an email address.

## Stack
- Static HTML/CSS, no framework, no build step
- Existing email capture form embed (Mailchimp) - no new accounts or paid tiers needed

## Scope
**Tier**: edu - **Owner**: EDU lead

**Visuals**
- Hero section with headline, subheadline, and checklist preview image
- Single email-capture form above the fold
- Footer with brand logo and social links matching existing edu pages

**Functionality**
- Form submits email to existing Mailchimp list
- On successful submit, redirects to a thank-you section with the PDF download link

## Out of Scope
- No work in agency/, brandtrue-saas/, or executives/
- No new email platform or list migration
- No A/B testing or analytics integration
- No mobile app version

## Constraints
- Stay inside `edu/resources/` for all new files
- Kebab-case for all new file and folder names
- Add a README.md to any new top-level folder created
- Never read, log, or surface `executives/finance/` contents
- Never commit `.env`
- Single HTML file plus one CSS file, no external JS frameworks

## Definition of Done
`edu/resources/30-day-brand-audit/index.html` opens in a browser, displays the hero and form above the fold, and submitting a valid email shows the thank-you section with a working PDF download link.

## Acceptance Criteria
- `edu/resources/30-day-brand-audit/index.html` exists
- `edu/resources/30-day-brand-audit/styles.css` exists and is linked from index.html
- Hero section renders headline, subheadline, and checklist preview image
- Email form is visible without scrolling at 1280x800
- Submitting a valid email triggers the existing Mailchimp embed
- Thank-you section becomes visible after submit and contains a PDF download link
- No console errors on page load or after submit
- README.md exists in `edu/resources/30-day-brand-audit/`

## Verification
- Open `edu/resources/30-day-brand-audit/index.html` in a browser
- Confirm hero + form render above the fold at 1280x800
- Submit a test email, confirm thank-you section and PDF link appear
- Check browser console for errors throughout

## Turn Budget
Stop after 25 turns, or sooner once the DoD condition holds.

---

## /goal one-liner

```
/goal edu/resources/30-day-brand-audit/index.html opens in a browser with the hero and email form visible above the fold, submitting a valid email reveals a thank-you section with a working PDF download link, zero console errors, stop after 25 turns
```
