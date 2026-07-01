'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Send } from 'lucide-react'

export default function DailyReview() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-[30px] font-bold">Daily Review</h1>
        <Link href="/reviews/weekly" className="text-sm text-primary font-medium hover:underline">View Weekly Review →</Link>
      </div>

      <form className="card space-y-4" onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
        <div><label className="block text-sm font-medium mb-1.5">What did you accomplish today?</label><textarea className="input-field" rows={3} placeholder="Key accomplishments..." /></div>
        <div><label className="block text-sm font-medium mb-1.5">What blocked you?</label><textarea className="input-field" rows={2} placeholder="Any blockers..." /></div>
        <div><label className="block text-sm font-medium mb-1.5">Top priority for tomorrow?</label><input className="input-field" placeholder="Most important task" /></div>
        <div><label className="block text-sm font-medium mb-1.5">Energy level (1-10)</label><input type="number" className="input-field" min="1" max="10" placeholder="7" /></div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary flex items-center gap-2"><Send size={16} strokeWidth={1.5} /> Submit Review</button>
        </div>
      </form>

      {submitted && (
        <div className="card border-accent/30 bg-accent/5">
          <h3 className="text-lg font-semibold text-accent mb-2">AI Summary</h3>
          <p className="text-sm text-text-muted">You had a productive day focused on strategic work. Your energy was high and you maintained focus. Tomorrow, consider time-blocking the morning for your top priority to maintain momentum.</p>
        </div>
      )}
    </div>
  )
}
