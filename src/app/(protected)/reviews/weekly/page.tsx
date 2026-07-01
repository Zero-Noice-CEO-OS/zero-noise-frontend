'use client'
import { useState } from 'react'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'

export default function WeeklyReview() {
  const [loading, setLoading] = useState(false)

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[30px] font-bold">Weekly Review</h1>
        <Link href="/reviews/monthly" className="text-sm text-primary font-medium hover:underline">View Monthly Review →</Link>
      </div>

      <div className="flex gap-3">
        <button onClick={handleGenerate} className="btn-primary flex items-center gap-2">
          <RefreshCw size={16} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} /> Generate / Refresh
        </button>
      </div>

      <div className="card">
        <h2 className="text-[22px] font-semibold mb-4">Week Summary</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center"><p className="text-2xl font-bold text-primary">14.5h</p><p className="text-sm text-text-muted">Deep Work</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-success">4/6</p><p className="text-sm text-text-muted">Goals On Track</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-accent">23</p><p className="text-sm text-text-muted">Activities</p></div>
        </div>
        <div className="border-t border-border-light dark:border-border-dark pt-4">
          <h3 className="font-semibold mb-2">AI Insights</h3>
          <p className="text-sm text-text-muted">Strong week overall. Deep work hours increased 12% from last week. Consider redistributing Wednesday&apos;s meeting-heavy schedule to protect focus time. Your delegation skill showed the most improvement.</p>
        </div>
      </div>
    </div>
  )
}
