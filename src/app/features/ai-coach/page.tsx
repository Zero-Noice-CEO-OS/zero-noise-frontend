'use client'

import PageShell from '@/components/PageShell'
import { Sparkles, Brain, Clock, Shield, Flame, Activity } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function AiCoachMarketingPage() {
  const { user } = useAuth()
  const breadcrumbs = [
    { label: 'Features', href: '/features' },
    { label: 'AI Coach' }
  ]

  return (
    <PageShell
      title="AI Executive Coach"
      description="Your 24/7 strategic advisor analyzing calendar logs, deep work capacity, and leadership skill growth."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16 pb-16">
        {/* Hero Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-2.5 py-1 bg-[#4F7CFF]/15 text-[#36D7FF] text-xs font-bold rounded-lg uppercase tracking-wider">
              Advisory Co-Pilot
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Optimize execution, protect focus, and lead with ultimate clarity.
            </h2>
            <p className="text-sm text-[#A6B0CF]/70 leading-relaxed">
              The AI Coach aggregates daily reflections, deep work streaks, and priority scores to suggest real-time changes to your schedule.
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
              <Sparkles size={13} className="text-[#36D7FF]" /> Live Advice Stream
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-[#A6B0CF]/85">
                <span className="font-bold text-white block mb-1">AI Recommendation</span>
                &ldquo;You have logged 12 hours of Maintain tasks this week. Strategic Builder capability has dropped by 8%. Consider delegating current maintain cards to protect morning build blocks.&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#36D7FF]">01 / Track daily reflection</span>
              <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">Log check-in metrics, energy, and main daily focus priorities.</p>
            </div>
            <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#36D7FF]">02 / Analyze calendar logs</span>
              <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">Co-pilot audits build vs maintenance hours to verify impact.</p>
            </div>
            <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#36D7FF]">03 / Optimize execution</span>
              <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">Unlocks dynamic recommendations to protect 90-minute focus slots.</p>
            </div>
          </div>
        </div>

        {/* FAQS */}
        <div className="space-y-4 max-w-2xl mx-auto border-t border-white/5 pt-12">
          <h3 className="text-sm font-bold text-white text-center mb-4">FAQ</h3>
          <div className="space-y-3">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold text-white">Is advice updated in real-time?</h4>
              <p className="text-[11px] text-[#A6B0CF]/70 mt-1">Yes, recommendations refresh instantly as check-ins and deep work sessions are logged.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
