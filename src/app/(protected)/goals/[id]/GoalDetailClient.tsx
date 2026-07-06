'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  Briefcase,
  Layers,
  Info,
  Clock,
  Sparkles,
  ListTodo
} from 'lucide-react'
import Modal from '@/components/Modal'
import { useGoal, useArchiveGoalMutation } from '@/hooks/useGoals'

export default function GoalDetail() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = (params?.id as string) || (searchParams?.get('id') as string)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'deepwork' | 'history' | 'updates' | 'insight'>('overview')

  // Queries & Mutations
  const goalQuery = useGoal(id)
  const archiveMutation = useArchiveGoalMutation()

  const goal = goalQuery.data
  const activities = goal?.activities || []
  const deepWorkSessions = goal?.deepWorkSessions || []
  const timeline = goal?.timeline || []
  const recentUpdates = goal?.recentUpdates || []
  const aiInsight = goal?.aiInsight || ''

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync(id)
      setDeleteOpen(false)
      router.push('/goals')
    } catch (err) {
      console.error(err)
    }
  }

  if (goalQuery.isLoading) {
    return (
      <div className="space-y-6 pb-16 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Syncing goal variables...</p>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="space-y-6 pb-16 animate-fade-in">
        <Link href="/goals" className="inline-flex items-center gap-1.5 text-xs font-bold text-textSecondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Goals
        </Link>
        <div className="bg-surface/50 border border-border rounded-card p-12 text-center text-xs text-textSecondary font-semibold">
          Goal not found.
        </div>
      </div>
    )
  }

  // Use the exact calculated value from the backend to ensure zero mismatch
  const progressPercent = goal.progress

  // Format currency/number metrics
  const formatMetricValue = (val: number) => {
    if (goal.metric.toLowerCase().includes('dollar') || goal.metric.toLowerCase().includes('mrr') || goal.metric.includes('$')) {
      return `$${val.toLocaleString()}`
    }
    return val.toLocaleString()
  }

  const timeRemaining = new Date(goal.deadline).getTime() - new Date().getTime()
  const daysRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60 * 24)))

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-textSecondary">
        <Link href="/goals" className="hover:text-primary transition-colors">Goals</Link>
        <span>&gt;</span>
        <span className="text-textPrimary truncate max-w-[200px]">{goal.title}</span>
      </div>

      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-textPrimary tracking-tight">{goal.title}</h1>
          <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/20">{goal.level}</span>
          <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${
            goal.status === 'Completed' || goal.status === 'On Track'
              ? 'bg-success/10 text-success border-success/20'
              : goal.status === 'At Risk'
              ? 'bg-warning/10 text-warning border-warning/20'
              : 'bg-danger/10 text-danger border-danger/20'
          }`}>{goal.status}</span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/goals/edit/?id=${id}`}
            className="px-4 py-2.5 rounded-button bg-surface border border-border text-textPrimary font-bold text-xs hover:bg-background/80 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Edit2 size={13} /> Edit Goal
          </Link>
          <button
            onClick={() => setDeleteOpen(true)}
            className="px-4 py-2.5 rounded-button bg-[#FF4F5E]/10 border border-[#FF4F5E]/20 text-[#FF4F5E] font-bold text-xs hover:bg-[#FF4F5E]/20 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Trash2 size={13} /> Archive Goal
          </button>
        </div>
      </div>

      {/* Performance Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Progress Card */}
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card space-y-3">
          <span className="text-[10px] font-extrabold uppercase text-textSecondary">Progress</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-primary">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-[9px] text-textSecondary font-bold mt-1 block">
            {formatMetricValue(goal.currentValue)} / {formatMetricValue(goal.target)}
          </span>
        </div>

        {/* Target Card */}
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase text-textSecondary block">Target</span>
          <p className="text-xl font-black text-textPrimary mt-2">{formatMetricValue(goal.target)}</p>
          <span className="text-[9px] text-textSecondary font-semibold">{goal.metric}</span>
        </div>

        {/* Baseline Card */}
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase text-textSecondary block">Baseline</span>
          <p className="text-xl font-black text-textPrimary mt-2">{formatMetricValue(goal.baseline)}</p>
          <span className="text-[9px] text-textSecondary font-semibold">starting value</span>
        </div>

        {/* Target Date Card */}
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase text-textSecondary block">Target Date</span>
          <p className="text-xs font-black text-textPrimary mt-2">
            {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <span className="text-[9px] text-success font-bold">({daysRemaining} days left)</span>
        </div>

        {/* Pace Status */}
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase text-textSecondary block">Days behind pace</span>
          <p className="text-xl font-black text-textPrimary mt-2">0 days</p>
          <span className="text-[9px] text-success font-bold">On schedule</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 overflow-x-auto border-b border-border/60 pb-1">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'activities', label: `Linked Activities (${activities.length})` },
          { id: 'deepwork', label: `Linked Deep Work (${deepWorkSessions.length})` },
          { id: 'history', label: 'Progress History' },
          { id: 'updates', label: 'Updates' },
          { id: 'insight', label: 'AI Insight' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold transition-all relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-primary dark:text-white border-b-2 border-primary' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workspace Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column (dynamic depending on tab) */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Goal Details & Progress Timeline */}
              <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Progress Timeline</h3>
                
                {/* Timeline Line Chart representation */}
                {timeline.length > 0 ? (
                  <div className="pt-2">
                    <div className="h-48 w-full relative flex items-end justify-between border-b border-l border-border/40 pb-2 pl-2">
                      {/* Plotting points */}
                      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="var(--color-primary, #6366F1)"
                          strokeWidth="2.5"
                          points={timeline.map((pt: any, idx: number) => {
                            const x = (idx / Math.max(1, timeline.length - 1)) * 100
                            const y = 100 - pt.progress
                            return `${x}%,${y}%`
                          }).join(' ')}
                        />
                        {timeline.map((pt: any, idx: number) => {
                          const x = (idx / Math.max(1, timeline.length - 1)) * 100
                          const y = 100 - pt.progress
                          return (
                            <circle
                              key={idx}
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              className="fill-accent stroke-surface stroke-2 cursor-pointer hover:r-6 transition-all"
                            />
                          )
                        })}
                      </svg>
                      {/* X Axis labels */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-textSecondary px-2 translate-y-4">
                        {timeline.map((pt: any, i: number) => (
                          <span key={i}>{pt.date}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-textSecondary italic py-8 text-center">No progress history recorded yet.</p>
                )}
              </div>

              {/* Goal Details Parameters */}
              <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Goal Details</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] text-textSecondary font-bold uppercase">Level</p>
                    <p className="font-semibold text-textPrimary mt-0.5">{goal.level}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-textSecondary font-bold uppercase">Metric</p>
                    <p className="font-semibold text-textPrimary mt-0.5">{goal.metric}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-textSecondary font-bold uppercase">Baseline</p>
                    <p className="font-semibold text-textPrimary mt-0.5">{formatMetricValue(goal.baseline)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-textSecondary font-bold uppercase">Target</p>
                    <p className="font-semibold text-textPrimary mt-0.5">{formatMetricValue(goal.target)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-textSecondary font-bold uppercase">Target Date</p>
                    <p className="font-semibold text-textPrimary mt-0.5">{new Date(goal.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-textSecondary font-bold uppercase">Goal Priority</p>
                    <p className="font-semibold text-primary uppercase mt-0.5">High</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-textSecondary font-bold uppercase">Created On</p>
                    <p className="font-semibold text-textPrimary mt-0.5">{new Date(goal.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'activities' && (
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Linked Focus Activities</h3>
              {activities.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {activities.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 px-4 border border-border bg-background/20 rounded-button hover:bg-background/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle size={15} className="text-success" />
                        <span className="text-xs font-semibold text-textPrimary">{item.title}</span>
                      </div>
                      <span className="text-xs text-textSecondary bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold border border-primary/20 uppercase tracking-wide text-[9px]">{item.category}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-textSecondary italic py-8 text-center">No activities currently linked to this goal.</p>
              )}
            </div>
          )}

          {activeTab === 'deepwork' && (
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Linked Deep Work Sessions</h3>
              {deepWorkSessions.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {deepWorkSessions.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3.5 px-4 border border-border bg-background/20 rounded-button hover:bg-background/40 transition-all text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock size={15} className="text-primary" />
                        <div>
                          <p className="font-semibold text-textPrimary">{item.output || 'Focus Session'}</p>
                          <p className="text-[10px] text-textSecondary mt-0.5">{new Date(item.startTime).toLocaleDateString()} • {item.durationMinutes} mins</p>
                        </div>
                      </div>
                      <span className="text-xs text-textSecondary font-bold">Score: {item.deepWorkScore}/15</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-textSecondary italic py-8 text-center">No Deep Work sessions linked to this goal.</p>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Progress History Logs</h3>
              <div className="space-y-2">
                {timeline.map((pt: any, i: number) => (
                  <div key={i} className="flex justify-between py-2 border-b border-border/40 text-xs">
                    <span className="text-textSecondary">{pt.date}</span>
                    <span className="font-extrabold text-textPrimary">{formatMetricValue(pt.value)} ({pt.progress}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'updates' && (
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Recent Updates</h3>
              <div className="space-y-4">
                {recentUpdates.map((upd: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 text-xs border-b border-border/40 pb-3 last:border-0">
                    <span className="text-[10px] text-textSecondary bg-background px-2 py-1 rounded border border-border shrink-0">{upd.date}</span>
                    <div>
                      <p className="font-bold text-textPrimary">{upd.title}</p>
                      <p className="text-[10px] text-textSecondary mt-0.5">{upd.type} Event Linked</p>
                    </div>
                  </div>
                ))}
                {recentUpdates.length === 0 && (
                  <p className="text-xs text-textSecondary italic py-4 text-center">No update logs recorded.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'insight' && (
            <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border border-primary/20 rounded-card p-6 shadow-card space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <h3 className="text-sm font-extrabold text-textPrimary uppercase tracking-wider">AI Goal Insight</h3>
              </div>
              <p className="text-xs leading-relaxed text-textPrimary font-semibold">
                {aiInsight}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: AI Insights & Next Actions */}
        <div className="space-y-6">
          
          {/* AI Insight Card (Always visible on Overview/Insight) */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border border-primary/20 rounded-card p-5 shadow-card relative overflow-hidden space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">AI Goal Insight</h3>
            </div>
            <p className="text-xs leading-relaxed text-textPrimary font-medium">
              {aiInsight || "You're on track to hit your goal. Maintain your current pace and schedule another session soon."}
            </p>
          </div>

          {/* Next Actions checklist */}
          <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-border/40 pb-2">
              <ListTodo size={15} className="text-accent" />
              <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Next Actions</h3>
            </div>
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex items-start gap-2">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border text-primary focus:ring-primary/20" />
                <span className="text-textPrimary font-semibold leading-relaxed">
                  {goal.nextAction || 'Identify execution strategy.'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick list of activities view */}
          {activeTab !== 'activities' && (
            <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-xs font-bold text-textPrimary uppercase tracking-wider">Linked Activities ({activities.length})</span>
                <button onClick={() => setActiveTab('activities')} className="text-[10px] font-bold text-primary hover:underline">View All</button>
              </div>
              <div className="space-y-2">
                {activities.slice(0, 3).map((a: any, i: number) => (
                  <div key={i} className="text-xs text-textPrimary font-semibold truncate bg-background/20 p-2 border border-border rounded">
                    • {a.title}
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-xs text-textSecondary italic py-2">No linked activities.</p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Archive Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Archive Goal">
        <div className="space-y-4">
          <p className="text-xs text-textSecondary leading-relaxed">Are you sure you want to archive this goal? This action will set its status to Archived and remove it from active boards.</p>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
            <button
              onClick={handleArchive}
              disabled={archiveMutation.isPending}
              className="px-4 py-2 rounded-button bg-danger text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              {archiveMutation.isPending ? 'Archiving...' : 'Archive'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
