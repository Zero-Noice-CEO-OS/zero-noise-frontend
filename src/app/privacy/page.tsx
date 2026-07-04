'use client'

import PageShell from '@/components/PageShell'
import { Shield, Lock } from 'lucide-react'

export default function PrivacyPage() {
  const breadcrumbs = [
    { label: 'Legal', href: '#' },
    { label: 'Privacy Policy' }
  ]

  return (
    <PageShell
      title="Privacy Policy"
      description="Zero Noise CEO OS is built on privacy-first values. We do not sell or monetize founder metrics."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8 pb-16 max-w-3xl mx-auto text-xs text-[#A6B0CF]/80 leading-relaxed font-medium">
        
        <div className="p-5 bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl flex gap-4 items-start">
          <span className="p-2 bg-[#4F7CFF]/15 text-[#36D7FF] rounded-lg shrink-0">
            <Shield size={18} />
          </span>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">Privacy-First Architecture</h4>
            <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">
              We understand founder time is highly strategic. All dashboard analytics, daily activity values, reflection ratings, and goals are encrypted and accessible only inside your secure session.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">1. Information We Collect</h3>
          <p>
            We collect the basic setup parameters you configure during registration (name, email address, password). We also track calendar activities you explicitly log to compute performance scores, plus check-in reflection responses.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">2. How We Use Data</h3>
          <p>
            Your logs are used exclusively to refresh dashboard radar visualizers and deliver personalized calendar guidance in the AI Advisor co-pilot cockpit. No data is shared with external advertising companies.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">3. Cookies & Session Storage</h3>
          <p>
            We use secure, HTTP-only cookie tokens to maintain authenticated sessions and manage page refresh processes. These tokens do not carry tracking attributes outside zeronoise.co.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">4. User Rights</h3>
          <p>
            You have the right to request a complete CSV archive of all logged activities. You may also purge your account metrics completely from Settings at any time.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">5. Security Standards</h3>
          <p>
            Transactions are verified using JWT signature filters. System networks use TLS protocols on data transfers. We conduct routine audits to secure databases from vulnerabilities.
          </p>
        </div>

        <div className="border-t border-white/5 pt-8 space-y-2">
          <p className="font-bold text-white text-xs">Contact Us</p>
          <p>If you have any questions, write to security@zeronoise.co.</p>
        </div>

      </div>
    </PageShell>
  )
}
