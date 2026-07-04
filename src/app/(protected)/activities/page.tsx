'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Calendar, Clock, Star, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '@/components/Modal'
import { useActivities, useCreateActivityMutation, useUpdateActivityMutation, useDeleteActivityMutation, useActivitySummary } from '@/hooks/useActivities'

const categories = ['All', 'Build', 'Sell', 'Lead', 'Learn', 'Maintain', 'Waste']

const categoryColors: Record<string, string> = {
  Build: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-hover',
  Sell: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-hover',
  Lead: 'bg-accent/10 text-accent border-accent/20 dark:bg-accent/20 dark:text-accent-hover',
  Learn: 'bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-success',
  Maintain: 'bg-warning/10 text-warning border-warning/20 dark:bg-warning/20 dark:text-warning',
  Waste: 'bg-danger/10 text-danger border-danger/20 dark:bg-danger/20 dark:text-danger',
}

const categoryRatiosColors: Record<string, string> = {
  Build: 'bg-primary',
  Sell: 'bg-primary',
  Lead: 'bg-accent',
  Learn: 'bg-success',
  Maintain: 'bg-warning',
  Waste: 'bg-danger',
}

export default function Activities() {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  
  // Filter & Search states
  const [filter, setFilter] = useState('All')
  const [timeFilter, setTimeFilter] = useState('All') // 'All', 'Today', 'This Week', 'This Month'
  const [sortBy, setSortBy] = useState('Newest') // 'Newest', 'Oldest', 'Highest Value', 'Longest Duration'
  const [searchVal, setSearchVal] = useState('')
  const [page, setPage] = useState(1)

  // Form Fields States
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'Build' | 'Sell' | 'Lead' | 'Learn' | 'Maintain' | 'Waste'>('Build')
  const [duration, setDuration] = useState<number>(60)
  const [valueScore, setValueScore] = useState<number>(8)

  // Date Range calculation based on timeFilter
  const getDateRange = () => {
    if (timeFilter === 'All') return { from: undefined, to: undefined }
    const now = new Date()
    const fromDate = new Date()
    if (timeFilter === 'Today') {
      fromDate.setHours(0, 0, 0, 0)
    } else if (timeFilter === 'This Week') {
      const day = fromDate.getDay()
      fromDate.setDate(fromDate.getDate() - day)
      fromDate.setHours(0, 0, 0, 0)
    } else if (timeFilter === 'This Month') {
      fromDate.setDate(1)
      fromDate.setHours(0, 0, 0, 0)
    }
    return { from: fromDate.toISOString(), to: now.toISOString() }
  }

  const { from, to } = getDateRange()

  // Sort parameters mapping
  const getSortParams = () => {
    switch (sortBy) {
      case 'Oldest':
        return { sortBy: 'startedAt', order: 'asc' as const }
      case 'Highest Value':
        return { sortBy: 'valueScore', order: 'desc' as const }
      case 'Longest Duration':
        return { sortBy: 'durationMinutes', order: 'desc' as const }
      case 'Newest':
      default:
        return { sortBy: 'startedAt', order: 'desc' as const }
    }
  }

  const sortParams = getSortParams()

  // Queries
  const queryParams = {
    page,
    limit: 10,
    category: (filter !== 'All' && filter !== 'Completed' && filter !== 'Pending') ? filter : undefined,
    from,
    to,
    searchQuery: searchVal ? searchVal : undefined,
    ...sortParams
  }
  const activitiesQuery = useActivities(queryParams)
  const summaryQuery = useActivitySummary()

  // Mutations
  const createMutation = useCreateActivityMutation()
  const updateMutation = useUpdateActivityMutation()
  const deleteMutation = useDeleteActivityMutation()

  const handleOpenAdd = () => {
    setTitle('')
    setCategory('Build')
    setDuration(60)
    setValueScore(8)
    setAddOpen(true)
  }

  const handleOpenEdit = (act: any) => {
    setSelectedActivityId(act.id)
    setTitle(act.title)
    setCategory(act.category)
    setDuration(act.durationMinutes)
    // Map value score from 1-5 backend to 1-10 frontend
    setValueScore(act.valueScore * 2)
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
          data: { title, category, durationMinutes: Number(duration), valueScore }
        })
        setEditOpen(false)
      } else {
        await createMutation.mutateAsync({
          title,
          category,
          durationMinutes: Number(duration),
          valueScore
        })
        setAddOpen(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (selectedActivityId) {
      try {
        await deleteMutation.mutateAsync(selectedActivityId)
        setDeleteOpen(false)
      } catch (err) {
        console.error(err)
      }
    }
  }

  // Format start time safely
  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return '12:00 PM'
    }
  }

  const activities = activitiesQuery.data?.data || []
  const summary = summaryQuery.data

  const weeklyOutputMock = [
    { day: 'Mon', hrs: 6.5 },
    { day: 'Tue', hrs: 8.0 },
    { day: 'Wed', hrs: 4.5 },
    { day: 'Thu', hrs: 7.2 },
    { day: 'Fri', hrs: 9.0 },
    { day: 'Sat', hrs: 2.0 },
    { day: 'Sun', hrs: 1.5 },
  ]

  return (
    <div className="space-y-8 pb-20 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Activities Log</h1>
          <p className="text-xs text-textSecondary mt-1">Audit, log, and analyze your day-to-day focus slots.</p>
        </div>
        <div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus size={16} strokeWidth={2.2} /> Add Activity
          </button>
        </div>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Breakdown Bar Chart */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover transition-all duration-300 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Weekly Output</h3>
            <span className="text-xs text-textSecondary">
              {summary ? `Total Hours: ${Math.round((summary.totalDurationMinutes || 0) / 60 * 10) / 10}h` : '0h'}
            </span>
          </div>
          <div className="h-44 w-full flex items-end justify-between pt-4 px-2">
            {weeklyOutputMock.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full group">
                <span className="text-[10px] font-bold text-textSecondary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {d.hrs}h
                </span>
                <div className="w-8 sm:w-10 bg-background dark:bg-border rounded-t-button relative overflow-hidden h-28">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.hrs / 10) * 100}%` }}
                    transition={{ type: 'spring', delay: i * 0.05, duration: 0.8 }}
                    className="absolute bottom-0 left-0 right-0 bg-primary group-hover:bg-accent transition-colors rounded-t-button"
                  />
                </div>
                <span className="text-xs text-textSecondary font-semibold">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Allocation Stats */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover transition-all duration-300 space-y-4">
          <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Category Ratio</h3>
          <div className="space-y-3.5 pt-2 max-h-[180px] overflow-y-auto pr-1">
            {summary?.timeAllocation && Object.keys(summary.timeAllocation).length > 0 ? (
              Object.entries(summary.timeAllocation).map(([cat, val], i) => {
                const percentStr = `${Math.round(Number(val))}%`
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-textSecondary">{cat}</span>
                      <span className="text-textPrimary">{percentStr}</span>
                    </div>
                    <div className="h-2 bg-background dark:bg-border/60 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${categoryRatiosColors[cat] || 'bg-primary'}`} style={{ width: percentStr }} />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-xs text-textSecondary italic py-8 text-center">No categories recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search Bar Row */}
      <div className="flex flex-wrap items-center gap-4 bg-surface/30 p-4 border border-border rounded-card">
        {/* Search Field */}
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            value={searchVal}
            onChange={e => { setSearchVal(e.target.value); setPage(1) }}
            placeholder="Search activities..."
            className="w-full px-3.5 py-2 pl-9 bg-surface border border-border rounded-button text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:border-primary text-xs transition-all"
          />
          <svg className="absolute left-3 top-3 text-textSecondary" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Categories Select Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold text-textSecondary">Category:</span>
          <select
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(1) }}
            className="px-2 py-1.5 bg-surface border border-border rounded-button text-textPrimary text-xs focus:outline-none focus:border-primary transition-all font-semibold"
          >
            {['All', 'Build', 'Sell', 'Lead', 'Learn', 'Maintain', 'Waste', 'Completed', 'Pending'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold text-textSecondary">Period:</span>
          <select
            value={timeFilter}
            onChange={e => { setTimeFilter(e.target.value); setPage(1) }}
            className="px-2 py-1.5 bg-surface border border-border rounded-button text-textPrimary text-xs focus:outline-none focus:border-primary transition-all font-semibold"
          >
            {['All', 'Today', 'This Week', 'This Month'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold text-textSecondary">Sort By:</span>
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setPage(1) }}
            className="px-2 py-1.5 bg-surface border border-border rounded-button text-textPrimary text-xs focus:outline-none focus:border-primary transition-all font-semibold"
          >
            {['Newest', 'Oldest', 'Highest Value', 'Longest Duration'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activities Timeline / Cards Stack */}
      <div className="space-y-4 max-w-4xl">
        {activitiesQuery.isLoading ? (
          <div className="bg-surface/50 border border-border rounded-card p-12 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Syncing activities list...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-surface/50 border border-border rounded-card p-12 text-center text-xs text-textSecondary font-semibold">
            No logged activities found in this filter category.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {activities.map((a, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={a.id}
                className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:shadow-hover hover:border-primary/20 transition-all duration-300 relative flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left side: Time Indicator & Title */}
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-full bg-background dark:bg-border flex items-center justify-center font-bold text-xs text-textSecondary shrink-0 border border-border mt-0.5">
                    {(page - 1) * 10 + idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-md font-bold text-textPrimary group-hover:text-primary transition-colors">
                        {a.title}
                      </h3>
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-badge border ${categoryColors[a.category] || 'bg-secondary'}`}>
                        {a.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-textSecondary mt-2">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar size={13} strokeWidth={2} /> {formatTime(a.startedAt)}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={13} strokeWidth={2} /> {a.durationMinutes} min
                      </span>
                      <span className="flex items-center gap-1 font-bold text-success">
                        <Star size={13} className="fill-current" /> {a.valueScore * 2}/10 Value
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:self-center self-end">
                  <button
                    onClick={() => handleOpenEdit(a)}
                    className="p-2 hover:bg-background dark:hover:bg-border/60 rounded-button text-textSecondary hover:text-textPrimary transition-all"
                    title="Edit Activity"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(a.id)}
                    className="p-2 hover:bg-danger/10 rounded-button text-textSecondary hover:text-danger transition-all"
                    title="Delete Activity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination controls */}
      {activitiesQuery.data?.meta && activitiesQuery.data.meta.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pr-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1 bg-surface border border-border text-textSecondary rounded-button text-xs font-bold disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs text-textSecondary font-bold">
            Page {page} of {activitiesQuery.data.meta.totalPages}
          </span>
          <button
            disabled={page >= activitiesQuery.data.meta.totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="px-3 py-1 bg-surface border border-border text-textSecondary rounded-button text-xs font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Floating Add Activity Action Button */}
      <button
        onClick={handleOpenAdd}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all z-40"
        title="Add Activity"
      >
        <Plus size={24} strokeWidth={2.2} />
      </button>

      {/* Modals */}
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
