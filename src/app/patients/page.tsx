"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, UserPlus, ChevronRight, Calendar, FileText, Star, ArrowUpDown, CheckSquare, Activity, Clock, UserX, AlertTriangle, Pill, CalendarClock, TrendingUp, Sparkles } from "lucide-react"
import Link from "next/link"
import { mockPatients } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { useSelection } from "@/hooks/use-selection"
import { BulkActionsBar } from "@/components/bulk-actions-bar"

type SortOption = 'name-asc' | 'name-desc' | 'last-session' | 'risk-high' | 'risk-low'
type PatientStatus = 'active' | 'inactive' | 'discharged'

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [selectionMode, setSelectionMode] = useState(false)

  const {
    selectedItems,
    isSelected,
    toggle,
    toggleAll,
    clearSelection,
    count: selectedCount,
    hasSelection,
    isAllSelected,
  } = useSelection<string>()

  // Sort patients based on selected option
  const sortPatients = (patients: typeof mockPatients) => {
    return [...patients].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)
        case 'name-desc':
          return `${b.lastName} ${b.firstName}`.localeCompare(`${a.lastName} ${a.firstName}`)
        case 'last-session':
          return new Date(b.lastSessionDate).getTime() - new Date(a.lastSessionDate).getTime()
        case 'risk-high': {
          const riskOrder = { high: 0, medium: 1, low: 2 }
          return riskOrder[a.riskLevel as keyof typeof riskOrder] - riskOrder[b.riskLevel as keyof typeof riskOrder]
        }
        case 'risk-low': {
          const riskOrder = { high: 2, medium: 1, low: 0 }
          return riskOrder[a.riskLevel as keyof typeof riskOrder] - riskOrder[b.riskLevel as keyof typeof riskOrder]
        }
        default:
          return 0
      }
    })
  }

  const filteredPatients = sortPatients(mockPatients.filter(patient => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnoses.some(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRisk = riskFilter === "all" || patient.riskLevel === riskFilter
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter

    return matchesSearch && matchesRisk && matchesStatus
  }))

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Risk</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>
      default:
        return <Badge variant="outline" className="text-xs">Low</Badge>
    }
  }

  const getRiskIndicator = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      default:
        return 'bg-green-500'
    }
  }

  const getStatusBadge = (status: PatientStatus) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
            <Activity className="h-3 w-3" />
            Active
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Inactive
          </Badge>
        )
      case 'discharged':
        return (
          <Badge variant="outline" className="gap-1">
            <UserX className="h-3 w-3" />
            Discharged
          </Badge>
        )
      default:
        return null
    }
  }

  // Get patient highlights/notable features
  const getPatientHighlights = (patient: typeof mockPatients[0]) => {
    const highlights: { icon: React.ReactNode; text: string; variant: 'default' | 'warning' | 'info' | 'success' }[] = []

    // High risk indicator
    if (patient.riskLevel === 'high') {
      highlights.push({
        icon: <AlertTriangle className="h-3 w-3" />,
        text: 'High Risk',
        variant: 'warning'
      })
    }

    // Many medications
    if (patient.medications && patient.medications.length >= 2) {
      highlights.push({
        icon: <Pill className="h-3 w-3" />,
        text: `${patient.medications.length} medications`,
        variant: 'info'
      })
    }

    // Long-term patient (more than 20 sessions)
    if (patient.totalSessions >= 20) {
      highlights.push({
        icon: <TrendingUp className="h-3 w-3" />,
        text: 'Long-term',
        variant: 'info'
      })
    }

    // Has upcoming appointment
    if (patient.nextSessionDate) {
      const nextDate = new Date(patient.nextSessionDate)
      const today = new Date()
      const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays <= 7 && diffDays >= 0) {
        highlights.push({
          icon: <CalendarClock className="h-3 w-3" />,
          text: diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`,
          variant: 'success'
        })
      }
    }

    // Severe diagnosis
    if (patient.diagnoses[0]?.severity === 'severe') {
      highlights.push({
        icon: <Sparkles className="h-3 w-3" />,
        text: 'Severe',
        variant: 'warning'
      })
    }

    // New patient (less than 5 sessions)
    if (patient.totalSessions <= 5) {
      highlights.push({
        icon: <Star className="h-3 w-3" />,
        text: 'New patient',
        variant: 'default'
      })
    }

    return highlights.slice(0, 3) // Max 3 highlights
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground">{filteredPatients.length} patients in your care</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="search-bar flex items-center gap-2 w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] rounded-full">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="discharged">Discharged</SelectItem>
            </SelectContent>
          </Select>

          {/* Risk Filter */}
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[150px] rounded-full">
              <SelectValue placeholder="All risks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risks</SelectItem>
              <SelectItem value="high">High risk</SelectItem>
              <SelectItem value="medium">Medium risk</SelectItem>
              <SelectItem value="low">Low risk</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[170px] rounded-full">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="last-session">Last session</SelectItem>
              <SelectItem value="risk-high">Risk: High first</SelectItem>
              <SelectItem value="risk-low">Risk: Low first</SelectItem>
            </SelectContent>
          </Select>

          {/* Select Mode Toggle */}
          <Button
            variant={selectionMode ? "default" : "outline"}
            className="rounded-full"
            onClick={() => {
              setSelectionMode(!selectionMode)
              if (selectionMode) clearSelection()
            }}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            {selectionMode ? "Done" : "Select"}
          </Button>

          {/* Add Patient Button */}
          <Button className="rounded-full" onClick={() => setShowOnboarding(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add patient
          </Button>

          {/* Onboarding Wizard */}
          <OnboardingWizard
            open={showOnboarding}
            onOpenChange={setShowOnboarding}
            onComplete={(data) => {
              console.log("Patient registered with consents:", data)
              // In a real app, this would save the patient data
            }}
          />
        </div>
      </div>

      {/* Select All Row (when in selection mode) */}
      {selectionMode && filteredPatients.length > 0 && (
        <div className="flex items-center gap-3 px-2">
          <Checkbox
            checked={isAllSelected(filteredPatients.map(p => p.id))}
            onCheckedChange={() => toggleAll(filteredPatients.map(p => p.id))}
            aria-label="Select all patients"
          />
          <span className="text-sm text-muted-foreground">
            {isAllSelected(filteredPatients.map(p => p.id))
              ? "Deselect all"
              : `Select all (${filteredPatients.length})`}
          </span>
        </div>
      )}

      {/* Patient Cards Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPatients.map((patient) => {
          const cardContent = (
            <>
              {/* Patient Header */}
              <div className="flex items-start gap-3 mb-4">
                {selectionMode && (
                  <div
                    className="pt-1"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggle(patient.id)
                    }}
                  >
                    <Checkbox
                      checked={isSelected(patient.id)}
                      onCheckedChange={() => toggle(patient.id)}
                      aria-label={`Select ${patient.firstName} ${patient.lastName}`}
                    />
                  </div>
                )}
                <Avatar className="h-12 w-12 avatar-bordered">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {patient.lastName.charAt(0)}{patient.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">
                      {patient.lastName} {patient.firstName}
                    </h3>
                    <span className={cn("w-2 h-2 rounded-full shrink-0", getRiskIndicator(patient.riskLevel))} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {patient.age} years · {patient.gender === 'male' ? 'Male' : 'Female'}
                    </p>
                  </div>
                </div>
                {getStatusBadge(patient.status)}
              </div>

              {/* Diagnosis */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">Primary Diagnosis</p>
                <p className="text-sm font-medium truncate">
                  {patient.diagnoses[0]?.name || 'No diagnosis'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {patient.diagnoses[0]?.code}
                </p>
              </div>

              {/* Highlights */}
              {(() => {
                const highlights = getPatientHighlights(patient)
                if (highlights.length === 0) return null
                return (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          highlight.variant === 'warning' && "bg-amber-100 text-amber-700",
                          highlight.variant === 'info' && "bg-blue-100 text-blue-700",
                          highlight.variant === 'success' && "bg-emerald-100 text-emerald-700",
                          highlight.variant === 'default' && "bg-gray-100 text-gray-700"
                        )}
                      >
                        {highlight.icon}
                        {highlight.text}
                      </span>
                    ))}
                  </div>
                )
              })()}

              {/* Stats Row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{patient.totalSessions} sessions</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{patient.medications?.length || 0} meds</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">Last session</p>
                  <p className="text-sm font-medium">
                    {new Date(patient.lastSessionDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {!selectionMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    View
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          )

          if (selectionMode) {
            return (
              <div
                key={patient.id}
                onClick={() => toggle(patient.id)}
                className={cn(
                  "glass-card rounded-2xl p-5 transition-all duration-200 hover:shadow-lg cursor-pointer group",
                  isSelected(patient.id) && "ring-2 ring-primary bg-primary/5"
                )}
              >
                {cardContent}
              </div>
            )
          }

          return (
            <Link
              key={patient.id}
              href={`/patients/${patient.id}`}
              className="glass-card rounded-2xl p-5 transition-all duration-200 hover:shadow-lg group"
            >
              {cardContent}
            </Link>
          )
        })}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedCount}
        onClearSelection={() => {
          clearSelection()
          setSelectionMode(false)
        }}
      />

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No patients found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setRiskFilter('all'); setStatusFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
