# Yogi Lindsey

Informational site for [yogi-lindsey.com](https://yogi-lindsey.com) — yoga teaching and sound healing in treatment and recovery communities.

## Local development

```bash
npm install
npm run optimize-images   # optional; regenerates public/images from photos/
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Project layout

| Path | Purpose |
|------|---------|
| `photos/` | Original photos (source of truth; not required at runtime) |
| `public/images/` | Optimized web images used by the site |
| `index.html` | Single-page content |
| `src/styles.css` | Palette, layout, responsive styles |
| `src/main.js` | Carousel, scroll reveal, header |
| `scripts/optimize-images.js` | Resize/compress originals into `public/images/` |

## Color palette

- `#809d62` primary — logo, section titles, primary CTAs
- `#435f89` secondary — nav, eyebrows, subheads, brand statement, contact icons, footer
- `#b3b265` highlights
- `#d7cc89` soft accents / atmosphere
- `#808080` muted text

## Deploy to DigitalOcean App Platform

### 1. Push to GitHub

1. Create a new GitHub repository (private or public).
2. From this folder:

```bash
git init
git add .
git commit -m "Initial Yogi Lindsey site"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Keep `photos/` in git if you want a backup of originals, or add `photos/` to `.gitignore` and only commit `public/images/` to keep the repo smaller. Large originals are not required at runtime; the site serves optimized files from `public/images/`.

### 2. Create a Static Site app

1. Sign in to [DigitalOcean](https://cloud.digitalocean.com/).
2. **Apps** → **Create App** → choose your GitHub repo and branch (`main`).
3. DigitalOcean should detect a static site. Confirm:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **HTTP port:** leave default (static sites do not need a runtime port)
4. Choose the basic static site plan and create the app.
5. Wait for the first deploy. Open the generated `*.ondigitalocean.app` URL to verify the site.

### 3. Attach yogi-lindsey.com

1. In the App → **Settings** → **Domains** → **Add Domain**.
2. Add `yogi-lindsey.com` and `www.yogi-lindsey.com`.
3. DigitalOcean will show the DNS records you must create at your domain registrar (wherever you bought the domain).

Typical setup (follow the exact values shown in the DO UI — they can change):

| Type | Host | Value |
|------|------|--------|
| A or ALIAS | `@` | DigitalOcean’s app IP / target |
| CNAME | `www` | your app’s `*.ondigitalocean.app` hostname |

Alternatively, point the domain’s **nameservers** to DigitalOcean and manage DNS in DO Networking → Domains.

### 4. HTTPS

After DNS propagates and validates, App Platform issues and renews TLS certificates automatically. Propagation can take from a few minutes up to 48 hours.

### 5. Later updates

```bash
git add .
git commit -m "Describe your change"
git push
```

App Platform rebuilds and redeploys from the connected branch.

## Contact

Contact icons link to `yogi.lindsey.818@gmail.com` and [Instagram](https://www.instagram.com/yogi_lindsey818).

## Notes

- Two `.HEIC` files in `photos/` could not be converted on this Windows setup (missing HEIF decoder). Export them to JPEG and re-run `npm run optimize-images` if you want them on the site.
- The site respects `prefers-reduced-motion`: carousel autoplay and scroll animations are reduced when requested.
