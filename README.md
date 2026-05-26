# Mallory Becker — Portfolio

Senior Product Designer · 2026 portfolio. A single-page hand-built site featuring case studies, a project gallery, and an animated lock screen.

🌐 **Live:** [yourusername.github.io/portfolio](#) *(update once deployed)*

---

## What's here

- `index.html` — the published site (entry point for GitHub Pages)
- `Portfolio.html` — working source file, identical to `index.html`
- `assets/` — images, logos, resume PDF
  - `assets/projects/` — per-case screenshots and slideshow frames
  - `assets/logos/` — company logos
- `.nojekyll` — disables Jekyll processing so files/folders starting with `_` are served as-is

## Tech

Plain HTML / CSS / vanilla JavaScript. No build step. No dependencies. Google Fonts (Inter + Instrument Serif) loaded from a CDN.

Tested in current Chrome, Safari, Firefox.

## Local preview

```sh
# any static server works
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just double-click `index.html`.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` · Folder: `/ (root)`
5. Save. The site goes live at `https://<username>.github.io/<repo>/` in ~1 minute.

> The `.nojekyll` file in this repo tells Pages to skip Jekyll and serve everything as static files.

### Custom domain (optional)

1. Add a `CNAME` file at the repo root containing your domain (e.g. `mallorybecker.studio`).
2. Point an `A` or `CNAME` DNS record at GitHub's Pages IPs.
3. Enable **Enforce HTTPS** in Pages settings.

## Editing

- Project data lives near the bottom of `index.html` in the `PROJECTS` array.
- The lock-screen passcode is set in the inline `<script>` near the top of `<body>` — search for `PASSCODE`.
- Tweaks to colors / typography are in `<style>` at the top of the file (CSS custom properties under `:root`).

## License

© 2026 Mallory Becker. All work and writing are confidential — please don't redistribute without permission.
