export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login"],
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
