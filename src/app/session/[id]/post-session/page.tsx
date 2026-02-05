"use client"

import { use, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes"
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Save,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  Volume2,
  Clock,
  MessageSquare,
  ClipboardList,
  PenLine,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  mockSessions,
  getPatientById,
} from "@/lib/mock-data"
import { notFound } from "next/navigation"

// Mock transcript from recording (longer version)
const mockTranscript = `[00:00:01] Bác sĩ: Chào anh A, hôm nay anh cảm thấy thế nào?

[00:00:05] Bệnh nhân: Dạ, em cảm thấy tốt hơn tuần trước ạ. Em đã ngủ được nhiều hơn.

[00:00:12] Bác sĩ: Tốt quá. Anh ngủ được bao nhiêu tiếng mỗi đêm?

[00:00:16] Bệnh nhân: Khoảng 6-7 tiếng ạ, trước đó chỉ được 4-5 tiếng. Em cũng không còn thức dậy giữa đêm như trước nữa.

[00:00:28] Bác sĩ: Rất tốt. Đó là một sự cải thiện đáng kể. Còn về bài tập thở mà tôi đã hướng dẫn tuần trước, anh có thực hành không?

[00:00:38] Bệnh nhân: Dạ có ạ, em tập mỗi khi cảm thấy lo lắng. Nó giúp em bình tĩnh hơn rất nhiều. Đặc biệt là trước các cuộc họp quan trọng.

[00:00:52] Bác sĩ: Tuyệt vời. Anh có thể chia sẻ cụ thể hơn về những tình huống mà anh đã áp dụng kỹ thuật thở không?

[00:01:02] Bệnh nhân: Dạ, tuần này em có một buổi thuyết trình quan trọng. Trước đó em rất lo lắng, tim đập nhanh. Em đã vào toilet và thực hành thở sâu như bác sĩ hướng dẫn, khoảng 5 phút. Sau đó em bình tĩnh hơn nhiều và buổi thuyết trình diễn ra khá tốt.

[00:01:25] Bác sĩ: Rất tốt. Anh đã biết cách tự giúp mình trong những tình huống căng thẳng. Còn về công việc nói chung thì sao, còn áp lực không?

[00:01:36] Bệnh nhân: Vẫn còn deadline ạ, nhưng em đã học cách chia nhỏ công việc ra như bác sĩ gợi ý. Mỗi ngày em làm một phần nhỏ thay vì để dồn lại. Không còn cảm giác quá tải như trước nữa.

[00:01:52] Bác sĩ: Đó là một thay đổi rất tích cực. Anh có ghi nhật ký mood như đã thảo luận không?

[00:02:00] Bệnh nhân: Dạ có, em ghi mỗi tối trước khi đi ngủ. Em nhận ra mood của em thường tốt hơn vào những ngày em tập thể dục.

[00:02:12] Bác sĩ: Rất hay! Đó là một insight quan trọng. Vậy tuần này anh có tập thể dục được bao nhiêu ngày?

[00:02:20] Bệnh nhân: Được 4 ngày ạ, mỗi ngày đi bộ khoảng 30 phút sau giờ làm.

[00:02:28] Bác sĩ: Tuyệt vời. Tôi rất vui vì anh đã thực hiện tốt các bài tập và thấy được hiệu quả. Tuần tới chúng ta sẽ bắt đầu học thêm về cách nhận diện và thay đổi những suy nghĩ tiêu cực. Anh có câu hỏi gì không?

[00:02:45] Bệnh nhân: Dạ không ạ. Em cảm ơn bác sĩ.

[00:02:48] Bác sĩ: Hẹn gặp lại anh tuần sau nhé.`

// Mock AI-generated summary
const mockAISummary = {
  overview: "Buổi tư vấn diễn ra tích cực. Bệnh nhân báo cáo nhiều cải thiện đáng kể so với tuần trước, bao gồm giấc ngủ, khả năng quản lý lo âu, và tổ chức công việc.",

  keyFindings: [
    "Giấc ngủ cải thiện từ 4-5 tiếng lên 6-7 tiếng/đêm, không còn thức giấc giữa đêm",
    "Áp dụng thành công kỹ thuật thở trong tình huống thực tế (trước thuyết trình)",
    "Đã học cách chia nhỏ công việc, giảm cảm giác quá tải",
    "Ghi nhật ký mood đều đặn, nhận ra mối liên hệ giữa tập thể dục và mood tốt hơn",
    "Tập thể dục 4/7 ngày, mỗi ngày 30 phút đi bộ"
  ],

  patientProgress: "Tiến triển tích cực. Bệnh nhân tuân thủ tốt các bài tập được giao và chủ động áp dụng vào cuộc sống hàng ngày. Có khả năng tự nhận thức về trạng thái tâm lý của mình.",

  clinicalImpression: "Triệu chứng trầm cảm giảm, đặc biệt về mặt giấc ngủ và năng lượng. Các kỹ năng CBT cơ bản đã được tiếp thu và áp dụng hiệu quả.",

  recommendations: [
    "Tiếp tục duy trì sleep hygiene và kỹ thuật thở",
    "Bắt đầu module cognitive restructuring trong buổi tới",
    "Duy trì thói quen ghi nhật ký mood và tập thể dục",
    "Cân nhắc đánh giá lại PHQ-9 trong buổi tới để đo lường tiến triển"
  ],

  sessionDuration: "2 phút 48 giây"
}

export default function PostSessionPage({
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

  const [noteType, setNoteType] = useState("SOAP")
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false)
  const [activeTab, setActiveTab] = useState("transcript")

  // SOAP note fields
  const [subjective, setSubjective] = useState("")
  const [objective, setObjective] = useState("")
  const [assessment, setAssessment] = useState("")
  const [plan, setPlan] = useState("")

  // Additional fields
  const [mood, setMood] = useState("")
  const [affect, setAffect] = useState("")
  const [riskLevel, setRiskLevel] = useState<string>(patient?.riskLevel || "low")
  const [homework, setHomework] = useState<string[]>([])
  const [newHomework, setNewHomework] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")

  // Track unsaved changes
  const hasChanges = useMemo(() => {
    return (
      subjective !== "" ||
      objective !== "" ||
      assessment !== "" ||
      plan !== "" ||
      mood !== "" ||
      affect !== "" ||
      homework.length > 0 ||
      additionalNotes !== ""
    )
  }, [subjective, objective, assessment, plan, mood, affect, homework, additionalNotes])

  const {
    showDialog,
    confirmNavigation,
    cancelNavigation,
  } = useUnsavedChanges({ hasChanges })

  const generateAIDraft = () => {
    setIsGeneratingDraft(true)
    setTimeout(() => {
      setSubjective("Bệnh nhân báo cáo cảm thấy tốt hơn so với tuần trước. Giấc ngủ cải thiện đáng kể, từ 4-5 tiếng/đêm lên 6-7 tiếng/đêm, không còn thức dậy giữa đêm. Đã thực hành kỹ thuật thở thành công trong tình huống thực tế (trước buổi thuyết trình quan trọng). Áp lực công việc vẫn còn với deadline nhưng đã học cách chia nhỏ công việc, không còn cảm giác quá tải. Ghi nhật ký mood đều đặn và nhận ra mood tốt hơn những ngày có tập thể dục. Tập thể dục 4/7 ngày trong tuần, mỗi ngày 30 phút đi bộ.")
      setObjective("Bệnh nhân đến đúng giờ, ăn mặc gọn gàng. Giao tiếp tốt, có eye contact. Giọng nói ổn định, rõ ràng. Biểu cảm phù hợp với nội dung chia sẻ. Không có dấu hiệu lo âu hoặc kích động rõ rệt.")
      setAssessment("Tiến triển tích cực. Bệnh nhân đáp ứng tốt với các kỹ thuật CBT đã được hướng dẫn (kỹ thuật thở, behavioral activation). Giấc ngủ cải thiện là dấu hiệu tốt cho thấy giảm triệu chứng trầm cảm. Khả năng tự nhận thức và quản lý cảm xúc tốt hơn. Tuân thủ điều trị tốt.")
      setPlan("1. Tiếp tục duy trì sleep hygiene và kỹ thuật thở\n2. Bắt đầu module cognitive restructuring trong buổi tới\n3. Duy trì thói quen ghi nhật ký mood và tập thể dục\n4. Cân nhắc làm PHQ-9 buổi tới để đánh giá tiến triển\n5. Hẹn tái khám sau 1 tuần")
      setMood("euthymic")
      setAffect("congruent")
      setIsGeneratingDraft(false)
    }, 2000)
  }

  const addHomework = () => {
    if (newHomework.trim()) {
      setHomework([...homework, newHomework.trim()])
      setNewHomework("")
    }
  }

  const removeHomework = (index: number) => {
    setHomework(homework.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    alert("Đã lưu ghi chú thành công!")
    router.push("/")
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive">Rủi ro cao</Badge>
      case 'medium':
        return <Badge variant="secondary">Rủi ro trung bình</Badge>
      default:
        return <Badge variant="outline">Rủi ro thấp</Badge>
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href={`/session/${id}/meeting`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{session.patientName}</h1>
                  <Badge variant="outline">Buổi #{session.sessionNumber}</Badge>
                  {patient && getRiskBadge(patient.riskLevel)}
                </div>
                <p className="text-sm text-muted-foreground">Ghi chú sau buổi tư vấn</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Lưu nháp
              </Button>
              <Button onClick={handleSave}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Hoàn thành
              </Button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="text-sm text-muted-foreground">Chuẩn bị</span>
            </div>
            <div className="w-16 h-0.5 bg-muted" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm text-muted-foreground">Cuộc gọi</span>
            </div>
            <div className="w-16 h-0.5 bg-muted" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm font-medium">Ghi chú</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Transcript & AI Summary */}
        <div className="w-[420px] border-r flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="transcript" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Transcript
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex-1">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Tóm tắt AI
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="transcript" className="flex-1 flex flex-col m-0 p-4 pt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Bản ghi buổi tư vấn</p>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">2:48</span>
                </div>
              </div>
              <ScrollArea className="flex-1 border rounded-lg p-4 bg-muted/30">
                <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{mockTranscript}</pre>
              </ScrollArea>
              <div className="mt-3 flex gap-2">
                <Button className="flex-1" variant="outline" onClick={() => setActiveTab("summary")}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Xem tóm tắt AI
                </Button>
                <Button variant="ghost" size="icon">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="flex-1 flex flex-col m-0 p-4 pt-2 overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">Tóm tắt từ AI</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-4 pr-2">
                  {/* Overview */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Tổng quan buổi tư vấn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{mockAISummary.overview}</p>
                    </CardContent>
                  </Card>

                  {/* Key Findings */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Điểm chính</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mockAISummary.keyFindings.map((finding, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Clinical Impression */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Nhận định lâm sàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{mockAISummary.clinicalImpression}</p>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Đề xuất</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {mockAISummary.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-primary font-medium">{index + 1}.</span>
                            <span className="text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
              <Button className="mt-3" onClick={generateAIDraft} disabled={isGeneratingDraft}>
                <ClipboardList className="mr-2 h-4 w-4" />
                {isGeneratingDraft ? "Đang tạo..." : "Tạo SOAP Note từ tóm tắt"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Panel - Note Editor */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 max-w-3xl mx-auto space-y-6">
              {/* Template Selection */}
              <div className="flex items-center gap-4">
                <Label>Template:</Label>
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOAP">SOAP Note</SelectItem>
                    <SelectItem value="DAP">DAP Note</SelectItem>
                    <SelectItem value="free">Ghi chú tự do</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={generateAIDraft} disabled={isGeneratingDraft}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isGeneratingDraft ? "Đang tạo..." : "AI tạo draft"}
                </Button>
              </div>

              {/* Quick Assessment */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Đánh giá nhanh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label className="text-sm">Khí sắc (Mood)</Label>
                      <Select value={mood} onValueChange={setMood}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Chọn..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="depressed">Trầm cảm</SelectItem>
                          <SelectItem value="anxious">Lo âu</SelectItem>
                          <SelectItem value="irritable">Cáu gắt</SelectItem>
                          <SelectItem value="euthymic">Ổn định</SelectItem>
                          <SelectItem value="elevated">Hưng phấn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Cảm xúc (Affect)</Label>
                      <Select value={affect} onValueChange={setAffect}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Chọn..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="congruent">Phù hợp</SelectItem>
                          <SelectItem value="incongruent">Không phù hợp</SelectItem>
                          <SelectItem value="flat">Phẳng</SelectItem>
                          <SelectItem value="labile">Dao động</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Mức độ rủi ro</Label>
                      <Select value={riskLevel} onValueChange={setRiskLevel}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Thấp</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="high">Cao</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SOAP Note */}
              {noteType === "SOAP" && (
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Subjective (Chủ quan)</CardTitle>
                      <CardDescription>Triệu chứng và cảm xúc do bệnh nhân báo cáo</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Bệnh nhân báo cáo..."
                        className="min-h-[120px]"
                        value={subjective}
                        onChange={(e) => setSubjective(e.target.value)}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Objective (Khách quan)</CardTitle>
                      <CardDescription>Quan sát và đánh giá của clinician</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Quan sát: ngoại hình, hành vi, MSE..."
                        className="min-h-[120px]"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Assessment (Đánh giá)</CardTitle>
                      <CardDescription>Nhận định lâm sàng và tiến triển</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Đánh giá tình trạng, tiến triển..."
                        className="min-h-[120px]"
                        value={assessment}
                        onChange={(e) => setAssessment(e.target.value)}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Plan (Kế hoạch)</CardTitle>
                      <CardDescription>Kế hoạch điều trị và can thiệp</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Tiếp tục..., Điều chỉnh..."
                        className="min-h-[120px]"
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Additional Notes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PenLine className="h-4 w-4" />
                    Ghi chú thêm
                  </CardTitle>
                  <CardDescription>Những ghi chú bổ sung của bác sĩ</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Ghi chú thêm về buổi tư vấn..."
                    className="min-h-[100px]"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Homework Assignment */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Bài tập về nhà</CardTitle>
                  <CardDescription>Giao bài tập cho bệnh nhân thực hiện</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {homework.map((hw, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-sm">{hw}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeHomework(index)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Thêm bài tập..."
                      value={newHomework}
                      onChange={(e) => setNewHomework(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addHomework()}
                    />
                    <Button variant="outline" onClick={addHomework}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Warning */}
              {riskLevel === 'high' && (
                <Card className="border-destructive">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      Cảnh báo rủi ro cao
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Bệnh nhân được đánh giá mức độ rủi ro CAO. Vui lòng xác nhận đã thực hiện:
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        Đã đánh giá nguy cơ tự sát/tự hại
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        Đã thảo luận safety plan
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        Đã cung cấp số hotline khẩn cấp
                      </label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pb-6">
                <Button variant="outline" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Lưu nháp
                </Button>
                <Button onClick={handleSave}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Hoàn thành buổi tư vấn
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        open={showDialog}
        onSave={() => {
          handleSave()
          confirmNavigation()
        }}
        onDiscard={confirmNavigation}
        onCancel={cancelNavigation}
      />
    </div>
  )
}
