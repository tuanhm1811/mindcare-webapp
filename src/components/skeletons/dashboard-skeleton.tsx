import { Skeleton } from "@/components/ui/skeleton"
import { StatsGridSkeleton } from "./stats-card-skeleton"
import { AppointmentListSkeleton } from "./appointment-card-skeleton"

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      {/* Stats Grid */}
      <StatsGridSkeleton count={4} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Appointments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-8 w-[100px] rounded-lg" />
          </div>
          <AppointmentListSkeleton count={4} />
        </div>

        {/* Right Column - Mini Calendar & Activity */}
        <div className="space-y-4">
          {/* Mini Calendar */}
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <Skeleton className="h-5 w-[100px]" />
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="glass-card rounded-2xl p-4 space-y-3">
            <Skeleton className="h-5 w-[120px]" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2 w-[60px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
