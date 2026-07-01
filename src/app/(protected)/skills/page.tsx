'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import Modal from '@/components/Modal'

const sampleSkills = [
  { id: 'strategic-thinking', name: 'Strategic Thinking', score: 7.2, trend: '+0.4' },
  { id: 'communication', name: 'Communication', score: 8.1, trend: '+0.2' },
  { id: 'decision-making', name: 'Decision Making', score: 6.8, trend: '+0.6' },
  { id: 'delegation', name: 'Delegation', score: 5.9, trend: '+0.3' },
  { id: 'time-management', name: 'Time Management', score: 7.5, trend: '+0.5' },
]

export default function Skills() {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[30px] font-bold">Skills</h1>
        <button onClick={() => setAddOpen(true)} className="btn-primary flex items-center gap-2"><Plus size={18} strokeWidth={1.5} /> Add Skill</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleSkills.map(skill => (
          <Link key={skill.id} href={`/skills/${skill.id}`} className="card hover:border-primary/30 cursor-pointer group">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{skill.name}</h3>
            <div className="flex items-end justify-between mt-4">
              <div>
                <p className="text-3xl font-bold text-primary">{skill.score}</p>
                <p className="text-sm text-text-muted">Current score</p>
              </div>
              <span className="text-success text-sm font-medium bg-success/10 px-2 py-0.5 rounded-full">{skill.trend}</span>
            </div>
            <div className="mt-4 h-2 bg-surface-light dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${skill.score * 10}%` }} />
            </div>
          </Link>
        ))}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Skill">
        <form className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Skill Name</label><input className="input-field" placeholder="e.g., Leadership" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Baseline Score (1-10)</label><input type="number" className="input-field" min="1" max="10" placeholder="5" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={() => setAddOpen(false)} className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
