'use client'

import PageShell from '@/components/PageShell'
import { Sparkles, Calendar, ArrowRight, Layers, Smartphone, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const roadmapSprints = [
  {
    horizon: 'Now (Q3 2026)',
    items: [
      { title: 'Voice check-in reflection integration', desc: 'Allows builders to record short audio score check-ins.', cat: 'AI Coach' },
      { title: 'Advanced time allocation widgets', desc: 'Alternative visualization maps in deep work timers.', cat: 'Dashboard' }
    ]
  },
  {
    horizon: 'Next (Q4 2026)',
    items: [
      { title: 'Apple Watch status companion', desc: 'Track focus metrics right on wrist.', cat: 'Mobile App' },
      { title: 'Multi-organization leader groups', desc: 'Allow accelerators or VC groups to audit scores together.', cat: 'Team Mode' }
    ]
  },
  {
    horizon: 'Future (2027)',
    items: [
      { title: 'Integrations SDK', desc: 'Extend API to sync calendar status to Slack, GitHub, Linear, and Notion.', cat: 'Integrations' }
    ]
  }
]

export default function RoadmapPage() {
  const breadcrumbs = [
    { label: 'Product', href: '#' },
    { label: 'Roadmap' }
  ]

  return (
    <PageShell
      title="Product Roadmap"
      description="Review planned capabilities, upcoming calendar integrations, and AI coach improvements."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-12 pb-16 max-w-3xl mx-auto">
        
        {/* Intro */}
        <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Layers size={14} className="text-[#36D7FF]" /> Engineering Milestones
          </h3>
          <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
            Zero Noise is designed to expand founder velocity. We iterate rapidly based on public feature stack votes. Our roadmap focuses on calendar audit enhancements and wearable integrations.
          </p>
        </div>

        {/* Horizons list */}
        <div className="space-y-8">
          {roadmapSprints.map((horizon, idx) => (
            <div key={idx} className="space-y-4">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#36D7FF] bg-[#4F7CFF]/15 border border-[#4F7CFF]/25 px-3 py-1 rounded-full w-fit block">
                {horizon.horizon}
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {horizon.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-all space-y-2">
                    <span className="text-[9px] uppercase tracking-widest bg-white/10 text-white/50 px-1.5 py-0.5 rounded font-extrabold w-fit block">
                      {item.cat}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                    <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </PageShell>
  )
}
