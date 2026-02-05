"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { mockSessions, mockPatients } from "@/lib/mock-data"

// Mock notes data
const mockNotes = [
  {
    id: 'N001',
    patientId: 'P001',
    patientName: 'Nguyễn Văn A',
    sessionDate: '2024-02-01',
    noteType: 'SOAP',
    status: 'completed',
    preview: 'Bệnh nhân báo cáo cải thiện giấc ngủ. PHQ-9 giảm từ 14 xuống 9...',
  },
  {
    id: 'N002',
    patientId: 'P002',
    patientName: 'Trần Thị B',
    sessionDate: '2024-01-28',
    noteType: 'DAP',
    status: 'completed',
    preview: 'Thảo luận về kỹ thuật thở để quản lý lo âu. Bệnh nhân thực hành tốt...',
  },
  {
    id: 'N003',
    patientId: 'P003',
    patientName: 'Lê Văn C',
    sessionDate: '2024-01-30',
    noteType: 'SOAP',
    status: 'pending',
    preview: 'Cần hoàn thành ghi chú...',
  },
  {
    id: 'N004',
    patientId: 'P008',
    patientName: 'Bùi Thị H',
    sessionDate: '2024-02-02',
    noteType: 'SOAP',
    status: 'pending',
    preview: 'DBT session - Emotion regulation skills...',
  },
  {
    id: 'N005',
    patientId: 'P005',
    patientName: 'Hoàng Văn E',
    sessionDate: '2024-01-29',
    noteType: 'SOAP',
    status: 'pending',
    preview: 'PTSD processing session...',
  },
]

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch =
      note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.preview.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || note.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingCount = mockNotes.filter(n => n.status === 'pending').length
  const completedCount = mockNotes.filter(n => n.status === 'completed').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Ghi chú lâm sàng</h1>
        <p className="text-muted-foreground">Quản lý và review ghi chú các buổi tư vấn</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng ghi chú</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockNotes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ hoàn thành</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên bệnh nhân hoặc nội dung..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chờ hoàn thành</SelectItem>
                <SelectItem value="completed">Đã hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách ghi chú</CardTitle>
          <CardDescription>
            {filteredNotes.length} ghi chú
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bệnh nhân</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>
                    <Link
                      href={`/patients/${note.patientId}`}
                      className="font-medium hover:underline"
                    >
                      {note.patientName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {new Date(note.sessionDate).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{note.noteType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={note.status === 'completed' ? 'default' : 'secondary'}
                      className={note.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    >
                      {note.status === 'completed' ? 'Hoàn thành' : 'Chờ hoàn thành'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-sm text-muted-foreground truncate">
                      {note.preview}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-1 h-4 w-4" />
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
