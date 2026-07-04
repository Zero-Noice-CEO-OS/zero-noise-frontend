'use client'

import PageShell from '@/components/PageShell'
import { ClipboardCheck, Sparkles, Star } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function ReviewsMarketingPage() {
  const { user } = useAuth()
  const breadcrumbs = [
    { label: 'Features', href: '/features' },
    { label: 'Reviews' }
  ]

  return (
    <PageShell
      title="Performance Reviews"
      description="Reflect on your daily logs and compile weekly status check-ins to monitor capabilities."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-2.5 py-1 bg-[#4F7CFF]/15 text-[#36D7FF] text-xs font-bold rounded-lg uppercase tracking-wider">
              Feedback Loops
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Maintain close loops on executive output metrics.
            </h2>
            <p className="text-sm text-[#A6B0CF]/70 leading-relaxed">
              Complete brief daily reflection prompts, score focus levels, and review aggregated weekly logs to optimize alignment.
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
              <ClipboardCheck size={13} className="text-[#36D7FF]" /> Performance Journal Mockup
            </h3>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 text-xs text-[#A6B0CF]/70">
              <p className="font-bold text-white">Daily Reflection Journal</p>
              <p className="italic">&ldquo;Completed build blocks, energy scored 8/10. Blocked key parameters for strategy audit.&rdquo;</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
