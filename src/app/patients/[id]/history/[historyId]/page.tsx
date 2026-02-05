"use client"

import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ClipboardList,
  BookOpen,
  StickyNote,
} from "lucide-react"
import Link from "next/link"
import { getSessionHistoryById, getPatientById } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"

export default function SessionHistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string; historyId: string }>
}) {
  const { id, historyId } = use(params)
  const sessionHistory = getSessionHistoryById(historyId)
  const patient = getPatientById(id)

  if (!sessionHistory || !patient) {
    notFound()
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'improved': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'declined': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'improved': return 'Cải thiện'
      case 'declined': return 'Giảm sút'
      default: return 'Ổn định'
    }
  }

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'improved': return 'bg-green-100 text-green-700'
      case 'declined': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-green-100 text-green-700'
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      default: return 'Thấp'
    }
  }

  const getHomeworkBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'partial': return 'bg-yellow-100 text-yellow-700'
      case 'not_done': return 'bg-red-100 text-red-700'
      default: return 'bg-blue-100 text-blue-700'
    }
  }

  const getHomeworkLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành'
      case 'partial': return 'Một phần'
      case 'not_done': return 'Chưa làm'
      default: return 'Đã giao'
    }
  }

  const getSessionTypeBadge = (type: string) => {
    switch (type) {
      case 'initial': return 'bg-green-100 text-green-700'
      case 'follow_up': return 'bg-blue-100 text-blue-700'
      case 'crisis': return 'bg-red-100 text-red-700'
      case 'assessment': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="p-4 flex items-center gap-4">
          <Link href={`/patients/${id}`}>
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
                    Session #{sessionHistory.sessionNumber}
                  </h1>
                  <Badge className={cn("rounded-full text-xs", getSessionTypeBadge(sessionHistory.sessionType))}>
                    {getSessionTypeLabel(sessionHistory.sessionType)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {sessionHistory.patientName} · {new Date(sessionHistory.sessionDate).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Summary */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Tóm tắt buổi hẹn</h3>
              </div>

              <div className="space-y-4">
                {/* Chief Concern */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lý do khám</p>
                  <p className="font-medium">{sessionHistory.summary.chiefConcern}</p>
                </div>

                {/* Key Points */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Điểm chính</p>
                  <ul className="space-y-2">
                    {sessionHistory.summary.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress */}
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Đánh giá tiến triển</p>
                  <p className="text-sm">{sessionHistory.summary.progress}</p>
                </div>

                {/* Status badges */}
                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    {getMoodIcon(sessionHistory.summary.moodState)}
                    <Badge className={cn("rounded-full text-xs", getMoodBadge(sessionHistory.summary.moodState))}>
                      {getMoodLabel(sessionHistory.summary.moodState)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn(
                      "h-4 w-4",
                      sessionHistory.summary.riskLevel === 'high' ? 'text-red-500' :
                        sessionHistory.summary.riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    )} />
                    <Badge className={cn("rounded-full text-xs", getRiskBadge(sessionHistory.summary.riskLevel))}>
                      Nguy cơ: {getRiskLabel(sessionHistory.summary.riskLevel)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs for detailed content */}
            <Tabs defaultValue="conversation" className="w-full">
              <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-full">
                <TabsTrigger value="conversation" className="rounded-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Hội thoại
                </TabsTrigger>
                <TabsTrigger value="notes" className="rounded-full">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Ghi chú lâm sàng
                </TabsTrigger>
                <TabsTrigger value="homework" className="rounded-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Bài tập
                </TabsTrigger>
              </TabsList>

              {/* Conversation Tab */}
              <TabsContent value="conversation" className="mt-6">
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Nội dung hội thoại</h3>
                    <span className="text-sm text-muted-foreground">
                      {sessionHistory.duration} phút
                    </span>
                  </div>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {sessionHistory.conversation.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3",
                            message.speaker === 'clinician' ? 'flex-row' : 'flex-row-reverse'
                          )}
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className={cn(
                              "text-xs",
                              message.speaker === 'clinician' ? 'bg-primary/10 text-primary' : 'bg-secondary'
                            )}>
                              {message.speaker === 'clinician' ? 'BS' : 'BN'}
                            </AvatarFallback>
                          </Avatar>
                          <div className={cn(
                            "flex-1 max-w-[80%]",
                            message.speaker === 'clinician' ? '' : 'text-right'
                          )}>
                            <div className={cn(
                              "inline-block p-3 rounded-2xl",
                              message.speaker === 'clinician'
                                ? 'bg-primary/10 rounded-tl-none'
                                : 'bg-secondary rounded-tr-none'
                            )}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className={cn(
                              "flex items-center gap-2 mt-1",
                              message.speaker === 'clinician' ? '' : 'justify-end'
                            )}>
                              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                              {message.tags && message.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs rounded-full py-0 px-1.5">
                                  {tag === 'key_insight' && '💡'}
                                  {tag === 'progress' && '📈'}
                                  {tag === 'risk_indicator' && '⚠️'}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Clinical Notes Tab */}
              <TabsContent value="notes" className="mt-6">
                <div className="glass-card rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="rounded-full">{sessionHistory.clinicalNote.noteType}</Badge>
                    <span className="text-sm text-muted-foreground">Clinical Note</span>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                      <p className="text-sm font-medium text-primary mb-2">S - Subjective</p>
                      <p className="text-sm">{sessionHistory.clinicalNote.subjective}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                      <p className="text-sm font-medium text-primary mb-2">O - Objective</p>
                      <p className="text-sm">{sessionHistory.clinicalNote.objective}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                      <p className="text-sm font-medium text-primary mb-2">A - Assessment</p>
                      <p className="text-sm">{sessionHistory.clinicalNote.assessment}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                      <p className="text-sm font-medium text-primary mb-2">P - Plan</p>
                      <p className="text-sm whitespace-pre-line">{sessionHistory.clinicalNote.plan}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Homework Tab */}
              <TabsContent value="homework" className="mt-6">
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold mb-4">Bài tập về nhà</h3>
                  <div className="space-y-3">
                    {sessionHistory.homework.map((hw, index) => (
                      <div key={index} className="p-4 rounded-xl bg-background/50 border border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={cn("rounded-full text-xs", getHomeworkBadge(hw.status))}>
                              {getHomeworkLabel(hw.status)}
                            </Badge>
                            <span className="text-sm font-medium">{hw.task}</span>
                          </div>
                        </div>
                        {hw.notes && (
                          <p className="text-sm text-muted-foreground mt-2 ml-20">{hw.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Session Info */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Thông tin buổi hẹn</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ngày</p>
                    <p className="font-medium text-sm">
                      {new Date(sessionHistory.sessionDate).toLocaleDateString('vi-VN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Thời gian</p>
                    <p className="font-medium text-sm">
                      {new Date(sessionHistory.sessionDate).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} · {sessionHistory.duration} phút
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessments */}
            {sessionHistory.assessments && sessionHistory.assessments.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Kết quả đánh giá</h3>
                <div className="space-y-4">
                  {sessionHistory.assessments.map((assessment, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="rounded-full">{assessment.toolType}</Badge>
                        <span className="font-bold">
                          {assessment.score}<span className="text-sm font-normal text-muted-foreground">/{assessment.maxScore}</span>
                        </span>
                      </div>
                      <Progress value={(assessment.score / assessment.maxScore) * 100} className="h-2 mb-1" />
                      <p className="text-xs text-muted-foreground">{assessment.interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Insights */}
            {sessionHistory.aiInsights && sessionHistory.aiInsights.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">AI Insights</h3>
                </div>
                <ul className="space-y-2">
                  {sessionHistory.aiInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Notes */}
            {sessionHistory.additionalNotes && (
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <StickyNote className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Ghi chú thêm</h3>
                </div>
                <p className="text-sm text-muted-foreground">{sessionHistory.additionalNotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
