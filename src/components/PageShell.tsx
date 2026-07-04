'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageShellProps {
  title: string
  description?: string
  breadcrumbs: BreadcrumbItem[]
  children: React.ReactNode
}

export default function PageShell({ title, description, breadcrumbs, children }: PageShellProps) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#050816] text-[#A6B0CF] font-sans flex flex-col transition-colors duration-500 overflow-x-hidden relative">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#4F7CFF]/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-1/4 w-[400px] h-[300px] bg-[#7B5CFF]/5 blur-[100px] pointer-events-none -z-10" />
      
      {/* Navigation Header */}
      <header className="border-b border-white/5 bg-[#050816]/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-br from-[#4F7CFF] to-[#7B5CFF] text-white font-extrabold text-[10px]">ZN</span>
            <span className="text-xs font-bold text-white tracking-tight">Zero Noise CEO OS</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white hover:opacity-90 active:scale-95 transition-all">
                Enter Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-xs font-semibold text-[#A6B0CF] hover:text-white transition-colors">
                  Log In
                </Link>
                <Link href="/signup" className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white hover:opacity-90 active:scale-95 transition-all">
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-10 flex flex-col space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#A6B0CF]/60">
          <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
            <Home size={12} />
            Home
          </Link>
          {breadcrumbs.map((item, idx) => {
            let itemHref = item.href;
            if (item.label.toLowerCase() === 'resources') {
              itemHref = '/documentation'; // Default landing resources page in code
            }
            return (
              <React.Fragment key={idx}>
                <ChevronRight size={10} className="text-white/20" />
                {itemHref ? (
                  <Link href={itemHref} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-[#36D7FF] font-semibold">{item.label}</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Hero Header */}
        <div className="space-y-2 border-b border-white/5 pb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-[#A6B0CF]/70 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 py-4">
          {children}
        </div>
      </main>

      {/* Footer inclusion */}
      <footer className="border-t border-white/5 bg-[#050816] mt-auto">
        <div className="max-w-[1280px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A6B0CF]/60">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-white/5 text-white font-extrabold text-[9px]">ZN</span>
            <span>© 2026 Zero Noise CEO OS</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/security" className="hover:text-white">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
