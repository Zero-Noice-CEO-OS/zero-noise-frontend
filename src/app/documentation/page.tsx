'use client'

import PageShell from '@/components/PageShell'
import { useState } from 'react'
import { Search, BookOpen, ChevronRight, Terminal, User, Sparkles, Cpu, Clock, Key } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { id: 'getting-started', label: 'Getting Started', desc: 'Core setup, user profiles, and onboarding walkthroughs.' },
  { id: 'daily-workflow', label: 'Daily Workflow', desc: 'How to score activities, reflections, and metrics.' },
  { id: 'ai-coach', label: 'AI Coach', desc: 'Understanding advisor prompts, feedback logs, and advice.' },
  { id: 'deep-work', label: 'Deep Work', desc: 'Circular timers, tracking focus streaks, and logs.' },
  { id: 'capability-engine', label: 'Capability Engine', desc: 'Benchmark radar metrics, strategic levels, and speed indexes.' }
]

const articles = {
  'getting-started': [
    { title: 'Connecting your founder calendar', desc: 'Learn how to sync Multi-device Google Calendar slots directly to deep work cockpit.' },
    { title: 'Configuring custom focus goals', desc: 'Establish strategic boundaries and audit intervals.' },
    { title: 'Keyboard shortcuts guide', desc: 'Command layout controls to toggle focus states instantly.' }
  ],
  'daily-workflow': [
    { title: 'Daily Check-in routine', desc: 'Score your energy levels, focus parameters, and list top daily priorities.' },
    { title: 'Auditing activities by impact', desc: 'Differentiate Build vs Administrative maintain logs.' }
  ],
  'ai-coach': [
    { title: 'How does Co-pilot track cognitive limits?', desc: 'Analyzing check-in reflection history to recommend calendar shifts.' }
  ],
  'deep-work': [
    { title: 'Focus streak calculations', desc: 'Understanding continuous building streaks.' }
  ],
  'capability-engine': [
    { title: 'Radar chart scoring guide', desc: 'How strategy, quality, speed, scale, and focus are quantified.' }
  ]
}

export default function DocumentationPage() {
  const breadcrumbs = [
    { label: 'Resources', href: '#' },
    { label: 'Documentation' }
  ]

  const [activeCat, setActiveCat] = useState('getting-started')
  const [search, setSearch] = useState('')

  const filteredCatArticles = articles[activeCat as keyof typeof articles] || []

  return (
    <PageShell
      title="Zero Noise Documentation"
      description="Integrate, setup, and optimize your executive co-pilot workspace."
      breadcrumbs={breadcrumbs}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-16">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/55 px-3 block mb-3">Categories</span>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                activeCat === cat.id 
                  ? 'bg-gradient-to-r from-[#4F7CFF]/15 to-[#7B5CFF]/10 text-white border border-[#4F7CFF]/20 shadow-sm'
                  : 'text-[#A6B0CF]/65 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{cat.label}</span>
              <ChevronRight size={12} className={activeCat === cat.id ? 'text-[#36D7FF]' : 'text-[#A6B0CF]/40'} />
            </button>
          ))}
          
          <div className="h-[1px] bg-white/5 my-4" />
          
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-[#36D7FF] font-bold">API Docs</span>
            <p className="text-[10px] text-[#A6B0CF]/60">Developer interfaces & webhooks.</p>
            <span className="text-[9px] uppercase tracking-widest bg-white/10 text-white/50 px-1.5 py-0.5 rounded inline-block">Coming Soon</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3.5 text-[#A6B0CF]/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
              placeholder="Search documentation (e.g. keyboard shortcuts, daily check-in)..."
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-bold text-white uppercase tracking-wider">
              {categories.find(c => c.id === activeCat)?.label} articles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCatArticles.map((art, idx) => (
                <div key={idx} className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-all space-y-2">
                  <span className="text-[10px] text-[#36D7FF] font-bold">ARTICLE</span>
                  <h4 className="text-xs font-bold text-white leading-snug">{art.title}</h4>
                  <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">{art.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core system details */}
          <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Terminal size={14} className="text-[#36D7FF]" /> Zero Noise Architecture
            </h3>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
              Zero Noise is built on a modular client-server framework. The client NextJS layer relies on react-query to store state buffers. The backend is configured as a NestJS RESTful API, employing JWT verification to guard personal user sessions.
            </p>
          </div>

        </div>

      </div>
    </PageShell>
  )
}
