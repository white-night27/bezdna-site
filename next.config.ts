import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bezdna-bar.ru" }],
        destination: "https://bezdna-bar.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
