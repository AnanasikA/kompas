import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `npm run dev` only: let phones and tablets on the same Wi-Fi open the dev
   * server through the computer's network address (http://192.168.x.x:3000).
   * Without this Next.js serves the HTML but blocks the scripts, so the page
   * looks right and nothing responds. Production builds are not affected.
   */
  /** The floating "N" badge of dev mode sits on top of the sidebar links; errors still show without it. */
  devIndicators: false,
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "192.0.2.*", "*.local"],
};

export default nextConfig;
