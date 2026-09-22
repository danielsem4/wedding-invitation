import type { Metadata } from "next";
import { Cormorant_Garamond, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

// Elegant Latin serif
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Elegant Hebrew serif
const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "You're invited to our wedding",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${frankRuhl.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
