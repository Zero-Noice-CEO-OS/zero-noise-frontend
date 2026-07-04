'use client'

import PageShell from '@/components/PageShell'
import { Sparkles, CheckCircle, AlertTriangle, Activity, Clock } from 'lucide-react'

const services = [
  { name: 'API Server Gateways', status: 'Operational', uptime: '99.98%' },
  { name: 'AI Coach LLM Stream Engines', status: 'Operational', uptime: '99.95%' },
  { name: 'Database Clusters', status: 'Operational', uptime: '100.00%' },
  { name: 'Session Token Authenticators', status: 'Operational', uptime: '99.99%' },
  { name: 'SMTP Email Delivery', status: 'Operational', uptime: '99.91%' }
]

const incidents = [
  { date: 'July 1, 2026', title: 'Session Token Refreshes latency', desc: 'DevOps detected token verification timeouts between 14:00 and 14:32 UTC. Successfully resolved.' }
]

export default function StatusPage() {
  const breadcrumbs = [
    { label: 'Resources', href: '#' },
    { label: 'Status' }
  ]

  return (
    <PageShell
      title="System Status"
      description="Real-time performance metrics and historical uptime graphs for Zero Noise CEO OS."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-10 pb-16 max-w-3xl mx-auto">
        
        {/* Overall Status Banner */}
        <div className="p-6 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl flex items-center gap-4">
          <span className="p-2 bg-[#22C55E]/15 text-[#3EE98A] rounded-full">
            <CheckCircle size={24} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">All Systems Operational</h3>
            <p className="text-[10px] text-[#3EE98A] font-extrabold uppercase tracking-wider">Overall uptime: 99.97%</p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/55 px-1">Active Modules</span>
          <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
            {services.map((ser, idx) => (
              <div key={idx} className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{relLink(ser.name)}</h4>
                  <p className="text-[10px] text-[#A6B0CF]/50">Uptime: {ser.uptime}</p>
                </div>
                
                <span className="text-[10px] uppercase tracking-widest bg-[#22C55E]/15 text-[#3EE98A] border border-[#22C55E]/30 px-2 py-0.5 rounded font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3EE98A] animate-pulse" />
                  {ser.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents timeline */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/55 px-1">Incidents History</span>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
            {incidents.map((inc, idx) => (
              <div key={idx} className="space-y-2 border-l-2 border-[#FF5D73] pl-4">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{inc.title}</h4>
                  <span className="text-[9px] text-[#A6B0CF]/50">{inc.date}</span>
                </div>
                <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">{inc.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageShell>
  )
}

function relLink(name: string) {
  return name
}
