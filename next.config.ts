import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the phone (and other LAN devices) to load dev resources when testing
  // over the local network. Without this, Next blocks cross-origin dev requests
  // from the LAN IP and the page never hydrates on the phone. Dev-only —
  // ignored in production builds.
  allowedDevOrigins: ["192.168.68.62", "192.168.68.*"],
  // Hide the on-screen Next.js dev indicator (the "N" badge). Dev-only UI;
  // Next still surfaces compile/runtime errors in the terminal.
  devIndicators: false,
};

export default nextConfig;
