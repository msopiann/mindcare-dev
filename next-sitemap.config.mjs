const siteUrl = process.env.APP_URL ?? "http://localhost:3000";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: ["/auth/*", "/api/*", "/dashboard*", "/forbidden"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/auth", "/api", "/dashboard"] },
    ],
  },
  additionalSitemaps: [`${siteUrl}/server-sitemap.xml`],
};

export default config;
