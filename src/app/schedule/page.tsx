"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react"
import Link from "next/link"
import { mockSessions, mockPatients, currentClinician } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// Time slots for the calendar (7am to 6pm)
const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
]

// Days of the week
const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
const weekDaysFull = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

// Session types for legend
const sessionTypes = [
  { id: 'follow_up', label: 'Tái khám', color: 'bg-blue-500' },
  { id: 'initial', label: 'Khám lần đầu', color: 'bg-green-500' },
  { id: 'crisis', label: 'Khẩn cấp', color: 'bg-red-500' },
  { id: 'assessment', label: 'Đánh giá', color: 'bg-purple-500' },
]

// Generate week dates starting from a base date
const getWeekDates = (baseDate: Date) => {
  const dates = []
  const startOfWeek = new Date(baseDate)
  const day = startOfWeek.getDay()
  startOfWeek.setDate(startOfWeek.getDate() - day) // Go to Sunday

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    dates.push(date)
  }
  return dates
}

// Generate calendar days for mini calendar
const getCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDay = firstDay.getDay()

  const days: (number | null)[] = []

  // Add empty slots for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    days.push(null)
  }

  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return days
}

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<'Day' | 'Week'>('Week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const weekDates = getWeekDates(selectedDate)
  const calendarDays = getCalendarDays(currentDate.getFullYear(), currentDate.getMonth())

  const today = new Date()
  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  const isSameDay = (date1: Date, date2: Date) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()

  // Navigate months in mini calendar
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Navigate weeks
  const prevWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 7)
    setSelectedDate(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 7)
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
    setCurrentDate(new Date())
  }

  // Get session color based on type
  const getSessionColor = (type: string) => {
    switch (type) {
      case 'initial': return 'indicator-green'
      case 'follow_up': return 'indicator-blue'
      case 'crisis': return 'indicator-yellow'
      case 'assessment': return 'indicator-purple'
      default: return 'indicator-blue'
    }
  }

  // Get patient risk indicator
  const getRiskIndicator = (patientId: string) => {
    const patient = mockPatients.find(p => p.id === patientId)
    if (!patient) return null
    if (patient.riskLevel === 'high') return 'bg-red-500'
    if (patient.riskLevel === 'medium') return 'bg-yellow-500'
    return null
  }

  // Filter sessions for a specific date and time slot
  const getSessionsForSlot = (date: Date, timeSlot: string) => {
    const hour = parseInt(timeSlot.split(':')[0])
    return mockSessions.filter(session => {
      const sessionDate = new Date(session.scheduledAt)
      const sessionHour = sessionDate.getHours()
      return isSameDay(sessionDate, date) && sessionHour === hour
    })
  }

  // Format time display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex h-[calc(100vh-72px)]">
      {/* Left Sidebar - Mini Calendar & Info */}
      <div className="w-72 border-r border-border/50 glass-card rounded-none flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-5">
            {/* Clinician Info */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {currentClinician.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{currentClinician.name}</p>
                <p className="text-xs text-muted-foreground">{currentClinician.title}</p>
              </div>
            </div>

            {/* Mini Calendar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">
                  Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
                </h3>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Week days header */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-muted-foreground font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="py-1.5" />
                  }

                  const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  const isSelected = isSameDay(dayDate, selectedDate)
                  const isTodayDate = isToday(dayDate)

                  // Check if there are sessions on this day
                  const hasSessions = mockSessions.some(s => {
                    const sessionDate = new Date(s.scheduledAt)
                    return isSameDay(sessionDate, dayDate)
                  })

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dayDate)}
                      className={cn(
                        "py-1.5 rounded-md text-sm transition-colors relative",
                        isSelected && "bg-primary text-primary-foreground font-medium",
                        !isSelected && isTodayDate && "bg-primary/10 text-primary font-medium",
                        !isSelected && !isTodayDate && "hover:bg-muted text-foreground"
                      )}
                    >
                      {day}
                      {hasSessions && !isSelected && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Today Button */}
            <Button
              variant="outline"
              className="w-full mb-6 rounded-full"
              onClick={goToToday}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Hôm nay
            </Button>

            {/* Session Types Legend */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Loại buổi hẹn</h3>
              <div className="space-y-2">
                {sessionTypes.map((type) => (
                  <div key={type.id} className="flex items-center gap-2">
                    <span className={cn("w-3 h-3 rounded-full", type.color)} />
                    <span className="text-sm text-muted-foreground">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Summary */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <h3 className="font-semibold text-sm mb-3">Tổng quan hôm nay</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tổng buổi hẹn</span>
                  <span className="font-medium">{mockSessions.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">BN nguy cơ cao</span>
                  <span className="font-medium text-red-600">
                    {mockSessions.filter(s => {
                      const patient = mockPatients.find(p => p.id === s.patientId)
                      return patient?.riskLevel === 'high'
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Calendar Header */}
        <div className="p-5 flex items-center justify-between border-b border-border/30">
          <div>
            <h2 className="text-lg font-semibold">Lịch hẹn</h2>
            <p className="text-sm text-muted-foreground">
              {weekDates[0].toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' })} - {weekDates[6].toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            Thêm lịch hẹn
          </Button>
        </div>

        {/* Date Navigation */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-border/30">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted/50 rounded-full p-1">
              {(['Day', 'Week'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? 'default' : 'ghost'}
                  size="sm"
                  className={cn(
                    "rounded-full text-xs px-4",
                    viewMode === mode && "shadow-sm"
                  )}
                  onClick={() => setViewMode(mode)}
                >
                  {mode === 'Day' ? 'Ngày' : 'Tuần'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="flex border-b border-border/30 bg-background/30">
          <div className="w-16 shrink-0" /> {/* Time column spacer */}
          {weekDates.map((date, index) => {
            const dayIsToday = isToday(date)
            return (
              <div
                key={index}
                className={cn(
                  "flex-1 min-w-[120px] p-3 text-center border-l border-border/20",
                  dayIsToday && "bg-primary/5"
                )}
              >
                <p className="text-xs text-muted-foreground">{weekDaysFull[date.getDay()]}</p>
                <p className={cn(
                  "text-lg font-semibold mt-0.5",
                  dayIsToday && "text-primary"
                )}>
                  {date.getDate()}
                </p>
              </div>
            )
          })}
        </div>

        {/* Calendar Grid */}
        <ScrollArea className="flex-1">
          <div className="flex min-h-full">
            {/* Time Column */}
            <div className="w-16 shrink-0 border-r border-border/20">
              {timeSlots.map((time) => (
                <div key={time} className="h-20 flex items-start justify-end pr-3 pt-1">
                  <span className="text-xs text-muted-foreground">{time}</span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDates.map((date, dateIndex) => {
              const dayIsToday = isToday(date)
              return (
                <div
                  key={dateIndex}
                  className={cn(
                    "flex-1 min-w-[120px] border-l border-border/20",
                    dayIsToday && "bg-primary/5"
                  )}
                >
                  {timeSlots.map((time) => {
                    const sessions = getSessionsForSlot(date, time)

                    return (
                      <div
                        key={time}
                        className="h-20 border-b border-border/10 p-1 relative"
                      >
                        {sessions.map((session) => {
                          const riskIndicator = getRiskIndicator(session.patientId)

                          return (
                            <Link
                              key={session.id}
                              href={`/session/${session.id}`}
                              className={cn(
                                "block rounded-lg p-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-md h-full",
                                getSessionColor(session.sessionType)
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <p className="font-medium text-sm truncate flex-1">
                                  {session.patientName}
                                </p>
                                {riskIndicator && (
                                  <span className={cn("w-2 h-2 rounded-full shrink-0 ml-1", riskIndicator)} />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {formatTime(session.scheduledAt)} · {session.duration} phút
                              </p>
                            </Link>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
