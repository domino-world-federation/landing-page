import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Next 16 only serves qualities listed here; anything else is a build-time
     * warning and falls back. 90 is for the hero's domino tile — the one image
     * the eye actually lands on, whose gold the default 75 flattens (S2). 75
     * stays as the default for everything else.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;
