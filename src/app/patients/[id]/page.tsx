"use client"

import { use, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { DataDeletionDialog } from "@/components/data-deletion-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Pill,
  Clock,
  PlayCircle,
  FileText,
  MessageSquare,
  ChevronRight,
  Star,
  AlertTriangle,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import {
  getPatientById,
  getAssessmentsByPatientId,
  getSessionHistoryByPatientId,
  lastSessionSummary,
  mockSessions,
} from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const patient = getPatientById(id)

  if (!patient) {
    notFound()
  }

  const assessments = getAssessmentsByPatientId(id)
  const sessionHistory = getSessionHistoryByPatientId(id)
  const patientSession = mockSessions.find(s => s.patientId === id) || mockSessions[0]

  // Data deletion dialog state
  const [showDeletionDialog, setShowDeletionDialog] = useState(false)

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'improved': return 'bg-green-100 text-green-700'
      case 'declined': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'improved': return 'Cải thiện'
      case 'declined': return 'Giảm sút'
      default: return 'Ổn định'
    }
  }

  const getSessionTypeLabel = (type: string) => {
    switch (type) {
      case 'initial': return 'Khám lần đầu'
      case 'follow_up': return 'Tái khám'
      case 'crisis': return 'Khẩn cấp'
      case 'assessment': return 'Đánh giá'
      default: return type
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-green-600 bg-green-50 border-green-200'
    }
  }

  const getRiskIndicator = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="p-4 flex items-center gap-4">
          <Link href="/patients">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 avatar-bordered">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {patient.lastName.charAt(0)}{patient.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">
                    {patient.lastName} {patient.firstName}
                  </h1>
                  <span className={cn("w-2 h-2 rounded-full", getRiskIndicator(patient.riskLevel))} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {patient.age} years · {patient.gender === 'male' ? 'Male' : 'Female'} · ID: {patient.id}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Link href={`/session/${patientSession.id}/pre-session`}>
              <Button className="rounded-full">
                <PlayCircle className="mr-2 h-4 w-4" />
                Start Session
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Patient Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <div className="stats-card">
                <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                <p className="text-2xl font-bold">{patient.totalSessions}</p>
              </div>
              <div className="stats-card">
                <p className="text-sm text-muted-foreground mb-1">Treatment Duration</p>
                <p className="text-2xl font-bold">
                  {Math.ceil((new Date().getTime() - new Date(patient.treatmentStartDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}
                  <span className="text-sm font-normal ml-1">months</span>
                </p>
              </div>
              <div className="stats-card">
                <p className="text-sm text-muted-foreground mb-1">Medications</p>
                <p className="text-2xl font-bold">{patient.medications?.length || 0}</p>
              </div>
              <div className="stats-card">
                <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                <Badge className={cn("mt-1", getRiskColor(patient.riskLevel))}>
                  {patient.riskLevel === 'high' ? 'High' : patient.riskLevel === 'medium' ? 'Medium' : 'Low'}
                </Badge>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-full">
                <TabsTrigger value="overview" className="rounded-full">Overview</TabsTrigger>
                <TabsTrigger value="history" className="rounded-full">History</TabsTrigger>
                <TabsTrigger value="assessments" className="rounded-full">Assessments</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-full">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Contact Info */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="font-medium">{patient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-medium">{patient.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="font-medium">{patient.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">Emergency Contact</p>
                    <p className="font-medium">
                      {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                    </p>
                    <p className="text-sm text-muted-foreground">{patient.emergencyContact.phone}</p>
                  </div>
                </div>

                {/* Diagnoses */}
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold mb-4">Diagnoses</h3>
                  <div className="space-y-3">
                    {patient.diagnoses.map((diagnosis, index) => (
                      <div key={index} className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="rounded-full">{diagnosis.code}</Badge>
                          <Badge
                            className={cn(
                              "rounded-full",
                              diagnosis.severity === 'severe' ? 'bg-red-100 text-red-700' :
                                diagnosis.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            )}
                          >
                            {diagnosis.severity === 'severe' ? 'Severe' :
                              diagnosis.severity === 'moderate' ? 'Moderate' : 'Mild'}
                          </Badge>
                        </div>
                        <p className="font-medium">{diagnosis.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Diagnosed: {new Date(diagnosis.diagnosedDate).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medications */}
                {patient.medications.length > 0 && (
                  <div className="glass-card rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Pill className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Current Medications</h3>
                    </div>
                    <div className="space-y-3">
                      {patient.medications.map((med, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50">
                          <div>
                            <p className="font-medium">{med.name} {med.dosage}</p>
                            <p className="text-sm text-muted-foreground">{med.frequency}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Since {new Date(med.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold mb-4">Lịch sử điều trị</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {patient.totalSessions} buổi kể từ {new Date(patient.treatmentStartDate).toLocaleDateString('vi-VN', {
                      month: 'long', year: 'numeric'
                    })}
                  </p>

                  {sessionHistory.length > 0 ? (
                    <div className="space-y-3">
                      {sessionHistory.map((session, index) => (
                        <Link
                          key={session.id}
                          href={`/patients/${id}/history/${session.id}`}
                          className="block p-4 rounded-xl bg-background/50 border border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">Session #{session.sessionNumber}</span>
                                {index === 0 && (
                                  <Badge className="rounded-full text-xs bg-primary/10 text-primary">Gần nhất</Badge>
                                )}
                                <Badge variant="outline" className="rounded-full text-xs">
                                  {getSessionTypeLabel(session.sessionType)}
                                </Badge>
                                <Badge className={cn("rounded-full text-xs", getMoodBadge(session.summary.moodState))}>
                                  {getMoodLabel(session.summary.moodState)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {new Date(session.sessionDate).toLocaleDateString('vi-VN', {
                                  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                                })} · {session.duration} phút
                              </p>
                              <p className="text-sm mb-2">{session.summary.chiefConcern}</p>
                              <div className="flex flex-wrap gap-1">
                                {session.summary.keyPoints.slice(0, 2).map((point, i) => (
                                  <span key={i} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {point.length > 40 ? point.substring(0, 40) + '...' : point}
                                  </span>
                                ))}
                                {session.summary.keyPoints.length > 2 && (
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    +{session.summary.keyPoints.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">Chưa có lịch sử điều trị chi tiết</p>
                      <p className="text-sm text-muted-foreground">
                        Lịch sử chi tiết sẽ hiển thị sau khi hoàn thành các buổi hẹn
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="assessments" className="mt-6">
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold mb-4">Assessment Results</h3>
                  {assessments.length > 0 ? (
                    <div className="space-y-4">
                      {assessments.map((assessment) => (
                        <div key={assessment.id} className="p-4 rounded-xl bg-background/50 border border-border/50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Badge className="rounded-full">{assessment.toolType}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(assessment.administeredAt).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric'
                                })}
                              </span>
                            </div>
                            <span className="font-bold text-lg">
                              {assessment.score}<span className="text-sm font-normal text-muted-foreground">/{assessment.maxScore}</span>
                            </span>
                          </div>
                          <Progress value={(assessment.score / assessment.maxScore) * 100} className="h-2 mb-2" />
                          <p className="text-sm text-muted-foreground">{assessment.interpretation}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No assessments yet</p>
                      <Button variant="outline" className="mt-4 rounded-full">
                        Add Assessment
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold mb-4">Session Notes</h3>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Notes will appear here</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Risk Warning */}
            {patient.riskLevel === 'high' && (
              <div className="rounded-2xl p-5 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-700">High Risk Patient</h3>
                </div>
                <p className="text-sm text-red-600/80">
                  This patient requires close monitoring. Conduct safety assessment at each session.
                </p>
              </div>
            )}

            {/* Last Session */}
            {id === 'P001' && (
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Last Session</h3>
                  <span className="text-sm text-muted-foreground">
                    {new Date(lastSessionSummary.sessionDate).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Key Points</p>
                    <ul className="space-y-1">
                      {lastSessionSummary.keyPoints.slice(0, 3).map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-sm font-medium mb-2">Homework Status</p>
                    <div className="space-y-2">
                      {lastSessionSummary.homework.map((hw, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge
                            className={cn(
                              "rounded-full text-xs",
                              hw.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            )}
                          >
                            {hw.status === 'completed' ? 'Done' : 'Partial'}
                          </Badge>
                          <span className="text-sm truncate">{hw.task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href={`/session/${patientSession.id}/pre-session`} className="block">
                  <Button className="w-full rounded-full justify-start">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Session
                  </Button>
                </Link>
                <Button variant="outline" className="w-full rounded-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Assessment
                </Button>
                <Button variant="outline" className="w-full rounded-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
                <Button variant="outline" className="w-full rounded-full justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <div className="border-t pt-2 mt-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setShowDeletionDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Yêu cầu xóa dữ liệu
                  </Button>
                </div>
              </div>
            </div>

            {/* Upcoming */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Upcoming</h3>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Next Appointment</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })} at 10:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Deletion Dialog */}
      <DataDeletionDialog
        open={showDeletionDialog}
        onOpenChange={setShowDeletionDialog}
        patientName={`${patient.firstName} ${patient.lastName}`}
        patientId={patient.id}
        onSubmit={(reason, notes) => {
          console.log("Data deletion requested:", { reason, notes, patientId: patient.id })
          toast.success("Yêu cầu đã được gửi", {
            description: "Bạn sẽ nhận được email xác nhận trong vòng 24 giờ.",
          })
        }}
      />
    </div>
  )
}
