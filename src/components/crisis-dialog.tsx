"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Phone,
  MessageSquare,
  FileText,
  Copy,
  ExternalLink,
  AlertTriangle,
  Heart,
} from "lucide-react"
import { useState } from "react"

interface CrisisDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emergencyContacts = [
  {
    name: "Đường dây nóng sức khỏe tâm thần",
    phone: "1800-599-920",
    description: "Miễn phí, 24/7",
    icon: Phone,
    primary: true,
  },
  {
    name: "Tổng đài cấp cứu",
    phone: "115",
    description: "Cấp cứu y tế",
    icon: Phone,
    primary: false,
  },
  {
    name: "Đường dây nóng bảo vệ trẻ em",
    phone: "111",
    description: "24/7, miễn phí",
    icon: Phone,
    primary: false,
  },
]

export function CrisisDialog({ open, onOpenChange }: CrisisDialogProps) {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

  const copyToClipboard = (phone: string) => {
    navigator.clipboard.writeText(phone)
    setCopiedPhone(phone)
    setTimeout(() => setCopiedPhone(null), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-xl">Hỗ trợ khẩn cấp</DialogTitle>
              <DialogDescription>
                Nếu bạn hoặc bệnh nhân cần hỗ trợ ngay lập tức
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Emergency Contacts */}
          <div className="space-y-3">
            {emergencyContacts.map((contact) => (
              <Card
                key={contact.phone}
                className={contact.primary ? "border-destructive bg-destructive/5" : ""}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          contact.primary
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <contact.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-2xl font-bold text-primary">{contact.phone}</p>
                        <p className="text-xs text-muted-foreground">{contact.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={contact.primary ? "destructive" : "default"}
                        size="sm"
                        asChild
                      >
                        <a href={`tel:${contact.phone}`} aria-label={`Gọi ${contact.name}`}>
                          <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                          Gọi ngay
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(contact.phone)}
                        aria-label={`Sao chép số ${contact.phone}`}
                      >
                        <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                        {copiedPhone === contact.phone ? "Đã sao chép!" : "Sao chép"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-auto py-3" asChild>
              <a
                href="https://example.com/safety-plan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1"
              >
                <FileText className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm">Safety Plan</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-3" asChild>
              <a
                href="https://example.com/crisis-resources"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1"
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm">Tài nguyên hỗ trợ</span>
              </a>
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground">
            <p>
              <strong>Lưu ý:</strong> Trong trường hợp khẩn cấp về y tế, hãy gọi ngay 115
              hoặc đưa bệnh nhân đến cơ sở y tế gần nhất.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
