'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function EditGoal() {
  const router = useRouter()

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/goals/1" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
        <ArrowLeft size={16} strokeWidth={1.5} /> Back to Goal
      </Link>

      <h1 className="text-[30px] font-bold">Edit Goal</h1>

      <form className="card space-y-4">
        <div><label className="block text-sm font-medium mb-1.5">Title</label><input className="input-field" defaultValue="Ship MVP by Q3" /></div>
        <div><label className="block text-sm font-medium mb-1.5">Metric</label><input className="input-field" defaultValue="Features completed" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1.5">Baseline</label><input type="number" className="input-field" defaultValue="0" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Target</label><input type="number" className="input-field" defaultValue="20" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1.5">Deadline</label><input type="date" className="input-field" defaultValue="2024-09-30" /></div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => router.push('/goals/1')} className="btn-secondary">Cancel</button>
          <button type="button" onClick={() => router.push('/goals/1')} className="btn-primary">Save</button>
        </div>
      </form>
    </div>
  )
}
