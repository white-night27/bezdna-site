import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://bezdna-bar.ru/sitemap.xml",
    host: "https://bezdna-bar.ru",
  };
}
