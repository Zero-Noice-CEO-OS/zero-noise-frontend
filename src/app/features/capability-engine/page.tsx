'use client'

import PageShell from '@/components/PageShell'
import { Award, Target, Brain } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function CapabilityEngineMarketingPage() {
  const { user } = useAuth()
  const breadcrumbs = [
    { label: 'Features', href: '/features' },
    { label: 'Capability Engine' }
  ]

  return (
    <PageShell
      title="Capability Engine"
      description="Score core skill dimensions and track your leadership capacity growth over time."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-2.5 py-1 bg-[#4F7CFF]/15 text-[#36D7FF] text-xs font-bold rounded-lg uppercase tracking-wider">
              Skills Benchmarks
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Visualize your leadership strength indexes.
            </h2>
            <p className="text-sm text-[#A6B0CF]/70 leading-relaxed">
              Track skill radar maps covering Strategy, Speed, Quality, Focus, and Scale. Uncover where capability bottlenecks reside.
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

          <div className="p-6 bg-[#0B1225]/85 border border-white/5 rounded-2xl flex justify-center">
            {/* Custom Polygon radar mockup */}
            <svg viewBox="0 0 100 100" className="w-40 h-40">
              <polygon points="50,5 95,38 78,90 22,90 5,38" className="stroke-white/10 fill-none" strokeWidth="0.5" />
              <polygon points="50,20 83,44 71,80 29,80 17,44" className="stroke-white/10 fill-none" strokeWidth="0.5" />
              <polygon points="50,22 80,41 71,77 34,75 19,41" className="stroke-[#4F7CFF] fill-[#4F7CFF]/10" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
