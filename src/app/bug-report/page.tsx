'use client'

import PageShell from '@/components/PageShell'
import { useState } from 'react'
import { Sparkles, Bug, AlertTriangle, Send, CheckCircle2 } from 'lucide-react'

export default function BugReportPage() {
  const breadcrumbs = [
    { label: 'Resources', href: '#' },
    { label: 'Report a Bug' }
  ]

  const [form, setForm] = useState({
    category: 'Dashboard',
    priority: 'Medium',
    description: '',
    expected: '',
    actual: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm({
        category: 'Dashboard',
        priority: 'Medium',
        description: '',
        expected: '',
        actual: ''
      })
    }, 2000)
  }

  return (
    <PageShell
      title="Report a Bug"
      description="Found a visual issue or logic breakdown? Let our engineers inspect it."
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-2xl mx-auto bg-white/5 border border-white/5 rounded-2xl p-6 sm:p-8 relative overflow-hidden pb-12">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#4F7CFF]/5 rounded-full blur-3xl pointer-events-none" />

        {submitted ? (
          <div className="py-16 text-center space-y-4">
            <span className="p-3 bg-[#22C55E]/15 text-[#3EE98A] rounded-full inline-block">
              <CheckCircle2 size={32} />
            </span>
            <h3 className="text-lg font-bold text-white">Bug Report Logged</h3>
            <p className="text-xs text-[#A6B0CF]/70 max-w-xs mx-auto">
              Our dev ops dashboard has been notified. A ticket has been appended to the current debugging milestone.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Bug size={16} className="text-[#FF5D73]" /> Submit Bug Parameters
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Module Area</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
                >
                  <option value="Dashboard">Dashboard Widgets</option>
                  <option value="AI Coach">AI Coach Dialogues</option>
                  <option value="Timer">Deep Work Timers</option>
                  <option value="Auth">Account Authentication</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Priority Severity</label>
                <select
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
                >
                  <option value="Low">Low - Cosmetic</option>
                  <option value="Medium">Medium - Logic issue</option>
                  <option value="High">High - Blocked execution</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Bug Description</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all resize-none"
                placeholder="Explain the problem you encountered..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Expected Behavior</label>
              <textarea
                required
                rows={2}
                value={form.expected}
                onChange={e => setForm({ ...form, expected: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all resize-none"
                placeholder="What did you expect would happen..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Actual Behavior</label>
              <textarea
                required
                rows={2}
                value={form.actual}
                onChange={e => setForm({ ...form, actual: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all resize-none"
                placeholder="What actually occurred..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Screenshot Upload (Optional)</label>
              <div className="border border-dashed border-white/10 rounded-xl p-4 text-center text-[10px] text-[#A6B0CF]/40">
                Drag and drop image files here, or click to browse.
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white text-xs font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-1"
            >
              <Send size={13} />
              Submit Bug Report
            </button>
          </form>
        )}
      </div>
    </PageShell>
  )
}
