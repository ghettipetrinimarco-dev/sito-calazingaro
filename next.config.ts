import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Necessario per Sharp su Vercel (ottimizzazione immagini lato server)
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
