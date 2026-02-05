"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Lock, Eye, FileText, CheckCircle } from "lucide-react"

interface ConsentStepProps {
  onComplete: (consents: ConsentData) => void
  onBack?: () => void
}

export interface ConsentData {
  dataCollection: boolean
  recordingOptIn: boolean
  communicationOptIn: boolean
  termsAccepted: boolean
  timestamp: Date
}

const privacyHighlights = [
  {
    icon: Lock,
    title: "Mã hóa dữ liệu",
    description: "Tất cả dữ liệu được mã hóa end-to-end theo tiêu chuẩn y tế",
  },
  {
    icon: Eye,
    title: "Quyền riêng tư",
    description: "Chỉ bác sĩ điều trị mới có quyền truy cập hồ sơ của bạn",
  },
  {
    icon: Shield,
    title: "Tuân thủ quy định",
    description: "Hệ thống tuân thủ các quy định về bảo mật thông tin y tế",
  },
  {
    icon: FileText,
    title: "Quyền của bạn",
    description: "Bạn có quyền yêu cầu xem, sửa hoặc xóa dữ liệu bất cứ lúc nào",
  },
]

export function ConsentStep({ onComplete, onBack }: ConsentStepProps) {
  const [consents, setConsents] = useState({
    dataCollection: false,
    recordingOptIn: false,
    communicationOptIn: false,
    termsAccepted: false,
  })

  const canProceed = consents.dataCollection && consents.termsAccepted

  const handleSubmit = () => {
    if (canProceed) {
      onComplete({
        ...consents,
        timestamp: new Date(),
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Privacy Highlights */}
      <div className="grid grid-cols-2 gap-4">
        {privacyHighlights.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Policy Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Chính sách bảo mật</CardTitle>
          <CardDescription>
            Vui lòng đọc kỹ trước khi đồng ý
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>1. Thu thập dữ liệu:</strong> Chúng tôi thu thập thông tin cá nhân,
                thông tin sức khỏe tâm thần, và lịch sử điều trị của bạn để phục vụ việc
                chăm sóc sức khỏe.
              </p>
              <p>
                <strong>2. Sử dụng dữ liệu:</strong> Dữ liệu của bạn được sử dụng để:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Cung cấp dịch vụ tư vấn và điều trị tâm lý</li>
                <li>Theo dõi tiến triển điều trị</li>
                <li>Cải thiện chất lượng dịch vụ</li>
              </ul>
              <p>
                <strong>3. Bảo mật:</strong> Dữ liệu được mã hóa và lưu trữ an toàn theo
                tiêu chuẩn bảo mật y tế. Chỉ có bác sĩ điều trị mới có quyền truy cập.
              </p>
              <p>
                <strong>4. Quyền của bạn:</strong> Bạn có quyền yêu cầu xem, chỉnh sửa,
                hoặc xóa dữ liệu cá nhân của mình bất cứ lúc nào.
              </p>
              <p>
                <strong>5. Lưu trữ:</strong> Dữ liệu được lưu trữ theo quy định pháp luật
                về hồ sơ bệnh án (tối thiểu 10 năm sau khi kết thúc điều trị).
              </p>
              <p>
                <strong>6. Chia sẻ dữ liệu:</strong> Chúng tôi không chia sẻ dữ liệu của bạn
                với bên thứ ba trừ khi có yêu cầu pháp lý hoặc được sự đồng ý của bạn.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Consent Checkboxes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Đồng ý điều khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Required: Data Collection */}
          <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
            <Checkbox
              id="dataCollection"
              checked={consents.dataCollection}
              onCheckedChange={(checked) =>
                setConsents((prev) => ({ ...prev, dataCollection: checked as boolean }))
              }
            />
            <div className="flex-1">
              <Label
                htmlFor="dataCollection"
                className="text-sm font-medium cursor-pointer"
              >
                Thu thập và xử lý dữ liệu *
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Tôi đồng ý cho MindCare thu thập và xử lý dữ liệu sức khỏe của tôi
                để phục vụ việc chăm sóc và điều trị.
              </p>
            </div>
          </div>

          {/* Optional: Recording */}
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <Checkbox
              id="recordingOptIn"
              checked={consents.recordingOptIn}
              onCheckedChange={(checked) =>
                setConsents((prev) => ({ ...prev, recordingOptIn: checked as boolean }))
              }
            />
            <div className="flex-1">
              <Label
                htmlFor="recordingOptIn"
                className="text-sm font-medium cursor-pointer"
              >
                Ghi âm buổi tư vấn (tùy chọn)
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Tôi đồng ý cho phép ghi âm các buổi tư vấn để hỗ trợ việc ghi chú
                và theo dõi điều trị. Bạn có thể từ chối từng buổi cụ thể.
              </p>
            </div>
          </div>

          {/* Optional: Communication */}
          <div className="flex items-start gap-3 p-3 rounded-lg border">
            <Checkbox
              id="communicationOptIn"
              checked={consents.communicationOptIn}
              onCheckedChange={(checked) =>
                setConsents((prev) => ({ ...prev, communicationOptIn: checked as boolean }))
              }
            />
            <div className="flex-1">
              <Label
                htmlFor="communicationOptIn"
                className="text-sm font-medium cursor-pointer"
              >
                Nhận thông báo (tùy chọn)
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Tôi đồng ý nhận thông báo nhắc nhở lịch hẹn và các thông tin chăm sóc
                sức khỏe qua email/SMS.
              </p>
            </div>
          </div>

          {/* Required: Terms */}
          <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
            <Checkbox
              id="termsAccepted"
              checked={consents.termsAccepted}
              onCheckedChange={(checked) =>
                setConsents((prev) => ({ ...prev, termsAccepted: checked as boolean }))
              }
            />
            <div className="flex-1">
              <Label
                htmlFor="termsAccepted"
                className="text-sm font-medium cursor-pointer"
              >
                Chấp nhận điều khoản sử dụng *
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Tôi đã đọc và chấp nhận{" "}
                <a href="#" className="text-primary underline">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="text-primary underline">
                  Chính sách bảo mật
                </a>
                .
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            * Bắt buộc để tiếp tục sử dụng dịch vụ
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!canProceed}
          className={onBack ? "" : "ml-auto"}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Xác nhận và tiếp tục
        </Button>
      </div>
    </div>
  )
}
