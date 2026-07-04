'use client'

import PageShell from '@/components/PageShell'
import { Sparkles, Check, Bug, Shield, Cpu, RefreshCw } from 'lucide-react'

const releaseNotes = [
  {
    version: '1.0.0',
    date: 'July 3, 2026',
    title: 'Zero Noise CEO OS Production Release',
    description: 'We are thrilled to officially launch Version 1.0.0. The workspace is fully optimized for executive audit logging and co-pilot guidance.',
    features: [
      'Interactive Daily Command Center timeline for logging and scoring Build vs Sell vs Maintain slots.',
      'AI Advisor co-pilot panel to review calendar audit suggestions.',
      'Capability index tracking showing live radar metric distributions.'
    ],
    improvements: [
      'Multi-device Google Calendar synchronization limits resolved.',
      'Reduced initial render cycles by 24% using react-query caching buffers.'
    ],
    fixes: [
      'Resolved JWT cookie refresh token expiration loops in browser client session.'
    ]
  },
  {
    version: '0.9.0',
    date: 'June 15, 2026',
    title: 'Beta Release Phase II',
    description: 'Integrated daily check-in templates and circular focus timer streams.',
    features: [
      'Circular progress SVG timers for 90-minute focus sessions.'
    ],
    improvements: [],
    fixes: []
  }
]

export default function ReleaseNotesPage() {
  const breadcrumbs = [
    { label: 'Resources', href: '#' },
    { label: 'Release Notes' }
  ]

  return (
    <PageShell
      title="Release Notes"
      description="Stay updated with new features, capability metrics improvements, and bugs resolved."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-12 pb-16 max-w-3xl mx-auto">
        
        <div className="relative border-l border-white/10 pl-6 ml-4 space-y-12">
          {releaseNotes.map((rel, idx) => (
            <div key={idx} className="relative">
              {/* Badge timeline indicator */}
              <span className="absolute -left-10 top-0.5 w-8 h-8 rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#7B5CFF] text-white text-[10px] font-bold flex items-center justify-center border-4 border-[#050816]">
                v{rel.version.split('.')[0]}
              </span>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[#36D7FF] text-xs font-bold">{rel.date}</span>
                  <h3 className="text-md font-extrabold text-white flex items-center gap-2">
                    {rel.title}
                    <span className="text-[9px] uppercase tracking-widest bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-bold">
                      v{rel.version}
                    </span>
                  </h3>
                  <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
                    {rel.description}
                  </p>
                </div>

                {/* Features */}
                {rel.features.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-white tracking-wider flex items-center gap-1">
                      <Sparkles size={11} className="text-[#36D7FF]" /> New Features
                    </h4>
                    <ul className="space-y-1 text-xs text-[#A6B0CF]/70 pl-2">
                      {rel.features.map((f, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-primary shrink-0 mt-0.5"><Check size={12} /></span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {rel.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-white tracking-wider flex items-center gap-1">
                      <RefreshCw size={11} className="text-[#8A63FF]" /> Improvements
                    </h4>
                    <ul className="space-y-1 text-xs text-[#A6B0CF]/70 pl-2">
                      {rel.improvements.map((imp, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-secondary shrink-0 mt-0.5"><Check size={12} /></span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bug Fixes */}
                {rel.fixes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-white tracking-wider flex items-center gap-1">
                      <Bug size={11} className="text-[#3EE98A]" /> Bug Fixes
                    </h4>
                    <ul className="space-y-1 text-xs text-[#A6B0CF]/70 pl-2">
                      {rel.fixes.map((fix, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-success shrink-0 mt-0.5"><Check size={12} /></span>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </PageShell>
  )
}
