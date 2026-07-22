export default {
  eleventyComputed: {
    permalink: (data) => (data.post ? `/blog/${data.post.slug}/` : false),
    title: (data) =>
      data.post ? `${data.post.title} — Emily Gottlieb Consulting` : undefined,
  },
};
