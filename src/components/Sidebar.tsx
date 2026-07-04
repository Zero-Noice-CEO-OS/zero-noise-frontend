'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard,
  Activity,
  Brain,
  Timer,
  Target,
  ClipboardCheck,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  User,
  LogOut
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/activities', label: 'Activities', icon: Activity },
  { href: '/skills', label: 'Skills', icon: Brain },
  { href: '/deep-work', label: 'Deep Work', icon: Timer },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/reviews', label: 'Reviews', icon: ClipboardCheck },
  { href: '/coach', label: 'Coach', icon: Bot },
  { href: '/subscription', label: 'Subscription', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed, toggleSidebar, isMobileOpen, setMobileOpen } = useTheme()
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [avatar, setAvatar] = useState<string | null>(null)

  // Listen to profile updates
  useEffect(() => {
    if (!user) return
    const stored = localStorage.getItem(`avatar_${user.id}`)
    setAvatar(stored)

    const handleStorageChange = () => {
      setAvatar(localStorage.getItem(`avatar_${user.id}`))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [user])

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'ZN'

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: typeof window !== 'undefined' && window.innerWidth < 768 ? 256 : (sidebarCollapsed ? 80 : 256),
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className={`fixed left-0 top-0 h-full border-r border-border bg-surface dark:bg-[#0B1225] flex flex-col z-50 shadow-card transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo & Toggle Header */}
        <div className="p-6 flex items-center justify-between relative border-b border-border/40">
          {!sidebarCollapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col"
            >
              <h1 className="text-md font-bold tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-1.5">
                <span>ZERO NOISE</span>
              </h1>
              <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-textSecondary">
                CEO OS
              </p>
            </motion.div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white mx-auto shadow-sm">
              ZN
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-7 w-6 h-6 bg-surface dark:bg-surface border border-border rounded-full flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all text-textSecondary hover:text-textPrimary hidden md:flex"
          >
            {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block relative"
              >
                <motion.div
                  whileHover={{ x: 4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-button text-sm font-semibold transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary dark:text-white dark:bg-gradient-to-r dark:from-primary/20 dark:to-secondary/20 dark:border-primary/30 glow-primary'
                      : 'text-textSecondary hover:bg-surface/50 dark:hover:bg-white/5 hover:text-textPrimary border border-transparent'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-gradient-to-b from-primary to-secondary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  <item.icon
                    size={20}
                    strokeWidth={active ? 2.2 : 1.75}
                    className={`transition-colors duration-200 ${
                      active ? 'text-primary dark:text-accent' : 'text-textSecondary group-hover:text-textPrimary'
                    }`}
                  />
                  
                  {/* Keep label visible on mobile drawer even if collapsed state is active on desktop */}
                  {(typeof window !== 'undefined' && window.innerWidth < 768) || !sidebarCollapsed ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  ) : null}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* CEO Score Sparkline Card */}
        {((typeof window !== 'undefined' && window.innerWidth < 768) || !sidebarCollapsed) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 my-2 p-3.5 bg-gradient-to-br from-surface to-background dark:from-surface/20 dark:to-background/20 border border-border/60 rounded-card space-y-2 relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-textSecondary">CEO Score</span>
              <span className="text-success font-extrabold flex items-center gap-0.5">
                <TrendingUp size={11} /> +12%
              </span>
            </div>
            <div className="h-10 w-full">
              <svg viewBox="0 0 100 30" className="w-full h-full text-primary dark:text-accent stroke-current fill-none">
                <path
                  d="M0,25 Q15,10 30,20 T60,5 T90,15 L100,10"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        )}

        {/* User profile footer with Popover */}
        <div className="p-4 border-t border-border relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 w-full text-left focus:outline-none"
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full shrink-0 object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 flex items-center justify-center text-primary dark:text-white shrink-0 overflow-hidden border border-border font-bold text-xs">
                {initials}
              </div>
            )}
            {((typeof window !== 'undefined' && window.innerWidth < 768) || !sidebarCollapsed) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-bold text-textPrimary truncate">{user?.name || 'Teja Reddy'}</p>
                <p className="text-[10px] text-textSecondary truncate font-medium">{user?.role || 'Founder & CEO'}</p>
              </motion.div>
            )}
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-16 left-4 right-4 bg-surface dark:bg-surface border border-border rounded-modal shadow-modal py-1.5 z-50 overflow-hidden text-left"
                >
                  <Link
                    href="/settings"
                    onClick={() => {
                      setProfileOpen(false)
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-textPrimary hover:bg-background/80 transition-all"
                  >
                    <User size={14} className="text-textSecondary" />
                    Profile & Settings
                  </Link>
                  <div className="h-[1px] bg-border my-1" />
                  <button
                    onClick={() => {
                      setProfileOpen(false)
                      setMobileOpen(false)
                      logout()
                    }}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-danger hover:bg-danger/10 w-full text-left transition-all"
                  >
                    <LogOut size={14} />
                    Log Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  )
}
