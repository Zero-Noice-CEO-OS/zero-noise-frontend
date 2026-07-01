'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import Modal from '@/components/Modal'

export default function SkillDetail() {
  const [logOpen, setLogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <Link href="/skills" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft size={16} strokeWidth={1.5} /> Back to Skills
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold">Strategic Thinking</h1>
          <p className="text-text-muted mt-1">Track your progress over time</p>
        </div>
        <button onClick={() => setLogOpen(true)} className="btn-primary flex items-center gap-2"><Plus size={18} strokeWidth={1.5} /> Log Entry</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <p className="text-sm text-text-muted">Current Score</p>
          <p className="text-3xl font-bold text-primary mt-1">7.2</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-text-muted">Entries This Month</p>
          <p className="text-3xl font-bold mt-1">12</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-text-muted">Trend</p>
          <p className="text-3xl font-bold text-success mt-1">+0.4</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-[22px] font-semibold mb-4">Recent Entries</h2>
        <div className="space-y-3">
          {[{ date: 'Jun 28', speed: 7, quality: 8, consistency: 7 }, { date: 'Jun 25', speed: 6, quality: 7, consistency: 8 }, { date: 'Jun 22', speed: 7, quality: 7, consistency: 7 }].map((entry, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark last:border-0">
              <span className="text-text-muted">{entry.date}</span>
              <div className="flex gap-4 text-sm">
                <span>Speed: <strong>{entry.speed}</strong></span>
                <span>Quality: <strong>{entry.quality}</strong></span>
                <span>Consistency: <strong>{entry.consistency}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={logOpen} onClose={() => setLogOpen(false)} title="Log Skill Entry">
        <form className="space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Speed (1-10)</label><input type="range" min="1" max="10" defaultValue="5" className="w-full" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Quality (1-10)</label><input type="range" min="1" max="10" defaultValue="5" className="w-full" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Consistency (1-10)</label><input type="range" min="1" max="10" defaultValue="5" className="w-full" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Notes</label><textarea className="input-field" rows={3} placeholder="Observations..." /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setLogOpen(false)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={() => setLogOpen(false)} className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
