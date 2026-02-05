import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { CrisisButton } from "@/components/crisis-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindCare - Mental Health Practice Management",
  description: "A modern platform for mental health professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Skip Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-background focus:text-foreground focus:p-3 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary"
        >
          Bỏ qua đến nội dung chính
        </a>

        <div className="gradient-bg min-h-screen">
          <AppSidebar />
          <div className="pl-[72px]">
            <AppHeader />
            <main id="main-content">{children}</main>
          </div>
          {/* Crisis Emergency Button - Always visible */}
          <CrisisButton />
        </div>
      </body>
    </html>
  );
}
