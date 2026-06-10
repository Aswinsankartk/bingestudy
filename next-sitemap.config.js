/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://bingestudy.vercel.app", // Your website URL
  generateRobotsTxt: true, // Generates a robots.txt file automatically
  generateIndexSitemap: false, // Set to true if you have over 50,000 URLs
  outDir: "public", // Outputs the files directly to your public folder
};
