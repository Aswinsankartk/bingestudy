export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/privacy", "/terms", "/contact"],
        disallow: [
          "/api",
          "/auth",
          "/dashboard",
          "/group",
          "/profile",
          "/sentry-example-page",
        ],
      },
    ],
    sitemap: "https://bingestudy.vercel.app/sitemap.xml",
  };
}
