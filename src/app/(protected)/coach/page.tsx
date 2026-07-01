'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'

const suggestedPrompts = [
  'How can I improve my deep work habits?',
  'What should I prioritize this week?',
  'How do I delegate more effectively?',
  'Analyze my skill growth trends',
]

interface Message {
  role: 'user' | 'ai'
  content: string
}

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hello! I'm your AI Coach. I analyze your activities, skills, and goals to provide personalized guidance. Ask me anything or try one of the suggested prompts below." }
  ])
  const [input, setInput] = useState('')

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: `Based on your recent data, here's my recommendation: Focus on maintaining your deep work streak. You've been averaging 2.5 hours daily — aim for 3 hours by blocking your calendar from 9-12am. Your strategic thinking skill shows the fastest growth when paired with uninterrupted morning sessions.` }])
    }, 500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-[30px] font-bold mb-4">AI Coach</h1>

      <div className="flex-1 card overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-surface-light dark:bg-gray-800 text-text-primary dark:text-gray-200'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {suggestedPrompts.map((prompt, i) => (
          <button key={i} onClick={() => sendMessage(prompt)} className="text-xs bg-surface-light dark:bg-gray-800 text-text-muted hover:text-primary hover:bg-primary/5 px-3 py-1.5 rounded-full transition-all duration-150">
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          className="input-field flex-1"
          placeholder="Ask your AI coach..."
        />
        <button onClick={() => sendMessage(input)} className="btn-primary px-4">
          <Send size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}
