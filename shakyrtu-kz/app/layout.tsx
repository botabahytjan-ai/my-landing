import type { Metadata } from "next";
import {
  Marcellus, Mulish, Playfair_Display, Cormorant_Garamond, Great_Vibes, DM_Serif_Display,
} from "next/font/google";
import "./globals.css";

const display = Marcellus({ subsets: ["latin-ext"], weight: "400", variable: "--font-display" });
const body = Mulish({ subsets: ["latin-ext"], variable: "--font-body" });

// Davetiye tema fontları
const playfair = Playfair_Display({ subsets: ["latin-ext"], weight: ["500", "700"], variable: "--t-playfair" });
const cormorant = Cormorant_Garamond({ subsets: ["latin-ext"], weight: ["500", "600"], variable: "--t-cormorant" });
const vibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--t-vibes" });
const dmserif = DM_Serif_Display({ subsets: ["latin-ext"], weight: "400", variable: "--t-dmserif" });

export const metadata: Metadata = {
  title: "Davetiyem — Dakikalar içinde dijital davetiye",
  description:
    "Düğün, nişan, kına ve her etkinlik için şık dijital davetiye. WhatsApp'tan gönder, kimlerin geldiğini canlı takip et. Matbaa yok, kod yok.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [
    display.variable, body.variable, playfair.variable, cormorant.variable, vibes.variable, dmserif.variable,
  ].join(" ");
  return (
    <html lang="tr" className={fonts}>
      <body>{children}</body>
    </html>
  );
}
