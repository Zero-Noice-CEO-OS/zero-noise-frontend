'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Award,
  Flame,
  RefreshCw,
  Send,
  Lock,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  BookOpen
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReviews, useGenerateReviewMutation } from '@/hooks/useReviews'
import { useSkills } from '@/hooks/useSkills'
import { useDashboardToday } from '@/hooks/useDashboard'

export default function ReviewsHub() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  // Local Time YYYY-MM-DD Date tracker
  const getLocalDateString = (d = new Date()) => {
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60 * 1000)
    return local.toISOString().split('T')[0]
  }

  const todayStr = getLocalDateString()
  const [selectedDate, setSelectedDate] = useState(todayStr)

  // Fetch reviews list & generator mutation
  const reviewsQuery = useReviews({ limit: 100 })
  const generateReviewMutation = useGenerateReviewMutation()
  const todayOverviewQuery = useDashboardToday() // today's actual stats from backend

  // Form States for Daily Review Reflection
  const [wins, setWins] = useState('')
  const [misses, setMisses] = useState('')
  const [achievement, setAchievement] = useState('')
  const [challenge, setChallenge] = useState('')
  const [lessons, setLessons] = useState('')
  const [tomorrowPriorities, setTomorrowPriorities] = useState('')
  const [energy, setEnergy] = useState<number>(7)
  const [quickNote, setQuickNote] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // Filter reviews by tab
  const reviews = reviewsQuery.data?.data || []
  const dailyReviews = reviews.filter(r => r.type === 'Daily')
  const weeklyReviews = reviews.filter(r => r.type === 'Weekly')
  const monthlyReviews = reviews.filter(r => r.type === 'Monthly')

  // Find if selectedDate already has a submitted Daily Review
  const currentDailyReview = dailyReviews.find(r => {
    try {
      return r.date.split('T')[0] === selectedDate
    } catch {
      return false
    }
  })

  // Load draft reflection answers if review exists
  useEffect(() => {
    if (currentDailyReview) {
      const recs = currentDailyReview.recommendations as any
      if (recs && recs.reflection) {
        setWins(recs.reflection.wins || '')
        setMisses(recs.reflection.misses || '')
        setAchievement(recs.reflection.achievement || '')
        setChallenge(recs.reflection.challenge || '')
        setLessons(recs.reflection.lessons || '')
        setTomorrowPriorities(recs.reflection.tomorrowPriorities || '')
        setEnergy(recs.stats?.energy || 7)
      }
    } else {
      // Clear forms for new entries
      setWins('')
      setMisses('')
      setAchievement('')
      setChallenge('')
      setLessons('')
      setTomorrowPriorities('')
      setEnergy(7)
    }
  }, [currentDailyReview, selectedDate])

  const handleDailySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await generateReviewMutation.mutateAsync({
        type: 'Daily',
        date: selectedDate,
        reflectionData: {
          wins,
          misses,
          achievement,
          challenge,
          lessons,
          tomorrowPriorities,
          energy
        }
      })
      setIsEditing(false)
      reviewsQuery.refetch()
    } catch (err) {
      console.error(err)
    }
  }

  const handleWeeklyGenerate = async () => {
    try {
      await generateReviewMutation.mutateAsync({ type: 'Weekly', date: todayStr })
      reviewsQuery.refetch()
    } catch (e) {
      console.error(e)
    }
  }

  const handleMonthlyGenerate = async () => {
    try {
      await generateReviewMutation.mutateAsync({ type: 'Monthly', date: todayStr })
      reviewsQuery.refetch()
    } catch (e) {
      console.error(e)
    }
  }

  // Calculate actual stats for today from the overview query
  const todayStats = {
    ceoScore: todayOverviewQuery.data?.ceoScore ?? 70,
    energy: energy,
    deepWorkMinutes: todayOverviewQuery.data?.deepWorkSummary?.totalMinutes ?? 0,
    activitiesCount: todayOverviewQuery.data?.activitiesSummary?.count ?? 0,
    goalsAdvanced: todayOverviewQuery.data?.skillPractice?.length ? 1 : 0
  }

  const formatMinutes = (mins: number) => {
    if (!mins) return '0h 0m'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}m`
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Executive Reviews</h1>
        <p className="text-xs text-textSecondary mt-1">Reflect on execution velocity, align objectives, and extract insights.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: 'daily', label: 'Daily Reflection' },
          { id: 'weekly', label: 'Weekly Summary' },
          { id: 'monthly', label: 'Monthly Audit' }
        ].map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-bold transition-all relative ${
                active ? 'text-primary dark:text-white' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {tab.label}
              {active && (
                <motion.div
                  layoutId="reviews-active-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab 1: Daily Reflection */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left/Middle: Reflection Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* If NOT generated/locked for the day - Display Reflection Questionnaire */}
            {!currentDailyReview || isEditing ? (
              <form onSubmit={handleDailySubmit} className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-6">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div>
                    <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">End-of-Day Reflection</h2>
                    <p className="text-[10px] text-textSecondary mt-1">Answer honestly to extract clean execution scores.</p>
                  </div>
                  <span className="text-xs font-extrabold text-textSecondary bg-surface/85 px-3.5 py-1.5 rounded-full border border-border">
                    Date: {selectedDate}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">What went well today?</label>
                    <textarea
                      required
                      value={wins}
                      onChange={(e) => setWins(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      rows={2}
                      placeholder="Identified wins, shipped modules, resolved issues..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">What didn't go well?</label>
                    <textarea
                      required
                      value={misses}
                      onChange={(e) => setMisses(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      rows={2}
                      placeholder="Distractions, dependency blockers, skipped tasks..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Biggest achievement</label>
                      <input
                        required
                        value={achievement}
                        onChange={(e) => setAchievement(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                        placeholder="Single major highlight"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Biggest challenge</label>
                      <input
                        required
                        value={challenge}
                        onChange={(e) => setChallenge(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                        placeholder="Key blocker or friction point"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">One improvement</label>
                    <input
                      required
                      value={lessons}
                      onChange={(e) => setLessons(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      placeholder="Tactical adjustment for the next session"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Top priorities for tomorrow</label>
                    <input
                      required
                      value={tomorrowPriorities}
                      onChange={(e) => setTomorrowPriorities(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      placeholder="e.g. Complete review screen, schedule pitch"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-button bg-surface border border-border text-textSecondary text-xs font-bold hover:bg-background/80 transition-all"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button type="button" onClick={() => { setWins(''); setMisses(''); }} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Save Draft</button>
                  <button
                    type="submit"
                    disabled={generateReviewMutation.isPending}
                    className="px-4 py-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Send size={13} /> {generateReviewMutation.isPending ? 'Locking...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            ) : (
              /* Read-only Mode (Locked Daily Review View) */
              <div className="space-y-6 animate-fade-in">
                
                {/* Submitted Alert */}
                <div className="bg-success/10 border border-success/20 text-success text-xs font-semibold px-4 py-3 rounded-card flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} /> Review submitted successfully
                  </span>
                  <span className="flex items-center gap-1 bg-success/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold">
                    <Lock size={11} /> Locked
                  </span>
                </div>

                {/* AI Coach Summary Card */}
                <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-6 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary animate-pulse" />
                      <h3 className="text-sm font-extrabold text-textPrimary uppercase tracking-wider">AI Coach Summary</h3>
                    </div>
                    <button
                      onClick={() => generateReviewMutation.mutateAsync({ type: 'Daily', date: selectedDate })}
                      disabled={generateReviewMutation.isPending}
                      className="px-3 py-1.5 rounded bg-surface border border-border text-textSecondary text-[10px] font-bold hover:bg-background hover:text-textPrimary transition-all flex items-center gap-1 shadow-sm"
                    >
                      <RefreshCw size={11} className={generateReviewMutation.isPending ? 'animate-spin' : ''} /> Regenerate
                    </button>
                  </div>

                  <p className="text-xs leading-relaxed text-textPrimary font-medium border-l-2 border-primary pl-4 py-1 bg-primary/5 rounded-r">
                    {currentDailyReview.summary}
                  </p>

                  {/* AI strengths & recommendations grid */}
                  {currentDailyReview.recommendations && (currentDailyReview.recommendations as any).strengths && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-extrabold uppercase text-success tracking-wider">Strengths & Wins</h4>
                        <div className="space-y-1.5">
                          {(currentDailyReview.recommendations as any).strengths.map((str: string, i: number) => (
                            <p key={i} className="text-xs text-textSecondary font-medium">• {str}</p>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-extrabold uppercase text-primary tracking-wider">Coach Recommendations</h4>
                        <div className="space-y-1.5">
                          {(currentDailyReview.recommendations as any).recommendations.map((rec: string, i: number) => (
                            <p key={i} className="text-xs text-textSecondary font-medium">• {rec}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-border/40 text-[9px] text-textSecondary font-semibold">
                    <span>Generated by AI Coach • {new Date(currentDailyReview.createdAt).toLocaleDateString()}</span>
                    <span className="italic text-primary">&ldquo;{(currentDailyReview.recommendations as any)?.motivationalMessage || 'Keep focusing!'}&rdquo;</span>
                  </div>
                </div>
                {/* Display Locked Reflection Answers */}
                <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Your Reflection</h3>
                    {selectedDate === todayStr && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-primary font-bold hover:underline"
                      >
                        Edit Reflection
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">What went well today?</p>
                      <p className="text-textPrimary mt-0.5">{wins || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">What didn't go well?</p>
                      <p className="text-textPrimary mt-0.5">{misses || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">Biggest achievement</p>
                      <p className="text-textPrimary mt-0.5">{achievement || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">Biggest challenge</p>
                      <p className="text-textPrimary mt-0.5">{challenge || 'N/A'}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Right Column: Scores & Summary */}
          <div className="space-y-6">
            
            {/* Dynamic CEO Score Widget */}
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider border-b border-border/40 pb-2">Scores & Summary</h3>
              
              <div className="space-y-4 pt-1">
                {/* CEO Score Gauge */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-full shadow-inner">
                    <span className="text-lg font-black text-primary">{currentDailyReview ? (currentDailyReview.recommendations as any).stats?.ceoScore : todayStats.ceoScore}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-textSecondary">CEO Score</span>
                    <p className="text-xs font-black text-textPrimary mt-0.5">{currentDailyReview ? (currentDailyReview.recommendations as any).stats?.ceoScore : todayStats.ceoScore} / 100</p>
                  </div>
                </div>

                {/* Energy Indicator */}
                <div className="flex items-center gap-4 border-t border-border/40 pt-3">
                  <div className="p-2 bg-success/10 rounded-lg text-success">
                    <Smile size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-textSecondary">Energy Level</span>
                    <p className="text-xs font-black text-textPrimary mt-0.5">{currentDailyReview ? (currentDailyReview.recommendations as any).stats?.energy : todayStats.energy} / 10</p>
                  </div>
                </div>

                {/* Deep Work logged */}
                <div className="flex items-center gap-4 border-t border-border/40 pt-3">
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    <Zap size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-textSecondary">Deep Work Time</span>
                    <p className="text-xs font-black text-textPrimary mt-0.5">
                      {formatMinutes(currentDailyReview ? (currentDailyReview.recommendations as any).stats?.deepWorkTotalMinutes : todayStats.deepWorkMinutes)}
                    </p>
                  </div>
                </div>

                {/* Activities logged */}
                <div className="flex items-center gap-4 border-t border-border/40 pt-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-textSecondary">Activities Logged</span>
                    <p className="text-xs font-black text-textPrimary mt-0.5">
                      {currentDailyReview ? (currentDailyReview.recommendations as any).stats?.activitiesLogged : todayStats.activitiesCount} sessions
                    </p>
                  </div>
                </div>
              </div>

              {/* Mood picker */}
              {!currentDailyReview && (
                <div className="space-y-2 pt-3 border-t border-border/40">
                  <span className="text-[10px] uppercase font-extrabold text-textSecondary">Mood / Mind State</span>
                  <div className="flex gap-1.5">
                    {[
                      { val: 9, label: 'Optimal', icon: Smile },
                      { val: 7, label: 'Steady', icon: Meh },
                      { val: 4, label: 'Drained', icon: Frown },
                    ].map(m => (
                      <button
                        type="button"
                        key={m.val}
                        onClick={() => setEnergy(m.val)}
                        className={`flex-1 py-1.5 rounded border text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${
                          energy === m.val ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-textSecondary'
                        }`}
                      >
                        <m.icon size={12} /> {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick note */}
              {!currentDailyReview && (
                <div className="space-y-1.5 pt-3">
                  <span className="text-[10px] uppercase font-extrabold text-textSecondary">Quick Notes</span>
                  <input
                    value={quickNote}
                    onChange={e => setQuickNote(e.target.value)}
                    className="w-full px-2.5 py-2 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none focus:border-primary placeholder:text-textSecondary/50"
                    placeholder="Mindset, blockers, focus triggers..."
                  />
                </div>
              )}
            </div>

            {/* Reflection Journal History */}
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Journal History</h3>
              <div className="space-y-2.5 overflow-y-auto max-h-[250px] pr-1">
                {dailyReviews.map((log) => {
                  const logDate = log.date.split('T')[0]
                  const isActive = selectedDate === logDate
                  return (
                    <div
                      key={log.id}
                      className={`w-full flex items-center justify-between py-2 border-b border-border last:border-0 text-left transition-all ${
                        isActive ? 'text-primary scale-102 font-bold' : ''
                      }`}
                    >
                      <button
                        onClick={() => setSelectedDate(logDate)}
                        className="flex-1 text-left"
                      >
                        <p className="text-xs font-bold text-textPrimary">{logDate}</p>
                        <p className="text-[10px] text-textSecondary">Energy: {(log.recommendations as any).stats?.energy || 7}/10</p>
                      </button>
                      <div className="flex items-center gap-2">
                        <Link href={`/reviews/detail?id=${log.id}`} className="text-[9px] text-primary hover:underline font-bold bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                          Details &rarr;
                        </Link>
                        <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-extrabold">
                          CEO Score: {(log.recommendations as any).stats?.ceoScore ?? 70}
                        </span>
                      </div>
                    </div>
                  )})}
                {dailyReviews.length === 0 && (
                  <p className="text-xs text-textSecondary italic text-center py-4">No logged reflections.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Weekly Summary */}
      {activeTab === 'weekly' && (
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card max-w-3xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Weekly Performance Summary</h2>
              <p className="text-xs text-textSecondary mt-0.5">Dynamically aggregate your execution statistics for the past 7 days.</p>
            </div>
            <button
              onClick={handleWeeklyGenerate}
              disabled={generateReviewMutation.isPending}
              className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw size={14} className={generateReviewMutation.isPending ? 'animate-spin' : ''} />
              {generateReviewMutation.isPending ? 'Generating...' : 'Refresh Insights'}
            </button>
          </div>

          {weeklyReviews.length > 0 ? (
            (() => {
              const latestWeekly = weeklyReviews[0]
              const recs = latestWeekly.recommendations as any
              return (
                <div className="space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border/40 bg-background/30 rounded-card p-4">
                    <div className="text-center">
                      <p className="text-xl font-black text-primary">
                        {recs?.stats?.deepWorkTotalMinutes ? formatMinutes(recs.stats.deepWorkTotalMinutes) : '14.5h'}
                      </p>
                      <p className="text-[10px] font-bold text-textSecondary mt-1">Deep Work Logged</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-success">
                        {recs?.stats?.ceoScore ? `${recs.stats.ceoScore}/100` : '78/100'}
                      </p>
                      <p className="text-[10px] font-bold text-textSecondary mt-1">Average CEO Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-accent">
                        {recs?.stats?.goalsAdvanced ?? 2} goals
                      </p>
                      <p className="text-[10px] font-bold text-textSecondary mt-1">Goals Advanced</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-indigo-500">
                        {recs?.stats?.skillPracticeCount ?? 3} skills
                      </p>
                      <p className="text-[10px] font-bold text-textSecondary mt-1">Skills Practiced</p>
                    </div>
                  </div>

                  {/* AI Coaching summary */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} className="text-primary" /> AI Executive Coach Summary
                      </h3>
                      <p className="text-xs leading-relaxed text-textSecondary font-medium">
                        {latestWeekly.summary}
                      </p>
                    </div>

                    {recs && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/40 pt-4 mt-2">
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-extrabold uppercase text-success tracking-wider">Weekly Wins</h4>
                          <div className="space-y-1.5">
                            {recs.strengths?.map((str: string, i: number) => (
                              <p key={i} className="text-xs text-textSecondary font-medium">• {str}</p>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-extrabold uppercase text-danger tracking-wider">Weekly Misses</h4>
                          <div className="space-y-1.5">
                            {recs.weaknesses?.map((weak: string, i: number) => (
                              <p key={i} className="text-xs text-textSecondary font-medium">• {weak}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {recs?.recommendations && (
                      <div className="space-y-2 border-t border-border/40 pt-4 mt-2">
                        <h4 className="text-[10px] font-extrabold uppercase text-primary tracking-wider">Strategic Recommendations</h4>
                        <div className="space-y-1.5">
                          {recs.recommendations.map((rec: string, i: number) => (
                            <p key={i} className="text-xs text-textSecondary font-medium">• {rec}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="text-center py-12 border-t border-border/40">
              <p className="text-xs text-textSecondary italic">No weekly reviews generated yet.</p>
              <button
                onClick={handleWeeklyGenerate}
                disabled={generateReviewMutation.isPending}
                className="mt-4 px-4 py-2 rounded bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all"
              >
                Generate First Weekly Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Monthly Audit */}
      {activeTab === 'monthly' && (
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card max-w-3xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div>
              <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Monthly Audit Report</h2>
              <p className="text-xs text-textSecondary mt-0.5">Comprehensive audit of capabilities growth, focus streaks, and CEO score trend.</p>
            </div>
            <button
              onClick={handleMonthlyGenerate}
              disabled={generateReviewMutation.isPending}
              className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw size={14} className={generateReviewMutation.isPending ? 'animate-spin' : ''} />
              {generateReviewMutation.isPending ? 'Generate Audit' : 'Generate Audit'}
            </button>
          </div>

          {monthlyReviews.length > 0 ? (
            (() => {
              const latestMonthly = monthlyReviews[0]
              const recs = latestMonthly.recommendations as any
              return (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border/40 bg-background/30 rounded-card p-4">
                    <div className="text-center">
                      <p className="text-xl font-black text-primary">
                        {recs?.stats?.deepWorkTotalMinutes ? formatMinutes(recs.stats.deepWorkTotalMinutes) : '58h'}
                      </p>
                      <p className="text-[10px] font-bold text-textSecondary mt-1">Deep Work hours</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-success">Shipped</p>
                      <p className="text-[10px] font-bold text-textSecondary mt-1">Goals Status</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-accent">+0.8</p>
                      <p className="text-[10px] font-bold text-textSecondary mt-1">Avg Skill Growth</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-indigo-500">Active</p>
                      <p className="text-[10px] font-bold text-textSecondary mt-1">Classification</p>
                    </div>
                  </div>

                  {/* AI Content */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} className="text-primary animate-pulse" /> AI Executive Monthly Insights
                      </h3>
                      <p className="text-xs leading-relaxed text-textSecondary font-medium">
                        {latestMonthly.summary}
                      </p>
                    </div>

                    {recs && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/40 pt-4 mt-2">
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-extrabold uppercase text-success tracking-wider">Key wins & sustained habits</h4>
                          <div className="space-y-1.5">
                            {recs.strengths?.map((str: string, i: number) => (
                              <p key={i} className="text-xs text-textSecondary font-medium">• {str}</p>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-extrabold uppercase text-danger tracking-wider">Long-term bottlenecks</h4>
                          <div className="space-y-1.5">
                            {recs.weaknesses?.map((weak: string, i: number) => (
                              <p key={i} className="text-xs text-textSecondary font-medium">• {weak}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {recs?.recommendations && (
                      <div className="space-y-2 border-t border-border/40 pt-4 mt-2">
                        <h4 className="text-[10px] font-extrabold uppercase text-primary tracking-wider">Strategic Goals Recommendations</h4>
                        <div className="space-y-1.5">
                          {recs.recommendations.map((rec: string, i: number) => (
                            <p key={i} className="text-xs text-textSecondary font-medium">• {rec}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })()
          ) : (
            <div className="text-center py-12 border-t border-border/40">
              <p className="text-xs text-textSecondary italic">No monthly audits generated yet.</p>
              <button
                onClick={handleMonthlyGenerate}
                disabled={generateReviewMutation.isPending}
                className="mt-4 px-4 py-2 rounded bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all"
              >
                Generate First Monthly Audit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
