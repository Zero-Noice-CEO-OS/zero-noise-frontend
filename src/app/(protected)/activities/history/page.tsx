'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Calendar, Clock, Star, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Modal from '@/components/Modal'
import { useCreateActivityMutation, useUpdateActivityMutation, useDeleteActivityMutation, useActivitiesWeeklyHistory } from '@/hooks/useActivities'
import { useGoals } from '@/hooks/useGoals'

const categories = ['All', 'Build', 'Sell', 'Lead', 'Learn', 'Maintain', 'Waste']

const categoryColors: Record<string, string> = {
  Build: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-hover',
  Sell: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-hover',
  Lead: 'bg-accent/10 text-accent border-accent/20 dark:bg-accent/20 dark:text-accent-hover',
  Learn: 'bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-success',
  Maintain: 'bg-warning/10 text-warning border-warning/20 dark:bg-warning/20 dark:text-warning',
  Waste: 'bg-danger/10 text-danger border-danger/20 dark:bg-danger/20 dark:text-danger',
}

export default function ActivitiesHistory() {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)

  // Filter states
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedWeekVal, setSelectedWeekVal] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [goalFilter, setGoalFilter] = useState('All')

  // Submitted Filter states (only applied on Apply Filters click)
  const [appliedFilters, setAppliedFilters] = useState({
    from: undefined as string | undefined,
    to: undefined as string | undefined,
    week: undefined as string | undefined,
    category: undefined as string | undefined,
    goalId: undefined as string | undefined,
  })

  // Form Fields States
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'Build' | 'Sell' | 'Lead' | 'Learn' | 'Maintain' | 'Waste'>('Build')
  const [duration, setDuration] = useState<number>(60)
  const [valueScore, setValueScore] = useState<number>(8)
  const [goalId, setGoalId] = useState<string | null>(null)

  // Queries & Mutations
  const { data: goalsData } = useGoals({ status: 'Active' })
  const { data: historyData, isLoading, refetch } = useActivitiesWeeklyHistory({
    from: appliedFilters.from,
    to: appliedFilters.to,
    week: appliedFilters.week && appliedFilters.week !== 'All' ? appliedFilters.week : undefined,
    category: appliedFilters.category && appliedFilters.category !== 'All' ? appliedFilters.category : undefined,
    goalId: appliedFilters.goalId && appliedFilters.goalId !== 'All' ? appliedFilters.goalId : undefined,
  })

  const createMutation = useCreateActivityMutation()
  const updateMutation = useUpdateActivityMutation()
  const deleteMutation = useDeleteActivityMutation()

  const handleApplyFilters = () => {
    setAppliedFilters({
      from: dateFrom ? new Date(dateFrom).toISOString().split('T')[0] : undefined,
      to: dateTo ? new Date(dateTo).toISOString().split('T')[0] : undefined,
      week: selectedWeekVal,
      category: categoryFilter,
      goalId: goalFilter,
    })
  }

  const handleOpenAdd = () => {
    setTitle('')
    setCategory('Build')
    setDuration(60)
    setValueScore(8)
    setGoalId(null)
    setAddOpen(true)
  }

  const handleOpenEdit = (act: any) => {
    setSelectedActivityId(act.id)
    setTitle(act.title)
    setCategory(act.category)
    setDuration(act.durationMinutes)
    setValueScore(act.valueScore * 2)
    setGoalId(act.goalId || null)
    setEditOpen(true)
  }

  const handleOpenDelete = (id: string) => {
    setSelectedActivityId(id)
    setDeleteOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editOpen && selectedActivityId) {
        await updateMutation.mutateAsync({
          id: selectedActivityId,
          data: { title, category, durationMinutes: Number(duration), valueScore, goalId }
        })
        setEditOpen(false)
      } else {
        await createMutation.mutateAsync({
          title,
          category,
          durationMinutes: Number(duration),
          valueScore,
          goalId
        })
        setAddOpen(false)
      }
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (selectedActivityId) {
      try {
        await deleteMutation.mutateAsync(selectedActivityId)
        setDeleteOpen(false)
        refetch()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const formatDuration = (mins: number) => {
    const hrs = Math.floor(mins / 60)
    const rem = mins % 60
    if (hrs > 0 && rem > 0) return `${hrs}h ${rem}m`
    if (hrs > 0) return `${hrs}h`
    return `${rem}m`
  }

  const formatTimeRange = (startedAt: string, endedAt: string) => {
    try {
      const s = new Date(startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const e = new Date(endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return `${s} - ${e}`
    } catch {
      return '09:00 AM - 10:00 AM'
    }
  }

  const selectedWeek = historyData?.selectedWeek
  const weeksList = historyData?.weeks || []

  // Group activities of the selected week by day
  const groupedActivities: Record<string, any[]> = {}
  if (selectedWeek?.activities) {
    selectedWeek.activities.forEach((a: any) => {
      try {
        const d = new Date(a.startedAt)
        const dateKey = d.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        if (!groupedActivities[dateKey]) {
          groupedActivities[dateKey] = []
        }
        groupedActivities[dateKey].push(a)
      } catch {
        // Fallback
      }
    })
  }

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Back Button and Header */}
      <div className="space-y-4">
        <Link href="/activities" className="inline-flex items-center gap-1 text-xs font-bold text-textSecondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Activities
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Activities History</h1>
            <p className="text-xs text-textSecondary mt-1">View and analyze your logged activities week by week.</p>
          </div>
          <div>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Plus size={16} /> Add Activity
            </button>
          </div>
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
            <label className="text-[10px] uppercase font-bold text-textSecondary">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded text-textPrimary text-xs focus:outline-none focus:border-primary font-semibold"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
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
                  {day.isFuture ? 'Coming soon' : formatDuration(day.totalMinutes)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities Timeline Lists */}
      <div className="space-y-8 max-w-4xl pt-4">
        {isLoading ? (
          <div className="bg-surface/50 border border-border rounded-card p-12 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Syncing activity logs...</p>
          </div>
        ) : Object.keys(groupedActivities).length === 0 ? (
          <div className="bg-surface/50 border border-border rounded-card p-12 text-center text-xs text-textSecondary font-semibold">
            No logged activities found for this period.
          </div>
        ) : (
          Object.entries(groupedActivities).map(([dateKey, list]) => {
            const dayTotalMins = list.reduce((sum, a) => sum + a.durationMinutes, 0);
            return (
              <div key={dateKey} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="text-sm font-extrabold text-textPrimary">{dateKey}</h3>
                  <span className="text-xs font-bold text-textSecondary">
                    Total: {formatDuration(dayTotalMins)}
                  </span>
                </div>
                <div className="space-y-3">
                  {list.map((a) => (
                    <div
                      key={a.id}
                      className="bg-surface/50 border border-border rounded-card p-4 shadow-sm hover:shadow-hover hover:border-primary/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 border border-border ${a.category === 'Build' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                          {a.category[0]}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-textPrimary group-hover:text-primary transition-colors">
                              {a.title}
                            </h4>
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${categoryColors[a.category] || 'bg-secondary'}`}>
                              {a.category}
                            </span>
                            {a.goal && (
                              <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-primary/25 bg-primary/10 text-primary">
                                🎯 {a.goal.title}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-[11px] text-textSecondary mt-1.5">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar size={12} /> {formatTimeRange(a.startedAt, a.endedAt)}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Clock size={12} /> {a.durationMinutes} min
                            </span>
                            <span className="flex items-center gap-1 font-bold text-success">
                              <Star size={12} className="fill-current" /> {a.valueScore * 2}/10 Value
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="p-2 hover:bg-background dark:hover:bg-border/60 rounded-button text-textSecondary hover:text-textPrimary transition-all"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(a.id)}
                          className="p-2 hover:bg-danger/10 rounded-button text-textSecondary hover:text-danger transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={addOpen || editOpen} onClose={() => { setAddOpen(false); setEditOpen(false) }} title={editOpen ? 'Edit Activity' : 'Add Activity'}>
        <form className="space-y-4" onSubmit={handleSave}>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              placeholder="Activity name"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
            >
              <option value="Build">Build</option>
              <option value="Sell">Sell</option>
              <option value="Lead">Lead</option>
              <option value="Learn">Learn</option>
              <option value="Maintain">Maintain</option>
              <option value="Waste">Waste</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Linked Goal (Optional)</label>
            <select
              value={goalId || ''}
              onChange={(e) => setGoalId(e.target.value || null)}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
            >
              <option value="">No Linked Goal</option>
              {Array.isArray(goalsData?.data) && goalsData.data.map((g: any) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Duration (min)</label>
              <input
                required
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Value Score (1-10)</label>
              <input
                required
                type="number"
                value={valueScore}
                onChange={(e) => setValueScore(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                min="1"
                max="10"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            <button type="button" onClick={() => { setAddOpen(false); setEditOpen(false) }} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Activity'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Activity">
        <div className="space-y-4">
          <p className="text-xs text-textSecondary leading-relaxed">Are you sure you want to delete this activity? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 rounded-button bg-danger text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
