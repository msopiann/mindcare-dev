import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const siteUrl = process.env.APP_URL ?? "http://localhost:3000";

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/auth/*", "/api/*", "/dashboard", "/404", "/500"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/auth", "/api"] },
    ],
  },
  additionalSitemaps: [`${siteUrl}/server-sitemap.xml`],
  additionalPaths: async (config) => {
    const events = await prisma.event.findMany({
      where: { published: true },
      select: { slug: true },
    });
    const resources = await prisma.resource.findMany({
      where: { published: true },
      select: { slug: true },
    });

    const eventPaths = events.map(({ slug }) => ({
      loc: `${config.siteUrl}/events/${slug}`,
      changefreq: "daily",
      priority: 0.8,
    }));
    const resourcePaths = resources.map(({ slug }) => ({
      loc: `${config.siteUrl}/resources/${slug}`,
      changefreq: "weekly",
      priority: 0.7,
    }));

    return [...eventPaths, ...resourcePaths];
  },
};

export default config;
