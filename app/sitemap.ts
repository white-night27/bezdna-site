import type { MetadataRoute } from "next";

const siteUrl = "https://bezdna-bar.ru";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/menu`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/legal`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
