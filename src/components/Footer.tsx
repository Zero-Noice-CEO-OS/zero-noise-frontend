'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { 
  Sparkles, 
  Linkedin, 
  Github, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  ArrowRight,
  Sun,
  Moon,
  ArrowUp
} from 'lucide-react'

export default function Footer() {
  const { theme, toggle } = useTheme()
  const { user } = useAuth()
  const [productOpen, setProductOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const ctaTarget = user ? '/dashboard' : '/signup'

  return (
    <div className="w-full bg-[#050816] text-[#A6B0CF] border-t border-white/5 font-sans relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#4F7CFF]/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* 1. Premium CTA Section */}
      <div className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-20 pb-16 text-center border-b border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(123,92,255,0.06),transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4F7CFF]/10 border border-[#4F7CFF]/20 text-xs font-bold text-[#36D7FF]">
            <Sparkles size={12} className="animate-pulse" />
            1% Better Every Day
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Become 1% Better Every Day
          </h2>
          
          <p className="text-sm sm:text-base text-[#A6B0CF]/80 leading-relaxed max-w-lg mx-auto font-medium">
            Measure your execution. Improve your capabilities. Compound your leadership.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-sm mx-auto">
            <Link 
              href={ctaTarget} 
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              {user ? 'Enter Cockpit' : 'Start Free'} <ArrowRight size={15} />
            </Link>
            <Link 
              href="/about" 
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all backdrop-blur-md"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Link Grid */}
      <footer className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-20 pb-12">
        {/* Desktop & Tablet grid, Mobile Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16">
          
          {/* Brand Info (Column 1) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-gradient-to-br from-[#4F7CFF] to-[#7B5CFF] text-white font-extrabold text-sm shadow-sm">ZN</span>
              <div>
                <span className="text-md font-extrabold tracking-tight text-white block">Zero Noise CEO OS</span>
              </div>
            </div>
            
            <p className="text-sm text-[#A6B0CF]/70 leading-relaxed max-w-sm font-medium">
              AI-powered Founder Performance System helping leaders improve 1% every day.
            </p>

            <div className="flex items-center gap-3">
              <Link 
                href={ctaTarget} 
                className="px-4 py-2 rounded-xl bg-[#22C55E]/25 text-[#3EE98A] border border-[#22C55E]/40 hover:bg-[#22C55E]/35 text-xs font-bold transition-all flex items-center gap-1"
              >
                {user ? 'Enter Cockpit' : 'Start Free'} <ArrowRight size={13} />
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all"
              >
                Contact Us
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-all"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Collapsible Column 2: Product */}
          <div className="space-y-4">
            {/* Mobile Button, Desktop Heading */}
            <div className="flex items-center justify-between md:block">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Product</h3>
              <button 
                onClick={() => setProductOpen(!productOpen)}
                className="md:hidden p-1 text-[#A6B0CF] hover:text-white"
              >
                {productOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            
            <ul className={`space-y-2.5 text-sm md:block ${productOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Dashboard</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/coach" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>AI Coach</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Daily Command Center</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Activity Intelligence</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/skills" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Capability Engine</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/deep-work" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Deep Work</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/goals" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Goal System</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Reviews</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#A6B0CF]/50">Pricing</span>
                <span className="text-[9px] uppercase tracking-widest bg-white/10 text-white/60 px-1.5 py-0.5 rounded">Coming Soon</span>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Roadmap</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Collapsible Column 3: Resources */}
          <div className="space-y-4">
            <div className="flex items-center justify-between md:block">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h3>
              <button 
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="md:hidden p-1 text-[#A6B0CF] hover:text-white"
              >
                {resourcesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            
            <ul className={`space-y-2.5 text-sm md:block ${resourcesOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link href="/documentation" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Documentation</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Help Center</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>FAQ</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Blog</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/release-notes" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Release Notes</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/features-requests" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Feature Requests</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/bug-report" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Report a Bug</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Status</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Collapsible Column 4: Company */}
          <div className="space-y-4">
            <div className="flex items-center justify-between md:block">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Company</h3>
              <button 
                onClick={() => setCompanyOpen(!companyOpen)}
                className="md:hidden p-1 text-[#A6B0CF] hover:text-white"
              >
                {companyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            
            <ul className={`space-y-2.5 text-sm md:block ${companyOpen ? 'block' : 'hidden'}`}>
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>About Us</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/about#mission" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Our Mission</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Privacy Policy</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Terms of Service</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Security</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center justify-between group">
                  <span>Contact</span>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#36D7FF]" />
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#A6B0CF]/50">Careers</span>
                <span className="text-[9px] uppercase tracking-widest bg-white/10 text-white/60 px-1.5 py-0.5 rounded">Coming Soon</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Footer Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#A6B0CF]/60">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span>© 2026 Zero Noise CEO OS. All rights reserved.</span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span className="text-white/40">Made for founders who want to compound performance every day.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-white/40">Version 1.0.0</span>
            <button 
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-[#36D7FF] transition-all flex items-center gap-1"
              title="Back to Top"
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
