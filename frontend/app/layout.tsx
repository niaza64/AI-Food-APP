import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Trends Tracker",
  description: "AI-powered food trends analysis using Google Search and Groq AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}

