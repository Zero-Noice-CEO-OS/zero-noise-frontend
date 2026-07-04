'use client'

import PageShell from '@/components/PageShell'
import { Sparkles, Shield, Heart, Award, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function AboutPage() {
  const { user } = useAuth()
  const breadcrumbs = [
    { label: 'Company', href: '#' },
    { label: 'About Us' }
  ]

  const timeline = [
    { year: '2024', title: 'The Genesis', desc: 'Founders of Zero Noise, frustrated by information overload in traditional productivity suites, sketch out an executive-focused OS.' },
    { year: '2025', title: 'AI Integration', desc: 'Introduced the capability benchmarking index and live LLM co-pilot streams to guide calendar schedules.' },
    { year: '2026', title: 'Zero Noise CEO OS v1.0', desc: 'Launched worldwide to enable high-growth leadership performance for startup founders.' }
  ]

  return (
    <PageShell 
      title="About Zero Noise" 
      description="We build professional workspaces for high-performance leaders. No fluff, no distractions, just execution."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-16 pb-12">
        {/* Core story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4F7CFF]/10 text-xs font-bold text-[#36D7FF]">
              <Sparkles size={12} />
              Our Story
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why Zero Noise Exists</h2>
            <p className="text-sm text-[#A6B0CF]/80 leading-relaxed">
              Every day, startup leaders are flooded with distractions. Chat channels, email chains, dashboard noise, and micro-management drag attention away from high-impact strategic tasks.
            </p>
            <p className="text-sm text-[#A6B0CF]/80 leading-relaxed">
              Zero Noise was founded with a singular, clear purpose: to build a high-performance cockpit for chief executives. By uniting Daily Command Center tracking, skills benchmarking, and AI-guided calendar optimization into a single executive dashboard, we help leaders improve 1% every single day.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/5 p-8 rounded-2xl relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F7CFF]/5 rounded-full blur-2xl" />
            <h3 className="text-lg font-bold text-white">How the AI Coach Works</h3>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
              The co-pilot constantly monitors tracked activities, value scores, energy levels, and active goals. When it detects strategic capability gaps or scheduling congestion, it delivers brief, high-impact alerts to protect 90-minute deep work blocks.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-[#A6B0CF]/80 italic">
              &ldquo;Protecting 90 minutes of morning build focus increases overall execution speed by 18%.&rdquo;
            </div>
          </div>
        </div>

        {/* Mission & Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="mission">
          <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <span className="p-3 rounded-xl bg-[#4F7CFF]/15 text-[#36D7FF] inline-block">
              <Shield size={20} />
            </span>
            <h3 className="text-md font-bold text-white">Our Mission</h3>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
              To minimize daily operational noise for startup founders, enabling strategic clarity and compounding leadership speed.
            </p>
          </div>
          
          <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <span className="p-3 rounded-xl bg-[#7B5CFF]/15 text-[#8A63FF] inline-block">
              <Award size={20} />
            </span>
            <h3 className="text-md font-bold text-white">Our Vision</h3>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
              A world where executive performance is structured, measurable, and free from administrative distraction.
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-3">
            <span className="p-3 rounded-xl bg-[#22C55E]/15 text-[#3EE98A] inline-block">
              <Heart size={20} />
            </span>
            <h3 className="text-md font-bold text-white">Core Principles</h3>
            <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
              Privacy-first database architectures, intentional dashboard designs, and clear actionable metrics.
            </p>
          </div>
        </div>

        {/* Why Founders Need This */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-white">Founders Compound Value</h2>
            <p className="text-xs text-[#A6B0CF]/70">Traditional task planners fail to measure execution impact. Zero Noise fixes this.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <div className="flex gap-3">
              <span className="text-primary shrink-0"><Check size={18} /></span>
              <div>
                <h4 className="text-xs font-bold text-white">Time Audit Insights</h4>
                <p className="text-[11px] text-[#A6B0CF]/70 mt-1">Easily log building vs administrative maintain tasks to evaluate daily leverage.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary shrink-0"><Check size={18} /></span>
              <div>
                <h4 className="text-xs font-bold text-white">Deep Work Protection</h4>
                <p className="text-[11px] text-[#A6B0CF]/70 mt-1">Eliminate notifications during crucial strategic blocks and measure output speed.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary shrink-0"><Check size={18} /></span>
              <div>
                <h4 className="text-xs font-bold text-white">Co-Pilot Alignment</h4>
                <p className="text-[11px] text-[#A6B0CF]/70 mt-1">Get timezone-optimized suggestions to coordinate team sprint metrics.</p>
              </div>
            </div>
          </div>
        </div>

        {/* History Timeline */}
        <div className="space-y-8">
          <h2 className="text-xl font-bold text-white">Our Timeline</h2>
          <div className="relative border-l border-white/10 pl-6 ml-4 space-y-8">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative">
                <span className="absolute -left-10 top-0.5 w-8 h-8 rounded-full bg-gradient-to-br from-[#4F7CFF] to-[#7B5CFF] text-white text-[10px] font-bold flex items-center justify-center border-4 border-[#050816]">
                  {idx + 1}
                </span>
                <div className="space-y-1">
                  <span className="text-[#36D7FF] text-xs font-bold">{item.year}</span>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-[#A6B0CF]/70">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 border-t border-white/5 pt-12">
          <h2 className="text-xl font-bold text-white text-center">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold text-white">Is there a free trial?</h4>
              <p className="text-[11px] text-[#A6B0CF]/70 mt-1">Yes, the standard plan is 100% free forever with basic activity logs and focus benchmarks.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <h4 className="text-xs font-bold text-white">How does Zero Noise secure user privacy?</h4>
              <p className="text-[11px] text-[#A6B0CF]/70 mt-1">All audit metrics are stored in a private, encrypted cloud database accessible only to your verified session.</p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="p-8 bg-gradient-to-r from-[#4F7CFF]/15 to-[#7B5CFF]/10 rounded-2xl border border-[#4F7CFF]/20 text-center space-y-4">
          <h3 className="text-lg font-bold text-white">Ready to compound performance?</h3>
          <p className="text-xs text-[#A6B0CF]/70 max-w-sm mx-auto">Create your secure executive cockpit session and initiate deep work logging today.</p>
          <div className="pt-2">
            <Link 
              href={user ? '/dashboard' : '/signup'} 
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
            >
              {user ? 'Enter Cockpit' : 'Start Free'} <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
