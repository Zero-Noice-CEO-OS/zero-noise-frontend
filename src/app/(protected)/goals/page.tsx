'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import Modal from '@/components/Modal'

const levels = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', '12-Year']
const sampleGoals = [
  { id: '1', title: 'Ship MVP by Q3', level: 'Quarterly', progress: 65 },
  { id: '2', title: 'Read 2 books/month', level: 'Monthly', progress: 50 },
  { id: '3', title: '3 deep work hours daily', level: 'Daily', progress: 80 },
  { id: '4', title: 'Revenue $1M ARR', level: 'Yearly', progress: 35 },
]

export default function Goals() {
  const [createOpen, setCreateOpen] = useState(false)
  const [activeLevel, setActiveLevel] = useState('All')

  const filtered = activeLevel === 'All' ? sampleGoals : sampleGoals.filter(g => g.level === activeLevel)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[30px] font-bold">Goals</h1>
        <button onClick={() => setCreateOpen(true)} className="btn-primary flex items-center gap-2"><Plus size={18} strokeWidth={1.5} /> New Goal</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['All', ...levels].map(level => (
          <button key={level} onClick={() => setActiveLevel(level)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${activeLevel === level ? 'bg-primary text-white' : 'bg-surface-light dark:bg-gray-800 text-text-muted hover:text-primary'}`}>
            {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(goal => (
          <Link key={goal.id} href={`/goals/${goal.id}`} className="card hover:border-primary/30 cursor-pointer group">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{goal.title}</h3>
              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{goal.level}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-text-muted">Progress</span>
                <span className="font-medium">{goal.progress}%</span>
              </div>
              <div className="h-2 bg-surface-light dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${goal.progress}%` }} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Goal">
        <form className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Title</label><input className="input-field" placeholder="Goal title" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Metric</label><input className="input-field" placeholder="e.g., hours, count, dollars" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1.5">Baseline</label><input type="number" className="input-field" placeholder="0" /></div>
            <div><label className="block text-sm font-medium mb-1.5">Target</label><input type="number" className="input-field" placeholder="100" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Deadline</label><input type="date" className="input-field" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={() => setCreateOpen(false)} className="btn-primary">Create</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
