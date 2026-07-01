'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Timer, Target, Brain, Plus, Play } from 'lucide-react'
import Modal from '@/components/Modal'

export default function Dashboard() {
  const [activityModal, setActivityModal] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold">Dashboard</h1>
          <p className="text-text-muted mt-1">Welcome back. Here&apos;s your overview.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setActivityModal(true)} className="btn-secondary flex items-center gap-2">
            <Plus size={18} strokeWidth={1.5} /> Add Activity
          </button>
          <Link href="/deep-work" className="btn-primary flex items-center gap-2">
            <Play size={18} strokeWidth={1.5} /> Start Deep Work
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Timer size={20} strokeWidth={1.5} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Deep Work Today</p>
              <p className="text-2xl font-bold">2h 45m</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <Target size={20} strokeWidth={1.5} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Goals On Track</p>
              <p className="text-2xl font-bold">4 / 6</p>
            </div>
          </div>
          <Link href="/goals" className="text-sm text-primary font-medium hover:underline">View Goals →</Link>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain size={20} strokeWidth={1.5} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-text-muted">Skills Tracked</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
          <Link href="/skills" className="text-sm text-primary font-medium hover:underline">View All →</Link>
        </div>
      </div>

      <div className="card">
        <h2 className="text-[22px] font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-3">
          {['Strategic Planning', 'Client Meeting', 'Product Design'].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark last:border-0">
              <span className="font-medium">{item}</span>
              <span className="text-sm text-text-muted">{90 - i * 15} min</span>
            </div>
          ))}
        </div>
      </div>

      <Modal open={activityModal} onClose={() => setActivityModal(false)} title="Add Activity">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input className="input-field" placeholder="Activity name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <select className="input-field">
              <option>Strategy</option><option>Operations</option><option>Learning</option><option>Health</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Duration (min)</label>
              <input type="number" className="input-field" placeholder="60" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Value Score (1-10)</label>
              <input type="number" className="input-field" placeholder="8" min="1" max="10" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setActivityModal(false)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={() => setActivityModal(false)} className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
