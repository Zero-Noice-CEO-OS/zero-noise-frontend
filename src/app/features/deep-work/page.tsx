'use client'

import PageShell from '@/components/PageShell'
import { Flame, Clock, Shield } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function DeepWorkMarketingPage() {
  const { user } = useAuth()
  const breadcrumbs = [
    { label: 'Features', href: '/features' },
    { label: 'Deep Work' }
  ]

  return (
    <PageShell
      title="Deep Work Timer"
      description="Protect your focus, run local work timers, and measure daily building streaks."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-2.5 py-1 bg-[#4F7CFF]/15 text-[#36D7FF] text-xs font-bold rounded-lg uppercase tracking-wider">
              Focus Shield
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Maintain high attention streaks, block distractors.
            </h2>
            <p className="text-sm text-[#A6B0CF]/70 leading-relaxed">
              Activate circular focus clocks. Build compound momentum by logging uninterrupted 90-minute building sessions.
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

          <div className="p-8 bg-[#0B1225]/85 border border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" className="stroke-white/5 fill-none" strokeWidth="6" />
                <circle cx="64" cy="64" r="50" className="stroke-[#36D7FF] fill-none" strokeWidth="6" strokeDasharray="314" strokeDashoffset="78" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-bold text-white">72:14</span>
                <span className="text-[8px] text-[#A6B0CF]/60 block -mt-1">REMAINING</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#3EE98A] bg-[#22C55E]/10 px-3 py-1 rounded-full">
              Session Running
            </span>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
