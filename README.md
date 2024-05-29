# Source code for the Argumentations Agentur Website

Website based on the 11ty starter <https://github.com/ttntm/11ty-landing-page>.

## Changing content

**Requirements:**

1. Eleventy (developed and tested with version 0.12.1)
2. Tailwind CSS

All other dependencies are either linked from a CDN or included in this repository.

**Running locally (for testing):**

1. Fork, clone or download
2. `cd` into the root folder
3. run `npm install`
4. run `npm run serve`
5. open a browser and go to `http://localhost:8080`

After you have done that once, you only need to repeat step 4 & 5 to run the website locally.

**Basic configuration:**

1. Eleventy -> `./.eleventy.js`
2. Tailwind -> `./tailwind.config.js`
3. Netlify -> `./netlify.toml`

CSS is built via PostCSS and based on `./src/_includes/css/_page.css`. Building CSS gets triggered by `./src/css/page.11ty.js` and Tailwind's config is set to JIT (see: [Tailwind docs](https://tailwindcss.com/docs/just-in-time-mode))

Please note that this CSS build _does not_ include the `normalize.css` file used for the 2 regular pages (imprint, privacy) - a minified production version is stored in `./src/static/css` and gets included in the build by default.

**Change Content:**

Page content is stored in

- `./src/`
  - `imprint.md`
  - `privacy.md`
- `./src/sections/`
- `./src/_data/features.json`

**Change Templates/Layout:**

Page structure and templates are stored in `./src/_layouts/` and can be edited there.

Best have a look at `./layouts/base.njk` first to understand how it all comes together - the page itself is constructed from partial templates stored in `./src/includes/` and each section has a corresponding template file (`section.**.njk`) stored there.

`index.njk` in `./src/` arranges everything, meaning that sections can be added/re-ordered/removed/... there.

**Change images:**

Images are stored in `./static/img/`; everything in there can be considered a placeholder that should eventually be replaced with your actual production images.

## Deployment on Github Pages

The basic idea is to publish from a separate github branch by using [gh-pages](https://www.npmjs.com/package/gh-pages). The configuration is based on [https://dev.to/ddhogan/publishing-an-eleventy-site-to-github-pages-40c5](https://dev.to/ddhogan/publishing-an-eleventy-site-to-github-pages-40c5).

1. Install gh-pages (when deploying for the first time): `npm install gh-pages --save-dev`.
2. Build the website: `npm run build` (generates fresh output into the directory `_site`).
3. Deploy on githup: `npm run deploy`.
