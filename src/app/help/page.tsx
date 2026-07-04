'use client'

import PageShell from '@/components/PageShell'
import { useState } from 'react'
import { Search, Mail, HelpCircle, Heart, Shield, Lock, CreditCard, Key } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { id: 'account', label: 'Account & Security', icon: Lock, desc: 'Manage password, profile parameters, and sessions.' },
  { id: 'billing', label: 'Billing & Pricing', icon: CreditCard, desc: 'Manage payment logs, invoices, and active plans.' },
  { id: 'coach', label: 'AI Coach Insights', icon: HelpCircle, desc: 'Understand Co-pilot advice streams and calendar logs.' }
]

const articles = {
  'account': [
    { q: 'How do I reset my password?', a: 'Go to the login screen and click "Forgot password?". Enter your email address to receive a secure link.' },
    { q: 'Is multi-factor authentication supported?', a: 'MFA is currently on our product roadmap and will be deployed in a future release.' }
  ],
  'billing': [
    { q: 'When is billing activated?', a: 'Standard tier is 100% free forever. Upgrade to Premium is optional and can be managed in settings.' },
    { q: 'What is the refund policy?', a: 'We offer a full 14-day refund window on Premium tier upgrades if you are not satisfied.' }
  ],
  'coach': [
    { q: 'How frequently does the AI Coach refresh?', a: 'The Advisor processes metrics at check-in and immediately following logged deep work sessions.' }
  ]
}

export default function HelpPage() {
  const breadcrumbs = [
    { label: 'Resources', href: '#' },
    { label: 'Help Center' }
  ]

  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('account')

  return (
    <PageShell
      title="Help Center"
      description="Search popular articles or reach our customer success team."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-12 pb-16">
        
        {/* Search & Intro */}
        <div className="relative max-w-xl mx-auto">
          <Search size={16} className="absolute left-3.5 top-3.5 text-[#A6B0CF]/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
            placeholder="Search help articles..."
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`p-5 text-left border rounded-2xl transition-all space-y-3 ${
                  activeCat === cat.id
                    ? 'bg-gradient-to-br from-[#4F7CFF]/15 to-[#7B5CFF]/10 border-[#4F7CFF]/30 text-white shadow-sm'
                    : 'bg-white/5 border-white/5 text-[#A6B0CF]/70 hover:text-white'
                }`}
              >
                <span className="p-2.5 rounded-xl bg-white/5 text-white inline-block">
                  <Icon size={16} />
                </span>
                <h4 className="text-xs font-bold text-white">{cat.label}</h4>
                <p className="text-[10px] text-[#A6B0CF]/60 leading-relaxed">{cat.desc}</p>
              </button>
            )
          })}
        </div>

        {/* FAQ list */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Popular Q&A ({categories.find(c => c.id === activeCat)?.label})
          </h3>
          
          <div className="space-y-4">
            {(articles[activeCat as keyof typeof articles] || []).map((art, idx) => (
              <div key={idx} className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-white">{art.q}</h4>
                <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">{art.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help banner */}
        <div className="p-6 bg-gradient-to-r from-[#4F7CFF]/10 to-transparent border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">Still need help?</h4>
            <p className="text-[11px] text-[#A6B0CF]/70">Our founder response agents are active and responding.</p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white text-xs font-bold shadow-md hover:scale-[1.02] transition-all"
          >
            Create Support Ticket
          </Link>
        </div>

      </div>
    </PageShell>
  )
}
