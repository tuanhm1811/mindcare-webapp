"use client"

import { use, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  ArrowRight,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MonitorUp,
  Settings,
  Circle,
  FileText,
  Clock,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Shield,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  mockSessions,
  getPatientById,
} from "@/lib/mock-data"
import { notFound } from "next/navigation"

export default function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const session = mockSessions.find(s => s.id === id)

  if (!session) {
    notFound()
  }

  const patient = getPatientById(session.patientId)

  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [quickNotes, setQuickNotes] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [showConsentDialog, setShowConsentDialog] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [consentTimestamp, setConsentTimestamp] = useState<Date | null>(null)

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleEndCall = () => {
    if (isRecording) {
      setIsRecording(false)
    }
    router.push(`/session/${id}/post-session`)
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive">Rủi ro cao</Badge>
      case 'medium':
        return <Badge variant="secondary">Rủi ro TB</Badge>
      default:
        return <Badge variant="outline">Rủi ro thấp</Badge>
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-black">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/session/${id}/pre-session`} aria-label="Quay lại chuẩn bị">
              <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-semibold">{session.patientName}</h1>
                <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-300">
                  Buổi #{session.sessionNumber}
                </Badge>
                {patient && getRiskBadge(patient.riskLevel)}
              </div>
            </div>
          </div>

          {/* Timer & Recording Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2 text-red-500 animate-pulse">
                <Circle className="h-3 w-3 fill-current" />
                <span className="text-sm">Đang ghi</span>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-zinc-700 text-zinc-400 flex items-center justify-center text-xs">
                1
              </div>
              <span className="text-xs text-zinc-400">Chuẩn bị</span>
            </div>
            <div className="w-8 h-0.5 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                2
              </div>
              <span className="text-xs text-white">Cuộc gọi</span>
            </div>
            <div className="w-8 h-0.5 bg-zinc-700" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-zinc-700 text-zinc-400 flex items-center justify-center text-xs">
                3
              </div>
              <span className="text-xs text-zinc-400">Ghi chú</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className={`flex-1 relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          {/* Main Video (Patient) */}
          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-zinc-500">
                  {session.patientName.split(' ').map(n => n[0]).join('').slice(-2)}
                </span>
              </div>
              <p className="text-white text-lg">{session.patientName}</p>
              <p className="text-zinc-400 text-sm">Đang kết nối...</p>
            </div>
          </div>

          {/* Self Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden shadow-lg">
            {isVideoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                <Video className="h-8 w-8 text-zinc-500" />
              </div>
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <VideoOff className="h-8 w-8 text-zinc-500" />
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-zinc-800"
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" aria-hidden="true" /> : <Maximize2 className="h-5 w-5" aria-hidden="true" />}
          </Button>

          {/* Video Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2" role="toolbar" aria-label="Điều khiển cuộc gọi">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? "Bật microphone" : "Tắt microphone"}
              aria-pressed={isMuted}
            >
              {isMuted ? <MicOff className="h-5 w-5" aria-hidden="true" /> : <Mic className="h-5 w-5" aria-hidden="true" />}
            </Button>
            <Button
              variant={!isVideoOn ? "destructive" : "secondary"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsVideoOn(!isVideoOn)}
              aria-label={isVideoOn ? "Tắt camera" : "Bật camera"}
              aria-pressed={!isVideoOn}
            >
              {isVideoOn ? <Video className="h-5 w-5" aria-hidden="true" /> : <VideoOff className="h-5 w-5" aria-hidden="true" />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full"
              aria-label="Chia sẻ màn hình"
            >
              <MonitorUp className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              variant={isRecording ? "destructive" : "secondary"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => {
                if (!isRecording) {
                  setShowConsentDialog(true)
                } else {
                  setIsRecording(false)
                }
              }}
              aria-label={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
              aria-pressed={isRecording}
            >
              <Circle className={`h-5 w-5 ${isRecording ? 'fill-white' : ''}`} aria-hidden="true" />
            </Button>
            <Separator orientation="vertical" className="h-8 bg-zinc-600 mx-2" aria-hidden="true" />
            <Button
              variant="destructive"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setShowEndConfirm(true)}
              aria-label="Kết thúc cuộc gọi"
            >
              <Phone className="h-5 w-5 rotate-[135deg]" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Quick Notes Panel */}
        {!isFullscreen && (
          <div className="w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-white font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Ghi chú nhanh
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Ghi lại các điểm quan trọng trong buổi tư vấn
              </p>
            </div>
            <div className="flex-1 p-4">
              <Textarea
                placeholder="Nhập ghi chú nhanh..."
                className="h-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
                value={quickNotes}
                onChange={(e) => setQuickNotes(e.target.value)}
              />
            </div>
            <div className="p-4 border-t border-zinc-800">
              {patient?.riskLevel === 'high' && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Bệnh nhân rủi ro cao</span>
                  </div>
                </div>
              )}
              <Button
                className="w-full"
                onClick={() => setShowEndConfirm(true)}
              >
                Kết thúc và ghi chú
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* End Call Confirmation Dialog */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="end-call-title">
          <Card className="w-96">
            <CardHeader>
              <CardTitle id="end-call-title">Kết thúc buổi tư vấn?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Thời gian buổi tư vấn: <span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
              </p>
              {isRecording && (
                <p className="text-sm text-muted-foreground">
                  Bản ghi âm sẽ được lưu để transcribe sau.
                </p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowEndConfirm(false)}>
                  Tiếp tục
                </Button>
                <Button className="flex-1" onClick={handleEndCall}>
                  Kết thúc
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recording Consent Dialog */}
      {showConsentDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="consent-title">
          <Card className="w-[450px]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle id="consent-title">Xin phép ghi âm</CardTitle>
                  <CardDescription>Yêu cầu đồng ý từ bệnh nhân</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Theo quy định bảo mật dữ liệu y tế, bạn cần xin phép bệnh nhân trước khi ghi âm buổi tư vấn.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
                    <span>Bản ghi âm được mã hóa end-to-end</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
                    <span>Chỉ bạn và bệnh nhân có quyền truy cập</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
                    <span>Lưu trữ theo quy định y tế (7 năm)</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg border">
                <Checkbox
                  id="consent-checkbox"
                  checked={consentChecked}
                  onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
                />
                <Label htmlFor="consent-checkbox" className="text-sm font-normal cursor-pointer">
                  Tôi xác nhận bệnh nhân <strong>{session.patientName}</strong> đã đồng ý ghi âm buổi tư vấn này
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowConsentDialog(false)
                    setConsentChecked(false)
                  }}
                >
                  Hủy
                </Button>
                <Button
                  className="flex-1"
                  disabled={!consentChecked}
                  onClick={() => {
                    setIsRecording(true)
                    setConsentTimestamp(new Date())
                    setShowConsentDialog(false)
                    setConsentChecked(false)
                  }}
                >
                  Bắt đầu ghi âm
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
