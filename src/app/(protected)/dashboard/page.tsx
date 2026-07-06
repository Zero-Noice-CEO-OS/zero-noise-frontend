'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Timer, Target, Brain, Plus, Play, Calendar, Zap, MessageSquare, TrendingUp, CheckCircle2, ChevronRight } from 'lucide-react'
import Modal from '@/components/Modal'
import { useAuth } from '@/context/AuthContext'
import { useDashboardSummary, useDashboardToday, useDashboardWeek, useDashboardAnalytics } from '@/hooks/useDashboard'
import { useCreateActivityMutation } from '@/hooks/useActivities'

export default function Dashboard() {
  const [activityModal, setActivityModal] = useState(false)
  const [actTitle, setActTitle] = useState('')
  const [actCategory, setActCategory] = useState<'Build' | 'Sell' | 'Lead' | 'Learn' | 'Maintain' | 'Waste'>('Build')
  const [actDuration, setActDuration] = useState(45)
  const [actValueScore, setActValueScore] = useState(8)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const createActivityMutation = useCreateActivityMutation()
  const { user } = useAuth()
  const [avatar, setAvatar] = useState<string | null>(null)

  useState(() => {
    if (typeof window !== 'undefined' && user) {
      setAvatar(localStorage.getItem(`avatar_${user.id}`))
    }
  })

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!actTitle.trim()) return
    try {
      await createActivityMutation.mutateAsync({
        title: actTitle,
        category: actCategory,
        durationMinutes: Number(actDuration),
        valueScore: Number(actValueScore)
      })
      setSaveSuccess(true)
      setTimeout(() => {
        setActivityModal(false)
        setSaveSuccess(false)
        setActTitle('')
      }, 1000)
    } catch (err) {
      console.error(err)
    }
  }

  // Queries
  const summaryQuery = useDashboardSummary()
  const todayOverviewQuery = useDashboardToday()
  const weekOverviewQuery = useDashboardWeek()
  const analyticsQuery = useDashboardAnalytics()

  // Current Date formatting
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Stagger variants for page cards load
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } }
  }

  const formatMinutes = (minutes: number) => {
    if (!minutes) return '0h 0m'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}h ${m}m`
  }

  const isLoading = summaryQuery.isLoading || todayOverviewQuery.isLoading || weekOverviewQuery.isLoading || analyticsQuery.isLoading

  if (isLoading) {
    return (
      <div className="space-y-8 pb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="h-3 w-32 bg-border/40 rounded animate-pulse" />
            <div className="h-8 w-64 bg-border/40 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-56 bg-surface/50 border border-border rounded-card p-5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[390px] bg-surface/50 border border-border rounded-card p-6 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const summary = summaryQuery.data
  const todayOverview = todayOverviewQuery.data
  const weekOverview = weekOverviewQuery.data
  const analytics = analyticsQuery.data

  const ceoScore = summary?.currentCeoScore ?? 0
  const energy = summary?.energy ?? 0
  const topPriority = summary?.topPriorities?.[0] || 'No top priorities set for today.'
  const currentStreak = summary?.currentStreak ?? 0
  const currentCapability = summary?.currentCapability ?? 0

  // Format today's deep work
  const deepWorkMinutes = todayOverview?.deepWorkSummary?.totalMinutes ?? 0
  const deepWorkTarget = 180 // 3 hours
  const deepWorkPercent = Math.min(100, Math.round((deepWorkMinutes / deepWorkTarget) * 100))

  return (
    <div className="space-y-8 pb-16">
      {/* Top Welcome / Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center font-extrabold text-primary border border-border text-sm">
              {user?.name
                ? user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : 'ZN'}
            </div>
          )}
          <div>
            <p className="text-[10px] text-textSecondary uppercase tracking-[0.2em] font-extrabold">{todayDate}</p>
            <h1 className="text-2xl font-extrabold tracking-tight mt-0.5 text-textPrimary">
              {(() => {
                const hours = new Date().getHours()
                if (hours >= 6 && hours < 12) return 'Good Morning'
                if (hours >= 12 && hours < 16) return 'Good Afternoon'
                if (hours >= 16 && hours < 22) return 'Good Evening'
                return 'Good Night'
              })()}, {user?.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-xs text-textSecondary mt-0.5">Focus on what matters. Execute with clarity.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivityModal(true)}
            className="px-4 py-2.5 rounded-button bg-surface border border-border text-textPrimary hover:bg-background/80 hover:scale-[1.02] active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} strokeWidth={2.2} /> Add Activity
          </button>
          <Link
            href="/deep-work"
            className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Play size={16} strokeWidth={2.2} /> Start Deep Work
          </Link>
        </div>
      </div>

      {/* Top Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {/* CEO Score Gauge */}
        <motion.div variants={cardVariants} className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:-translate-y-1 hover:shadow-hover hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-56 relative group overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">CEO Score</span>
            <span className="text-[10px] font-extrabold text-success flex items-center gap-0.5">
              <TrendingUp size={10} /> Active
            </span>
          </div>
          <div className="flex items-center justify-center my-2 relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="36"
                className="stroke-background dark:stroke-border/40"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="36"
                className="stroke-primary"
                strokeWidth="7"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - ceoScore / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-textPrimary">{ceoScore}</span>
              <span className="text-[10px] text-textSecondary block -mt-1">/100</span>
            </div>
          </div>
          <p className="text-[9px] text-center text-textSecondary font-semibold">calculated daily</p>
        </motion.div>

        {/* Deep Work Today */}
        <motion.div variants={cardVariants} className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:-translate-y-1 hover:shadow-hover hover:border-accent/20 transition-all duration-300 flex flex-col justify-between h-56">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">Deep Work Today</span>
            <span className="text-[9px] font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              {deepWorkPercent}% On Track
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-textPrimary">{formatMinutes(deepWorkMinutes)}</h3>
            <p className="text-[10px] text-textSecondary font-semibold">/ 3h Daily Goal</p>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-background dark:bg-border/60 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${deepWorkPercent}%` }} />
            </div>
            <p className="text-[9px] text-textSecondary font-semibold">
              {deepWorkMinutes >= deepWorkTarget ? 'Goal achieved!' : `${deepWorkTarget - deepWorkMinutes} min remaining`}
            </p>
          </div>
        </motion.div>

        {/* Energy Score */}
        <motion.div variants={cardVariants} className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:-translate-y-1 hover:shadow-hover hover:border-success/20 transition-all duration-300 flex flex-col justify-between h-56">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">Energy Level</span>
            <span className="text-[9px] font-extrabold text-success bg-success/15 px-2 py-0.5 rounded-full">
              {energy >= 7 ? 'Good' : energy >= 4 ? 'Moderate' : 'Low'}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-textPrimary">{energy} <span className="text-xs font-semibold text-textSecondary">/10</span></h3>
            <p className="text-[10px] text-textSecondary font-semibold">Calculated at morning check-in</p>
          </div>
          <div className="flex gap-1.5 justify-center py-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
              <span
                key={dot}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  dot <= energy
                    ? 'bg-success scale-105 shadow-sm'
                    : dot === energy + 1
                    ? 'bg-success/40'
                    : 'bg-background dark:bg-border/60'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Top Priority */}
        <motion.div variants={cardVariants} className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:-translate-y-1 hover:shadow-hover hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-56">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">Top Priority</span>
            <span className="text-xs text-textSecondary font-extrabold">Active</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-textPrimary line-clamp-3 leading-snug">
              {topPriority}
            </h3>
            <p className="text-[10px] text-textSecondary font-semibold">Today&apos;s goal</p>
          </div>
          <div className="h-2.5 bg-background dark:bg-border/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" style={{ width: topPriority !== 'No top priorities set for today.' ? '100%' : '0%' }} />
          </div>
        </motion.div>

        {/* Current Skill / Capability */}
        <motion.div variants={cardVariants} className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:-translate-y-1 hover:shadow-hover hover:border-secondary/20 transition-all duration-300 flex flex-col justify-between h-56">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-textSecondary">Capability Index</span>
            <span className="text-[9px] text-success bg-success/10 font-bold px-2 py-0.5 rounded-full">
              Level {Math.round(currentCapability * 100) / 100}
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="text-md font-bold text-textPrimary truncate">
              Focus Streak
            </h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-primary">{currentStreak} Days</span>
              <span className="text-xs text-success font-bold">🔥</span>
            </div>
          </div>
          <div className="h-1.5 bg-background dark:bg-border/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${Math.min(100, currentStreak * 10)}%` }} />
          </div>
        </motion.div>
      </motion.div>

      {/* Middle Section: Timeline / Donut Allocation / Goal Progress */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Today's Schedule */}
        <motion.div variants={cardVariants} className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-textPrimary flex items-center gap-2">
                <Calendar size={16} className="text-primary" /> Today&apos;s Plan
              </h2>
              <span className="text-[10px] text-textSecondary font-bold bg-background dark:bg-white/5 px-2 py-0.5 rounded-full border border-border">Scheduled</span>
            </div>
            <div className="space-y-3.5 overflow-y-auto max-h-[250px] pr-1">
              {todayOverview?.morningCheckIn ? (
                <div className="space-y-3.5">
                  <div className="flex gap-4 items-start">
                    <span className="text-[10px] font-bold text-textSecondary w-14 shrink-0 mt-0.5">Morning</span>
                    <div className="flex-1 pl-3 border-l-2 border-primary/20">
                      <p className="text-xs font-bold text-textPrimary">Morning Check-in</p>
                      <p className="text-[10px] text-textSecondary">Energy: {todayOverview.morningCheckIn.energy}/10 • Skill Focus: {todayOverview.morningCheckIn.mainSkill || 'None'}</p>
                    </div>
                  </div>
                  {Array.isArray(summary?.topPriorities) && summary.topPriorities.map((priority: string, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <span className="text-[10px] font-bold text-textSecondary w-14 shrink-0 mt-0.5">Priority #{idx + 1}</span>
                      <div className="flex-1 pl-3 border-l-2 border-accent/20">
                        <p className="text-xs font-bold text-textPrimary">{priority}</p>
                        <p className="text-[10px] text-textSecondary">Execution Target</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <p className="text-xs text-textSecondary font-semibold">Morning check-in is pending.</p>
                  <Link href="/reviews" className="inline-block px-3 py-1.5 text-[10px] font-bold text-white bg-primary rounded-button shadow-sm">
                    Complete Check-in
                  </Link>
                </div>
              )}
            </div>
          </div>
          <Link href="/activities" className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-2">
            View Full Schedule <ChevronRight size={12} />
          </Link>
        </motion.div>

        {/* Time Allocation Custom Visualizer */}
        <motion.div variants={cardVariants} className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between h-[390px]">
          <div>
            <h2 className="text-sm font-extrabold text-textPrimary mb-4">Time Allocation</h2>
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                {[
                  { label: 'Deep Work', minutes: todayOverview?.deepWorkSummary?.totalMinutes ?? 0, color: 'bg-primary' },
                  { label: 'Other Activities', minutes: todayOverview?.activitiesSummary?.totalMinutes ?? 0, color: 'bg-accent' },
                ].map((leg, idx) => {
                  const total = (todayOverview?.deepWorkSummary?.totalMinutes ?? 0) + (todayOverview?.activitiesSummary?.totalMinutes ?? 0)
                  const percent = total > 0 ? Math.round((leg.minutes / total) * 100) : 0
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${leg.color}`} />
                          <span className="text-textSecondary">{leg.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-textPrimary">
                          <span>{formatMinutes(leg.minutes)}</span>
                          <span className="text-textSecondary text-[10px] font-bold">({percent}%)</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-background dark:bg-border/60 rounded-full overflow-hidden">
                        <div className={`h-full ${leg.color} rounded-full`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <Link href="/activities" className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-2">
            View Analytics <ChevronRight size={12} />
          </Link>
        </motion.div>

        {/* Custom Capability Radar Visualizer Card */}
        <motion.div variants={cardVariants} className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between h-[390px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-textPrimary">Capability Index</h2>
              <span className="text-[10px] text-textSecondary font-bold bg-background dark:bg-white/5 px-2.5 py-0.5 rounded-full border border-border">Core skills</span>
            </div>
            {/* Visual Custom Polygon SVG for Radar Index */}
            <div className="relative h-44 w-full flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-40 h-40">
                {/* Outer grid */}
                <polygon points="50,5 95,38 78,90 22,90 5,38" className="stroke-border dark:stroke-border/40 fill-none" strokeWidth="0.5" />
                <polygon points="50,20 83,44 71,80 29,80 17,44" className="stroke-border dark:stroke-border/40 fill-none" strokeWidth="0.5" />
                <polygon points="50,35 71,50 63,70 37,70 29,50" className="stroke-border dark:stroke-border/40 fill-none" strokeWidth="0.5" />
                
                {/* Center lines */}
                <line x1="50" y1="50" x2="50" y2="5" className="stroke-border dark:stroke-border/40" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="95" y2="38" className="stroke-border dark:stroke-border/40" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="78" y2="90" className="stroke-border dark:stroke-border/40" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="22" y2="90" className="stroke-border dark:stroke-border/40" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="5" y2="38" className="stroke-border dark:stroke-border/40" strokeWidth="0.5" />

                {/* Score Polygon overlay */}
                <polygon points="50,20 86,40 70,82 32,76 15,41" className="stroke-primary fill-primary/10 dark:fill-primary/20 animate-pulse-ring" strokeWidth="2" />
              </svg>
              {/* Simple Legend labels overlay */}
              <div className="absolute top-1 text-[8px] font-bold text-textSecondary uppercase">Strategy</div>
              <div className="absolute right-1 top-[42%] text-[8px] font-bold text-textSecondary uppercase">Speed</div>
              <div className="absolute right-4 bottom-2 text-[8px] font-bold text-textSecondary uppercase">Quality</div>
              <div className="absolute left-4 bottom-2 text-[8px] font-bold text-textSecondary uppercase">Focus</div>
              <div className="absolute left-1 top-[42%] text-[8px] font-bold text-textSecondary uppercase">Scale</div>
            </div>
            
            <div className="space-y-1.5 pt-2 text-[11px] font-semibold text-textSecondary">
              <div className="flex justify-between">
                <span>Overall capability score</span>
                <span className="text-textPrimary">{Math.round(currentCapability * 10) / 10}/10</span>
              </div>
              <div className="flex justify-between">
                <span>Active skills tracking</span>
                <span className="text-textPrimary">{analytics?.skillDistribution?.length || 0} skills</span>
              </div>
            </div>
          </div>
          <Link href="/skills" className="text-xs text-primary font-bold hover:underline flex items-center gap-1 self-start mt-2">
            Audit Skills <ChevronRight size={12} />
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom Section: AI Recommendation & Recent Activities & Weekly performance */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* AI Recommendation Card */}
        <motion.div variants={cardVariants} className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border border-primary/20 dark:border-primary/30 flex flex-col justify-between p-6 rounded-card shadow-card hover:shadow-hover transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-primary text-white shadow-sm flex items-center justify-center">
                <Brain size={18} strokeWidth={2.2} />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-textPrimary">AI Coach Insight</h2>
                <p className="text-[10px] text-textSecondary font-bold">Personalized CEO OS recommendation</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-textPrimary font-medium">
              {summary?.aiReady 
                ? "Your dashboard context is updated. Your AI Coach predicts optimal execution periods. Go to the Coach cockpit to review strategic priorities."
                : "Welcome to Zero Noise. Complete your daily reflection and log deep work blocks to generate dynamic AI coaching recommendations."
              }
            </p>
          </div>
          <div className="pt-6">
            <Link href="/coach" className="px-4 py-2.5 rounded-button bg-primary hover:bg-primary-hover text-white flex items-center gap-2 text-xs font-bold w-fit shadow-md hover:scale-[1.02] active:scale-95 transition-all">
              <MessageSquare size={14} /> Chat with Coach
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions & Recent Activities list */}
        <motion.div variants={cardVariants} className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-textPrimary">Recent Reviews & Logs</h2>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="font-bold text-textPrimary">Daily Reflection</p>
                  <p className="text-textSecondary text-[10px]">{summary?.latestReview ? new Date(summary.latestReview.date).toLocaleDateString() : 'Today'}</p>
                </div>
                <span className="text-[10px] text-success font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} strokeWidth={2.2} /> {summary?.latestReview ? 'Logged' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="font-bold text-textPrimary">Active Goals</p>
                  <p className="text-textSecondary text-[10px]">Current Target</p>
                </div>
                <span className="text-[10px] text-success font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} strokeWidth={2.2} /> {summary?.currentGoalsCount || 0} active
                </span>
              </div>
            </div>
          </div>
          <Link href="/reviews" className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-2">
            View All Reviews <ChevronRight size={12} />
          </Link>
        </motion.div>
      </motion.div>

      {/* Activity Add Modal */}
      <Modal open={activityModal} onClose={() => setActivityModal(false)} title="Add Activity">
        {saveSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-textPrimary">Activity Logged Successfully!</h3>
            <p className="text-xs text-textSecondary">Your metrics are refreshing in the background...</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSaveActivity}>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Title</label>
              <input
                required
                value={actTitle}
                onChange={e => setActTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                placeholder="Activity name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Category</label>
              <select
                value={actCategory}
                onChange={e => setActCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              >
                <option value="Build">Build</option>
                <option value="Sell">Sell</option>
                <option value="Lead">Lead</option>
                <option value="Learn">Learn</option>
                <option value="Maintain">Maintain</option>
                <option value="Waste">Waste</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Duration (min)</label>
                <input
                  required
                  type="number"
                  value={actDuration}
                  onChange={e => setActDuration(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                  placeholder="60"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Value Score (1-10)</label>
                <input
                  required
                  type="number"
                  value={actValueScore}
                  onChange={e => setActValueScore(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                  placeholder="8"
                  min="1"
                  max="10"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
              <button type="button" onClick={() => setActivityModal(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
              <button
                type="submit"
                disabled={createActivityMutation.isPending}
                className="px-4 py-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
              >
                {createActivityMutation.isPending ? 'Saving...' : 'Save Activity'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
