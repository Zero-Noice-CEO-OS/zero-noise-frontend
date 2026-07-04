'use client'

import PageShell from '@/components/PageShell'
import { useState } from 'react'
import { Mail, HelpCircle, Briefcase, PhoneCall, Check, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const breadcrumbs = [
    { label: 'Company', href: '#' },
    { label: 'Contact' }
  ]

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'Support',
    message: ''
  })
  const [success, setSuccess] = useState(false)

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { apiClient } = require('@/services/api-client')
      await apiClient.post('/auth/contact', formState)
      setSuccess(true)
      setFormState({ name: '', email: '', subject: 'Support', message: '' })
    } catch (err) {
      console.error(err)
      alert('Failed to transmit inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell
      title="Contact Zero Noise"
      description="Need support or want to discuss enterprise features? We respond within 12 hours."
      breadcrumbs={breadcrumbs}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-16">
        
        {/* Info Cards Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <span className="p-2 bg-[#4F7CFF]/15 text-[#36D7FF] rounded-lg inline-block">
              <HelpCircle size={18} />
            </span>
            <h3 className="text-sm font-bold text-white">Help & Support</h3>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
              Facing issue checking in or connecting your calendar? Visit documentation or write to us.
            </p>
            <p className="text-xs text-[#36D7FF] font-bold">support@zeronoise.co</p>
          </div>

          <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <span className="p-2 bg-[#7B5CFF]/15 text-[#8A63FF] rounded-lg inline-block">
              <Mail size={18} />
            </span>
            <h3 className="text-sm font-bold text-white">Sales & Partnerships</h3>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
              Custom capability configurations for leadership groups or accelerator cohorts.
            </p>
            <p className="text-xs text-[#8A63FF] font-bold">sales@zeronoise.co</p>
          </div>

          <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <span className="p-2 bg-[#22C55E]/15 text-[#3EE98A] rounded-lg inline-block">
              <Briefcase size={18} />
            </span>
            <h3 className="text-sm font-bold text-white">Response SLA</h3>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
              Founders have no time to waste. Our executive response team responds within 12 hours.
            </p>
          </div>

          <div className="p-5 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#22C55E]/25 text-[#22C55E] rounded-lg inline-block">
                <PhoneCall size={18} />
              </span>
              <h3 className="text-sm font-bold text-white">WhatsApp Helpline</h3>
            </div>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
              Instant workspace support and billing alignments. Chat directly with product builders.
            </p>
            <a
              href="https://wa.me/919059503227?text=Hello%2C%20I'd%20like%20to%20know%20more%20about%20Zero%20Noise%20CEO%20OS."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2 bg-[#22C55E] hover:bg-[#1da850] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-md"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="p-5 bg-[#0B1225]/40 border border-white/5 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-white">Office Location</h4>
            <p className="text-[11px] text-[#A6B0CF]/70">650 California St, San Francisco, CA 94108</p>
            {/* Google maps placeholder */}
            <div className="h-28 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-[10px] text-[#A6B0CF]/40">
              Interactive Map Placeholder
            </div>
          </div>
        </div>

        {/* Feedback Form Column */}
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#4F7CFF]/5 rounded-full blur-3xl pointer-events-none" />

          {success ? (
            <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-4">
              <span className="p-3 bg-[#22C55E]/15 text-[#3EE98A] rounded-full inline-block">
                <CheckCircle2 size={32} />
              </span>
              <h3 className="text-lg font-bold text-white">Message Transmitted</h3>
              <p className="text-xs text-[#A6B0CF]/70 max-w-xs">
                Your request has been registered in our ticket queue. A representative will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-md font-bold text-white">Send Message</h3>
              <p className="text-xs text-[#A6B0CF]/70">Complete this form and we will review your metrics context if requested.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Full Name</label>
                  <input
                    required
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
                    placeholder="Teja Reddy"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
                    placeholder="teja@zeronoise.co"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Subject Category</label>
                <select
                  value={formState.subject}
                  onChange={e => setFormState({ ...formState, subject: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
                >
                  <option value="Support">Support Inquiry</option>
                  <option value="Sales">Sales Inquiry</option>
                  <option value="Partnership">Business Partnership</option>
                  <option value="Feedback">Product Feedback</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Message Detail</label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all resize-none"
                  placeholder="Explain how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white text-xs font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
              >
                <Send size={13} />
                Send Inquiry
              </button>
            </form>
          )}
        </div>

      </div>
    </PageShell>
  )
}
