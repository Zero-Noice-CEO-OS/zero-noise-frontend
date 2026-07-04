'use client'

import PageShell from '@/components/PageShell'
import { useState } from 'react'
import { Plus, Search, ChevronRight, Vote, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react'

interface FeatureReq {
  id: number
  title: string
  desc: string
  votes: number
  comments: number
  status: 'Planned' | 'In Progress' | 'Completed'
  category: string
}

export default function FeaturesPage() {
  const breadcrumbs = [
    { label: 'Resources', href: '#' },
    { label: 'Feature Requests' }
  ]

  const [search, setSearch] = useState('')
  const [votedIds, setVotedIds] = useState<number[]>([])
  const [requests, setRequests] = useState<FeatureReq[]>([
    {
      id: 1,
      title: 'Voice-to-Text Reflection Input support',
      desc: 'Allow founders to speak reflection answers instead of typing them. Co-pilot will summarize and score automatically.',
      votes: 42,
      comments: 7,
      status: 'In Progress',
      category: 'AI Coach'
    },
    {
      id: 2,
      title: 'Wearable Apple Watch integration for Focus streaks',
      desc: 'Synchronize activity timers directly from watch to track heart rate and output scores.',
      votes: 28,
      comments: 3,
      status: 'Planned',
      category: 'Integrations'
    },
    {
      id: 3,
      title: 'Circular calendar visualization widgets',
      desc: 'Provide an alternative radar visual showing hourly categories (Build, Lead, Maintain).',
      votes: 18,
      comments: 2,
      status: 'Completed',
      category: 'Dashboard'
    }
  ])

  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCat, setNewCat] = useState('AI Coach')
  const [submitted, setSubmitted] = useState(false)

  const handleVote = (id: number) => {
    if (votedIds.includes(id)) return
    setVotedIds([...votedIds, id])
    setRequests(requests.map(r => r.id === id ? { ...r, votes: r.votes + 1 } : r))
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newDesc.trim()) return
    
    const newReq: FeatureReq = {
      id: requests.length + 1,
      title: newTitle,
      desc: newDesc,
      votes: 1,
      comments: 0,
      status: 'Planned',
      category: newCat
    }

    setRequests([newReq, ...requests])
    setSubmitted(true)
    setTimeout(() => {
      setNewTitle('')
      setNewDesc('')
      setSubmitted(false)
    }, 2000)
  }

  const filteredRequests = requests.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.desc.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <PageShell
      title="Feature Requests"
      description="Submit capabilities you want to see, or vote on requests created by other founders."
      breadcrumbs={breadcrumbs}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-16">
        
        {/* Submit Request Form Column */}
        <div className="lg:col-span-1 bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F7CFF]/5 rounded-full blur-3xl pointer-events-none" />
          
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <span className="p-3 bg-[#22C55E]/15 text-[#36D7FF] rounded-full inline-block">
                <CheckCircle2 size={24} />
              </span>
              <h4 className="text-xs font-bold text-white">Feature Submitted</h4>
              <p className="text-[10px] text-[#A6B0CF]/70 leading-relaxed">
                Thank you! Your request has been added to our public voting stack.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="text-sm font-bold text-white">New Request</h3>
              <p className="text-[10px] text-[#A6B0CF]/70">We actively review the top voted items for the next sprint.</p>
              
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Feature Title</label>
                <input
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
                  placeholder="Sync Slack status..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Category</label>
                <select
                  value={newCat}
                  onChange={e => setNewCat(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050816] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
                >
                  <option value="AI Coach">AI Coach</option>
                  <option value="Dashboard">Dashboard</option>
                  <option value="Integrations">Integrations</option>
                  <option value="Settings">Settings</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all resize-none"
                  placeholder="Explain why founders need this feature..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white text-xs font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-1"
              >
                <Plus size={13} />
                Submit Request
              </button>
            </form>
          )}
        </div>

        {/* Public Stack Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3.5 text-[#A6B0CF]/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
              placeholder="Search feature request backlog..."
            />
          </div>

          <div className="space-y-4">
            {filteredRequests.map((req) => {
              const voted = votedIds.includes(req.id)
              return (
                <div key={req.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4">
                  {/* Voting box */}
                  <button
                    onClick={() => handleVote(req.id)}
                    disabled={voted}
                    className={`flex flex-col items-center justify-center p-2.5 w-12 border rounded-xl transition-all shrink-0 ${
                      voted 
                        ? 'bg-[#4F7CFF]/15 border-[#4F7CFF]/30 text-white'
                        : 'bg-white/5 border-white/5 hover:border-white/10 text-[#A6B0CF]/70 hover:text-white'
                    }`}
                  >
                    <Vote size={14} className={voted ? 'text-[#36D7FF]' : ''} />
                    <span className="text-xs font-extrabold mt-1">{req.votes}</span>
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#A6B0CF]/50 uppercase font-bold tracking-wider">
                        {req.category}
                      </span>
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-extrabold ${
                        req.status === 'Completed'
                          ? 'bg-[#22C55E]/15 text-[#3EE98A] border border-[#22C55E]/30'
                          : req.status === 'In Progress'
                          ? 'bg-[#4F7CFF]/15 text-[#36D7FF] border border-[#4F7CFF]/30'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">{req.title}</h4>
                    <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">{req.desc}</p>
                    
                    <div className="flex items-center gap-1.5 text-[9px] text-[#A6B0CF]/40">
                      <MessageSquare size={10} /> {req.comments} Comments
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </PageShell>
  )
}
