'use client'
import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square } from 'lucide-react'
import Modal from '@/components/Modal'

export default function DeepWork() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const interval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else if (interval.current) {
      clearInterval(interval.current)
    }
    return () => { if (interval.current) clearInterval(interval.current) }
  }, [running])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
  }

  const handleStop = () => {
    setRunning(false)
    setSummaryOpen(true)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-[30px] font-bold">Deep Work</h1>

      <div className="card max-w-lg mx-auto text-center py-12">
        <p className="text-6xl font-bold font-mono text-primary dark:text-white mb-8">{formatTime(seconds)}</p>
        <div className="flex justify-center gap-4">
          {!running ? (
            <button onClick={() => setRunning(true)} className="btn-primary flex items-center gap-2 text-lg px-8 py-3">
              <Play size={22} strokeWidth={1.5} /> Start
            </button>
          ) : (
            <>
              <button onClick={() => setRunning(false)} className="btn-secondary flex items-center gap-2 text-lg px-6 py-3">
                <Pause size={22} strokeWidth={1.5} /> Pause
              </button>
              <button onClick={handleStop} className="btn-destructive flex items-center gap-2 text-lg px-6 py-3">
                <Square size={22} strokeWidth={1.5} /> Stop
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-[22px] font-semibold mb-4">Today&apos;s Sessions</h2>
        <div className="space-y-3">
          {[{ time: '09:00 - 10:30', duration: '1h 30m' }, { time: '14:00 - 15:15', duration: '1h 15m' }].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark last:border-0">
              <span>{s.time}</span>
              <span className="text-sm font-medium text-accent">{s.duration}</span>
            </div>
          ))}
        </div>
      </div>

      <Modal open={summaryOpen} onClose={() => setSummaryOpen(false)} title="Session Summary">
        <form className="space-y-4">
          <div className="text-center py-2">
            <p className="text-3xl font-bold text-primary">{formatTime(seconds)}</p>
            <p className="text-sm text-text-muted mt-1">Total duration</p>
          </div>
          <div><label className="block text-sm font-medium mb-1.5">Interruptions</label><input type="number" className="input-field" defaultValue="0" min="0" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Output Notes</label><textarea className="input-field" rows={3} placeholder="What did you accomplish?" /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setSummaryOpen(false)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={() => { setSummaryOpen(false); setSeconds(0) }} className="btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
