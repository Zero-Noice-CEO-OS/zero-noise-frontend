'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Activity, Brain, Timer, Target, ClipboardCheck, Bot, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/activities', label: 'Activities', icon: Activity },
  { href: '/skills', label: 'Skills', icon: Brain },
  { href: '/deep-work', label: 'Deep Work', icon: Timer },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/reviews/daily', label: 'Reviews', icon: ClipboardCheck },
  { href: '/coach', label: 'Coach', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col z-40">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary dark:text-white">Zero Noise</h1>
        <p className="text-xs text-text-muted mt-0.5">CEO OS</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-card text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-primary/10 text-primary dark:text-white dark:bg-primary/20'
                  : 'text-text-muted hover:bg-surface-light dark:hover:bg-gray-800 hover:text-text-primary dark:hover:text-white'
              }`}
            >
              <item.icon size={20} strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
