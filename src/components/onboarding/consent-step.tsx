"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Lock, Eye, Shield, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConsentStepProps {
  data: ConsentData
  onChange: (data: ConsentData) => void
}

export interface ConsentData {
  dataCollection: boolean
  recordingOptIn: boolean
  communicationOptIn: boolean
  termsAccepted: boolean
  timestamp: Date | null
}

const privacyHighlights = [
  {
    icon: Lock,
    title: "Mã hóa dữ liệu",
    description: "End-to-end theo tiêu chuẩn y tế",
  },
  {
    icon: Eye,
    title: "Quyền riêng tư",
    description: "Chỉ bác sĩ điều trị được truy cập",
  },
  {
    icon: Shield,
    title: "Tuân thủ quy định",
    description: "Bảo mật thông tin y tế",
  },
  {
    icon: FileText,
    title: "Quyền của bạn",
    description: "Xem, sửa, xóa dữ liệu bất cứ lúc nào",
  },
]

export function ConsentStep({ data, onChange }: ConsentStepProps) {
  const updateConsent = (key: keyof Omit<ConsentData, 'timestamp'>, value: boolean) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Privacy Highlights */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Cam kết bảo mật
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {privacyHighlights.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consent Options */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Đồng ý điều khoản
        </h3>

        <div className="space-y-3">
          {/* Required: Data Collection */}
          <div
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
              data.dataCollection
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-muted-foreground/40"
            )}
            onClick={() => updateConsent("dataCollection", !data.dataCollection)}
          >
            <Checkbox
              id="dataCollection"
              checked={data.dataCollection}
              onCheckedChange={(checked) => updateConsent("dataCollection", checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label
                htmlFor="dataCollection"
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                Thu thập và xử lý dữ liệu
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">
                  Bắt buộc
                </span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Đồng ý cho MindCare thu thập và xử lý dữ liệu sức khỏe để phục vụ việc chăm sóc và điều trị.
              </p>
            </div>
          </div>

          {/* Required: Terms */}
          <div
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
              data.termsAccepted
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-muted-foreground/40"
            )}
            onClick={() => updateConsent("termsAccepted", !data.termsAccepted)}
          >
            <Checkbox
              id="termsAccepted"
              checked={data.termsAccepted}
              onCheckedChange={(checked) => updateConsent("termsAccepted", checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label
                htmlFor="termsAccepted"
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                Chấp nhận điều khoản sử dụng
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-semibold">
                  Bắt buộc
                </span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Đã đọc và chấp nhận{" "}
                <a href="#" className="text-primary underline" onClick={(e) => e.stopPropagation()}>
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="text-primary underline" onClick={(e) => e.stopPropagation()}>
                  Chính sách bảo mật
                </a>
                .
              </p>
            </div>
          </div>

          {/* Optional: Recording */}
          <div
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
              data.recordingOptIn
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-muted-foreground/40"
            )}
            onClick={() => updateConsent("recordingOptIn", !data.recordingOptIn)}
          >
            <Checkbox
              id="recordingOptIn"
              checked={data.recordingOptIn}
              onCheckedChange={(checked) => updateConsent("recordingOptIn", checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label
                htmlFor="recordingOptIn"
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                Ghi âm buổi tư vấn
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  Tùy chọn
                </span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Cho phép ghi âm các buổi tư vấn để hỗ trợ việc ghi chú. Bạn có thể từ chối từng buổi cụ thể.
              </p>
            </div>
          </div>

          {/* Optional: Communication */}
          <div
            className={cn(
              "flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
              data.communicationOptIn
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/20 hover:border-muted-foreground/40"
            )}
            onClick={() => updateConsent("communicationOptIn", !data.communicationOptIn)}
          >
            <Checkbox
              id="communicationOptIn"
              checked={data.communicationOptIn}
              onCheckedChange={(checked) => updateConsent("communicationOptIn", checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label
                htmlFor="communicationOptIn"
                className="text-sm font-medium cursor-pointer flex items-center gap-2"
              >
                Nhận thông báo
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                  Tùy chọn
                </span>
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Nhận thông báo nhắc nhở lịch hẹn và thông tin chăm sóc sức khỏe qua email/SMS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
