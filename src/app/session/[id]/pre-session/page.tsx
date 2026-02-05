"use client"

import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  ArrowRight,
  Pill,
  FileText,
  CheckCircle,
  Clock,
  User,
  AlertTriangle,
  Video,
  Calendar,
  TrendingUp,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import {
  mockSessions,
  getPatientById,
  getAssessmentsByPatientId,
  lastSessionSummary,
} from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

// Mock session history data
const mockSessionHistory = [
  {
    id: 1,
    date: '2024-02-01',
    sessionNumber: 12,
    type: 'Follow-up',
    summary: 'Patient reported improved sleep after implementing sleep hygiene. Discussed CBT techniques for negative thoughts. PHQ-9 decreased from 14 to 9.',
    mood: 'Improved',
    homework: ['Mood journal 3x/day', 'Exercise 30 min/day'],
  },
  {
    id: 2,
    date: '2024-01-25',
    sessionNumber: 11,
    type: 'Follow-up',
    summary: 'Continued work on negative automatic thoughts. Patient struggled with homework due to increased work pressure.',
    mood: 'Stable',
    homework: ['Practice STOP technique', 'Thought records journal'],
  },
  {
    id: 3,
    date: '2024-01-18',
    sessionNumber: 10,
    type: 'Follow-up',
    summary: 'Started cognitive restructuring module. Patient identified key cognitive distortions.',
    mood: 'Stable',
    homework: ['Read cognitive distortions material', 'Practice breathing exercises'],
  },
]

export default function PreSessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const session = mockSessions.find(s => s.id === id)

  if (!session) {
    notFound()
  }

  const patient = getPatientById(session.patientId)
  const assessments = getAssessmentsByPatientId(session.patientId)

  if (!patient) {
    notFound()
  }

  const getRiskIndicator = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  const getMoodBadge = (mood: string) => {
    if (mood === 'Improved') return 'bg-green-100 text-green-700'
    if (mood === 'Declined') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Avatar className="h-10 w-10 avatar-bordered">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {patient.lastName.charAt(0)}{patient.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">{session.patientName}</h1>
                  <Badge variant="outline" className="rounded-full">Session #{session.sessionNumber}</Badge>
                  <span className={cn("w-2 h-2 rounded-full", getRiskIndicator(patient.riskLevel))} />
                </div>
                <p className="text-sm text-muted-foreground">{session.chiefConcern}</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="text-sm font-medium">Prepare</span>
              </div>
              <div className="w-8 h-0.5 bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="text-sm text-muted-foreground">Meeting</span>
              </div>
              <div className="w-8 h-0.5 bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="text-sm text-muted-foreground">Notes</span>
              </div>
            </div>

            <Link href={`/session/${id}/meeting`}>
              <Button className="rounded-full">
                <Video className="mr-2 h-4 w-4" />
                Start Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Patient Overview */}
          <div className="space-y-6">
            {/* Patient Info Card */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Patient Info</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium">{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium">{patient.gender === 'male' ? 'Male' : 'Female'}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Diagnoses</p>
                  <div className="space-y-2">
                    {patient.diagnoses.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full text-xs">{d.code}</Badge>
                        <span className="text-sm">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
                  {patient.medications.map((med, i) => (
                    <div key={i} className="p-3 rounded-xl bg-background/50 border border-border/50">
                      <p className="font-medium">{med.name} {med.dosage}</p>
                      <p className="text-sm text-muted-foreground">{med.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Assessments */}
            {assessments.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Recent Assessments</h3>
                </div>
                <div className="space-y-4">
                  {assessments.slice(0, 2).map((assessment) => (
                    <div key={assessment.id}>
                      <div className="flex justify-between items-center mb-2">
                        <Badge className="rounded-full">{assessment.toolType}</Badge>
                        <span className="font-bold">{assessment.score}<span className="text-sm font-normal text-muted-foreground">/{assessment.maxScore}</span></span>
                      </div>
                      <Progress value={(assessment.score / assessment.maxScore) * 100} className="h-2 mb-1" />
                      <p className="text-xs text-muted-foreground">{assessment.interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Session History */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Session History</h3>
              </div>
              <div className="space-y-4">
                {mockSessionHistory.map((historySession, index) => (
                  <div
                    key={historySession.id}
                    className={cn(
                      "p-4 rounded-xl transition-all",
                      index === 0 ? "bg-primary/5 border border-primary/20" : "bg-background/50 border border-border/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Session #{historySession.sessionNumber}</span>
                        {index === 0 && <Badge className="rounded-full text-xs bg-primary/10 text-primary">Latest</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(historySession.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="rounded-full text-xs">{historySession.type}</Badge>
                      <Badge className={cn("rounded-full text-xs", getMoodBadge(historySession.mood))}>
                        {historySession.mood}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{historySession.summary}</p>
                    {historySession.homework.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-1">Homework assigned:</p>
                        <ul className="space-y-1">
                          {historySession.homework.map((hw, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {hw}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Last Session & Focus */}
          <div className="space-y-6">
            {/* High Risk Warning */}
            {patient.riskLevel === 'high' && (
              <div className="rounded-2xl p-5 bg-gradient-to-br from-red-50 to-orange-50 border border-red-100">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-700">Important Notice</h3>
                </div>
                <ul className="space-y-2 text-sm text-red-600/80">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>HIGH RISK patient - conduct safety assessment at start of session</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>Monitor medication compliance and side effects</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Last Session Details */}
            <div className="glass-card rounded-2xl p-5 border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Last Session Details</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {new Date(lastSessionSummary.sessionDate).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                })}
              </p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Key Points Discussed</p>
                  <ul className="space-y-2">
                    {lastSessionSummary.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-sm font-medium mb-2">Homework Status</p>
                  <div className="space-y-2">
                    {lastSessionSummary.homework.map((hw, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                        <Badge
                          className={cn(
                            "rounded-full text-xs",
                            hw.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          )}
                        >
                          {hw.status === 'completed' ? 'Done' : 'Partial'}
                        </Badge>
                        <span className="text-sm">{hw.task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-sm font-medium mb-2">Suggested Focus Areas</p>
                  <ul className="space-y-1">
                    {lastSessionSummary.nextFocusAreas.map((area, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-primary" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Start Call Button */}
            <Link href={`/session/${id}/meeting`}>
              <Button className="w-full rounded-full h-12 text-base">
                <Video className="mr-2 h-5 w-5" />
                Ready - Start Video Call
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
