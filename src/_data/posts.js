import Fetch from "@11ty/eleventy-fetch";

// Pulls published posts from the Beehiiv v2 API. Requires the
// BEEHIIV_API_KEY environment variable; when it's absent (e.g. a local
// build before the key is set up) the blog renders empty rather than
// failing the build. The publication id is public, so it lives here.
const DEFAULT_PUBLICATION_ID = "pub_f891eeaf-3a2f-4dbe-ab4f-9da4ab64d4ec";

// Beehiiv's free_web_content is a complete HTML document (doctype, head,
// fonts, stylesheets). We only want the article markup: the site provides
// its own styling, and WebC refuses external <script>/<link> tags injected
// via @html.
function extractPostBody(fullDocument) {
  const match = fullDocument.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let html = match ? match[1] : fullDocument;
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<link[^>]*>/gi, "");
  // Drop Beehiiv's own post header (title, byline, share icons) — the post
  // template renders its own title and date.
  html = html.replace(
    /<div id=['"]web-header['"][\s\S]*?(?=<div id=['"]content-blocks['"])/,
    "",
  );
  return html;
}

export default async function () {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId =
    process.env.BEEHIIV_PUBLICATION_ID || DEFAULT_PUBLICATION_ID;

  if (!apiKey) {
    console.warn(
      "[posts] BEEHIIV_API_KEY not set — building with no blog posts.",
    );
    return [];
  }

  const posts = [];
  let page = 1;
  let totalPages = 1;

  do {
    const url =
      `https://api.beehiiv.com/v2/publications/${publicationId}/posts` +
      `?status=confirmed&order_by=publish_date&direction=desc` +
      `&expand[]=free_web_content&page=${page}`;

    const response = await Fetch(url, {
      duration: "1h",
      type: "json",
      fetchOptions: {
        headers: { Authorization: `Bearer ${apiKey}` },
      },
    });

    posts.push(...(response.data ?? []));
    totalPages = response.total_pages ?? 1;
    page += 1;
  } while (page <= totalPages);

  return posts
    .filter((post) => post.publish_date)
    .map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      subtitle: post.subtitle,
      date: new Date(post.publish_date * 1000),
      dateDisplay: new Date(post.publish_date * 1000).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      ),
      html: extractPostBody(post.content?.free?.web ?? ""),
    }));
}
