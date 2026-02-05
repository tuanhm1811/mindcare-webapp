"use client"

import { useEffect, useState, useCallback } from "react"

interface UseUnsavedChangesOptions {
  hasChanges: boolean
  message?: string
}

interface UseUnsavedChangesReturn {
  showDialog: boolean
  setShowDialog: (show: boolean) => void
  confirmNavigation: () => void
  cancelNavigation: () => void
  pendingUrl: string | null
}

export function useUnsavedChanges({
  hasChanges,
  message = "Bạn có thay đổi chưa được lưu. Bạn có chắc muốn rời khỏi trang này?",
}: UseUnsavedChangesOptions): UseUnsavedChangesReturn {
  const [showDialog, setShowDialog] = useState(false)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)

  // Handle browser beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasChanges, message])

  // Handle link clicks to intercept navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!hasChanges) return

      const target = e.target as HTMLElement
      const anchor = target.closest("a")

      if (anchor && anchor.href && !anchor.href.startsWith("tel:") && !anchor.href.startsWith("mailto:")) {
        const url = new URL(anchor.href)
        // Only intercept internal navigation
        if (url.origin === window.location.origin) {
          e.preventDefault()
          setPendingUrl(anchor.href)
          setShowDialog(true)
        }
      }
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [hasChanges])

  const confirmNavigation = useCallback(() => {
    if (pendingUrl) {
      window.location.href = pendingUrl
    }
    setShowDialog(false)
    setPendingUrl(null)
  }, [pendingUrl])

  const cancelNavigation = useCallback(() => {
    setShowDialog(false)
    setPendingUrl(null)
  }, [])

  return {
    showDialog,
    setShowDialog,
    confirmNavigation,
    cancelNavigation,
    pendingUrl,
  }
}
