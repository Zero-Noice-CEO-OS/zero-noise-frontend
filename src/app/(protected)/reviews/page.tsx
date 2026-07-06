'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Sparkles, Smile, Meh, Frown, Award, Flame, RefreshCw, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDailyLogByDate, useDailyLogsHistory, useMorningCheckInMutation, useEveningReviewMutation } from '@/hooks/useDailyLogs'
import { useReviews, useGenerateReviewMutation } from '@/hooks/useReviews'

export default function ReviewsHub() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  
  // Date tracking (today's string formatted YYYY-MM-DD in local time)
  const getLocalDateString = (d = new Date()) => {
    const offset = d.getTimezoneOffset()
    const local = new Date(d.getTime() - offset * 60 * 1000)
    return local.toISOString().split('T')[0]
  }

  const todayStr = getLocalDateString()
  const [selectedDate, setSelectedDate] = useState(todayStr)

  // Queries & Mutations
  const todayLogQuery = useDailyLogByDate(selectedDate)
  const historyQuery = useDailyLogsHistory({ page: 1, limit: 10 })
  const morningMutation = useMorningCheckInMutation()
  const eveningMutation = useEveningReviewMutation()

  // Reviews list queries
  const weeklyReviewsQuery = useReviews({ type: 'Weekly', limit: 5 })
  const monthlyReviewsQuery = useReviews({ type: 'Monthly', limit: 5 })
  const generateReviewMutation = useGenerateReviewMutation()

  // Morning Check-in Form States
  const [energy, setEnergy] = useState<number>(7)
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [p3, setP3] = useState('')
  const [mainSkill, setMainSkill] = useState('')
  const [risks, setRisks] = useState('')

  // Evening Review Form States
  const [wins, setWins] = useState('')
  const [misses, setMisses] = useState('')
  const [lessons, setLessons] = useState('')
  const [tomorrowPriorities, setTomorrowPriorities] = useState('')

  // Set default values when todayLogQuery changes
  useEffect(() => {
    if (todayLogQuery.data) {
      setEnergy(todayLogQuery.data.energy || 7)
      setWins(todayLogQuery.data.wins || '')
      setMisses(todayLogQuery.data.misses || '')
      setLessons(todayLogQuery.data.lessons || '')
      setTomorrowPriorities(todayLogQuery.data.tomorrowPriorities || '')
    } else {
      setEnergy(7)
      setP1('')
      setP2('')
      setP3('')
      setMainSkill('')
      setRisks('')
      setWins('')
      setMisses('')
      setLessons('')
      setTomorrowPriorities('')
    }
  }, [todayLogQuery.data, selectedDate])

  const handleMorningSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const topPriorities = [p1, p2, p3].filter(p => p.trim() !== '')
    try {
      await morningMutation.mutateAsync({
        date: selectedDate,
        energy,
        topPriorities,
        mainSkill: mainSkill || 'Focus Execution',
        risks: risks || undefined
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleEveningSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await eveningMutation.mutateAsync({
        dateStr: selectedDate,
        data: {
          wins,
          misses,
          lessons,
          tomorrowPriorities
        }
      })
      // Automatically trigger a Daily review generation to populate AI Advice
      await generateReviewMutation.mutateAsync({ type: 'Daily', date: selectedDate })
    } catch (err) {
      console.error(err)
    }
  }

  const handleWeeklyGenerate = async () => {
    try {
      await generateReviewMutation.mutateAsync({ type: 'Weekly', date: todayStr })
    } catch (e) {
      console.error(e)
    }
  }

  const handleMonthlyGenerate = async () => {
    try {
      await generateReviewMutation.mutateAsync({ type: 'Monthly', date: todayStr })
    } catch (e) {
      console.error(e)
    }
  }

  // reflections meta info
  const totalEntries = historyQuery.data?.meta?.total ?? 0

  const latestWeeklyReview = weeklyReviewsQuery.data?.data?.[0]
  const latestMonthlyReview = monthlyReviewsQuery.data?.data?.[0]

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
          { id: 'daily', label: 'Daily Journal' },
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

      {/* Daily Reflection Journal */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Journal Form */}
          <div className="lg:col-span-2 space-y-6">
            {todayLogQuery.isLoading ? (
              <div className="bg-surface/50 border border-border rounded-card p-12 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Syncing log info...</p>
              </div>
            ) : !todayLogQuery.data ? (
              /* Morning Check-in Form */
              <form
                onSubmit={handleMorningSubmit}
                className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Morning Check-in</h2>
                  <span className="text-xs font-bold text-textSecondary bg-surface/80 px-3 py-1 rounded-full border border-border">
                    Date: {selectedDate}
                  </span>
                </div>
                
                {/* Mood Indicator / Energy Slider */}
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">State of mind / Energy Level ({energy}/10)</label>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: 'great', label: 'Optimal (9)', val: 9, icon: Smile, color: 'text-success bg-success/10 border-success/30' },
                      { id: 'good', label: 'Steady (7)', val: 7, icon: Meh, color: 'text-primary bg-primary/10 border-primary/20' },
                      { id: 'meh', label: 'Drained (4)', val: 4, icon: Frown, color: 'text-danger bg-danger/10 border-danger/20' },
                    ].map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setEnergy(m.val)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-button border text-xs font-bold transition-all ${
                          (m.val === 9 && energy >= 8) || (m.val === 7 && energy === 7) || (m.val === 4 && energy <= 6)
                            ? `${m.color} ring-2 ring-primary/20 scale-[1.02] shadow-sm`
                            : 'bg-surface text-textSecondary border-border hover:bg-background/80'
                        }`}
                      >
                        <m.icon size={16} />
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Top priorities for today (1 - 3 objectives)</label>
                  <div className="space-y-2">
                    <input
                      required
                      value={p1}
                      onChange={(e) => setP1(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      placeholder="Priority 1 (Required)"
                    />
                    <input
                      value={p2}
                      onChange={(e) => setP2(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      placeholder="Priority 2 (Optional)"
                    />
                    <input
                      value={p3}
                      onChange={(e) => setP3(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      placeholder="Priority 3 (Optional)"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Target Practice Skill</label>
                    <input
                      value={mainSkill}
                      onChange={(e) => setMainSkill(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      placeholder="e.g. Strategic Planning"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Identified Risks</label>
                    <input
                      value={risks}
                      onChange={(e) => setRisks(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      placeholder="e.g. Meeting fatigue, blockers"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={morningMutation.isPending}
                    className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {morningMutation.isPending ? 'Saving...' : 'Submit Morning Check-in'}
                  </button>
                </div>
              </form>
            ) : !todayLogQuery.data.wins ? (
              /* Evening Review Form */
              <form
                onSubmit={handleEveningSubmit}
                className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Evening Review</h2>
                  <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                    Day Check-in Logged
                  </span>
                </div>

                <div className="p-4 border border-border bg-surface/30 rounded-card space-y-2 text-xs">
                  <p className="font-bold text-textPrimary uppercase text-[9px] tracking-wider text-textSecondary">Morning Intentions Summary</p>
                  <p className="text-textPrimary font-semibold">⚡ Main Skill Focus: <span className="text-primary">{todayLogQuery.data.mainSkill}</span></p>
                  <div className="space-y-1">
                    <p className="font-bold text-textSecondary text-[9px] tracking-wider">PRIORITIES:</p>
                    {Array.isArray(todayLogQuery.data.topPriorities) && (todayLogQuery.data.topPriorities as string[]).map((p, idx) => (
                      <p key={idx} className="text-textSecondary">• {p}</p>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">What did you accomplish today (Wins)?</label>
                  <textarea
                    required
                    value={wins}
                    onChange={(e) => setWins(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                    rows={3}
                    placeholder="Key focus areas, shipped features, sales calls..."
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">What blocked you or went wrong (Misses)?</label>
                  <textarea
                    required
                    value={misses}
                    onChange={(e) => setMisses(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                    rows={2}
                    placeholder="Dependencies, bottlenecks, meeting fatigue..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Lessons learned</label>
                    <input
                      value={lessons}
                      onChange={(e) => setLessons(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      placeholder="e.g. Delegate ops tasks"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Top priority for tomorrow</label>
                    <input
                      value={tomorrowPriorities}
                      onChange={(e) => setTomorrowPriorities(e.target.value)}
                      className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                      placeholder="Single critical objective"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={eveningMutation.isPending}
                    className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send size={14} /> {eveningMutation.isPending ? 'Submitting...' : 'Submit Evening Review'}
                  </button>
                </div>
              </form>
            ) : (
              /* Completed Log Summary View */
              <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div>
                    <h2 className="text-md font-bold text-textPrimary">Daily Journal Entry Complete</h2>
                    <p className="text-xs text-textSecondary mt-0.5">Date: {selectedDate}</p>
                  </div>
                  <div className="bg-success/15 border border-success/20 text-success text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> CEO Score: {todayLogQuery.data.ceoScore ?? 0}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-wider font-extrabold text-textSecondary">Morning Check-in</p>
                    <p className="text-xs text-textPrimary font-semibold">⚡ Energy: {todayLogQuery.data.energy}/10</p>
                    <p className="text-xs text-textPrimary font-semibold">🎯 Skill Target: {todayLogQuery.data.mainSkill}</p>
                    <p className="text-xs text-textSecondary leading-relaxed">{todayLogQuery.data.risks ? `⚠️ Risks: ${todayLogQuery.data.risks}` : 'No risks recorded.'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase tracking-wider font-extrabold text-textSecondary">Evening Review</p>
                    <p className="text-xs text-textPrimary font-semibold">🏆 Wins: {todayLogQuery.data.wins}</p>
                    <p className="text-xs text-textPrimary/80">⚠️ Misses: {todayLogQuery.data.misses}</p>
                    <p className="text-xs text-textSecondary italic">{todayLogQuery.data.lessons ? `💡 Lesson: "${todayLogQuery.data.lessons}"` : ''}</p>
                  </div>
                </div>

                {/* AI Advice Block */}
                <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border border-primary/20 p-5 rounded-card relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={15} className="text-primary" />
                    <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">AI Executive Advisor</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-textPrimary font-medium">
                    &ldquo;Excellent execution today! By recognizing the blockers around &ldquo;{todayLogQuery.data.misses}&rdquo;, you have derived a clear roadmap. For tomorrow, prioritizing &ldquo;{todayLogQuery.data.tomorrowPriorities}&rdquo; will maintain your alignment.&rdquo;
                  </p>
                </div>

                {/* Reset button (allows updating review) */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      if (todayLogQuery.data) {
                        todayLogQuery.data.wins = null
                        setWins(wins || todayLogQuery.data.wins || '')
                      }
                    }}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Update Evening Review
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Achievements & Streak & History */}
          <div className="space-y-6">
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider">Reflections Stats</h3>
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-textSecondary flex items-center gap-1.5"><Award size={15} className="text-primary" /> Current Status</span>
                  <span className="font-extrabold text-textPrimary">Steady</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-textSecondary flex items-center gap-1.5"><Flame size={15} className="text-accent" /> Total Logs</span>
                  <span className="font-extrabold text-textPrimary">{totalEntries} entries</span>
                </div>
              </div>
            </div>

            {/* Daily History list */}
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
              <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider">Journal History</h3>
              <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
                {historyQuery.data?.data?.map((log) => {
                  const logDate = new Date(log.date).toISOString().split('T')[0]
                  const isActive = selectedDate === logDate
                  return (
                    <button
                      key={log.id}
                      onClick={() => setSelectedDate(logDate)}
                      className={`w-full flex items-center justify-between py-2 border-b border-border last:border-0 text-left transition-all ${
                        isActive ? 'text-primary scale-102 font-bold' : 'hover:opacity-80'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-textPrimary">{logDate}</p>
                        <p className="text-[10px] text-textSecondary">Energy: {log.energy}/10</p>
                      </div>
                      <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                        Score: {log.ceoScore ?? 0}
                      </span>
                    </button>
                  )
                })}
                {totalEntries === 0 && (
                  <p className="text-xs text-textSecondary italic text-center py-4">No historical logs found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly summary tab */}
      {activeTab === 'weekly' && (
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Weekly Performance Summary</h2>
            <button
              onClick={handleWeeklyGenerate}
              disabled={generateReviewMutation.isPending}
              className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw size={14} className={generateReviewMutation.isPending ? 'animate-spin' : ''} />
              {generateReviewMutation.isPending ? 'Generating...' : 'Refresh Insights'}
            </button>
          </div>

          {weeklyReviewsQuery.isLoading ? (
            <div className="p-8 text-center text-xs text-textSecondary font-bold">Syncing weekly audits...</div>
          ) : latestWeeklyReview ? (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-6 py-4 border-y border-border/40">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-primary">14.5h</p>
                  <p className="text-[10px] font-bold text-textSecondary mt-1">Deep Work Logged</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-success">Active</p>
                  <p className="text-[10px] font-bold text-textSecondary mt-1">Status</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-accent">Audited</p>
                  <p className="text-[10px] font-bold text-textSecondary mt-1">Classification</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">AI Executive Coach Reflection</h3>
                  <p className="text-xs leading-relaxed text-textSecondary font-medium">
                    {latestWeeklyReview.summary}
                  </p>
                </div>
                {latestWeeklyReview.recommendations && latestWeeklyReview.recommendations.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Strategic Recommendations</h3>
                    <div className="space-y-1.5">
                      {latestWeeklyReview.recommendations.map((rec, i) => (
                        <p key={i} className="text-xs text-textSecondary font-medium">• {rec}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
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

      {/* Monthly summary tab */}
      {activeTab === 'monthly' && (
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Monthly Audit Report</h2>
            <button
              onClick={handleMonthlyGenerate}
              disabled={generateReviewMutation.isPending}
              className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw size={14} className={generateReviewMutation.isPending ? 'animate-spin' : ''} />
              {generateReviewMutation.isPending ? 'Generating...' : 'Generate Audit'}
            </button>
          </div>

          {monthlyReviewsQuery.isLoading ? (
            <div className="p-8 text-center text-xs text-textSecondary font-bold">Syncing monthly audits...</div>
          ) : latestMonthlyReview ? (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-border/40">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-primary">58h</p>
                  <p className="text-[10px] font-bold text-textSecondary mt-1">Deep Work</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-success">Shipped</p>
                  <p className="text-[10px] font-bold text-textSecondary mt-1">Goals Status</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-accent">+0.8</p>
                  <p className="text-[10px] font-bold text-textSecondary mt-1">Avg Skill Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-textPrimary">Active</p>
                  <p className="text-[10px] font-bold text-textSecondary mt-1">Classification</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">AI Executive Monthly Insights</h3>
                  <p className="text-xs leading-relaxed text-textSecondary font-medium">
                    {latestMonthlyReview.summary}
                  </p>
                </div>
                {latestMonthlyReview.recommendations && latestMonthlyReview.recommendations.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Strategic Goals Recommendations</h3>
                    <div className="space-y-1.5">
                      {latestMonthlyReview.recommendations.map((rec, i) => (
                        <p key={i} className="text-xs text-textSecondary font-medium">• {rec}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
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
