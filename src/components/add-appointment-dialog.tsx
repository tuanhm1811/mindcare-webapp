"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Phone,
  MessageSquare,
  Calendar as CalendarIcon,
  Video,
  Building,
  Clock,
  User,
  X,
  UserPlus,
  Plus,
} from "lucide-react"
import { format, addDays, startOfWeek, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns"
import { vi } from "date-fns/locale"
import { mockPatients, Patient } from "@/lib/mock-data"
import { OnboardingWizard, OnboardingData } from "@/components/onboarding/onboarding-wizard"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface AddAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (appointment: AppointmentFormData) => void
  preselectedDate?: Date
  preselectedPatientId?: string
}

export interface AppointmentFormData {
  patientId: string
  patientName: string
  date: Date
  time: string
  duration: number
  sessionType: "initial" | "follow_up" | "crisis" | "assessment"
  appointmentType: "video" | "in_person"
  chiefConcern: string
  notes: string
}

// Session type categories
const sessionCategories = [
  { id: "follow_up", label: "Tái khám" },
  { id: "initial", label: "Khám lần đầu" },
  { id: "crisis", label: "Khẩn cấp" },
  { id: "assessment", label: "Đánh giá tâm lý" },
]

// Time slots
const morningSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]
const afternoonSlots = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"]

// Simulate some unavailable slots
const unavailableSlots = ["10:00", "14:00", "15:30"]

export function AddAppointmentDialog({
  open,
  onOpenChange,
  onSubmit,
  preselectedDate,
  preselectedPatientId,
}: AddAppointmentDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [sessionType, setSessionType] = useState<string>("follow_up")
  const [selectedDate, setSelectedDate] = useState<Date>(preselectedDate || new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [appointmentType, setAppointmentType] = useState<"video" | "in_person">("video")
  const [chiefConcern, setChiefConcern] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [showMonthCalendar, setShowMonthCalendar] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())

  // Generate week days
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  }, [weekStart])

  // Generate month calendar days
  const monthCalendarDays = useMemo(() => {
    const monthStart = startOfMonth(calendarMonth)
    const monthEnd = endOfMonth(calendarMonth)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Add empty days for padding at the start (to align with day of week)
    const startDayOfWeek = getDay(monthStart) // 0 = Sunday
    const paddingDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 // Monday = 0

    return { days, paddingDays }
  }, [calendarMonth])

  // Filter patients
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return mockPatients.slice(0, 6)
    return mockPatients.filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6)
  }, [searchTerm])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("")
      setSelectedPatient(null)
      setSessionType("follow_up")
      setSelectedDate(new Date())
      setSelectedTime("")
      setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
      setAppointmentType("video")
      setChiefConcern("")
      setShowAddPatient(false)
    }
  }, [open])

  // Preselect patient if provided
  useEffect(() => {
    if (preselectedPatientId && open) {
      const patient = mockPatients.find((p) => p.id === preselectedPatientId)
      if (patient) setSelectedPatient(patient)
    }
  }, [preselectedPatientId, open])

  const handleSubmit = () => {
    if (!selectedPatient || !selectedTime) return

    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        date: selectedDate,
        time: selectedTime,
        duration: 50,
        sessionType: sessionType as AppointmentFormData["sessionType"],
        appointmentType,
        chiefConcern,
        notes: "",
      })
      setIsSubmitting(false)
      onOpenChange(false)
    }, 500)
  }

  const handleAddPatientComplete = (data: OnboardingData) => {
    // Create a new patient from the onboarding data
    const newPatient: Patient = {
      id: `new-${Date.now()}`,
      firstName: data.patientInfo.firstName,
      lastName: data.patientInfo.lastName,
      dateOfBirth: data.patientInfo.dateOfBirth,
      age: calculateAge(data.patientInfo.dateOfBirth),
      gender: data.patientInfo.gender,
      phone: data.patientInfo.phone,
      email: data.patientInfo.email,
      address: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      diagnoses: [],
      medications: [],
      riskLevel: "low",
      treatmentStartDate: new Date().toISOString(),
      totalSessions: 0,
      lastSessionDate: new Date().toISOString(),
      status: "active",
    }

    // Select the new patient and set session type to initial
    setSelectedPatient(newPatient)
    setSessionType("initial")
    setShowAddPatient(false)
  }

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const canSubmit = selectedPatient && selectedTime

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1100px] p-0 gap-0 overflow-hidden max-h-[95vh]" showCloseButton={false}>
          <div className="flex min-h-[700px]">
            {/* Left Panel - Form */}
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Đặt lịch hẹn mới</h2>
                    <p className="text-sm text-muted-foreground">Chọn bệnh nhân, ngày giờ và loại buổi hẹn</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => onOpenChange(false)}
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    {/* Session Type Selection */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Loại buổi hẹn</p>
                      <div className="flex flex-wrap gap-2">
                        {sessionCategories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setSessionType(cat.id)}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm font-medium transition-all",
                              sessionType === cat.id
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-muted hover:bg-muted/80 text-foreground"
                            )}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Patient Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">Chọn bệnh nhân</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => setShowAddPatient(true)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Thêm mới
                        </Button>
                      </div>

                      {/* Search */}
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Tìm kiếm bệnh nhân..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 h-10 rounded-xl bg-muted/50 border-0"
                        />
                      </div>

                      {/* Patient Cards */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Add New Patient Card */}
                        <button
                          onClick={() => setShowAddPatient(true)}
                          className="flex items-center gap-3 p-3 rounded-xl text-left transition-all bg-primary/5 border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                        >
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserPlus className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-primary text-sm">Thêm bệnh nhân mới</p>
                            <p className="text-xs text-muted-foreground">Đăng ký nhanh</p>
                          </div>
                        </button>

                        {filteredPatients.slice(0, 5).map((patient) => (
                          <button
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                              selectedPatient?.id === patient.id
                                ? "bg-primary/10 border-2 border-primary"
                                : "bg-muted/50 border-2 border-transparent hover:border-muted-foreground/20"
                            )}
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-medium text-sm">
                                {patient.firstName[0]}{patient.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-sm">
                                {patient.firstName} {patient.lastName}
                              </p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground truncate">
                                  {patient.diagnoses[0]?.name || "Chưa chẩn đoán"}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Appointment Type */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Hình thức</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setAppointmentType("video")}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                            appointmentType === "video"
                              ? "bg-primary/10 border-2 border-primary text-primary"
                              : "bg-muted/50 border-2 border-transparent hover:border-muted-foreground/20"
                          )}
                        >
                          <Video className="h-5 w-5" />
                          <span className="font-medium">Video call</span>
                        </button>
                        <button
                          onClick={() => setAppointmentType("in_person")}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                            appointmentType === "in_person"
                              ? "bg-primary/10 border-2 border-primary text-primary"
                              : "bg-muted/50 border-2 border-transparent hover:border-muted-foreground/20"
                          )}
                        >
                          <Building className="h-5 w-5" />
                          <span className="font-medium">Trực tiếp</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Date & Time */}
                  <div className="space-y-5">
                    {/* Date Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">Chọn ngày</p>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => setWeekStart(addDays(weekStart, -7))}
                            aria-label="Tuần trước"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Popover open={showMonthCalendar} onOpenChange={setShowMonthCalendar}>
                            <PopoverTrigger asChild>
                              <button className="text-xs text-muted-foreground min-w-[100px] text-center hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded-lg transition-colors">
                                {format(weekStart, "dd/MM", { locale: vi })} - {format(addDays(weekStart, 6), "dd/MM", { locale: vi })}
                                <CalendarIcon className="h-3 w-3 ml-1 inline-block" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="center" sideOffset={8}>
                              <div className="p-3">
                                {/* Month Navigation */}
                                <div className="flex items-center justify-between mb-3">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                                  >
                                    <ChevronLeft className="h-4 w-4" />
                                  </Button>
                                  <span className="font-semibold text-sm">
                                    {format(calendarMonth, "MMMM yyyy", { locale: vi })}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full"
                                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Week day headers */}
                                <div className="grid grid-cols-7 gap-1 mb-1">
                                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                                    <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
                                      {d}
                                    </div>
                                  ))}
                                </div>

                                {/* Calendar grid */}
                                <div className="grid grid-cols-7 gap-1">
                                  {/* Padding days */}
                                  {Array.from({ length: monthCalendarDays.paddingDays }).map((_, i) => (
                                    <div key={`pad-${i}`} className="h-8 w-8" />
                                  ))}

                                  {/* Month days */}
                                  {monthCalendarDays.days.map((day) => {
                                    const isSelected = isSameDay(day, selectedDate)
                                    const isToday = isSameDay(day, new Date())
                                    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))

                                    return (
                                      <button
                                        key={day.toISOString()}
                                        onClick={() => {
                                          if (!isPast) {
                                            setSelectedDate(day)
                                            setWeekStart(startOfWeek(day, { weekStartsOn: 1 }))
                                            setShowMonthCalendar(false)
                                          }
                                        }}
                                        disabled={isPast}
                                        className={cn(
                                          "h-8 w-8 rounded-lg text-sm font-medium transition-all",
                                          isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : isToday
                                            ? "bg-primary/10 text-primary"
                                            : isPast
                                            ? "text-muted-foreground/40 cursor-not-allowed"
                                            : "hover:bg-muted text-foreground"
                                        )}
                                      >
                                        {format(day, "d")}
                                      </button>
                                    )
                                  })}
                                </div>

                                {/* Quick actions */}
                                <div className="flex gap-2 mt-3 pt-3 border-t">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs h-8"
                                    onClick={() => {
                                      const today = new Date()
                                      setSelectedDate(today)
                                      setWeekStart(startOfWeek(today, { weekStartsOn: 1 }))
                                      setCalendarMonth(today)
                                      setShowMonthCalendar(false)
                                    }}
                                  >
                                    Hôm nay
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs h-8"
                                    onClick={() => {
                                      const tomorrow = addDays(new Date(), 1)
                                      setSelectedDate(tomorrow)
                                      setWeekStart(startOfWeek(tomorrow, { weekStartsOn: 1 }))
                                      setCalendarMonth(tomorrow)
                                      setShowMonthCalendar(false)
                                    }}
                                  >
                                    Ngày mai
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={() => setWeekStart(addDays(weekStart, 7))}
                            aria-label="Tuần sau"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Week Calendar */}
                      <div className="grid grid-cols-7 gap-1.5">
                        {weekDays.map((day) => {
                          const isSelected = isSameDay(day, selectedDate)
                          const isToday = isSameDay(day, new Date())
                          const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))

                          return (
                            <button
                              key={day.toISOString()}
                              onClick={() => !isPast && setSelectedDate(day)}
                              disabled={isPast}
                              className={cn(
                                "flex flex-col items-center py-2 px-1 rounded-xl transition-all",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : isToday
                                  ? "bg-primary/10 text-primary"
                                  : isPast
                                  ? "text-muted-foreground/50 cursor-not-allowed"
                                  : "hover:bg-muted"
                              )}
                            >
                              <span className="text-[10px] font-medium uppercase">
                                {format(day, "EEE", { locale: vi })}
                              </span>
                              <span className="text-base font-semibold">
                                {format(day, "d")}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Chọn giờ</p>

                      {/* Morning */}
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Buổi sáng
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {morningSlots.map((time) => {
                            const isUnavailable = unavailableSlots.includes(time)
                            const isSelected = selectedTime === time

                            return (
                              <button
                                key={time}
                                onClick={() => !isUnavailable && setSelectedTime(time)}
                                disabled={isUnavailable}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                  isSelected
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : isUnavailable
                                    ? "bg-muted/30 text-muted-foreground/50 cursor-not-allowed line-through"
                                    : "bg-muted hover:bg-muted/80"
                                )}
                              >
                                {time}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Buổi chiều
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {afternoonSlots.map((time) => {
                            const isUnavailable = unavailableSlots.includes(time)
                            const isSelected = selectedTime === time

                            return (
                              <button
                                key={time}
                                onClick={() => !isUnavailable && setSelectedTime(time)}
                                disabled={isUnavailable}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                                  isSelected
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : isUnavailable
                                    ? "bg-muted/30 text-muted-foreground/50 cursor-not-allowed line-through"
                                    : "bg-muted hover:bg-muted/80"
                                )}
                              >
                                {time}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Ghi chú (tùy chọn)</p>
                      <Textarea
                        placeholder="Mô tả ngắn gọn lý do hẹn khám..."
                        value={chiefConcern}
                        onChange={(e) => setChiefConcern(e.target.value)}
                        className="min-h-[70px] rounded-xl bg-muted/30 border-muted-foreground/20 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedPatient && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">
                          {selectedPatient.firstName} {selectedPatient.lastName}
                        </span>
                      </div>
                    )}
                    {selectedDate && selectedTime && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{selectedTime}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!canSubmit || isSubmitting}
                      className="min-w-[120px]"
                    >
                      {isSubmitting ? "Đang đặt..." : "Đặt lịch hẹn"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Patient Profile */}
            {selectedPatient && (
              <div className="w-[300px] bg-gradient-to-b from-muted/30 to-background border-l flex flex-col">
                <div className="p-5 text-center border-b">
                  <Avatar className="h-20 w-20 mx-auto mb-3">
                    <AvatarFallback className="text-xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
                      {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {selectedPatient.age} tuổi, {selectedPatient.gender === "male" ? "Nam" : "Nữ"}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" aria-label="Gọi điện">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" aria-label="Nhắn tin">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-9 w-9" aria-label="Xem lịch">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                  {/* Session Stats */}
                  <div className="flex items-center justify-center gap-6 py-3 bg-muted/50 rounded-xl">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{selectedPatient.totalSessions}</p>
                      <p className="text-xs text-muted-foreground">Tổng buổi</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      </div>
                      <p className="text-xs text-muted-foreground">Bệnh nhân</p>
                    </div>
                  </div>

                  {/* Diagnoses */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Chẩn đoán</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPatient.diagnoses.length > 0 ? (
                        selectedPatient.diagnoses.map((d, i) => (
                          <Badge key={i} variant="secondary" className="rounded-full text-xs">
                            {d.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Chưa có chẩn đoán</span>
                      )}
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Mức độ rủi ro</p>
                    <Badge
                      variant={
                        selectedPatient.riskLevel === "high"
                          ? "destructive"
                          : selectedPatient.riskLevel === "medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="rounded-full"
                    >
                      {selectedPatient.riskLevel === "high"
                        ? "Cao"
                        : selectedPatient.riskLevel === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                    </Badge>
                  </div>

                  {/* Treatment Info */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Thông tin điều trị</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Buổi gần nhất:</span>
                        <span className="font-medium">
                          {new Date(selectedPatient.lastSessionDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {selectedPatient.nextSessionDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Buổi tiếp theo:</span>
                          <span className="font-medium">
                            {new Date(selectedPatient.nextSessionDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Patient Dialog */}
      <OnboardingWizard
        open={showAddPatient}
        onOpenChange={setShowAddPatient}
        onComplete={handleAddPatientComplete}
      />
    </>
  )
}
