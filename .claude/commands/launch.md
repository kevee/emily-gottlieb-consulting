---
description: Start the Eleventy dev server and open a browser preview
---

Launch the site for local development:

1. Start the dev server using the `eleventy` configuration from `.claude/launch.json` (use the browser preview tool `preview_start` with name "eleventy" — do not run the server with Bash). If it's already running, reuse it.
2. Open the preview at http://localhost:8080 and take a screenshot to confirm the site rendered.
3. If the build fails, check the server logs (`preview_logs`) and report the error.

Note: without `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` set in the environment, the blog section builds empty — that's expected locally, not an error.
