"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { CrisisDialog } from "./crisis-dialog"

interface CrisisButtonProps {
  variant?: "floating" | "inline"
  size?: "sm" | "md" | "lg"
}

export function CrisisButton({ variant = "floating", size = "md" }: CrisisButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  if (variant === "inline") {
    return (
      <>
        <Button
          variant="destructive"
          onClick={() => setIsDialogOpen(true)}
          aria-label="Hỗ trợ khẩn cấp"
        >
          <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
          Hỗ trợ khẩn cấp
        </Button>
        <CrisisDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      </>
    )
  }

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        className={`fixed bottom-6 right-6 ${sizeClasses[size]} rounded-full shadow-lg z-50 animate-pulse hover:animate-none`}
        onClick={() => setIsDialogOpen(true)}
        aria-label="Hỗ trợ khẩn cấp - Nhấn để gọi đường dây nóng"
      >
        <Phone className={iconSizes[size]} aria-hidden="true" />
      </Button>
      <CrisisDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  )
}
