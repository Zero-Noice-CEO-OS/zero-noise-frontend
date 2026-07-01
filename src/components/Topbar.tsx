'use client'
import { useState } from 'react'
import { Bell, User, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-end px-6 gap-4 z-30">
      <button className="p-2 hover:bg-surface-light dark:hover:bg-gray-800 rounded-full transition-colors duration-150 relative">
        <Bell size={20} strokeWidth={1.5} className="text-text-muted" />
      </button>
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors duration-150"
        >
          <User size={18} strokeWidth={1.5} className="text-primary" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-12 w-48 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card shadow-lg py-1 animate-fade-in">
            <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary dark:text-gray-200 hover:bg-surface-light dark:hover:bg-gray-800">
              <Settings size={16} strokeWidth={1.5} /> Settings
            </Link>
            <button onClick={() => router.push('/login')} className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-surface-light dark:hover:bg-gray-800 w-full text-left">
              <LogOut size={16} strokeWidth={1.5} /> Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
