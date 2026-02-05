"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PatientInfoStep, PatientInfoData } from "./patient-info-step"
import { ConsentStep, ConsentData } from "./consent-step"
import { cn } from "@/lib/utils"
import { User, Shield, CheckCircle, UserPlus, X } from "lucide-react"

interface OnboardingWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: OnboardingData) => void
}

export interface OnboardingData {
  patientInfo: PatientInfoData
  consents: ConsentData
  completedAt: Date
}

type TabType = "info" | "consent"

const defaultPatientInfo: PatientInfoData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "male",
  phone: "",
  email: "",
  address: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  referralSource: "",
  primaryConcern: "",
}

const defaultConsents: ConsentData = {
  dataCollection: false,
  recordingOptIn: false,
  communicationOptIn: false,
  termsAccepted: false,
  timestamp: null,
}

export function OnboardingWizard({
  open,
  onOpenChange,
  onComplete,
}: OnboardingWizardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("info")
  const [patientInfoData, setPatientInfoData] = useState<PatientInfoData>(defaultPatientInfo)
  const [consentData, setConsentData] = useState<ConsentData>(defaultConsents)
  const [errors, setErrors] = useState<Partial<Record<keyof PatientInfoData, string>>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PatientInfoData, string>> = {}

    if (!patientInfoData.firstName.trim()) {
      newErrors.firstName = "Vui lòng nhập họ"
    }
    if (!patientInfoData.lastName.trim()) {
      newErrors.lastName = "Vui lòng nhập tên"
    }
    if (!patientInfoData.dateOfBirth) {
      newErrors.dateOfBirth = "Vui lòng nhập ngày sinh"
    }
    if (!patientInfoData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại"
    }
    if (!patientInfoData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = "Vui lòng nhập tên người liên hệ khẩn cấp"
    }
    if (!patientInfoData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = "Vui lòng nhập số điện thoại người liên hệ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const canSubmit = consentData.dataCollection && consentData.termsAccepted

  const handleSubmit = () => {
    if (!validateForm()) {
      setActiveTab("info")
      return
    }

    if (!canSubmit) {
      setActiveTab("consent")
      return
    }

    // Show success state
    setIsSuccess(true)

    // Complete after a short delay to show the success animation
    setTimeout(() => {
      onComplete({
        patientInfo: patientInfoData,
        consents: {
          ...consentData,
          timestamp: new Date(),
        },
        completedAt: new Date(),
      })
      onOpenChange(false)
      resetForm()
    }, 1500)
  }

  const resetForm = () => {
    setActiveTab("info")
    setPatientInfoData(defaultPatientInfo)
    setConsentData(defaultConsents)
    setErrors({})
    setIsSuccess(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  // Check if patient info section has required fields filled
  const patientInfoComplete =
    patientInfoData.firstName.trim() &&
    patientInfoData.lastName.trim() &&
    patientInfoData.dateOfBirth &&
    patientInfoData.phone.trim() &&
    patientInfoData.emergencyContactName.trim() &&
    patientInfoData.emergencyContactPhone.trim()

  if (isSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden" showCloseButton={false}>
          <div className="py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-300">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Đăng ký thành công!</h3>
            <p className="text-muted-foreground">
              Bệnh nhân <strong>{patientInfoData.firstName} {patientInfoData.lastName}</strong> đã được thêm vào hệ thống.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden max-h-[90vh]" showCloseButton={false}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Thêm bệnh nhân mới</DialogTitle>
              <p className="text-sm text-muted-foreground">Điền thông tin và đồng ý điều khoản</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 rounded-lg"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
            <button
              onClick={() => setActiveTab("info")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                activeTab === "info"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="h-4 w-4" />
              Thông tin
              {patientInfoComplete && (
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("consent")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                activeTab === "consent"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Shield className="h-4 w-4" />
              Đồng ý điều khoản
              {canSubmit && (
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[500px]">
          <div className="px-6 py-4">
            {activeTab === "info" && (
              <PatientInfoStep
                data={patientInfoData}
                onChange={setPatientInfoData}
                errors={errors}
              />
            )}

            {activeTab === "consent" && (
              <ConsentStep
                data={consentData}
                onChange={setConsentData}
              />
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {!patientInfoComplete && (
                <span className="text-destructive">Vui lòng điền đầy đủ thông tin bắt buộc</span>
              )}
              {patientInfoComplete && !canSubmit && (
                <span className="text-amber-600">Vui lòng đồng ý các điều khoản bắt buộc</span>
              )}
              {patientInfoComplete && canSubmit && (
                <span className="text-green-600">Sẵn sàng đăng ký bệnh nhân</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!patientInfoComplete || !canSubmit}
                className="min-w-[140px]"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
