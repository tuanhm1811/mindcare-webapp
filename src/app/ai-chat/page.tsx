"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Send,
  Sparkles,
  User,
  BookOpen,
  Pill,
  FileQuestion,
  AlertCircle,
  Copy,
  RotateCcw,
} from "lucide-react"
import { currentClinician } from "@/lib/mock-data"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: string[]
}

const suggestedQuestions = [
  {
    icon: BookOpen,
    category: "DSM-5",
    question: "Tiêu chuẩn chẩn đoán Major Depressive Disorder theo DSM-5?",
  },
  {
    icon: Pill,
    category: "Thuốc",
    question: "So sánh SSRIs và SNRIs trong điều trị trầm cảm?",
  },
  {
    icon: FileQuestion,
    category: "Trị liệu",
    question: "Khi nào nên sử dụng CBT vs DBT?",
  },
  {
    icon: AlertCircle,
    category: "Cấp cứu",
    question: "Protocol đánh giá nguy cơ tự sát?",
  },
]

const mockResponses: Record<string, { content: string; sources: string[] }> = {
  "Tiêu chuẩn chẩn đoán Major Depressive Disorder theo DSM-5?": {
    content: `**Major Depressive Disorder (MDD) - Tiêu chuẩn DSM-5**

**A. Ít nhất 5 triệu chứng sau trong 2 tuần, có sự thay đổi so với trước đây:**

1. **Khí sắc trầm** hầu hết thời gian trong ngày, gần như mỗi ngày (chủ quan hoặc quan sát được)
2. **Giảm hứng thú** hoặc niềm vui đáng kể trong hầu hết các hoạt động
3. **Thay đổi cân nặng** đáng kể (>5% trong 1 tháng) hoặc thay đổi khẩu vị
4. **Mất ngủ hoặc ngủ quá nhiều** gần như mỗi ngày
5. **Kích động hoặc chậm chạp tâm thần vận động** (quan sát được)
6. **Mệt mỏi** hoặc mất năng lượng gần như mỗi ngày
7. **Cảm giác vô dụng** hoặc tội lỗi quá mức
8. **Giảm khả năng tập trung** hoặc do dự
9. **Suy nghĩ về cái chết** lặp đi lặp lại, ý định tự sát

**Lưu ý quan trọng:**
- Phải có ít nhất 1 trong 2 triệu chứng: (1) khí sắc trầm hoặc (2) giảm hứng thú
- Triệu chứng gây đau khổ hoặc suy giảm chức năng đáng kể
- Loại trừ do chất hoặc bệnh lý y khoa
- Không do rối loạn phổ tâm thần phân liệt

**Mức độ:**
- Nhẹ: 5 triệu chứng, suy giảm nhẹ
- Trung bình: 6-7 triệu chứng
- Nặng: Hầu hết triệu chứng, suy giảm nặng`,
    sources: ["DSM-5 (APA, 2013)", "Kaplan & Sadock's Synopsis of Psychiatry"]
  },
  "So sánh SSRIs và SNRIs trong điều trị trầm cảm?": {
    content: `**So sánh SSRIs và SNRIs**

**SSRIs (Selective Serotonin Reuptake Inhibitors)**
- Thuốc: Fluoxetine, Sertraline, Paroxetine, Citalopram, Escitalopram
- Cơ chế: Ức chế tái hấp thu serotonin chọn lọc
- Ưu điểm:
  • First-line choice cho MDD
  • Ít tác dụng phụ hơn TCAs
  • An toàn khi quá liều
- Tác dụng phụ: Rối loạn tình dục, buồn nôn, đau đầu, mất ngủ

**SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)**
- Thuốc: Venlafaxine, Duloxetine, Desvenlafaxine
- Cơ chế: Ức chế tái hấp thu cả serotonin và norepinephrine
- Ưu điểm:
  • Hiệu quả hơn cho triệu chứng somantic (đau)
  • Có thể hiệu quả khi SSRIs thất bại
  • Duloxetine được chấp thuận cho đau thần kinh
- Tác dụng phụ: Tương tự SSRIs + tăng huyết áp (liều cao)

**Khi nào chọn gì?**
- **SSRIs**: First-line, đặc biệt Escitalopram/Sertraline
- **SNRIs**: Khi có triệu chứng đau kèm theo, mệt mỏi nặng, hoặc không đáp ứng SSRIs

**Lưu ý:** Cả hai đều cần 2-4 tuần để thấy hiệu quả. Không ngừng thuốc đột ngột.`,
    sources: ["APA Practice Guidelines", "Stahl's Essential Psychopharmacology"]
  },
  default: {
    content: `Cảm ơn câu hỏi của bạn. Đây là một chủ đề quan trọng trong thực hành lâm sàng.

Để trả lời đầy đủ, tôi cần thêm thông tin về ngữ cảnh cụ thể. Tuy nhiên, tôi có thể cung cấp một số hướng dẫn chung:

1. **Đánh giá toàn diện** là bước đầu tiên quan trọng
2. **Evidence-based practice** nên được ưu tiên
3. **Cá nhân hóa điều trị** dựa trên đặc điểm của từng bệnh nhân

*Lưu ý: Đây là thông tin hỗ trợ tham khảo. Quyết định lâm sàng cuối cùng thuộc về clinician dựa trên đánh giá cụ thể của từng ca.*

Bạn có muốn tôi đi sâu vào khía cạnh cụ thể nào không?`,
    sources: ["Clinical Guidelines", "Best Practice Recommendations"]
  }
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Xin chào ${currentClinician.name}! 👋

Tôi là MindCare AI Assistant, sẵn sàng hỗ trợ bạn với:

• **Tra cứu DSM-5** - Tiêu chuẩn chẩn đoán các rối loạn tâm thần
• **Thông tin thuốc** - Psychopharmacology, tương tác thuốc
• **Protocols điều trị** - Evidence-based treatment guidelines
• **Hỗ trợ case** - Conceptualization, differential diagnosis

Bạn có thể hỏi tôi bất cứ điều gì liên quan đến thực hành tâm thần học!

*Lưu ý: Thông tin tôi cung cấp chỉ mang tính tham khảo. Quyết định lâm sàng cuối cùng thuộc về bạn.*`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (question?: string) => {
    const messageText = question || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = mockResponses[messageText] || mockResponses.default
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        sources: response.sources,
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">AI Assistant</h1>
              <p className="text-sm text-muted-foreground">
                Tra cứu DSM-5, thuốc, protocols điều trị
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-6" role="log" aria-live="polite" aria-label="Lịch sử tin nhắn">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'flex flex-col items-end' : ''
                    }`}
                >
                  <div
                    className={`rounded-lg p-4 ${message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                      }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2">
                      {message.sources && (
                        <div className="flex flex-wrap gap-1">
                          {message.sources.map((source, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(message.content)}
                        aria-label="Sao chép tin nhắn"
                      >
                        <Copy className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Brain className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-4 bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">Đang trả lời...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Hỏi về DSM-5, thuốc, protocols điều trị..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                aria-label="Gửi tin nhắn"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI có thể đưa ra thông tin không chính xác. Luôn verify với nguồn chính thức.
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Suggested Questions */}
      <div className="w-72 border-l p-4 hidden lg:block">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Câu hỏi gợi ý
            </h3>
            <div className="space-y-2">
              {suggestedQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(item.question)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-sm">{item.question}</p>
                </button>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick References</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                DSM-5 Quick Guide
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Pill className="mr-2 h-4 w-4" />
                Drug Interactions
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertCircle className="mr-2 h-4 w-4" />
                Crisis Protocols
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
