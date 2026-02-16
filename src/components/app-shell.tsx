"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { CrisisButton } from "@/components/crisis-button";
import { Toaster } from "@/components/ui/sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname.startsWith("/landing");

  if (isLanding) {
    return (
      <main id="main-content">
        {children}
        <Toaster />
      </main>
    );
  }

  return (
    <>
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
        {/* Toast Notifications */}
        <Toaster />
      </div>
    </>
  );
}
