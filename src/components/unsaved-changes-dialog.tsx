"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface UnsavedChangesDialogProps {
  open: boolean
  onSave?: () => void
  onDiscard: () => void
  onCancel: () => void
  showSaveButton?: boolean
  isSaving?: boolean
}

export function UnsavedChangesDialog({
  open,
  onSave,
  onDiscard,
  onCancel,
  showSaveButton = true,
  isSaving = false,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle>Thay đổi chưa được lưu</DialogTitle>
              <DialogDescription>
                Bạn có thay đổi chưa được lưu. Bạn muốn làm gì?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Nếu bạn rời khỏi trang này mà không lưu, tất cả thay đổi sẽ bị mất.
          </p>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            Ở lại trang
          </Button>
          <Button variant="destructive" onClick={onDiscard}>
            Bỏ thay đổi
          </Button>
          {showSaveButton && onSave && (
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu và tiếp tục"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
