'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import PageShell from '@/components/PageShell'
import { Check, ArrowRight, Shield, Zap, Sparkles, Brain, Cpu, Star } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const PLANS_DATA: Record<string, any> = {
  'free': {
    name: 'Free Plan',
    price: '₹0',
    cycle: 'forever',
    tagline: 'Automatically assigned to every newly registered user.',
    desc: 'Perfect for testing the waters and establishing core daily check-in habits.',
    who: 'Solo developers, early-stage hackers, and hobbyists building out proof of concepts.',
    useCase: 'Log in daily to rating operating metrics and consult basic prompt logs.',
    limits: {
      ai: '5 requests / day',
      goals: '5 active goals max',
      analytics: 'Standard (Uptime graphs, simple logs lists)',
      support: 'Documentation self-serve',
      security: 'SSL transit locks',
    },
    workflows: [
      'Initialize morning rating logs in 2 clicks',
      'Record focus metrics checklist',
      'Track energy status and core developer goals'
    ]
  },
  'starter': {
    name: 'Starter Plan',
    price: '₹499',
    cycle: 'month',
    tagline: 'Step up to unlimited goal tracking and daily logs auditing.',
    desc: 'Build consistency metrics with priority support channels and email delivery logs.',
    who: 'Active builders, freelance teams, and early-stage founders seeking clean productivity indicators.',
    useCase: 'Protect daily deep work timers and verify check-in logs consistency.',
    limits: {
      ai: '20 requests / day',
      goals: 'Unlimited goals',
      analytics: 'Intermediate metrics lists',
      support: 'Standard email support',
      security: 'Encrypted database protocols',
    },
    workflows: [
      'Audit focus categories (Build vs Sales vs Maintenance)',
      'Establish custom milestones',
      'Automate calendar reminder loops'
    ]
  },
  'founder-pro': {
    name: 'Founder Pro Plan',
    price: '₹4,899',
    cycle: 'year',
    tagline: 'Best Value for Growing Founders',
    desc: 'Unlocks the full AI coach advisor pipeline and radar-based capability metric graphs.',
    who: 'Startup CEOs, active managers, and product leads leading scaling engineering structures.',
    useCase: 'Deploy calendar audits, build executive profiles, and receive timezone recommendations.',
    limits: {
      ai: 'Unlimited prompts',
      goals: 'Unlimited goals',
      analytics: 'Advanced charts (Radar capability indices)',
      support: 'Priority support',
      security: 'JWT cookie authorization',
    },
    workflows: [
      'Query the AI Advisor on weekly priority leaks',
      'Trace strategic radars distributions',
      'Run timezone adjustments alerts'
    ]
  },
  'founder-elite': {
    name: 'Founder Elite Plan',
    price: '₹18,999',
    cycle: '6 years',
    tagline: 'For High-Performance Leaders',
    desc: 'Unlocks priority AI coach queue, premium analytics, and early access beta programs.',
    who: 'VC managers, accelerator leads, and multiple-exit chief executives compounding growth speed.',
    useCase: 'Full organizational audits, leadership metrics scaling, and strategic advice logs.',
    limits: {
      ai: 'Unlimited (Priority queue)',
      goals: 'Unlimited',
      analytics: 'Full Premium Suite',
      support: 'VIP dedicated chat',
      security: 'Dedicated token protocols',
    },
    workflows: [
      'Benchmark multi-device teams focus statistics',
      'Sync corporate calendar workspaces',
      'Exclusive roundtable alignment'
    ]
  },
  'lifetime-founder': {
    name: 'Lifetime Founder Plan',
    price: '₹32,999',
    cycle: 'once',
    tagline: 'Pay Once. Own Forever.',
    desc: 'The ultimate executive asset. One-time payment to compound performance forever.',
    who: 'Committed high-performance leaders and serial founders building multiple projects.',
    useCase: 'Complete Zero Noise cockpit suite access forever with all future updates.',
    limits: {
      ai: 'Unlimited (Ultimate VIP)',
      goals: 'Unlimited',
      analytics: 'Full Premium Suite + Custom reports',
      support: 'Direct developer access channels',
      security: 'Custom priority keys',
    },
    workflows: [
      'Audit operations parameters across all active pipelines',
      'Consult advisor co-pilot',
      'Establish direct development pipeline alerts'
    ]
  }
}

export default function PricingDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const slug = params.slug as string
  const plan = PLANS_DATA[slug] || PLANS_DATA['free']

  const breadcrumbs = [
    { label: 'Pricing', href: '/' },
    { label: plan.name }
  ]

  return (
    <PageShell
      title={plan.name}
      description={plan.tagline}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16 pb-16">
        {/* Plan Hero Banner */}
        <div className="bg-gradient-to-br from-white/5 via-[#4F7CFF]/5 to-transparent border border-white/5 rounded-2xl p-8 sm:p-12 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7B5CFF]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6">
            <span className="px-3 py-1 bg-primary/20 text-[#36D7FF] text-[10px] font-bold rounded-lg uppercase tracking-wider">
              {plan.cycle === 'forever' ? 'FREE FOREVER' : 'PREMIUM WORKSPACE'}
            </span>
            <h2 className="text-4xl font-black text-white leading-tight">
              {plan.name} <br/>
              <span className="text-primary">{plan.price}</span>
              <span className="text-xs text-[#A6B0CF] font-normal"> / {plan.cycle}</span>
            </h2>
            <p className="text-xs text-[#A6B0CF]/80 leading-relaxed font-medium">
              {plan.desc}
            </p>
            <div className="flex gap-4">
              <Link
                href={user ? '/settings?tab=subscription' : '/login'}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
              >
                Get Started <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          <div className="p-6 bg-[#050816] border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Star size={13} className="text-[#36D7FF]" /> Plan Specifics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                <span className="text-[#A6B0CF]">AI Assistant Limit</span>
                <span className="text-white font-bold">{plan.limits.ai}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                <span className="text-[#A6B0CF]">Goal Tracking</span>
                <span className="text-white font-bold">{plan.limits.goals}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                <span className="text-[#A6B0CF]">Analytics Level</span>
                <span className="text-white font-bold">{plan.limits.analytics}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                <span className="text-[#A6B0CF]">Support Level</span>
                <span className="text-white font-bold">{plan.limits.support}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#A6B0CF]">Security Layer</span>
                <span className="text-white font-bold">{plan.limits.security}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Brain size={16} className="text-primary" /> Who this is for
            </h3>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed font-medium">
              {plan.who}
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu size={16} className="text-secondary" /> Daily Workflow Example
            </h3>
            <ul className="space-y-2 text-xs text-[#A6B0CF]/70 font-medium">
              {plan.workflows.map((flow: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={13} className="text-success shrink-0 mt-0.5" />
                  <span>{flow}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 max-w-2xl mx-auto">
          <h3 className="text-sm font-bold text-white text-center uppercase tracking-wider">Frequently Asked Questions</h3>
          <div className="space-y-3">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold text-white">Can I change my plan later?</h4>
              <p className="text-[11px] text-[#A6B0CF]/70 mt-1">Yes, you can upgrade, downgrade, or cancel auto-renewal at any time inside the settings dashboard tab.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold text-white">Are there hidden charges?</h4>
              <p className="text-[11px] text-[#A6B0CF]/70 mt-1">No. Transparency is core to Zero Noise. All pricing is tax-inclusive in invoices and clearly itemized.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
