'use client'

import PageShell from '@/components/PageShell'
import { Calendar, Play, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function DailyCommandCenterMarketingPage() {
  const { user } = useAuth()
  const breadcrumbs = [
    { label: 'Features', href: '/features' },
    { label: 'Daily Command Center' }
  ]

  return (
    <PageShell
      title="Daily Command Center"
      description="Refine your priorities, view strategic indicators, and coordinate daily tasks in a clean dashboard."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-2.5 py-1 bg-[#4F7CFF]/15 text-[#36D7FF] text-xs font-bold rounded-lg uppercase tracking-wider">
              Control Panel
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              A distraction-free cockpit for chief executives.
            </h2>
            <p className="text-sm text-[#A6B0CF]/70 leading-relaxed">
              Consolidate daily goals, skill audits, streaks, and reflections. Avoid context switching to focus on high-impact strategic tasks.
            </p>
            <div>
              <Link
                href={user ? '/dashboard' : '/signup'}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                {user ? 'Enter Dashboard' : 'Start Free'}
              </Link>
            </div>
          </div>

          <div className="p-6 bg-[#0B1225]/85 border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={13} className="text-[#36D7FF]" /> Executive Cockpit Preview
            </h3>
            <div className="space-y-2.5 text-xs text-[#A6B0CF]/70">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>CEO score</span>
                <span className="text-white font-bold">84/100</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Focus Streak</span>
                <span className="text-[#36D7FF] font-bold">12 Days 🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-center">Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white/5 border border-white/5 rounded-xl">
              <h4 className="text-xs font-bold text-white mb-2">Eliminate Administrative Noise</h4>
              <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">Focus strictly on high-impact strategic items instead of minor operational notifications.</p>
            </div>
            <div className="p-5 bg-white/5 border border-white/5 rounded-xl">
              <h4 className="text-xs font-bold text-white mb-2">Unified Dashboard Cockpit</h4>
              <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">Keep your metrics, goals, and focus indicators in a single view.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
