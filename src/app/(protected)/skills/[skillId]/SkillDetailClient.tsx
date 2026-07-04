'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Plus, Calendar } from 'lucide-react'
import Modal from '@/components/Modal'
import { useSkill, useSkillEntries, useLogSkillEntryMutation } from '@/hooks/useSkills'

export default function SkillDetail() {
  const params = useParams()
  const skillId = params.skillId as string

  const [logOpen, setLogOpen] = useState(false)
  
  // Slider states for Speed, Quality, Consistency
  const [speed, setSpeed] = useState(7)
  const [quality, setQuality] = useState(8)
  const [consistency, setConsistency] = useState(7)
  const [notes, setNotes] = useState('')

  // Queries & Mutations
  const skillQuery = useSkill(skillId)
  const entriesQuery = useSkillEntries(skillId)
  const logMutation = useLogSkillEntryMutation()

  const skill = skillQuery.data
  const entries = entriesQuery.data?.data || []

  // Update slider states based on latest entry if available
  useEffect(() => {
    if (entries.length > 0) {
      setSpeed(entries[0].speed || 7)
      setQuality(entries[0].quality || 8)
      setConsistency(entries[0].consistency || 7)
    }
  }, [entries])

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Map extra dimensions required by backend validation constraints
      const avgVal = Math.round((speed + quality + consistency) / 3)
      await logMutation.mutateAsync({
        id: skillId,
        data: {
          speed,
          quality,
          consistency,
          depth: consistency,
          retention: quality,
          application: speed,
          confidence: avgVal,
          notes: notes || undefined
        }
      })
      setNotes('')
      setLogOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  if (skillQuery.isLoading) {
    return (
      <div className="space-y-6 pb-16 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Syncing skill parameters...</p>
      </div>
    )
  }

  if (!skill) {
    return (
      <div className="space-y-6 pb-16">
        <Link href="/skills" className="inline-flex items-center gap-1.5 text-xs font-bold text-textSecondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Skills
        </Link>
        <div className="bg-surface/50 border border-border rounded-card p-12 text-center text-xs text-textSecondary font-semibold">
          Skill not found.
        </div>
      </div>
    )
  }

  // Radar points generator
  const cx = 50
  const cy = 50
  const r = 40

  const getPt = (val: number, angleDeg: number) => {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    const factor = val / 10
    const x = cx + r * factor * Math.cos(rad)
    const y = cy + r * factor * Math.sin(rad)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }

  const polygonPoints = `${getPt(speed, 0)} ${getPt(quality, 120)} ${getPt(consistency, 240)}`
  const formattedScore = Math.round(skill.currentScore * 10) / 10

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      <Link href="/skills" className="inline-flex items-center gap-1.5 text-xs font-bold text-textSecondary hover:text-primary transition-colors">
        <ArrowLeft size={14} /> Back to Skills
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-black text-textPrimary tracking-tight">{skill.name}</h1>
          <p className="text-xs text-textSecondary font-semibold mt-1">Configure parameters and track historical entries logs.</p>
        </div>
        <button
          onClick={() => setLogOpen(true)}
          className="px-4 py-2.5 rounded-button bg-primary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus size={14} /> Log Skill Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dimensions Summary */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Capability Dimensions</h2>
          <div className="space-y-4 pt-2">
            {[
              { label: 'Speed', val: speed, desc: 'Execution speed and agility' },
              { label: 'Quality', val: quality, desc: 'Fidelity of generated artifacts' },
              { label: 'Consistency', val: consistency, desc: 'Daily execution stability' }
            ].map(d => (
              <div key={d.label} className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs font-bold text-textPrimary">
                  <span>{d.label}</span>
                  <span>{d.val}/10</span>
                </div>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${d.val * 10}%` }} />
                </div>
                <p className="text-[10px] text-textSecondary">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Radar Visualizer */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-xs font-bold uppercase tracking-wider text-textPrimary mb-6 align-self-start">Skill Radar</h2>
          <div className="w-56 h-56 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer grid */}
              <polygon points="50,10 84.6,30 84.6,70 50,90 15.4,70 15.4,30" fill="none" stroke="currentColor" className="text-border" strokeWidth="0.5" />
              {/* Inner grids */}
              <polygon points="50,20 76,35 76,65 50,80 24,65 24,35" fill="none" stroke="currentColor" className="text-border/40" strokeWidth="0.5" />
              <polygon points="50,30 67.3,40 67.3,60 50,70 32.7,60 32.7,40" fill="none" stroke="currentColor" className="text-border/20" strokeWidth="0.5" />
              
              {/* Axes lines */}
              <line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" className="text-border" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="84.6" y2="70" stroke="currentColor" className="text-border" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="15.4" y2="70" stroke="currentColor" className="text-border" strokeWidth="0.5" />

              {/* Data polygon */}
              <polygon
                points={polygonPoints}
                fill="rgba(79, 124, 255, 0.2)"
                stroke="#4F7CFF"
                strokeWidth="1.5"
              />

              {/* Data points */}
              <circle cx={getPt(speed, 0).split(',')[0]} cy={getPt(speed, 0).split(',')[1]} r="2" fill="#4F7CFF" />
              <circle cx={getPt(quality, 120).split(',')[0]} cy={getPt(quality, 120).split(',')[1]} r="2" fill="#4F7CFF" />
              <circle cx={getPt(consistency, 240).split(',')[0]} cy={getPt(consistency, 240).split(',')[1]} r="2" fill="#4F7CFF" />
            </svg>

            {/* Labels overlay */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-textPrimary uppercase">Speed</div>
            <div className="absolute bottom-6 right-2 text-[9px] font-bold text-textPrimary uppercase">Quality</div>
            <div className="absolute bottom-6 left-2 text-[9px] font-bold text-textPrimary uppercase">Consistency</div>
          </div>
        </div>

        {/* Scoring & Context Card */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Current Score</h2>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-5xl font-black text-primary">{formattedScore}</span>
              <span className="text-sm font-bold text-textSecondary">/10</span>
            </div>
            <p className="text-xs text-textSecondary leading-relaxed">
              Based on the average of your latest dimension parameters. Update regularly to benchmark progress.
            </p>
          </div>

          <div className="pt-4 border-t border-border/40 text-[10px] text-textSecondary font-semibold">
            Status: <span className="text-success uppercase tracking-wider font-extrabold">Active</span>
          </div>
        </div>

        {/* Entries Logs History */}
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card lg:col-span-3 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-textPrimary flex items-center gap-1.5">
            <Calendar size={14} /> Entry Logs History
          </h2>
          
          <div className="overflow-x-auto scrollbar-none pt-2">
            <table className="w-full text-left text-xs text-textSecondary font-medium">
              <thead>
                <tr className="border-b border-border/60 text-[10px] uppercase font-bold text-textSecondary pb-2">
                  <th className="py-2">Date</th>
                  <th className="py-2">Speed</th>
                  <th className="py-2">Quality</th>
                  <th className="py-2">Consistency</th>
                  <th className="py-2">Score</th>
                  <th className="py-2 max-w-xs">Notes</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-textSecondary/60 italic uppercase tracking-wider">No entries logged yet.</td>
                  </tr>
                ) : (
                  entries.map((entry: any) => {
                    const entryScore = Math.round(((entry.speed + entry.quality + entry.consistency) / 3) * 10) / 10
                    return (
                      <tr key={entry.id} className="border-b border-border/40 last:border-0 hover:bg-background/40">
                        <td className="py-3 font-semibold text-textPrimary">{new Date(entry.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">{entry.speed}/10</td>
                        <td className="py-3">{entry.quality}/10</td>
                        <td className="py-3">{entry.consistency}/10</td>
                        <td className="py-3 font-bold text-primary">{entryScore}/10</td>
                        <td className="py-3 max-w-xs truncate text-textPrimary/80">{entry.notes || '-'}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Log Entry Modal */}
      <Modal open={logOpen} onClose={() => setLogOpen(false)} title="Log Skill Entry">
        <form onSubmit={handleLogSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline text-xs font-bold text-textPrimary">
              <span>Speed Parameter</span>
              <span>{speed}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={e => setSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-background dark:bg-border/60 rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline text-xs font-bold text-textPrimary">
              <span>Quality Parameter</span>
              <span>{quality}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={quality}
              onChange={e => setQuality(Number(e.target.value))}
              className="w-full h-1.5 bg-background dark:bg-border/60 rounded-full appearance-none cursor-pointer accent-secondary"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline text-xs font-bold text-textPrimary">
              <span>Consistency Parameter</span>
              <span>{consistency}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={consistency}
              onChange={e => setConsistency(Number(e.target.value))}
              className="w-full h-1.5 bg-background dark:bg-border/60 rounded-full appearance-none cursor-pointer accent-success"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Notes / Reflections</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              rows={3}
              placeholder="Observations, blockers, metrics..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            <button type="button" onClick={() => setLogOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
            <button
              type="submit"
              disabled={logMutation.isPending}
              className="px-4 py-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              {logMutation.isPending ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
