"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface PatientInfoStepProps {
  data: PatientInfoData
  onChange: (data: PatientInfoData) => void
  errors: Partial<Record<keyof PatientInfoData, string>>
}

export interface PatientInfoData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  phone: string
  email: string
  address: string
  emergencyContactName: string
  emergencyContactRelationship: string
  emergencyContactPhone: string
  referralSource: string
  primaryConcern: string
}

const genderOptions = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
]

const relationshipOptions = [
  { value: "spouse", label: "Vợ/Chồng" },
  { value: "parent", label: "Cha/Mẹ" },
  { value: "child", label: "Con" },
  { value: "sibling", label: "Anh/Chị/Em" },
  { value: "friend", label: "Bạn bè" },
  { value: "other", label: "Khác" },
]

const referralSources = [
  { value: "doctor", label: "Bác sĩ giới thiệu" },
  { value: "self", label: "Tự tìm kiếm" },
  { value: "family", label: "Gia đình/bạn bè" },
  { value: "insurance", label: "Bảo hiểm y tế" },
  { value: "hospital", label: "Bệnh viện" },
  { value: "other", label: "Khác" },
]

export function PatientInfoStep({ data, onChange, errors }: PatientInfoStepProps) {
  const updateField = <K extends keyof PatientInfoData>(
    field: K,
    value: PatientInfoData[K]
  ) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Thông tin cá nhân
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm text-muted-foreground">
              Họ và tên đệm <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              placeholder="Nguyễn Văn"
              value={data.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={cn(
                "h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary",
                errors.firstName && "border-destructive"
              )}
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm text-muted-foreground">
              Tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              placeholder="An"
              value={data.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className={cn(
                "h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary",
                errors.lastName && "border-destructive"
              )}
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-sm text-muted-foreground">
              Ngày sinh <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
              className={cn(
                "h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary",
                errors.dateOfBirth && "border-destructive"
              )}
            />
            {errors.dateOfBirth && (
              <p className="text-xs text-destructive">{errors.dateOfBirth}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Giới tính</Label>
            <div className="flex gap-2">
              {genderOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField("gender", option.value as PatientInfoData["gender"])}
                  className={cn(
                    "flex-1 h-11 px-4 rounded-lg text-sm font-medium transition-all",
                    data.gender === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Thông tin liên hệ
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm text-muted-foreground">
              Số điện thoại <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0912 345 678"
              value={data.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={cn(
                "h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary",
                errors.phone && "border-destructive"
              )}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={data.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm text-muted-foreground">Địa chỉ</Label>
          <Input
            id="address"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
            value={data.address}
            onChange={(e) => updateField("address", e.target.value)}
            className="h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Người liên hệ khẩn cấp
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactName" className="text-sm text-muted-foreground">
              Họ tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="emergencyContactName"
              placeholder="Nguyễn Thị B"
              value={data.emergencyContactName}
              onChange={(e) => updateField("emergencyContactName", e.target.value)}
              className={cn(
                "h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary",
                errors.emergencyContactName && "border-destructive"
              )}
            />
            {errors.emergencyContactName && (
              <p className="text-xs text-destructive">{errors.emergencyContactName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone" className="text-sm text-muted-foreground">
              Số điện thoại <span className="text-destructive">*</span>
            </Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              placeholder="0912 345 678"
              value={data.emergencyContactPhone}
              onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
              className={cn(
                "h-11 bg-muted/30 border-muted-foreground/20 focus:border-primary",
                errors.emergencyContactPhone && "border-destructive"
              )}
            />
            {errors.emergencyContactPhone && (
              <p className="text-xs text-destructive">{errors.emergencyContactPhone}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Mối quan hệ</Label>
          <div className="flex flex-wrap gap-2">
            {relationshipOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField("emergencyContactRelationship", option.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  data.emergencyContactRelationship === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
          Thông tin bổ sung
        </h3>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Nguồn giới thiệu</Label>
          <div className="flex flex-wrap gap-2">
            {referralSources.map((source) => (
              <button
                key={source.value}
                type="button"
                onClick={() => updateField("referralSource", source.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  data.referralSource === source.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {source.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="primaryConcern" className="text-sm text-muted-foreground">
            Lý do khám / Vấn đề chính
          </Label>
          <Textarea
            id="primaryConcern"
            placeholder="Mô tả ngắn gọn lý do bệnh nhân đến khám..."
            value={data.primaryConcern}
            onChange={(e) => updateField("primaryConcern", e.target.value)}
            className="min-h-[80px] bg-muted/30 border-muted-foreground/20 focus:border-primary resize-none"
          />
        </div>
      </div>
    </div>
  )
}
