import type { MetadataRoute } from "next";

const baseUrl = "https://takken-gakushu-site.vercel.app";

const routes = [
  "/",
  "/practice",
  "/past",
  "/review",
  "/weakness",
  "/traps",
  "/courses",
  "/advertising",
  "/privacy",
  "/terms",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
  }));
}
