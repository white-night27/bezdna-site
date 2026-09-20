import type { Metadata } from "next";
import { Caveat, Manrope, Oswald } from "next/font/google";
import "./globals.css";

const siteUrl = "https://bezdna-bar.ru";

const displayFont = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--f-display",
  display: "swap",
});

const labelFont = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: "500",
  variable: "--f-label",
  display: "swap",
  preload: false,
});

const bodyFont = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--f-body",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "БЕЗДНА — тапрум и кухня, Санкт-Петербург",
  description: "Бездна — тапрум и кухня на Рижском проспекте, Санкт-Петербург. Крафтовое пиво на кранах, бургеры, рёбра и пицца. Ежедневно 16:00–03:00.",
  keywords: ["Бездна", "тапрум", "бар Санкт-Петербург", "Рижский проспект 12", "крафтовое пиво"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: "БЕЗДНА",
    title: "БЕЗДНА — тапрум и кухня, Санкт-Петербург",
    description: "Тёмный тапрум и кухня на Рижском проспекте: краны с крафтом, бургеры, рёбра, пицца и ночной вайб Бездны.",
    images: [{ url: "/og-preview-1200x630-v5.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "БЕЗДНА — тапрум и кухня на Рижском проспекте, 12" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "БЕЗДНА — тапрум и кухня, Санкт-Петербург",
    description: "Тёмный тапрум и кухня на Рижском проспекте: краны с крафтом, бургеры, рёбра и пицца.",
    images: ["/og-preview-1200x630-v5.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/favicon.svg?v=2",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  name: "БЕЗДНА",
  description: "Тапрум и кухня на Рижском проспекте в Санкт-Петербурге.",
  servesCuisine: ["Burgers", "Pizza", "Bar Food"],
  telephone: "+7 (967) 976-56-56",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Рижский проспект, 12",
    addressLocality: "Санкт-Петербург",
    addressCountry: "RU",
  },
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "16:00",
    closes: "03:00",
  }],
  sameAs: ["https://t.me/abyss_calling"],
  url: siteUrl,
  image: [
    `${siteUrl}/food/burger-krutoyar-v2.webp`,
    `${siteUrl}/food/ribs-krutoyar-v2.webp`,
    `${siteUrl}/food/pizza-dyavolitsa-960.webp`,
  ],
  hasMenu: `${siteUrl}/menu`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#070606" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body className={`${displayFont.variable} ${labelFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
