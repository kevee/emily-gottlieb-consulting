# Emily Gottlieb Consulting

The site behind [egottconsulting.com](https://egottconsulting.com), built with [**Eleventy**](https://www.11ty.dev/) using [**WebC**](https://www.11ty.dev/docs/languages/webc/) templates and [**Sass**](https://sass-lang.com/) for styles.

## Getting started

You need **NodeJS** 18 or newer. Install dependencies and start the dev server:

```sh
npm install
npm start
```

The site builds to `_site/`. `npm run build` produces a production build.

## Structure

- **`src/_includes/layouts/base.webc` ---** the shared layout component: head, header, nav, and the translucent content container.
- **`src/index.webc` ---** the home page content.
- **`src/blog/` ---** the blog index plus a paginated template that generates one page per Beehiiv post.
- **`src/css/style.scss` ---** all styles, with shared values in `_variables.scss`. Eleventy compiles this to `/css/style.css` at build time.
- **`src/_data/posts.js` ---** fetches published posts from the Beehiiv API at build time.

## Beehiiv

Blog posts come from Beehiiv at build time, so the site stays fully static — no client-side API calls. The publication id is baked into `src/_data/posts.js` (it's public, not a secret). The data file needs one environment variable:

- **`BEEHIIV_API_KEY` ---** an API key from Beehiiv under Settings → Integrations → API.

Without it the build still succeeds, but the blog renders empty. For local development, copy `.env.example` to `.env` and paste your key there — it's loaded automatically via [**dotenv**](https://github.com/motdotla/dotenv) and the file is git-ignored, so the key stays out of the repo. Set `BEEHIIV_PUBLICATION_ID` only if you ever need to point at a different publication.

**Note:** builds cache Beehiiv responses in `.cache/` for an hour. Delete that directory to force a fresh fetch.

## Deploys

Pushing to `main` runs the [deploy workflow](.github/workflows/deploy.yml), which builds the site and publishes `_site/` to the `gh-pages` branch. GitHub Pages should be set to serve from `gh-pages`. The workflow also runs daily at 15:00 UTC so new Beehiiv posts appear without needing a commit.

Add `BEEHIIV_API_KEY` as a repository secret (Settings → Secrets and variables → Actions) so CI builds include posts.
