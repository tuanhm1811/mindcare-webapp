"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Trash2 } from "lucide-react"

interface DataDeletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientName: string
  patientId: string
  onSubmit: (reason: string, notes: string) => void
}

const deletionReasons = [
  { value: "patient_request", label: "Yêu cầu từ bệnh nhân" },
  { value: "treatment_ended", label: "Kết thúc điều trị" },
  { value: "data_retention", label: "Hết thời hạn lưu trữ" },
  { value: "other", label: "Lý do khác" },
]

export function DataDeletionDialog({
  open,
  onOpenChange,
  patientName,
  patientId,
  onSubmit,
}: DataDeletionDialogProps) {
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!reason || !confirmed) return
    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit(reason, notes)
      setIsSubmitting(false)
      onOpenChange(false)
      // Reset form
      setReason("")
      setNotes("")
      setConfirmed(false)
    }, 1000)
  }

  const handleClose = () => {
    onOpenChange(false)
    setReason("")
    setNotes("")
    setConfirmed(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle>Yêu cầu xóa dữ liệu</DialogTitle>
              <DialogDescription>
                Bệnh nhân: {patientName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning */}
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  Cảnh báo: Hành động này không thể hoàn tác
                </p>
                <p className="text-sm text-muted-foreground">
                  Tất cả dữ liệu của bệnh nhân bao gồm hồ sơ, ghi chú buổi tư vấn,
                  kết quả đánh giá và lịch sử điều trị sẽ bị xóa vĩnh viễn.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason">Lý do xóa dữ liệu *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Chọn lý do..." />
              </SelectTrigger>
              <SelectContent>
                {deletionReasons.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú thêm</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú về yêu cầu xóa dữ liệu..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <Checkbox
              id="confirm-deletion"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
            />
            <Label
              htmlFor="confirm-deletion"
              className="text-sm font-normal cursor-pointer leading-relaxed"
            >
              Tôi xác nhận đã hiểu rằng việc xóa dữ liệu là không thể hoàn tác và
              đã tuân thủ các quy định về lưu trữ hồ sơ y tế.
            </Label>
          </div>

          {/* Legal Notice */}
          <p className="text-xs text-muted-foreground">
            Lưu ý: Theo quy định, một số thông tin có thể được giữ lại để đáp ứng
            yêu cầu pháp lý và bảo hiểm. Yêu cầu xóa sẽ được xử lý trong vòng 30 ngày.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!reason || !confirmed || isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
