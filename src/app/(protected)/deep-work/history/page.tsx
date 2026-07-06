'use client'

import { useState } from 'react'
import { Calendar, Clock, Star, AlertCircle, ArrowLeft, Eye, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useDeepWorkWeeklyHistory } from '@/hooks/useDeepWork'
import { useGoals } from '@/hooks/useGoals'

export default function DeepWorkHistory() {
  // Filter states
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedWeekVal, setSelectedWeekVal] = useState('All')
  const [goalFilter, setGoalFilter] = useState('All')
  const [minDuration, setMinDuration] = useState('')

  // Submitted Filter states (applied on Apply Filters)
  const [appliedFilters, setAppliedFilters] = useState({
    from: undefined as string | undefined,
    to: undefined as string | undefined,
    week: undefined as string | undefined,
    goalId: undefined as string | undefined,
    minDuration: undefined as string | undefined,
  })

  // Queries
  const { data: goalsData } = useGoals({ status: 'Active' })
  const { data: historyData, isLoading } = useDeepWorkWeeklyHistory({
    from: appliedFilters.from,
    to: appliedFilters.to,
    week: appliedFilters.week && appliedFilters.week !== 'All' ? appliedFilters.week : undefined,
    goalId: appliedFilters.goalId && appliedFilters.goalId !== 'All' ? appliedFilters.goalId : undefined,
    minDuration: appliedFilters.minDuration || undefined,
  })

  const handleApplyFilters = () => {
    setAppliedFilters({
      from: dateFrom ? new Date(dateFrom).toISOString().split('T')[0] : undefined,
      to: dateTo ? new Date(dateTo).toISOString().split('T')[0] : undefined,
      week: selectedWeekVal,
      goalId: goalFilter,
      minDuration: minDuration || undefined,
    })
  }

  const formatDuration = (mins: number) => {
    const hrs = Math.floor(mins / 60)
    const rem = mins % 60
    if (hrs > 0 && rem > 0) return `${hrs}h ${rem}m`
    if (hrs > 0) return `${hrs}h`
    return `${rem}m`
  }

  const formatTimeRange = (startedAt: string, endedAt: string | null) => {
    try {
      const s = new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      if (!endedAt) return `${s} - Ongoing`
      const e = new Date(endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return `${s} - ${e}`
    } catch {
      return '09:00 AM - 10:15 AM'
    }
  }

  const selectedWeek = historyData?.selectedWeek
  const weeksList = historyData?.weeks || []

  // Group deep work sessions of the selected week by day
  const groupedSessions: Record<string, any[]> = {}
  if (selectedWeek?.sessions) {
    selectedWeek.sessions.forEach((s: any) => {
      try {
        const d = new Date(s.startedAt)
        const dateKey = d.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        if (!groupedSessions[dateKey]) {
          groupedSessions[dateKey] = []
        }
        groupedSessions[dateKey].push(s);
      } catch {
        // Fallback
      }
    })
  }

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Back Button and Header */}
      <div className="space-y-4">
        <Link href="/deep-work" className="inline-flex items-center gap-1 text-xs font-bold text-textSecondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Deep Work
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Deep Work History</h1>
          <p className="text-xs text-textSecondary mt-1">Review and audit your deep focus blocks and achievements.</p>
        </div>
      </div>

      {/* Filters Box */}
      <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card space-y-4">
        <h3 className="text-xs font-extrabold text-textPrimary uppercase tracking-wider">Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-textSecondary">Date From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded text-textPrimary text-xs focus:outline-none focus:border-primary font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-textSecondary">Date To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded text-textPrimary text-xs focus:outline-none focus:border-primary font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-textSecondary">Week</label>
            <select
              value={selectedWeekVal}
              onChange={(e) => setSelectedWeekVal(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded text-textPrimary text-xs focus:outline-none focus:border-primary font-semibold"
            >
              <option value="All">Current / Latest Week</option>
              {weeksList.map((w: any) => (
                <option key={w.weekNumber} value={`Week ${w.weekNumber}`}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-textSecondary">Goal</label>
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded text-textPrimary text-xs focus:outline-none focus:border-primary font-semibold"
            >
              <option value="All">All Goals</option>
              {Array.isArray(goalsData?.data) && goalsData.data.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-textSecondary">Min Duration (mins)</label>
            <input
              type="number"
              placeholder="e.g. 30"
              value={minDuration}
              onChange={(e) => setMinDuration(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded text-textPrimary text-xs focus:outline-none focus:border-primary font-semibold"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button
            onClick={handleApplyFilters}
            className="px-5 py-2 rounded-button bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 shadow transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Week Header & Grid */}
      {selectedWeek && (
        <div className="space-y-6">
          <h2 className="text-lg font-extrabold text-textPrimary">{selectedWeek.label}</h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {selectedWeek.days.map((day: any, idx: number) => (
              <div
                key={idx}
                className={`bg-surface/50 border ${day.isFuture ? 'border-dashed border-border/60 opacity-60' : 'border-border'} rounded-card p-4 text-center space-y-1`}
              >
                <p className="text-xs font-bold text-textPrimary">{day.dayName}</p>
                <p className="text-[10px] text-textSecondary font-semibold">{day.dateStr}</p>
                <p className="text-xs font-extrabold text-primary mt-2">
                  {day.isFuture ? 'Coming soon' : formatDuration(day.minutes)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deep Work Completed Sessions */}
      <div className="space-y-8 max-w-4xl pt-4">
        {isLoading ? (
          <div className="bg-surface/50 border border-border rounded-card p-12 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Syncing focus logs...</p>
          </div>
        ) : Object.keys(groupedSessions).length === 0 ? (
          <div className="bg-surface/50 border border-border rounded-card p-12 text-center text-xs text-textSecondary font-semibold">
            No completed focus sessions found for this period.
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xs font-extrabold text-textPrimary uppercase tracking-wider">Completed Sessions</h3>
            {Object.entries(groupedSessions).map(([dateKey, list]) => {
              const dayTotalMins = list.reduce((sum, s) => sum + (s.durationMinutes || s.plannedDurationMinutes || 0), 0);
              return (
                <div key={dateKey} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <h3 className="text-sm font-extrabold text-textPrimary">{dateKey}</h3>
                    <span className="text-xs font-bold text-textSecondary">
                      Total: {formatDuration(dayTotalMins)}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {list.map((s) => {
                      const computedScore = s.deepWorkScore ? ((s.deepWorkScore / 1.5).toFixed(1)) : '0.0';
                      return (
                        <div
                          key={s.id}
                          className="bg-surface/50 border border-border rounded-card p-5 shadow-sm hover:shadow-hover hover:border-primary/20 transition-all duration-300 space-y-4 group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                🎯
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-textPrimary">
                                  Deep Work Session
                                </h4>
                                {s.goal && (
                                  <p className="text-xs text-textSecondary mt-0.5">
                                    Goal: <span className="font-semibold text-textPrimary">{s.goal.title}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs">
                              <div className="flex items-center gap-1 text-textSecondary">
                                <Calendar size={13} /> {formatTimeRange(s.startedAt, s.endedAt)}
                              </div>
                              <div className="flex items-center gap-1 font-bold text-primary">
                                <Clock size={13} /> Focus Time: {formatDuration(s.actualDurationMinutes || s.plannedDurationMinutes || 0)}
                              </div>
                              <div className="flex items-center gap-1 font-semibold text-danger">
                                <AlertCircle size={13} /> Interruptions: {s.interruptions || 0}
                              </div>
                              <div className="flex items-center gap-1 font-bold text-success">
                                <Star size={13} className="fill-current" /> CEO Contribution: {computedScore}/10
                              </div>
                            </div>
                          </div>

                          {s.output && (
                            <div className="p-3 bg-background dark:bg-border/30 rounded text-xs text-textSecondary flex items-start gap-2">
                              <MessageSquare size={13} className="mt-0.5 shrink-0 text-textSecondary/75" />
                              <div>
                                <p className="font-bold text-textPrimary text-[10px] uppercase tracking-wider mb-1">Output Notes</p>
                                <p className="leading-relaxed">{s.output}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}
