import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  async headers() {
    const policy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com" +
        (process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""),
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      { key: "Content-Security-Policy", value: policy },
    ];
    if (
      process.env.AEETDS_SITE_URL?.startsWith("https://") &&
      process.env.AEETDS_PUBLIC_RELEASE === "true"
    )
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000",
      });
    return [
      { source: "/:path*", headers },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/submit/abstract",
        destination: "/submit/guidelines",
        permanent: false,
      },
      {
        source: "/submit/award",
        destination: "/awards#nomination",
        permanent: false,
      },
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
