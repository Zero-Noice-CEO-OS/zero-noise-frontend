'use client'
import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function MonthlyReview() {
  const [loading, setLoading] = useState(false)

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-[30px] font-bold">Monthly Review</h1>

      <button onClick={handleGenerate} className="btn-primary flex items-center gap-2">
        <RefreshCw size={16} strokeWidth={1.5} className={loading ? 'animate-spin' : ''} /> Generate / Refresh
      </button>

      <div className="card">
        <h2 className="text-[22px] font-semibold mb-4">June 2024 Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center"><p className="text-2xl font-bold text-primary">58h</p><p className="text-sm text-text-muted">Deep Work</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-success">3</p><p className="text-sm text-text-muted">Goals Completed</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-accent">+0.8</p><p className="text-sm text-text-muted">Avg Skill Growth</p></div>
          <div className="text-center"><p className="text-2xl font-bold">92</p><p className="text-sm text-text-muted">Activities</p></div>
        </div>
        <div className="border-t border-border-light dark:border-border-dark pt-4">
          <h3 className="font-semibold mb-2">AI Monthly Insights</h3>
          <p className="text-sm text-text-muted">This month showed consistent improvement across all tracked skills. Revenue-generating activities increased 25%. Recommendation: Set a stretch goal for July focused on delegation to free up strategic thinking time.</p>
        </div>
      </div>
    </div>
  )
}
