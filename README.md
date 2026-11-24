# Paddle Game - download website

Static site (HTML, CSS, vanilla JS). No frameworks, no trackers, no external CDNs. Works on GitHub Pages and Cloudflare Pages. The APK is **not** in this repo; it is hosted on GitHub Releases.

## What to edit

| What | Where |
|---|---|
| Download URL, releases URL, version, file name, size, SHA-256, release date, contact | Config block at the top of `script.js` (single source of truth) |
| Real screenshots | Replace `assets/images/shot-1` to `shot-6` (see below) |
| Domain (`YOUR-DOMAIN`) | `index.html` (canonical, Open Graph, Twitter), `robots.txt`, `sitemap.xml` |
| "To be confirmed" items (headset models, storage, price/licence, gameplay video) | `index.html`, search for `tbc` |
| Team section | `index.html`, section `#credits`; delete the Team card to remove it |
| Privacy "Last updated" date | `privacy.html` |

If `GITHUB_RELEASE_ASSET_URL` still contains `PASTE_`, the DOWNLOAD APK button is disabled and says "Download coming soon". The site never starts a download by itself and never invents a URL.

## Replace the screenshots

The six gallery images are placeholders (`assets/images/shot-1.svg` to `shot-6.svg`): main menu, settings, match setup, racket in hand, court with scoreboard, rally.

1. Export your real screenshots as WebP or JPEG at 1280x720 (for example `shot-1.webp`).
2. Put them in `assets/images/`.
3. In `index.html`, change each `shot-N.svg` to `shot-N.webp` (it appears in `data-full`, in the `<img src>`, and for shot-5 also in the hero).
4. Add `assets/images/og.jpg` (1200x630) for link previews.

## Step 1: Create the GitHub Release with the APK

1. Create a GitHub repository for your APK releases (it can be the same repo as this site).
2. Open the repo, then **Releases**, then **Draft a new release**.
3. Create a tag such as `v1.0.0` and a title such as `Paddle Game v1.0.0`.
4. Attach `PaddleGameApk.apk` by dragging it into the assets box. Keep the file name exactly `PaddleGameApk.apk`.
5. Add the release notes and click **Publish release**.

## Step 2: Copy the asset URL

The direct URL has this shape:

```
https://github.com/<user>/<repo>/releases/download/<tag>/PaddleGameApk.apk
```

Or right-click the APK in the release's Assets list and copy the link address. The releases page URL is `https://github.com/<user>/<repo>/releases`.

## Step 3: Paste it into the config

In `script.js`:

```js
const GITHUB_RELEASE_ASSET_URL = "https://github.com/<user>/<repo>/releases/download/v1.0.0/PaddleGameApk.apk";
const RELEASES_PAGE_URL = "https://github.com/<user>/<repo>/releases";
const FILE_SIZE = "xx.x MB";   // from the real file properties
const SHA256 = "...";          // see below
```

Get the SHA-256 on Windows: `certutil -hashfile PaddleGameApk.apk SHA256`. On macOS or Linux: `shasum -a 256 PaddleGameApk.apk`.

## Step 4a: Deploy on GitHub Pages

1. Push the contents of this folder to a GitHub repository (the `index.html` must be at the root).
2. Repo **Settings**, then **Pages**.
3. Source: **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. After a minute the site is live at `https://<user>.github.io/<repo>/`.
5. The included `.nojekyll` file stops GitHub from processing the files.

Note: on a project site (`/<repo>/`) the custom 404 page is only used when the site is served from a custom domain or a user site, because GitHub Pages looks for `404.html` at the site root. All links in this project are relative, so everything else works under any sub-path.

## Step 4b: Deploy on Cloudflare Pages

1. Cloudflare dashboard, **Workers & Pages**, **Create**, **Pages**, **Connect to Git**, pick your repo.
2. Framework preset: **None**. Build command: leave empty. Build output directory: `/` (the repo root).
3. Click **Save and Deploy**. The site goes live at `https://<project>.pages.dev`.
4. Or choose **Upload assets** and upload this folder directly. Cloudflare serves `404.html` automatically.

## Step 5: Attach a custom domain

**GitHub Pages**
1. Repo **Settings**, **Pages**, **Custom domain**, enter `www.example.com`, Save.
2. At your DNS provider add a `CNAME` record: `www` pointing to `<user>.github.io`.
3. For an apex domain (`example.com`) add four `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (confirm these in GitHub's current docs).
4. Wait for DNS, then tick **Enforce HTTPS**.

**Cloudflare Pages**
1. Your project, **Custom domains**, **Set up a custom domain**.
2. If the domain's DNS is on Cloudflare the records are added for you. Otherwise add a `CNAME` pointing to `<project>.pages.dev`.
3. HTTPS certificates are issued automatically.

After the domain works, replace every `YOUR-DOMAIN` in `index.html`, `robots.txt` and `sitemap.xml`.

## Before you publish

- Check the licence of every asset in the game (for example any music track, Mixamo animations, BNG framework). Remove anything you cannot redistribute.
- Fill in the "To be confirmed" items or leave them as they are.
- Open the site at phone, tablet and desktop widths and click every button.

## Files

```
index.html  privacy.html  404.html
style.css   script.js
robots.txt  sitemap.xml   .nojekyll
assets/images/   shot-1..6.svg (placeholders)
assets/icons/    favicon.svg
```

Paddle Game is an independently developed application. It is not affiliated with, endorsed by, or sponsored by Meta Platforms, Inc. Meta Quest is a trademark of Meta Platforms, Inc.
