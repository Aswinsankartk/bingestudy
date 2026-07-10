import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://bingestudy.vercel.app"),
  title: {
    default: "BingeStudy — Study Together. Study Smarter.",
    template: "%s | BingeStudy",
  },
  description:
    "Create private study groups, share notes and materials in real time, and get instant answers from an AI assistant.",
  keywords: [
    "study group app",
    "collaborative study platform",
    "student note sharing",
    "real-time study chat",
    "AI study assistant",
  ],
  openGraph: {
    title: "BingeStudy — Study Together. Study Smarter.",
    description:
      "Create private study groups, share notes and materials in real time, and get instant answers from an AI assistant.",
    url: "https://bingestudy.vercel.app",
    siteName: "BingeStudy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BingeStudy — Study Together. Study Smarter.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BingeStudy — Study Together. Study Smarter.",
    description:
      "Create private study groups, share notes and materials in real time, and get instant answers from an AI assistant.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://bingestudy.vercel.app",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="animate-fade-in">{children}</div>
      </body>
    </html>
  );
}
