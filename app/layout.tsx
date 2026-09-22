import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Frank_Ruhl_Libre,
  Cinzel,
  Pinyon_Script,
} from "next/font/google";
import "./globals.css";

// Elegant Latin serif — body / supporting Latin text
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Elegant Hebrew serif (includes nikud)
const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
});

// Monumental inscriptional capitals — the couple's names / "ADIA" / the date
const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Formal calligraphy — "are getting married" and the envelope name
const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Shoval & Daniel — Wedding Invitation",
  description: "שמחים ונרגשים להזמינכם לחגוג עמנו את יום נישואינו",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      className={`${cormorant.variable} ${frankRuhl.variable} ${cinzel.variable} ${pinyon.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
