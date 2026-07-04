'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit2, Trash2, Calendar, Target, TrendingUp, CheckCircle } from 'lucide-react'
import Modal from '@/components/Modal'
import { useGoal, useArchiveGoalMutation } from '@/hooks/useGoals'

export default function GoalDetail() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [deleteOpen, setDeleteOpen] = useState(false)

  // Queries & Mutations
  const goalQuery = useGoal(id)
  const archiveMutation = useArchiveGoalMutation()

  const goal = goalQuery.data
  const activities = goal?.activities || []

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

  // Calculate progress percent
  const deltaTarget = Math.abs(goal.target - goal.baseline)
  const deltaCurrent = Math.abs(goal.current - goal.baseline)
  const progressPercent = deltaTarget === 0 ? 0 : Math.min(100, Math.round((deltaCurrent / deltaTarget) * 100))

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      <Link href="/goals" className="inline-flex items-center gap-1.5 text-xs font-bold text-textSecondary hover:text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Goals
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-black text-textPrimary tracking-tight">{goal.title}</h1>
          <p className="text-xs text-textSecondary font-semibold mt-1">Protect targets, track active status, and audit operations logs.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/goals/${id}/edit`}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Tracker Card */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Goal Completion Progress</h2>
          
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-baseline text-xs font-bold text-textPrimary">
              <span>Metric Target</span>
              <span>{progressPercent}% Achieved</span>
            </div>
            <div className="w-full h-2.5 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2 bg-background/50 border border-border rounded-xl">
                <span className="text-[9px] uppercase font-bold text-textSecondary">Baseline</span>
                <p className="text-xs font-bold text-textPrimary mt-0.5">{goal.baseline}</p>
              </div>
              <div className="p-2 bg-background/50 border border-border rounded-xl">
                <span className="text-[9px] uppercase font-bold text-textSecondary">Current</span>
                <p className="text-xs font-bold text-primary mt-0.5">{goal.current}</p>
              </div>
              <div className="p-2 bg-background/50 border border-border rounded-xl">
                <span className="text-[9px] uppercase font-bold text-textSecondary">Target</span>
                <p className="text-xs font-bold text-textPrimary mt-0.5">{goal.target}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Parameters info */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-2.5 items-start">
            <div className="p-2 bg-primary/10 rounded-lg text-primary mt-0.5">
              <Target size={15} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-textSecondary">Metric Name</span>
              <p className="text-xs font-bold text-textPrimary mt-0.5">{goal.metric}</p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <div className="p-2 bg-secondary/10 rounded-lg text-secondary mt-0.5">
              <TrendingUp size={15} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-textSecondary">Status</span>
              <p className="text-xs font-bold text-textPrimary mt-0.5 capitalize">{goal.status.toLowerCase()}</p>
            </div>
          </div>

          <div className="flex gap-2.5 items-start sm:col-span-2 border-t border-border/40 pt-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500 mt-0.5">
              <Calendar size={15} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-textSecondary">Target Date Deadline</span>
              <p className="text-xs font-bold text-textPrimary mt-0.5">{new Date(goal.deadline).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Next actions checklist */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Next Action Reference</h2>
            <p className="text-xs text-textPrimary font-semibold leading-relaxed pt-1">
              {goal.nextAction || 'No next action mapped.'}
            </p>
          </div>

          <div className="pt-4 border-t border-border/40 text-[10px] text-textSecondary font-semibold">
            Goal Priority: <span className="text-primary uppercase tracking-wider font-extrabold">{goal.level}</span>
          </div>
        </div>

        {/* Linked Activities */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card lg:col-span-3 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Linked Focus Activities</h2>
          {activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {activities.map((item: any, i: number) => (
                <Link
                  key={i}
                  href="/activities"
                  className="flex items-center justify-between py-3.5 border-b border-border/40 last:border-0 hover:bg-background/80 px-3 rounded-button transition-all duration-150"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle size={15} className="text-success" />
                    <span className="text-xs font-semibold text-textPrimary">{item.title}</span>
                  </div>
                  <span className="text-xs text-textSecondary font-bold">→</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-textSecondary italic py-2">No activities currently linked to this goal.</p>
          )}
        </div>

      </div>

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
