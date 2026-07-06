'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, Calendar, ChevronRight } from 'lucide-react'
import Modal from '@/components/Modal'
import { useGoals, useCreateGoalMutation } from '@/hooks/useGoals'
import { subscriptionService } from '@/services/subscription-service'

const displayLevels = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', '12-Year']

export default function Goals() {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [activeLevel, setActiveLevel] = useState('All')

  // Form Fields States
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('Quarterly')
  const [metric, setMetric] = useState('')
  const [baseline, setBaseline] = useState<number>(0)
  const [target, setTarget] = useState<number>(100)
  const [deadline, setDeadline] = useState('')
  const [nextAction, setNextAction] = useState('')

  // Map display level to backend level for queries
  const getBackendLevel = (lvl: string) => {
    if (lvl === 'Yearly') return 'Annual'
    if (lvl === '12-Year') return 'Vision12Year'
    return lvl
  }

  const queryParams = {
    page: 1,
    limit: 50,
    level: activeLevel !== 'All' ? getBackendLevel(activeLevel) : undefined,
  }

  // Queries & Mutations
  const goalsQuery = useGoals(queryParams)
  const createMutation = useCreateGoalMutation()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMutation.mutateAsync({
        title,
        level,
        metric,
        baseline: Number(baseline),
        target: Number(target),
        deadline: new Date(deadline).toISOString(),
        nextAction: nextAction || undefined
      })
      setCreateOpen(false)
      // reset fields
      setTitle('')
      setMetric('')
      setBaseline(0)
      setTarget(100)
      setDeadline('')
      setNextAction('')
    } catch (err) {
      console.error(err)
    }
  }

  const formatDeadline = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (e) {
      return 'N/A'
    }
  }

  const goals = goalsQuery.data?.data || []

  const handleNewGoalClick = async () => {
    try {
      const sub = await subscriptionService.getDetails()
      const isFree = sub.subscription?.plan === 'Free Tier' || sub.subscription?.plan === 'Free' || !sub.subscription
      if (isFree && goals.length >= 5) {
        alert("Goal Limit Reached! Free plans are limited to maximum 5 active goals. Please upgrade your plan in settings to create unlimited goals.")
        router.push('/settings?tab=subscription')
        return
      }
      setCreateOpen(true)
    } catch (e) {
      console.error(e)
      setCreateOpen(true)
    }
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Goals Tracker</h1>
          <p className="text-xs text-textSecondary mt-1">Audit multi-layered goals, from long-term vision to daily actions.</p>
        </div>
        <button
          onClick={handleNewGoalClick}
          className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 shadow-md"
        >
          <Plus size={16} strokeWidth={2.2} /> New Goal
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap pb-1 border-b border-border">
        {['All', ...displayLevels].map(lvl => {
          const active = activeLevel === lvl
          return (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-3 py-2 text-xs font-bold transition-all relative ${
                active ? 'text-primary dark:text-white' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {lvl}
              {active && (
                <motion.div
                  layoutId="goals-active-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Goal Cards Deck */}
      {goalsQuery.isLoading ? (
        <div className="bg-surface/50 border border-border rounded-card p-12 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Syncing goals board...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-surface/50 border border-border rounded-card p-12 text-center text-xs text-textSecondary font-semibold">
          No goals found under this layer. Create one to begin focus loops.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {goals.map(goal => {
              const displayProgress = Math.min(100, Math.max(0, Math.round(goal.progress)))
              return (
                <Link key={goal.id} href={`/goals/detail/?id=${goal.id}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -3 }}
                    className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-[250px] relative group overflow-hidden animate-fade-in"
                  >
                    <div>
                      {/* Badges row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20">
                          {goal.level}
                        </span>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                          goal.status === 'Completed'
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                        }`}>
                          {goal.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-md font-bold text-textPrimary mt-4 group-hover:text-primary transition-colors leading-snug">
                        {goal.title}
                      </h3>

                      {/* Next action hint */}
                      {goal.nextAction && (
                        <p className="text-xs text-textSecondary mt-2 flex items-center gap-1.5">
                          <Target size={13} className="text-accent" /> Next: <span className="font-semibold text-textPrimary line-clamp-1">{goal.nextAction}</span>
                        </p>
                      )}
                    </div>

                    {/* Progress ring/bar row & Deadline info */}
                    <div className="border-t border-border/40 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-textSecondary font-bold">
                        <Calendar size={13} /> {formatDeadline(goal.deadline)}
                      </div>

                      {/* SVG Circular Progress inside Goal Card */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-textPrimary">{displayProgress}%</span>
                        <div className="relative w-9 h-9">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="18" cy="18" r="14" className="stroke-background dark:stroke-border/40" strokeWidth="2.5" fill="none" />
                            <circle
                              cx="18"
                              cy="18"
                              r="14"
                              className="stroke-accent"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 14}`}
                              strokeDashoffset={`${2 * Math.PI * 14 * (1 - displayProgress / 100)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* New Goal Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Goal">
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              placeholder="Goal title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
                <option value="12-Year">12-Year</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Metric</label>
              <input
                required
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                placeholder="e.g., hours, count, dollars"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Baseline</label>
              <input
                required
                type="number"
                value={baseline}
                onChange={(e) => setBaseline(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Target</label>
              <input
                required
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Next Action (Hint)</label>
            <input
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              placeholder="e.g. Schedule meeting"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Deadline</label>
            <input
              required
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
