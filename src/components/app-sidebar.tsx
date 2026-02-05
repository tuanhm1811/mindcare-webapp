"use client"

import {
  Calendar,
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  Settings,
  HelpCircle,
  Flag,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Lịch hẹn",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "AI Assistant",
    url: "/ai-chat",
    icon: MessageSquare,
  },
  {
    title: "Bệnh nhân",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Ghi chú",
    url: "/notes",
    icon: FileText,
  },
]

const bottomItems = [
  {
    title: "Trợ giúp",
    url: "/help",
    icon: HelpCircle,
  },
  {
    title: "Phản hồi",
    url: "/feedback",
    icon: Flag,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  // Don't show sidebar on session pages
  if (pathname?.includes('/session/')) {
    return null
  }

  return (
    <TooltipProvider delayDuration={100}>
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[72px] flex-col items-center py-4 glass-card border-r-0 rounded-none">
        {/* Logo */}
        <Link href="/" className="mb-6 flex h-11 w-11 items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Heart className="h-5 w-5" />
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.url ||
              (item.url !== '/' && pathname?.startsWith(item.url))

            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.url}
                    aria-label={item.title}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "sidebar-icon-btn",
                      isActive && "active"
                    )}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <nav className="flex flex-col items-center gap-1">
          {bottomItems.map((item) => {
            const isActive = pathname === item.url

            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.url}
                    aria-label={item.title}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "sidebar-icon-btn",
                      isActive && "active"
                    )}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </aside>
    </TooltipProvider>
  )
}
