"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  AlertTriangle,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { mockSessions, mockPatients, currentClinician, Session } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { AddAppointmentDialog } from "@/components/add-appointment-dialog"

// Time slots for the calendar (7am to 10pm)
const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00'
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


// Draggable Appointment Component
function DraggableAppointment({
  session,
  children,
  disabled = false,
}: {
  session: Session
  children: React.ReactNode
  disabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: session.id,
    data: { session },
    disabled,
  })

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.5 : undefined,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        !disabled && "cursor-grab active:cursor-grabbing"
      )}
      {...(!disabled ? listeners : {})}
      {...(!disabled ? attributes : {})}
    >
      {children}
    </div>
  )
}

// Droppable Time Slot Component
function DroppableTimeSlot({
  id,
  children,
  className,
}: {
  id: string
  children: React.ReactNode
  className?: string
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        className,
        isOver && "bg-primary/10 ring-2 ring-primary/30 ring-inset"
      )}
    >
      {children}
    </div>
  )
}

export default function SchedulePage() {
  const [viewMode, setViewMode] = useState<'Day' | 'Week'>('Week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddAppointment, setShowAddAppointment] = useState(false)

  // Drag and drop state
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [pendingDrop, setPendingDrop] = useState<{
    session: Session
    newDate: Date
    newTime: string
  } | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging starts
      },
    })
  )

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const session = event.active.data.current?.session as Session
    if (session) {
      setActiveSession(session)
    }
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveSession(null)

    if (!over) return

    const session = active.data.current?.session as Session
    if (!session) return

    // Parse the drop target ID (format: "slot-{dateISO}-{time}")
    const dropId = over.id as string
    if (!dropId.startsWith('slot-')) return

    const parts = dropId.replace('slot-', '').split('_')
    if (parts.length !== 2) return

    const [dateStr, time] = parts
    const newDate = new Date(dateStr)

    // Check if it's actually a different slot
    const currentDate = new Date(session.scheduledAt)
    const currentHour = currentDate.getHours()
    const newHour = parseInt(time.split(':')[0])

    if (
      currentDate.toDateString() === newDate.toDateString() &&
      currentHour === newHour
    ) {
      return // Same slot, no change needed
    }

    // Store pending drop and show confirmation
    setPendingDrop({ session, newDate, newTime: time })
    setShowConfirmDialog(true)
  }

  // Confirm reschedule
  const confirmReschedule = () => {
    if (!pendingDrop) return

    const { session, newDate, newTime } = pendingDrop

    // In a real app, you would call an API here
    toast.success("Đã di chuyển lịch hẹn!", {
      description: `${session.patientName} - ${newDate.toLocaleDateString('vi-VN')} lúc ${newTime}`,
    })

    setShowConfirmDialog(false)
    setPendingDrop(null)
  }

  // Cancel reschedule
  const cancelReschedule = () => {
    setShowConfirmDialog(false)
    setPendingDrop(null)
  }

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

  // Navigate days (for Day view)
  const prevDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const nextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  // Get sessions for selected day (Day view)
  const getSessionsForDay = (date: Date) => {
    return mockSessions.filter(session => {
      const sessionDate = new Date(session.scheduledAt)
      return isSameDay(sessionDate, date)
    }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
  }

  // Get sessions for a specific hour on selected day
  const getSessionsForHour = (hour: number) => {
    return mockSessions.filter(session => {
      const sessionDate = new Date(session.scheduledAt)
      return isSameDay(sessionDate, selectedDate) && sessionDate.getHours() === hour
    })
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
      {/* Left Sidebar - Mini Calendar & Info - Hidden on small screens, visible on lg+ */}
      <div className="hidden lg:flex w-64 xl:w-72 2xl:w-80 border-r border-border/50 glass-card rounded-none flex-col shrink-0">
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
        {/* Calendar Header - Compact */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-border/30">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold">Lịch hẹn</h2>
            <p className="text-xs text-muted-foreground">
              {viewMode === 'Day'
                ? selectedDate.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' })
                : `${weekDates[0].toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })} - ${weekDates[6].toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })}`
              }
            </p>
          </div>
          <Button size="sm" className="rounded-full h-8" onClick={() => setShowAddAppointment(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Thêm lịch hẹn
          </Button>
        </div>

        {/* Add Appointment Dialog */}
        <AddAppointmentDialog
          open={showAddAppointment}
          onOpenChange={setShowAddAppointment}
          preselectedDate={selectedDate}
          onSubmit={(data) => {
            console.log("New appointment:", data)
            toast.success("Đặt lịch thành công!", {
              description: `Lịch hẹn cho ${data.patientName} vào ${data.date.toLocaleDateString('vi-VN')} lúc ${data.time}`,
            })
          }}
        />

        {/* Date Navigation - Compact */}
        <div className="px-4 py-1.5 flex items-center justify-between border-b border-border/30">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={viewMode === 'Day' ? prevDay : prevWeek}
              aria-label={viewMode === 'Day' ? 'Ngày trước' : 'Tuần trước'}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={viewMode === 'Day' ? nextDay : nextWeek}
              aria-label={viewMode === 'Day' ? 'Ngày sau' : 'Tuần sau'}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center bg-muted/50 rounded-full p-0.5">
            {(['Day', 'Week'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "rounded-full text-xs px-3 h-7",
                  viewMode === mode && "shadow-sm"
                )}
                onClick={() => setViewMode(mode)}
              >
                {mode === 'Day' ? 'Ngày' : 'Tuần'}
              </Button>
            ))}
          </div>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {viewMode === 'Week' ? (
            <>
              {/* Week Days Header - Responsive */}
              <div className="flex border-b border-border/30 bg-background/30">
                <div className="w-14 md:w-16 xl:w-20 shrink-0" /> {/* Time column spacer */}
                {weekDates.map((date, index) => {
                  const dayIsToday = isToday(date)
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex-1 min-w-[100px] md:min-w-[120px] xl:min-w-[140px] 2xl:min-w-[160px] py-1.5 xl:py-2 px-2 text-center border-l border-border/20",
                        dayIsToday && "bg-primary/5"
                      )}
                    >
                      <p className="text-[10px] xl:text-xs text-muted-foreground hidden sm:block">{weekDaysFull[date.getDay()]}</p>
                      <p className="text-[10px] text-muted-foreground sm:hidden">{weekDays[date.getDay()]}</p>
                      <p className={cn(
                        "text-base xl:text-lg font-semibold",
                        dayIsToday && "text-primary"
                      )}>
                        {date.getDate()}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Week Calendar Grid */}
              <ScrollArea className="flex-1">
                <div className="flex min-h-full">
                  {/* Time Column - Responsive */}
                  <div className="w-14 md:w-16 xl:w-20 shrink-0 border-r border-border/20">
                    {timeSlots.map((time) => (
                      <div key={time} className="h-24 md:h-28 xl:h-32 2xl:h-36 flex items-start justify-end pr-2 md:pr-3 pt-1">
                        <span className="text-[10px] md:text-xs text-muted-foreground">{time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Day Columns - Responsive */}
                  {weekDates.map((date, dateIndex) => {
                    const dayIsToday = isToday(date)
                    return (
                      <div
                        key={dateIndex}
                        className={cn(
                          "flex-1 min-w-[100px] md:min-w-[120px] xl:min-w-[140px] 2xl:min-w-[160px] border-l border-border/20",
                          dayIsToday && "bg-primary/5"
                        )}
                      >
                        {timeSlots.map((time) => {
                          const sessions = getSessionsForSlot(date, time)
                          const slotId = `slot-${date.toISOString().split('T')[0]}_${time}`

                          return (
                            <DroppableTimeSlot
                              key={time}
                              id={slotId}
                              className="h-24 md:h-28 xl:h-32 2xl:h-36 border-b border-border/10 p-1 xl:p-1.5 relative transition-colors"
                            >
                              {sessions.map((session) => {
                                const riskIndicator = getRiskIndicator(session.patientId)

                                return (
                                  <DraggableAppointment key={session.id} session={session}>
                                    <Link
                                      href={`/session/${session.id}`}
                                      className={cn(
                                        "block rounded-lg p-1.5 md:p-2 xl:p-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
                                        getSessionColor(session.sessionType)
                                      )}
                                    >
                                      <div className="flex items-start justify-between">
                                        <p className="font-medium text-xs md:text-sm truncate flex-1">
                                          {session.patientName}
                                        </p>
                                        {riskIndicator && (
                                          <span className={cn("w-2 h-2 rounded-full shrink-0 ml-1", riskIndicator)} />
                                        )}
                                      </div>
                                      <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                                        {formatTime(session.scheduledAt)} · {session.duration}p
                                      </p>
                                      {/* Session note - chiefConcern */}
                                      {session.chiefConcern && (
                                        <p className="text-[9px] md:text-[10px] xl:text-xs text-muted-foreground/70 mt-1 line-clamp-2 xl:line-clamp-3 leading-tight italic">
                                          {session.chiefConcern}
                                        </p>
                                      )}
                                    </Link>
                                  </DraggableAppointment>
                                )
                              })}
                            </DroppableTimeSlot>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </>
          ) : (
          /* Day View - Responsive */
          <ScrollArea className="flex-1">
            <div className="flex min-h-full">
              {/* Time Column */}
              <div className="w-16 md:w-20 xl:w-24 shrink-0 border-r border-border/20">
                {timeSlots.map((time) => (
                  <div key={time} className="h-20 md:h-24 xl:h-28 2xl:h-32 flex items-start justify-end pr-3 md:pr-4 pt-2">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">{time}</span>
                  </div>
                ))}
              </div>

              {/* Day Content */}
              <div className="flex-1 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
                {timeSlots.map((time) => {
                  const hour = parseInt(time.split(':')[0])
                  const sessions = getSessionsForHour(hour)
                  const dayIsToday = isToday(selectedDate)
                  const slotId = `slot-${selectedDate.toISOString().split('T')[0]}_${time}`

                  return (
                    <DroppableTimeSlot
                      key={time}
                      id={slotId}
                      className={cn(
                        "h-20 md:h-24 xl:h-28 2xl:h-32 border-b border-border/10 px-3 md:px-4 xl:px-6 py-2 relative transition-colors",
                        dayIsToday && "bg-primary/5"
                      )}
                    >
                      {sessions.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                          <span className="text-sm text-muted-foreground/50">—</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {sessions.map((session) => {
                            const patient = mockPatients.find(p => p.id === session.patientId)
                            const riskIndicator = getRiskIndicator(session.patientId)

                            return (
                              <DraggableAppointment key={session.id} session={session}>
                                <Link
                                  href={`/session/${session.id}`}
                                  className={cn(
                                    "flex items-center gap-3 md:gap-4 xl:gap-5 rounded-xl p-2.5 md:p-3 xl:p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg interactive-card",
                                    getSessionColor(session.sessionType)
                                  )}
                                >
                                  <Avatar className="h-10 w-10 md:h-12 md:w-12 xl:h-14 xl:w-14 border-2 border-white/50 shrink-0">
                                    <AvatarFallback className="bg-white/50 text-foreground font-medium text-sm md:text-base">
                                      {session.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-foreground truncate text-sm md:text-base xl:text-lg">
                                        {session.patientName}
                                      </p>
                                      {riskIndicator && (
                                        <span className={cn("w-2 h-2 rounded-full shrink-0", riskIndicator)} />
                                      )}
                                    </div>
                                    <p className="text-xs md:text-sm text-muted-foreground">
                                      {formatTime(session.scheduledAt)} · {session.duration} phút
                                    </p>
                                    {patient && (
                                      <p className="text-[10px] md:text-xs text-muted-foreground/70 mt-0.5 hidden sm:block">
                                        {patient.diagnoses[0]?.name || 'Chưa có chẩn đoán'}
                                      </p>
                                    )}
                                    {/* Session Note - chiefConcern */}
                                    {session.chiefConcern && (
                                      <div className="hidden md:flex items-start gap-1.5 mt-2 p-2 bg-white/30 rounded-lg">
                                        <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                        <p className="text-xs xl:text-sm text-muted-foreground leading-relaxed">
                                          {session.chiefConcern}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right shrink-0 hidden sm:block">
                                    <span className={cn(
                                      "inline-block px-2 xl:px-3 py-1 xl:py-1.5 rounded-full text-xs xl:text-sm font-medium",
                                      session.sessionType === 'initial' && "bg-green-100 text-green-700",
                                      session.sessionType === 'follow_up' && "bg-blue-100 text-blue-700",
                                      session.sessionType === 'crisis' && "bg-red-100 text-red-700",
                                      session.sessionType === 'assessment' && "bg-purple-100 text-purple-700",
                                    )}>
                                      {sessionTypes.find(t => t.id === session.sessionType)?.label || session.sessionType}
                                    </span>
                                  </div>
                                </Link>
                              </DraggableAppointment>
                            )
                          })}
                        </div>
                      )}
                    </DroppableTimeSlot>
                  )
                })}
              </div>
            </div>
          </ScrollArea>
        )}

          {/* Drag Overlay - shows the dragged item */}
          <DragOverlay>
            {activeSession ? (
              <div
                className={cn(
                  "rounded-lg p-2 shadow-xl opacity-90 min-w-[150px] max-w-[200px]",
                  getSessionColor(activeSession.sessionType)
                )}
              >
                <p className="font-medium text-sm truncate">{activeSession.patientName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(activeSession.scheduledAt)} · {activeSession.duration} phút
                </p>
                {activeSession.chiefConcern && (
                  <p className="text-[10px] text-muted-foreground/80 mt-1 line-clamp-1">
                    {activeSession.chiefConcern}
                  </p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Reschedule Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xác nhận di chuyển lịch hẹn</DialogTitle>
              <DialogDescription>
                {pendingDrop && (
                  <>
                    Di chuyển lịch hẹn của <strong>{pendingDrop.session.patientName}</strong> đến{" "}
                    <strong>
                      {pendingDrop.newDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </strong>{" "}
                    lúc <strong>{pendingDrop.newTime}</strong>?
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={cancelReschedule}>
                Hủy
              </Button>
              <Button onClick={confirmReschedule}>
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
