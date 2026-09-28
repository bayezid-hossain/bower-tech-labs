import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode route indicator (it shows up in visual-test captures). Errors still surface.
  devIndicators: false,
};

export default nextConfig;
