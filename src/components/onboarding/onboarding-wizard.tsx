"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConsentStep, ConsentData } from "./consent-step"
import { cn } from "@/lib/utils"
import { User, Shield, CheckCircle } from "lucide-react"

interface OnboardingWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (data: OnboardingData) => void
}

export interface OnboardingData {
  consents: ConsentData
  completedAt: Date
}

const steps = [
  { id: 1, title: "Thông tin", icon: User },
  { id: 2, title: "Đồng ý", icon: Shield },
  { id: 3, title: "Hoàn tất", icon: CheckCircle },
]

export function OnboardingWizard({
  open,
  onOpenChange,
  onComplete,
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(2) // Start at consent step
  const [consentData, setConsentData] = useState<ConsentData | null>(null)

  const handleConsentComplete = (consents: ConsentData) => {
    setConsentData(consents)
    setCurrentStep(3)

    // Complete after a short delay to show the success step
    setTimeout(() => {
      onComplete({
        consents,
        completedAt: new Date(),
      })
      onOpenChange(false)
      // Reset for next time
      setCurrentStep(2)
      setConsentData(null)
    }, 1500)
  }

  const handleClose = () => {
    onOpenChange(false)
    setCurrentStep(2)
    setConsentData(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Đăng ký bệnh nhân mới</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center py-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1",
                    currentStep >= step.id
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-20 h-0.5 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mt-4">
          {currentStep === 2 && (
            <ConsentStep onComplete={handleConsentComplete} />
          )}

          {currentStep === 3 && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đăng ký thành công!</h3>
              <p className="text-muted-foreground">
                Bệnh nhân đã được thêm vào hệ thống.
                <br />
                Đang chuyển hướng...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
