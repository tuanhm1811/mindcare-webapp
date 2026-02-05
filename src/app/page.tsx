"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  FileText,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Phone,
  Play,
  ChevronLeft,
} from "lucide-react"
import Link from "next/link"
import { dashboardStats, getTodaySchedule, mockPatients, mockSessions, currentClinician } from "@/lib/mock-data"

// Mini calendar data
const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sat', 'Su']
const currentDate = new Date()
const currentDay = currentDate.getDate()

export default function DashboardPage() {
  const todaySchedule = getTodaySchedule()
  const highRiskPatients = mockPatients.filter(p => p.riskLevel === 'high')

  return (
    <div className="p-6 space-y-6">
      {/* Greeting Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Hey, {currentClinician.name.split(' ')[0]}! Glad to have you back
        </h1>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Active Patients */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Active Patients</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{dashboardStats.activePatients}</span>
            <Badge variant="secondary" className="text-xs text-green-600 bg-green-100">
              +15%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Patients in active treatment
          </p>
          <div className="mt-3">
            <Progress value={75} className="h-2" />
          </div>
        </div>

        {/* Pending Notes */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Notes</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{dashboardStats.pendingNotes}</span>
            <Badge variant="secondary" className="text-xs text-orange-600 bg-orange-100">
              -30%
            </Badge>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Session notes completed
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Assessment reports pending
            </div>
          </div>
        </div>

        {/* Sessions This Week */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Sessions This Week</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{dashboardStats.sessionsThisWeek}</span>
            <Badge variant="secondary" className="text-xs text-green-600 bg-green-100">
              +5%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Appointments scheduled
          </p>
          <div className="mt-3">
            <Progress value={60} className="h-2" />
          </div>
        </div>

        {/* Upcoming - Mini Calendar */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Upcoming</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-muted-foreground font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {[21, 22, 23, 24, 25, 26, 27].map((day) => (
              <div
                key={day}
                className={`py-1 rounded-md ${day === 22
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted cursor-pointer'
                  }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Schedule & Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Today&apos;s Schedule</h2>
                <p className="text-sm text-muted-foreground">{todaySchedule.length} appointments</p>
              </div>
              <Link href="/schedule">
                <Button variant="outline" className="rounded-full">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {todaySchedule.slice(0, 4).map(({ session, patient }) => (
                <Link
                  key={session.id}
                  href={`/session/${session.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-200 group"
                >
                  <Avatar className="h-11 w-11 avatar-bordered">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {patient.lastName.charAt(0)}{patient.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.patientName}</p>
                      {patient.riskLevel === 'high' && (
                        <Badge variant="destructive" className="text-xs">High Risk</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {session.chiefConcern}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">
                      {new Date(session.scheduledAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.duration} min
                    </p>
                  </div>
                  <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    Start
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Patient Progress Overview</h2>
                <p className="text-sm text-muted-foreground">Based on assessment scores over time</p>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="rounded-full text-xs">Week</Button>
                <Button variant="ghost" size="sm" className="rounded-full text-xs">Month</Button>
                <Button variant="ghost" size="sm" className="rounded-full text-xs">Year</Button>
              </div>
            </div>

            {/* Simple bar chart visualization */}
            <div className="flex items-end gap-3 h-40 pt-4">
              {[45, 60, 55, 70, 65, 80, 75].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary/60 to-primary/30 transition-all duration-300 hover:from-primary/80 hover:to-primary/50"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* High Risk Alert */}
          {highRiskPatients.length > 0 && (
            <div className="rounded-2xl p-5 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-red-700">Urgent Attention</h3>
              </div>
              <p className="text-sm text-red-600/80 mb-4">
                Patients requiring immediate follow-up
              </p>
              <div className="space-y-2">
                {highRiskPatients.slice(0, 2).map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/patients/${patient.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/60 hover:bg-white/80 transition-colors"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-red-100 text-red-700 text-sm">
                        {patient.lastName.charAt(0)}{patient.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-red-900">
                        {patient.lastName} {patient.firstName}
                      </p>
                      <p className="text-xs text-red-600/70 truncate">
                        {patient.diagnoses[0]?.name}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-400" />
                  </Link>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3 border-red-200 text-red-700 hover:bg-red-50">
                <Phone className="mr-2 h-4 w-4" />
                Get help now
              </Button>
            </div>
          )}

          {/* Upcoming Appointments List */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold mb-4">Upcoming Sessions</h3>
            <div className="space-y-3">
              {mockSessions.slice(0, 4).map((session) => {
                const patient = mockPatients.find(p => p.id === session.patientId)
                return (
                  <div key={session.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {patient?.lastName.charAt(0)}{patient?.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{session.patientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient?.diagnoses[0]?.name.split(' ').slice(0, 2).join(' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(session.scheduledAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Button className="w-full mt-4 rounded-full">
              Schedule a new consultation
            </Button>
          </div>

          {/* Recent Session Records */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold mb-1">Records of recent sessions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              View recordings for review
            </p>
            <div className="space-y-3">
              {[
                { name: 'Protecting personal space', doctor: 'Dr. McCoy', duration: '45min' },
                { name: 'Respectful relationship s3', doctor: 'Darlene Robertson', duration: '1h 7min' },
                { name: 'Respectful relationship s2', doctor: 'Darlene Robertson', duration: '58 min' },
              ].map((record, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                    <Play className="h-4 w-4 text-primary ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{record.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.doctor} · {record.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
