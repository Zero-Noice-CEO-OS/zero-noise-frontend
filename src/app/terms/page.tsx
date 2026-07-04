'use client'

import PageShell from '@/components/PageShell'
import { Shield } from 'lucide-react'

export default function TermsPage() {
  const breadcrumbs = [
    { label: 'Legal', href: '#' },
    { label: 'Terms of Service' }
  ]

  return (
    <PageShell
      title="Terms of Service"
      description="Terms of service governing the use of Zero Noise CEO OS dashboard and AI coach modules."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-8 pb-16 max-w-3xl mx-auto text-xs text-[#A6B0CF]/80 leading-relaxed font-medium">
        
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">1. Account Eligibility</h3>
          <p>
            By registering for Zero Noise CEO OS, you represent that you are at least 18 years old and have the capacity to form binding legal contracts.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">2. User Accounts</h3>
          <p>
            You are responsible for safeguarding your password credentials. You must immediately notify security@zeronoise.co if you suspect any unauthorized access to your workspace session.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">3. Subscriptions & Billing</h3>
          <p>
            Standard subscription features are free. Premium tier upgrades charge a monthly fee billed immediately. You can cancel Premium renewals in Settings.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">4. Acceptable Usage Boundaries</h3>
          <p>
            You agree not to upload malicious scripts, attempt unauthorized database penetration, or scrape user metrics in violation of cybersecurity regulations.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">5. Limitation of Liability</h3>
          <p>
            Zero Noise is provided "as is" without warranty. We are not liable for any strategic business outcomes, calendar scheduling mistakes, or data refresh delays.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">6. Intellectual Property</h3>
          <p>
            Zero Noise designs, including dashboard configurations, SVG radar assets, icons, and AI coach prompt structures are owned by Zero Noise and protected by copyright laws.
          </p>
        </div>

        <div className="border-t border-white/5 pt-8 space-y-2">
          <p className="font-bold text-white text-xs">Contact Us</p>
          <p>If you have any questions, write to support@zeronoise.co.</p>
        </div>

      </div>
    </PageShell>
  )
}
