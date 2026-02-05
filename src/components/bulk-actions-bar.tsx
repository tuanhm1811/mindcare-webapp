"use client"

import { Button } from "@/components/ui/button"
import { X, Mail, Download, Archive } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onSendMessage?: () => void
  onExport?: () => void
  onArchive?: () => void
  className?: string
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onSendMessage,
  onExport,
  onArchive,
  className,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  const handleSendMessage = () => {
    if (onSendMessage) {
      onSendMessage()
    } else {
      toast.success("Sending messages...", {
        description: `Preparing to send messages to ${selectedCount} patients`,
      })
    }
  }

  const handleExport = () => {
    if (onExport) {
      onExport()
    } else {
      toast.success("Exporting data...", {
        description: `Exporting ${selectedCount} patient records to Excel`,
      })
    }
  }

  const handleArchive = () => {
    if (onArchive) {
      onArchive()
    } else {
      toast.success("Archiving patients...", {
        description: `${selectedCount} patients will be archived`,
      })
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-background/95 backdrop-blur-lg border border-border/50 shadow-2xl",
        "rounded-full px-4 py-2.5 flex items-center gap-3",
        "animate-in slide-in-from-bottom-4 fade-in duration-300",
        className
      )}
    >
      <div className="flex items-center gap-2 pr-3 border-r border-border/50">
        <span className="text-sm font-medium">
          {selectedCount} selected
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full gap-2"
          onClick={handleSendMessage}
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Send message</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-full gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          onClick={handleArchive}
        >
          <Archive className="h-4 w-4" />
          <span className="hidden sm:inline">Archive</span>
        </Button>
      </div>

      <div className="pl-2 border-l border-border/50">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full h-8 w-8 p-0"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
