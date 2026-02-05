"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, UserPlus, ChevronRight, Calendar, FileText, Star } from "lucide-react"
import Link from "next/link"
import { mockPatients } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showOnboarding, setShowOnboarding] = useState(false)

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnoses.some(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRisk = riskFilter === "all" || patient.riskLevel === riskFilter

    return matchesSearch && matchesRisk
  })

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

      {/* Patient Cards Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPatients.map((patient) => (
          <Link
            key={patient.id}
            href={`/patients/${patient.id}`}
            className="glass-card rounded-2xl p-5 transition-all duration-200 hover:shadow-lg group"
          >
            {/* Patient Header */}
            <div className="flex items-start gap-3 mb-4">
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
                <p className="text-sm text-muted-foreground">
                  {patient.age} years · {patient.gender === 'male' ? 'Male' : 'Female'}
                </p>
              </div>
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
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Link>
        ))}
      </div>

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
          <Button variant="outline" onClick={() => { setSearchTerm(''); setRiskFilter('all'); }}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
