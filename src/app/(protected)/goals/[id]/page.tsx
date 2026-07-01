'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import Modal from '@/components/Modal'

export default function GoalDetails() {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="space-y-6">
      <Link href="/goals" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft size={16} strokeWidth={1.5} /> Back to Goals
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-[30px] font-bold">Ship MVP by Q3</h1>
        <div className="flex gap-3">
          <Link href="/goals/1/edit" className="btn-secondary flex items-center gap-2"><Pencil size={16} strokeWidth={1.5} /> Edit</Link>
          <button onClick={() => setDeleteOpen(true)} className="btn-destructive flex items-center gap-2"><Trash2 size={16} strokeWidth={1.5} /> Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center"><p className="text-sm text-text-muted">Progress</p><p className="text-3xl font-bold text-accent mt-1">65%</p></div>
        <div className="card text-center"><p className="text-sm text-text-muted">Deadline</p><p className="text-xl font-bold mt-1">Sep 30, 2024</p></div>
        <div className="card text-center"><p className="text-sm text-text-muted">Level</p><p className="text-xl font-bold mt-1">Quarterly</p></div>
      </div>

      <div className="card">
        <h2 className="text-[22px] font-semibold mb-4">Linked Activities</h2>
        <div className="space-y-3">
          {['Product Design', 'Sprint Planning', 'User Testing'].map((item, i) => (
            <Link key={i} href="/activities" className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark last:border-0 hover:text-primary transition-colors">
              <span>{item}</span>
              <span className="text-sm text-text-muted">→</span>
            </Link>
          ))}
        </div>
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Goal">
        <div className="space-y-4">
          <p className="text-sm text-text-muted">Are you sure you want to delete this goal? This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setDeleteOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => setDeleteOpen(false)} className="btn-destructive">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
