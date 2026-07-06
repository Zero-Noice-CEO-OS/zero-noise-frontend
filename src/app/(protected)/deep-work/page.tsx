'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square, Award, Flame, Hourglass, Expand, Shrink, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '@/components/Modal'
import { useActiveSession, useDeepWorkAnalytics, useDeepWorkHistory, useStartDeepWorkMutation, usePauseDeepWorkMutation, useResumeDeepWorkMutation, useCompleteDeepWorkMutation, useUpdateDeepWorkMutation } from '@/hooks/useDeepWork'
import { useGoals } from '@/hooks/useGoals'
import Link from 'next/link'
import { deepWorkService } from '@/services/deep-work-service'

export default function DeepWork() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const interval = useRef<NodeJS.Timeout | null>(null)

  // Start Session Configurations State
  const [plannedMins, setPlannedMins] = useState<number>(50)
  const [selectedGoalId, setSelectedGoalId] = useState<string>('')
  const [startOutput, setStartOutput] = useState('')

  // Completion Form State
  const [interruptions, setInterruptions] = useState<number>(0)
  const [outputNotes, setOutputNotes] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [viewDayOpen, setViewDayOpen] = useState(false)
  const [loadingDaySessions, setLoadingDaySessions] = useState(false)
  const [selectedDayName, setSelectedDayName] = useState('')
  const [selectedDaySessions, setSelectedDaySessions] = useState<any[] | null>(null)

  // Queries & Mutations
  const activeSessionQuery = useActiveSession()
  const analyticsQuery = useDeepWorkAnalytics()
  const historyQuery = useDeepWorkHistory({ page: 1, limit: 10 })
  const goalsQuery = useGoals({ status: 'Active' })

  const startMutation = useStartDeepWorkMutation()
  const pauseMutation = usePauseDeepWorkMutation()
  const resumeMutation = useResumeDeepWorkMutation()
  const completeMutation = useCompleteDeepWorkMutation()
  const updateMutation = useUpdateDeepWorkMutation()

  // Track active session changes and sync timer state
  useEffect(() => {
    if (activeSessionQuery.data) {
      const session = activeSessionQuery.data;
      setInterruptions(session.interruptions || 0);
      const plannedSeconds = (session.plannedDurationMinutes || 50) * 60;
      if (session.status === 'ACTIVE') {
        const startTime = new Date(session.startedAt).getTime();
        const totalElapsed = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        const pausedMins = session.pausedDurationMinutes || 0;
        const pausedSeconds = pausedMins * 60;
        const activeElapsed = Math.max(0, totalElapsed - pausedSeconds);
        const remaining = plannedSeconds - activeElapsed;
        setSeconds(remaining);
        setRunning(true);
      } else if (session.status === 'PAUSED') {
        setRunning(false);
        const startTime = new Date(session.startedAt).getTime();
        const lastPausedTime = session.lastPausedAt ? new Date(session.lastPausedAt).getTime() : Date.now();
        const totalElapsedAtPause = Math.max(0, Math.floor((lastPausedTime - startTime) / 1000));
        const pausedMins = session.pausedDurationMinutes || 0;
        const pausedSeconds = pausedMins * 60;
        const activeElapsed = Math.max(0, totalElapsedAtPause - pausedSeconds);
        const remaining = plannedSeconds - activeElapsed;
        setSeconds(remaining);
      }
    } else {
      setRunning(false);
      setSeconds(plannedMins * 60);
    }
  }, [activeSessionQuery.data, plannedMins]);

  // Timer Tick Hook
  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (interval.current) {
      clearInterval(interval.current);
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [running]);

  const formatTime = (s: number) => {
    const isNegative = s < 0;
    const absSeconds = Math.abs(s);
    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const sec = absSeconds % 60;
    const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    return isNegative ? `-${formatted}` : formatted;
  };

  const getElapsedSeconds = () => {
    if (!activeSessionQuery.data) return 0;
    const session = activeSessionQuery.data;
    const startTime = new Date(session.startedAt).getTime();
    const totalElapsed = Math.floor((Date.now() - startTime) / 1000);
    const pausedMins = session.pausedDurationMinutes || 0;
    const pausedSeconds = pausedMins * 60;
    let extraPausedSeconds = 0;
    if (session.status === 'PAUSED' && session.lastPausedAt) {
      extraPausedSeconds = Math.floor((Date.now() - new Date(session.lastPausedAt).getTime()) / 1000);
    }
    return Math.max(0, totalElapsed - (pausedSeconds + extraPausedSeconds));
  };

  const handleStart = async () => {
    try {
      await startMutation.mutateAsync({
        plannedDurationMinutes: plannedMins,
        goalId: selectedGoalId || undefined,
        output: startOutput || undefined
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handlePause = async () => {
    if (activeSessionQuery.data) {
      try {
        await pauseMutation.mutateAsync({ id: activeSessionQuery.data.id })
        setRunning(false)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleResume = async () => {
    if (activeSessionQuery.data) {
      try {
        await resumeMutation.mutateAsync(activeSessionQuery.data.id)
        setRunning(true)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleStopClick = () => {
    setSummaryOpen(true)
  }

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (activeSessionQuery.data) {
      try {
        await completeMutation.mutateAsync({
          id: activeSessionQuery.data.id,
          data: {
            output: outputNotes || 'Completed deep focus block.',
            interruptions: Number(interruptions)
          }
        })
        setSummaryOpen(false)
        setSeconds(0)
        setRunning(false)
        setInterruptions(0)
        setOutputNotes('')
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleLogInterruption = async () => {
    if (activeSessionQuery.data) {
      const nextVal = interruptions + 1
      setInterruptions(nextVal)
      try {
        await updateMutation.mutateAsync({
          id: activeSessionQuery.data.id,
          data: { interruptions: nextVal }
        })
        setToastMessage('✓ Interruption logged.')
        setTimeout(() => {
          setToastMessage(null)
        }, 3000)
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleDayClick = async (d: any) => {
    setSelectedDayName(d.dateStr || d.day)
    setLoadingDaySessions(true)
    setViewDayOpen(true)
    try {
      const today = new Date();
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf((d.dateStr || '').split(' ')[1]);
      const dayNum = Number((d.dateStr || '').split(' ')[0]);
      const targetDate = isNaN(dayNum) || monthIndex === -1 ? today : new Date(today.getFullYear(), monthIndex, dayNum);
      
      const fromStr = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).toISOString().split('T')[0];
      const toStr = fromStr;
      
      const res = await deepWorkService.getHistory({ from: fromStr, to: toStr, limit: 100 });
      setSelectedDaySessions((res.data || []).filter((s: any) => s.status === 'COMPLETED'));
    } catch (e) {
      console.error(e);
      setSelectedDaySessions([]);
    } finally {
      setLoadingDaySessions(false);
    }
  }

  // Calculate progress
  const plannedDurationVal = Number(activeSessionQuery.data?.plannedDurationMinutes || plannedMins)
  const targetSeconds = (isNaN(plannedDurationVal) || plannedDurationVal <= 0 ? 50 : plannedDurationVal) * 60
  const progressPercent = Math.min(((targetSeconds - seconds) / targetSeconds) * 100, 100)
  const strokeRadius = 70
  const circ = 2 * Math.PI * strokeRadius
  const strokeOffset = circ - ((isNaN(progressPercent) ? 0 : progressPercent) / 100) * circ

  const timerContent = (
    <div className="flex flex-col items-center justify-center p-6 relative">
      {/* SVG Circular Timer progress */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r={strokeRadius}
            className="stroke-background dark:stroke-border/40"
            strokeWidth="7"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r={strokeRadius}
            className="stroke-primary transition-all duration-300"
            strokeWidth="9"
            fill="none"
            strokeDasharray={`${circ}`}
            strokeDashoffset={`${strokeOffset}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center flex flex-col items-center">
          <span className="text-3xl font-extrabold font-mono text-textPrimary tracking-tight">
            {formatTime(seconds)}
          </span>
          <span className="text-[9px] text-textSecondary uppercase tracking-widest font-extrabold mt-1">
            Focus Session
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-8 w-full max-w-sm px-4">
        {!activeSessionQuery.data ? (
          /* Start Config Options Panel */
          <div className="w-full space-y-4 max-w-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-textSecondary uppercase tracking-wider">Goal</label>
                <select
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  className="w-full px-2 py-1.5 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
                >
                  <option value="">No linked goal</option>
                  {goalsQuery.data?.data && goalsQuery.data.data.length > 0 ? (
                    goalsQuery.data.data.map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))
                  ) : (
                    <option value="" disabled>No active goals found</option>
                  )}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-textSecondary uppercase tracking-wider">Duration</label>
                <div className="flex gap-1.5">
                  <select
                    value={plannedMins === 25 || plannedMins === 50 || plannedMins === 90 || plannedMins === 120 ? plannedMins : 'custom'}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === 'custom') {
                        setPlannedMins(137) // immediately switches to input display mode showing 137 minutes custom default
                      } else {
                        setPlannedMins(Number(val))
                      }
                    }}
                    className="flex-1 px-1.5 py-1 bg-surface border border-border rounded text-textPrimary text-xs focus:outline-none"
                  >
                    <option value={25}>25m</option>
                    <option value={50}>50m</option>
                    <option value={90}>90m</option>
                    <option value={120}>120m</option>
                    <option value="custom">Custom</option>
                  </select>
                  {(plannedMins !== 25 && plannedMins !== 50 && plannedMins !== 90 && plannedMins !== 120) && (
                    <input
                      type="number"
                      min="1"
                      max="720"
                      value={plannedMins}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(720, Number(e.target.value)))
                        setPlannedMins(val)
                      }}
                      className="w-16 px-1 py-1 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none"
                    />
                  )}
                </div>
              </div>
            </div>
            {goalsQuery.data?.data && goalsQuery.data.data.length === 0 && (
              <div className="p-3 bg-[#FEF3C7] dark:bg-[#FEF3C7]/10 border border-[#F59E0B]/20 rounded-button text-[10px] text-[#D97706] dark:text-[#FBBF24] font-bold flex items-center justify-between">
                <span>No active goals found.</span>
                <Link href="/goals" className="underline hover:opacity-80">Create Goal &rarr;</Link>
              </div>
            )}
            <input
              value={startOutput}
              onChange={(e) => setStartOutput(e.target.value)}
              placeholder="What are you focusing on?"
              className="w-full px-3 py-2 border border-border rounded bg-surface text-textPrimary text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleStart}
              disabled={startMutation.isPending}
              className="w-full py-2.5 rounded bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Play size={14} strokeWidth={2.2} /> Start Session
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            {activeSessionQuery.data.status === 'PAUSED' || !running ? (
              <button
                onClick={handleResume}
                disabled={resumeMutation.isPending}
                className="flex-1 h-11 px-3 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-background/80 transition-all"
              >
                <Play size={14} strokeWidth={2.2} /> Resume
              </button>
            ) : (
              <button
                onClick={handlePause}
                disabled={pauseMutation.isPending}
                className="flex-1 h-11 px-3 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-background/80 transition-all"
              >
                <Pause size={14} strokeWidth={2.2} /> Pause
              </button>
            )}
            <button
              onClick={handleLogInterruption}
              disabled={updateMutation.isPending}
              className="flex-1 h-11 px-3 rounded-button bg-accent text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              ⚠️ Log Interruption
            </button>
            <button
              onClick={handleStopClick}
              className="flex-1 h-11 px-3 rounded-button bg-danger text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              <Square size={14} strokeWidth={2.2} /> Complete
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const analytics = analyticsQuery.data

  const formatHours = (mins: number) => {
    const hrs = Math.floor(mins / 60)
    const rem = mins % 60
    return hrs > 0 ? `${hrs}h ${rem}m` : `${rem}m`
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Distraction free Full-Screen Focus Mode Overlay */}
      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050816] text-white flex flex-col items-center justify-center p-8"
          >
            {/* Ambient Glow */}
            <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse-ring" />

            <button
              onClick={() => setFocusMode(false)}
              className="absolute top-6 right-6 p-2 rounded-full border border-border bg-white/5 hover:bg-white/10 transition-colors text-gray-300"
              title="Exit Focus Mode"
            >
              <Shrink size={18} />
            </button>
            <div className="max-w-md w-full text-center space-y-4">
              <h2 className="text-sm font-bold tracking-widest text-textSecondary uppercase">Distraction-Free Focus</h2>
              {timerContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Deep Work Timer</h1>
          <p className="text-xs text-textSecondary mt-1">Activate high-bandwidth cognitive focus intervals.</p>
        </div>
        <button
          onClick={() => setFocusMode(true)}
          className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Expand size={14} strokeWidth={2} /> Distraction-Free Focus
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:shadow-hover transition-all duration-300 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Hourglass size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Total Time Today</p>
            <p className="text-xl font-extrabold text-textPrimary mt-1">
              {analytics ? formatHours(analytics.todayTotalMinutes) : '0m'}
            </p>
          </div>
        </div>
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:shadow-hover transition-all duration-300 flex items-center gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-xl">
            <Flame size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Current Streak</p>
            <p className="text-xl font-extrabold text-textPrimary mt-1">
              {analytics ? `${analytics.streakDays} Days` : '0 Days'}
            </p>
          </div>
        </div>
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:shadow-hover transition-all duration-300 flex items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <Award size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Average Session</p>
            <p className="text-xl font-extrabold text-success mt-1">
              {analytics ? `${analytics.averageSessionMinutes} min` : '0 min'}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown Bar Chart */}
      {analytics?.weeklyHistory && (
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover transition-all duration-300 space-y-4">
          <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Weekly Focus Stats</h3>
          <div className="h-44 w-full flex items-end justify-between pt-4 px-2">
            {analytics.weeklyHistory.map((d: any, i) => (
              <div key={i} onClick={() => handleDayClick(d)} className="flex flex-col items-center gap-2 w-full group cursor-pointer hover:scale-105 transition-all">
                <span className="text-[10px] font-bold text-textSecondary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {d.minutes}m
                </span>
                <div className="w-8 sm:w-10 bg-background dark:bg-border rounded-t-button relative overflow-hidden h-28">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.min(100, (d.minutes / 240) * 100)}%` }}
                    transition={{ type: 'spring', delay: i * 0.05, duration: 0.8 }}
                    className="absolute bottom-0 left-0 right-0 bg-primary group-hover:bg-accent transition-colors rounded-t-button"
                  />
                </div>
                <span className="text-xs text-textSecondary font-semibold whitespace-nowrap">{d.dateStr || d.day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timer Section Card */}
      <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover max-w-xl mx-auto flex flex-col items-center">
        {timerContent}
      </div>

      {/* Today's History logs */}
      <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card">
        <h2 className="text-sm font-extrabold text-textPrimary mb-4">Focus Log History</h2>
        {historyQuery.isLoading ? (
          <div className="p-8 text-center text-xs text-textSecondary font-bold">Syncing history logs...</div>
        ) : !Array.isArray(historyQuery.data?.data) || historyQuery.data.data.length === 0 ? (
          <p className="text-xs text-textSecondary italic text-center py-4">No completed focus sessions found.</p>
        ) : (
          <div className="space-y-4">
            {historyQuery.data.data.map((s) => {
              const parseDateSafely = (val: string) => {
                try {
                  const d = new Date(val)
                  if (isNaN(d.getTime())) return 'Recently'
                  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                } catch {
                  return 'Recently'
                }
              }
              const startFormatted = parseDateSafely(s.startedAt)
              const endFormatted = s.endedAt ? parseDateSafely(s.endedAt) : 'Ongoing'
              return (
                <div key={s.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-border/40 last:border-0 gap-2">
                  <div>
                    <p className="font-bold text-textPrimary text-xs sm:text-sm">{startFormatted} - {endFormatted}</p>
                    <p className="text-xs text-textSecondary mt-0.5">{s.output || 'No output details.'}</p>
                    {s.interruptions > 0 && (
                      <p className="text-[10px] text-danger/80 font-bold mt-1">
                        ⚠️ {s.interruptions} {s.interruptions === 1 ? 'interruption' : 'interruptions'} recorded
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-full self-start sm:self-center">
                    {s.actualDurationMinutes || s.plannedDurationMinutes || 0} min
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Complete Modal */}
      <Modal open={summaryOpen} onClose={() => setSummaryOpen(false)} title="Session Summary">
        <form className="space-y-4" onSubmit={handleCompleteSubmit}>
          <div className="text-center py-2">
            <p className="text-3xl font-extrabold text-primary font-mono">{formatTime(getElapsedSeconds())}</p>
            <p className="text-xs text-textSecondary mt-1">Total session duration</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Interruptions Count</label>
            <input
              type="number"
              value={interruptions}
              onChange={(e) => setInterruptions(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              min="0"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Output Notes / What was accomplished?</label>
            <textarea
              required
              value={outputNotes}
              onChange={(e) => setOutputNotes(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              rows={3}
              placeholder="e.g. Completed authorization APIs and tests"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            <button type="button" onClick={() => setSummaryOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
            <button
              type="submit"
              disabled={completeMutation.isPending}
              className="px-4 py-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              {completeMutation.isPending ? 'Saving...' : 'Save Session'}
            </button>
          </div>
        </form>
      </Modal>
      {/* View Day Sessions Modal */}
      <Modal open={viewDayOpen} onClose={() => setViewDayOpen(false)} title={`Focus Logs - ${selectedDayName}`}>
        <div className="space-y-4">
          {loadingDaySessions ? (
            <div className="py-8 text-center text-xs text-textSecondary font-bold animate-pulse">Loading focus sessions...</div>
          ) : !selectedDaySessions || selectedDaySessions.length === 0 ? (
            <p className="text-xs text-textSecondary italic text-center py-6">No completed focus sessions recorded on this day.</p>
          ) : (
            <div className="space-y-4 divide-y divide-border/30 max-h-[400px] overflow-y-auto pr-1">
              {selectedDaySessions.map((s, idx) => (
                <div key={s.id} className={`pt-4 ${idx === 0 ? 'pt-0' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <p className="font-bold text-textPrimary text-sm">
                        {new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {s.endedAt ? new Date(s.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing'}
                      </p>
                      <p className="text-xs text-textSecondary">{s.output || 'No output details.'}</p>
                      {s.interruptions > 0 && (
                        <p className="text-[10px] text-danger/80 font-bold mt-1">
                          ⚠️ {s.interruptions} {s.interruptions === 1 ? 'interruption' : 'interruptions'} logged
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                        {s.actualDurationMinutes || s.plannedDurationMinutes || 0} min
                      </span>
                      <div className="text-[10px] font-extrabold text-success mt-1">
                        Score: {s.deepWorkScore ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end pt-4 border-t border-border/40">
            <button onClick={() => setViewDayOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Close</button>
          </div>
        </div>
      </Modal>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#10B981] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
