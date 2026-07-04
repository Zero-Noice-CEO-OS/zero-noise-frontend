'use client'

import { useState, useEffect } from 'react'
import { Bell, Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationsList, useUnreadNotificationsCount, useMarkReadMutation, useMarkAllReadMutation } from '@/hooks/useNotifications'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { subscriptionService } from '@/services/subscription-service'

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false)
  const { theme, toggle, sidebarCollapsed, toggleSidebar, toggleMobileOpen } = useTheme()
  const { user } = useAuth()
  const [avatar, setAvatar] = useState<string | null>(null)

  // Listen to profile updates
  useEffect(() => {
    if (!user) return
    setAvatar(localStorage.getItem(`avatar_${user.id}`))
    const handleStorageChange = () => {
      setAvatar(localStorage.getItem(`avatar_${user.id}`))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [user])

  // Queries & Mutations
  const countQuery = useUnreadNotificationsCount()
  const listQuery = useNotificationsList({ page: 1, limit: 5 })
  const markReadMutation = useMarkReadMutation()
  const markAllReadMutation = useMarkAllReadMutation()

  const subQuery = useQuery({
    queryKey: ['subscription-details'],
    queryFn: () => subscriptionService.getDetails(),
    enabled: !!user,
  })

  const activePlan = subQuery.data?.subscription?.plan || 'Free'

  const unreadCount = countQuery.data?.count ?? 0
  const notifications = listQuery.data?.data ?? []

  // Push notifications side-effect
  const [notifiedIds, setNotifiedIds] = useState<string[]>([])
  useEffect(() => {
    if (notifications.length > 0 && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      notifications.forEach(item => {
        if (item.status === 'UNREAD' && !notifiedIds.includes(item.id)) {
          new Notification(item.title, { body: item.message })
          setNotifiedIds(prev => [...prev, item.id])
        }
      })
    }
  }, [notifications, notifiedIds])

  const handleMarkRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id)
    } catch (e) {
      console.error(e)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync()
    } catch (e) {
      console.error(e)
    }
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 1)
    : 'T'

  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-surface/70 dark:bg-background/60 backdrop-blur-xl border-b border-border flex items-center justify-between px-6 z-30 transition-all duration-300 ${
        sidebarCollapsed ? 'md:left-20 left-0' : 'md:left-64 left-0'
      }`}
    >
      {/* Hamburger Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              toggleMobileOpen()
            } else {
              toggleSidebar()
            }
          }}
          className="p-2 hover:bg-surface/50 dark:hover:bg-white/5 rounded-full transition-all text-textSecondary hover:text-textPrimary"
          title="Toggle Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Brand logo (visible always in center) */}
      <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
        <span className="p-1 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-[10px]">ZN</span>
        <span className="text-xs font-bold text-textPrimary tracking-tight">Zero Noise</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Switcher Button */}
        <button
          onClick={toggle}
          className="p-2 hover:bg-surface/50 dark:hover:bg-white/5 rounded-full transition-all duration-200 text-textSecondary hover:text-textPrimary border border-transparent hover:border-border/40"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={18} strokeWidth={1.75} className="text-warning" />
          ) : (
            <Moon size={18} strokeWidth={1.75} className="text-primary" />
          )}
        </button>

        {/* Notifications Icon with dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 hover:bg-surface/50 dark:hover:bg-white/5 rounded-full transition-all duration-200 text-textSecondary hover:text-textPrimary relative border border-transparent hover:border-border/40"
          >
            <Bell size={18} strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-danger text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ring-2 ring-surface scale-90">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 w-80 bg-surface dark:bg-surface border border-border rounded-modal shadow-modal py-3 z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-border">
                    <span className="text-xs font-bold text-textPrimary uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        disabled={markAllReadMutation.isPending}
                        className="text-[10px] text-primary font-bold hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[300px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-[11px] text-textSecondary italic text-center py-8">No notifications found.</p>
                    ) : (
                      notifications.map((item) => {
                        const isUnread = item.status === 'UNREAD'
                        return (
                          <div
                            key={item.id}
                            onClick={() => isUnread && handleMarkRead(item.id)}
                            className={`px-4 py-3 border-b border-border/40 last:border-0 hover:bg-background/80 transition-all text-left cursor-pointer ${
                              isUnread ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <p className="text-xs font-bold text-textPrimary line-clamp-1">{item.title}</p>
                              {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                            </div>
                            <p className="text-[10px] text-textSecondary mt-1 leading-relaxed">{item.message}</p>
                          </div>
                        )
                      })
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <Link href="/settings" className="ml-1 focus:outline-none relative group">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#E5E9F0] dark:bg-[#2E3440] text-[#4C566A] dark:text-[#E5E9F0] flex items-center justify-center font-extrabold text-xs border border-border">
              {initials}
            </div>
          )}
          {(() => {
            const getBadgeDetails = (plan: string) => {
              switch (plan) {
                case 'Starter':
                  return { label: 'STARTER', color: 'bg-indigo-600 text-white border-indigo-700' }
                case 'Founder Pro':
                  return { label: 'PRO', color: 'bg-emerald-600 text-white border-emerald-700' }
                case 'Founder Elite':
                  return { label: 'ELITE', color: 'bg-rose-600 text-white border-rose-700' }
                case 'Lifetime Founder':
                  return { label: 'LIFETIME', color: 'bg-amber-500 text-black border-amber-600' }
                default:
                  return null
              }
            }
            const b = getBadgeDetails(activePlan)
            if (!b) return null
            return (
              <span className={`absolute -top-1.5 -right-1.5 text-[6px] font-black px-1.5 py-0.5 rounded-full border shadow-sm tracking-wider scale-90 select-none ${b.color}`}>
                {b.label}
              </span>
            )
          })()}
        </Link>
      </div>
    </header>
  )
}
