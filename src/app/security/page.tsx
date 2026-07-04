'use client'

import PageShell from '@/components/PageShell'
import { Shield, Key, Database, Cpu, Award } from 'lucide-react'

export default function SecurityPage() {
  const breadcrumbs = [
    { label: 'Company', href: '#' },
    { label: 'Security' }
  ]

  return (
    <PageShell
      title="Security Cockpit"
      description="Zero Noise uses encryption, JWT protocols, and secure database standards to protect your data."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-12 pb-16 max-w-3xl mx-auto">
        
        {/* Intro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <span className="p-3 bg-[#4F7CFF]/15 text-[#36D7FF] rounded-xl inline-block">
              <Key size={18} />
            </span>
            <h3 className="text-xs font-bold text-white">JWT Signatures</h3>
            <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">
              Every request is signed using JWT verification. Invalidation triggers automatically upon log out or cookie expiry.
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <span className="p-3 bg-[#7B5CFF]/15 text-[#8A63FF] rounded-xl inline-block">
              <Database size={18} />
            </span>
            <h3 className="text-xs font-bold text-white">Encrypted Sessions</h3>
            <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">
              Founder metrics are isolated on partitioned secure clouds. Uptime clusters run daily backups to guard from loss.
            </p>
          </div>
        </div>

        {/* Responsible Disclosure */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">Responsible Disclosure</h3>
          <p className="text-xs text-[#A6B0CF]/75 leading-relaxed font-medium">
            We value the cybersecurity researcher community. If you identify a security issue on our gateways, please email security@zeronoise.co. We will review the ticket and patch it within 24 hours. Do not publicly disclose vulnerabilities before alignment.
          </p>
        </div>

        {/* Compliance Roadmap */}
        <div className="space-y-4 border-t border-white/5 pt-8">
          <h3 className="text-sm font-bold text-white">Compliance Roadmap</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-white">SOC 2 Type I</span>
              <span className="text-[9px] uppercase tracking-widest bg-[#22C55E]/15 text-[#3EE98A] px-2 py-0.5 rounded font-extrabold">Active</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-xs font-bold text-white">SOC 2 Type II</span>
              <span className="text-[9px] uppercase tracking-widest bg-white/10 text-white/50 px-2 py-0.5 rounded font-extrabold">Audit Planned</span>
            </div>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
