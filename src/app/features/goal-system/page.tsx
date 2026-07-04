'use client'

import PageShell from '@/components/PageShell'
import { Target, Award, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function GoalSystemMarketingPage() {
  const { user } = useAuth()
  const breadcrumbs = [
    { label: 'Features', href: '/features' },
    { label: 'Goal System' }
  ]

  return (
    <PageShell
      title="Goal System"
      description="Connect daily metrics and execution check-ins directly to company-level key results."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-2.5 py-1 bg-[#4F7CFF]/15 text-[#36D7FF] text-xs font-bold rounded-lg uppercase tracking-wider">
              Alignment Matrix
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Connect daily actions to core company objectives.
            </h2>
            <p className="text-sm text-[#A6B0CF]/70 leading-relaxed">
              Define sprint objectives, update execution milestones, and verify task progress within a clean dashboard.
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
              <Target size={13} className="text-[#36D7FF]" /> Active Sprint Goals
            </h3>
            <div className="space-y-3 text-xs text-[#A6B0CF]/70">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between font-bold text-white">
                  <span>Deploy CEO OS Beta</span>
                  <span className="text-[#36D7FF]">75%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4F7CFF] rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
