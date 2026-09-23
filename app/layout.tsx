import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Cormorant,
  Frank_Ruhl_Libre,
  Great_Vibes,
} from "next/font/google";
import "./globals.css";

// Elegant Latin serif — body text + letter-spaced small-caps labels.
// Italic is included for the graceful script-substitute subtitle.
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

// Swash-italic display serif — the couple's names (the centrepiece).
const cormorant = Cormorant({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Elegant Hebrew serif (includes nikud)
const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
});

// Formal roundhand calligraphy — the couple's names + the "DS" monogram.
const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Shoval & Daniel — Wedding Invitation",
  description: "שמחים ונרגשים להזמינכם לחגוג עמנו את יום נישואינו",
};

// Mobile-first viewport: fit device width, cover the notch safe-areas, and
// keep pinch-zoom enabled for accessibility (no maximumScale/userScalable).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f3efe3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      className={`${cormorantGaramond.variable} ${cormorant.variable} ${frankRuhl.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>{children}</body>
    </html>
  );
}
