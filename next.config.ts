import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: false },
      { source: "/catalog.html", destination: "/books", permanent: false },
      {
        source: "/catagory.html",
        destination: "/subjects/horticulture-pomology",
        permanent: false,
      },
      {
        source: "/book_detail.html",
        destination:
          "/books/frontier-agronomy-for-climate-smart-digital-and-natural-farming-systems",
        permanent: false,
      },
    ];
  },
};
export default nextConfig;
