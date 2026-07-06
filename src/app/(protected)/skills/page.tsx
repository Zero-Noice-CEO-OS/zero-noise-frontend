'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, TrendingUp, Award, Brain, Activity } from 'lucide-react'
import Modal from '@/components/Modal'
import { useSkills, useSkillsSummary, useCreateSkillMutation } from '@/hooks/useSkills'

const PREDEFINED_SKILLS = [
  'Reading', 'Writing', 'Speaking', 'Articulation', 'Storytelling',
  'Strategy', 'Decision Making', 'Listening', 'Information Processing',
  'Negotiation', 'Leadership'
]

export default function Skills() {
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState('')
  const [customName, setCustomName] = useState('')
  const [error, setError] = useState('')
  const [baselineScore, setBaselineScore] = useState<number>(5)

  // Queries & Mutations
  const skillsQuery = useSkills()
  const summaryQuery = useSkillsSummary()
  const createMutation = useCreateSkillMutation()

  const skills = skillsQuery.data?.data || []
  const summary = summaryQuery.data

  // Filter out skills that are already active to prevent duplicates
  const availableSkills = PREDEFINED_SKILLS.filter(
    (skillName) => !skills.some((s: any) => s.name === skillName && !s.archived)
  )

  const handleOpenAdd = () => {
    setName(availableSkills[0] || 'Other')
    setCustomName('')
    setError('')
    setBaselineScore(5)
    setAddOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalName = name === 'Other' ? customName.trim() : name.trim()
    if (!finalName) {
      setError('Skill name is required')
      return
    }
    const isDuplicate = skills.some((s: any) => s.name.toLowerCase() === finalName.toLowerCase() && !s.archived)
    if (isDuplicate) {
      setError('You are already tracking this skill')
      return
    }
    try {
      await createMutation.mutateAsync({ name: finalName, baselineScore })
      setName('')
      setCustomName('')
      setError('')
      setBaselineScore(5)
      setAddOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Skills Matrix</h1>
          <p className="text-xs text-textSecondary mt-1">Refine core executive capabilities with structured logs.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 shadow-md"
        >
          <Plus size={16} strokeWidth={2.2} /> Add Skill
        </button>
      </div>

      {/* Top Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:shadow-hover transition-all duration-300 flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Award size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Average Score</p>
            <p className="text-xl font-extrabold text-textPrimary mt-1">
              {summary ? `${Math.round(summary.averageScore * 10) / 10} / 10` : '0 / 10'}
            </p>
          </div>
        </div>
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:shadow-hover transition-all duration-300 flex items-center gap-4">
          <div className="p-3 bg-accent/10 text-accent rounded-xl">
            <Brain size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Total Tracked</p>
            <p className="text-xl font-extrabold text-textPrimary mt-1">
              {summary ? `${summary.totalTracked} Core Skills` : '0 Skills'}
            </p>
          </div>
        </div>
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card hover:shadow-hover transition-all duration-300 flex items-center gap-4">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <Award size={20} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Monthly growth</p>
            <p className="text-xl font-extrabold text-success mt-1">
              {summary ? `+${Math.round(summary.monthlyGrowth * 10) / 10} Avg` : '0.0 Avg'}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Deck */}
      {skillsQuery.isLoading ? (
        <div className="bg-surface/50 border border-border rounded-card p-12 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Loading capability indexes...</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-surface/50 border border-border rounded-card p-12 text-center text-xs text-textSecondary font-semibold">
          No tracked skills found. Log a skill to initialize capability mapping.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map(skill => {
            const currentVal = Math.round(skill.currentScore * 10) / 10
            const displayProgress = skill.currentScore * 10
            const trendStr = skill.currentScore >= skill.baselineScore ? `+${(skill.currentScore - skill.baselineScore).toFixed(1)}` : `${(skill.currentScore - skill.baselineScore).toFixed(1)}`
            const mockSparkline = [skill.baselineScore, skill.baselineScore + 0.2, skill.baselineScore + 0.3, skill.currentScore - 0.2, skill.currentScore]

            return (
              <Link key={skill.id} href={`/skills/detail/?id=${skill.id}`}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="bg-surface/50 border border-border rounded-card p-6 shadow-card hover:shadow-hover hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-[230px] group relative overflow-hidden animate-fade-in"
                >
                  {/* Header info */}
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-md font-bold text-textPrimary group-hover:text-primary transition-colors">
                        {skill.name}
                      </h3>
                      <span className="text-[10px] font-extrabold text-success bg-success/10 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <TrendingUp size={11} /> {trendStr}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-3">
                      <p className="text-3xl font-extrabold text-textPrimary">{currentVal}</p>
                      <p className="text-xs text-textSecondary font-bold">/10 score</p>
                    </div>
                  </div>

                  {/* Sparkline & Progress section */}
                  <div className="space-y-4 pt-4">
                    {/* Sparkline mini SVG */}
                    <div className="h-10 w-full opacity-80 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 100 30" className="w-full h-full text-accent stroke-current fill-none">
                        <path
                          d={`M ${mockSparkline.map((val, idx) => `${(idx * 100) / 4},${30 - (val - 1) * 3}`).join(' L ')}`}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="h-2 bg-background dark:bg-border/60 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500 group-hover:bg-primary"
                          style={{ width: `${displayProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Add Skill Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Skill">
        <form className="space-y-4" onSubmit={handleSave}>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Skill Name</label>
            <select
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
            >
              {availableSkills.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Other">Other...</option>
            </select>
          </div>
          {name === 'Other' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Custom Skill Name</label>
              <input
                required
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value)
                  setError('')
                }}
                placeholder="e.g. Public Speaking"
                className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              />
            </div>
          )}
          {error && (
            <p className="text-[10px] font-bold text-[#EF4444]">{error}</p>
          )}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Baseline Score (1-10)</label>
            <input
              required
              type="number"
              value={baselineScore}
              onChange={(e) => setBaselineScore(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
              min="1"
              max="10"
              placeholder="5"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              {createMutation.isPending ? 'Saving...' : 'Save Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
