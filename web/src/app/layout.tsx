import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digi — Collective Memory Platform",
  description: "One event. One disposable camera. Everyone contributes to the same shared album — no filters, no retakes, just real memories. The collaborative event camera app.",
  keywords: ["event camera", "disposable camera app", "shared album", "wedding photos", "event photos", "collaborative camera", "photo sharing"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Digi — Collective Memory Platform",
    description: "One event. One disposable camera. Everyone contributes to the same shared album.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
