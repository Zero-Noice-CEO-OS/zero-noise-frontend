'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useGoal, useUpdateGoalMutation } from '@/hooks/useGoals'

export default function GoalEdit() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  // Queries & Mutations
  const goalQuery = useGoal(id)
  const updateMutation = useUpdateGoalMutation()

  // Form states
  const [title, setTitle] = useState('')
  const [metric, setMetric] = useState('')
  const [baseline, setBaseline] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [status, setStatus] = useState('Active')

  // Prefill form
  useEffect(() => {
    if (goalQuery.data) {
      const g = goalQuery.data
      setTitle(g.title)
      setMetric(g.metric)
      setBaseline(String(g.baseline))
      setTarget(String(g.target))
      setNextAction(g.nextAction || '')
      setStatus(g.status)
      try {
        setDeadline(new Date(g.deadline).toISOString().split('T')[0])
      } catch (e) {
        setDeadline('')
      }
    }
  }, [goalQuery.data])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          title,
          metric,
          baseline: Number(baseline),
          target: Number(target),
          deadline: new Date(deadline).toISOString(),
          nextAction: nextAction || undefined,
          status: status
        }
      })
      router.push(`/goals/${id}`)
    } catch (err) {
      console.error(err)
    }
  }

  if (goalQuery.isLoading) {
    return (
      <div className="space-y-6 max-w-2xl pb-16 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Loading configurations...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl pb-16 animate-fade-in">
      <Link href={`/goals/${id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-textSecondary hover:text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Goal
      </Link>

      <div>
        <h1 className="text-3xl font-black text-textPrimary tracking-tight">Edit Goal Parameters</h1>
        <p className="text-xs text-textSecondary font-semibold mt-1">Amend focus parameters, update baseline coordinates, and modify status.</p>
      </div>

      <form onSubmit={handleUpdate} className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Goal Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={updateMutation.isPending}
            className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Baseline Value</label>
            <input
              type="number"
              value={baseline}
              onChange={(e) => setBaseline(e.target.value)}
              disabled={updateMutation.isPending}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Target Value</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={updateMutation.isPending}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Metric Unit</label>
            <input
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              disabled={updateMutation.isPending}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              required
              placeholder="e.g. %, hours, INR"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Deadline Date</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={updateMutation.isPending}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={updateMutation.isPending}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Next Action (Hint)</label>
          <input
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            disabled={updateMutation.isPending}
            className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
          <button type="button" onClick={() => router.push(`/goals/${id}`)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-4 py-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
