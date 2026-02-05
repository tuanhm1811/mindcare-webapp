"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Phone,
  FileText,
  ClipboardCheck,
  FlaskConical,
  PhoneCall,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
} from "lucide-react"
import Link from "next/link"
import {
  dashboardStats,
  getTodaySchedule,
  mockPatients,
  currentClinician,
  mockActionItems,
  mockClinicalOutcomes,
  getCaseloadSummary,
  getOverdueFollowUps,
  type ActionItem
} from "@/lib/mock-data"

export default function DashboardPage() {
  const todaySchedule = getTodaySchedule()
  const highRiskPatients = mockPatients.filter(p => p.riskLevel === 'high')
  const caseloadSummary = getCaseloadSummary()
  const overdueFollowUps = getOverdueFollowUps()

  // Action item icon based on type
  const getActionIcon = (type: ActionItem['type']) => {
    switch (type) {
      case 'note_due': return <FileText className="h-4 w-4" />
      case 'assessment_due': return <ClipboardCheck className="h-4 w-4" />
      case 'treatment_plan': return <Calendar className="h-4 w-4" />
      case 'lab_result': return <FlaskConical className="h-4 w-4" />
      case 'follow_up': return <PhoneCall className="h-4 w-4" />
      default: return <Circle className="h-4 w-4" />
    }
  }

  // Priority color
  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50'
      case 'medium': return 'text-amber-500 bg-amber-50'
      case 'low': return 'text-green-500 bg-green-50'
    }
  }

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

        {/* Caseload Summary */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">Caseload Summary</h3>
          </div>
          <div className="space-y-3">
            {/* Risk distribution */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Phân bố Risk Level</span>
                <span className="font-medium">{caseloadSummary.total} BN</span>
              </div>
              <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-red-400 transition-all"
                  style={{ width: `${(caseloadSummary.byRisk.high / caseloadSummary.total) * 100}%` }}
                  title={`High: ${caseloadSummary.byRisk.high}`}
                />
                <div
                  className="bg-amber-400 transition-all"
                  style={{ width: `${(caseloadSummary.byRisk.medium / caseloadSummary.total) * 100}%` }}
                  title={`Medium: ${caseloadSummary.byRisk.medium}`}
                />
                <div
                  className="bg-green-400 transition-all"
                  style={{ width: `${(caseloadSummary.byRisk.low / caseloadSummary.total) * 100}%` }}
                  title={`Low: ${caseloadSummary.byRisk.low}`}
                />
              </div>
            </div>
            {/* Risk legend */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-muted-foreground">Cao ({caseloadSummary.byRisk.high})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-muted-foreground">TB ({caseloadSummary.byRisk.medium})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-muted-foreground">Thấp ({caseloadSummary.byRisk.low})</span>
              </div>
            </div>
            {/* Status summary */}
            <div className="pt-2 border-t border-border/50">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="font-semibold text-lg">{caseloadSummary.byStatus.active}</p>
                  <p className="text-muted-foreground">Đang ĐT</p>
                </div>
                <div>
                  <p className="font-semibold text-lg">{caseloadSummary.byStatus.inactive}</p>
                  <p className="text-muted-foreground">Tạm ngưng</p>
                </div>
                <div>
                  <p className="font-semibold text-lg">{caseloadSummary.byStatus.discharged}</p>
                  <p className="text-muted-foreground">Kết thúc</p>
                </div>
              </div>
            </div>
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

          {/* Clinical Outcomes - Assessment Trends */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Clinical Outcomes</h2>
                <p className="text-sm text-muted-foreground">Assessment score trends (PHQ-9, GAD-7, PCL-5)</p>
              </div>
              <Link href="/patients">
                <Button variant="outline" size="sm" className="rounded-full text-xs">
                  View all
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>

            {/* Assessment trends list */}
            <div className="space-y-4">
              {mockClinicalOutcomes.slice(0, 4).map((outcome) => {
                const latestScore = outcome.scores[outcome.scores.length - 1]
                const previousScore = outcome.scores[outcome.scores.length - 2]
                const percentChange = previousScore
                  ? Math.round(((latestScore.score - previousScore.score) / previousScore.score) * 100)
                  : 0

                return (
                  <div key={outcome.patientId} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {outcome.patientName.split(' ').slice(-2).map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{outcome.patientName}</p>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {outcome.assessmentType}
                        </Badge>
                      </div>
                      {/* Mini sparkline visualization */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-end gap-0.5 h-4">
                          {outcome.scores.map((s, i) => (
                            <div
                              key={i}
                              className={`w-3 rounded-sm transition-all ${
                                outcome.trend === 'improving' ? 'bg-green-400' :
                                outcome.trend === 'declining' ? 'bg-red-400' : 'bg-amber-400'
                              }`}
                              style={{ height: `${(s.score / s.maxScore) * 100}%`, opacity: 0.4 + (i * 0.3) }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {latestScore.score}/{latestScore.maxScore}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        outcome.trend === 'improving' ? 'text-green-600' :
                        outcome.trend === 'declining' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {outcome.trend === 'improving' ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : outcome.trend === 'declining' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : null}
                        {percentChange !== 0 && `${Math.abs(percentChange)}%`}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {outcome.trend === 'improving' ? 'Cải thiện' :
                         outcome.trend === 'declining' ? 'Xấu đi' : 'Ổn định'}
                      </p>
                    </div>
                  </div>
                )
              })}
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

          {/* Overdue Follow-ups */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Cần theo dõi</h3>
              {overdueFollowUps.length > 0 && (
                <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                  {overdueFollowUps.length} BN
                </Badge>
              )}
            </div>
            {overdueFollowUps.length > 0 ? (
              <div className="space-y-3">
                {overdueFollowUps.slice(0, 4).map((patient) => {
                  const daysSinceLastSession = Math.floor(
                    (new Date().getTime() - new Date(patient.lastSessionDate).getTime()) / (1000 * 60 * 60 * 24)
                  )
                  return (
                    <Link
                      key={patient.id}
                      href={`/patients/${patient.id}`}
                      className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={`text-sm ${
                          patient.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                          patient.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {patient.lastName.charAt(0)}{patient.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {patient.lastName} {patient.firstName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {patient.diagnoses[0]?.name.split(' ').slice(0, 3).join(' ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs text-amber-600">
                          <Clock className="h-3 w-3" />
                          {daysSinceLastSession} ngày
                        </div>
                        <p className="text-[10px] text-muted-foreground">chưa khám</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>Tất cả bệnh nhân đã được theo dõi</p>
              </div>
            )}
            <Link href="/schedule">
              <Button className="w-full mt-4 rounded-full">
                Đặt lịch hẹn mới
              </Button>
            </Link>
          </div>

          {/* Action Items / Tasks */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold">Action Items</h3>
              <Badge variant="secondary" className="text-xs">
                {mockActionItems.filter(i => i.priority === 'high').length} urgent
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Công việc cần hoàn thành
            </p>
            <div className="space-y-2">
              {mockActionItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${getPriorityColor(item.priority)}`}>
                    {getActionIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-full">
              Xem tất cả tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
