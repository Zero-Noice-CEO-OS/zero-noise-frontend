'use client'

import PageShell from '@/components/PageShell'
import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react'

const faqGroups = [
  {
    category: 'General',
    items: [
      { q: 'What is Zero Noise CEO OS?', a: 'Zero Noise CEO OS is an executive workspace designed specifically for startup founders and chief executives to minimize operational noise, protect deep focus, benchmark key skills, and receive daily coaching.' },
      { q: 'Why is it called Zero Noise?', a: 'Because modern task planners flood founders with micro-notifications. Zero Noise filters updates to focus attention purely on strategic high-leverage activities.' }
    ]
  },
  {
    category: 'AI Coach',
    items: [
      { q: 'How does the AI Coach work?', a: 'The Coach logs your check-in ratings, time tracking metrics, and goals. It uses LLM modeling to suggest timezone alignment, deep work slots, and priority reviews.' }
    ]
  },
  {
    category: 'Privacy & Security',
    items: [
      { q: 'Is my tracked workspace data encrypted?', a: 'Yes. All scores, goals, logs, and sessions are encrypted using JWT protocols on server transactions.' }
    ]
  }
]

export default function FaqPage() {
  const breadcrumbs = [
    { label: 'Resources', href: '#' },
    { label: 'FAQ' }
  ]

  const [search, setSearch] = useState('')
  const [activeFaq, setActiveFaq] = useState<string | null>(null)

  const toggleFaq = (key: string) => {
    setActiveFaq(activeFaq === key ? null : key)
  }

  return (
    <PageShell
      title="FAQ"
      description="Answers to common questions about Zero Noise CEO OS capabilities, security, and setup."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-10 pb-16 max-w-3xl mx-auto">
        
        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-[#A6B0CF]/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
            placeholder="Search questions (e.g. AI Coach, security)..."
          />
        </div>

        {/* FAQ Accordion Groups */}
        <div className="space-y-8">
          {faqGroups.map((group, groupIdx) => {
            // Simple query filtering
            const filteredItems = group.items.filter(item => 
              item.q.toLowerCase().includes(search.toLowerCase()) || 
              item.a.toLowerCase().includes(search.toLowerCase())
            )
            
            if (filteredItems.length === 0) return null

            return (
              <div key={groupIdx} className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/50 block px-1">
                  {group.category}
                </span>
                
                <div className="space-y-3">
                  {filteredItems.map((item, itemIdx) => {
                    const key = `${groupIdx}-${itemIdx}`
                    const isOpen = activeFaq === key
                    
                    return (
                      <div 
                        key={itemIdx}
                        className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleFaq(key)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left text-xs font-bold text-white hover:bg-white/[0.02] transition-all"
                        >
                          <span className="flex items-center gap-2">
                            <HelpCircle size={14} className="text-[#36D7FF]" />
                            {item.q}
                          </span>
                          <span className="text-[#A6B0CF]">
                            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-4 text-xs text-[#A6B0CF]/70 leading-relaxed pt-2 border-t border-white/5 bg-white/[0.01]">
                            {item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </PageShell>
  )
}
