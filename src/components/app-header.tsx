"use client"

import { Search, Bell, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { currentClinician } from "@/lib/mock-data"
import { usePathname } from "next/navigation"

export function AppHeader() {
  const pathname = usePathname()

  // Don't show header on session pages (they have their own header)
  if (pathname?.includes('/session/')) {
    return null
  }

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard'
    if (pathname === '/schedule') return 'Schedule'
    if (pathname === '/patients') return 'Patients'
    if (pathname?.startsWith('/patients/')) return 'Patient Profile'
    if (pathname === '/ai-chat') return 'Messages'
    if (pathname === '/notes') return 'Notes'
    return 'MindCare'
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between px-6 py-4">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">{getPageTitle()}</h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="search-bar flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-primary/10"
          aria-label="Thông báo, có thông báo mới"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/10"
          aria-label="Cài đặt"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 ml-2">
              <Avatar className="h-10 w-10 avatar-bordered">
                <AvatarImage src="/avatars/doctor.jpg" alt={currentClinician.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {currentClinician.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glass-card" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentClinician.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentClinician.title}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Hồ sơ cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem>
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
