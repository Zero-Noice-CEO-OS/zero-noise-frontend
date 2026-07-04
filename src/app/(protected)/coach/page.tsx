'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Pin, Info, ArrowUpRight, Plus, Trash2, Edit3, Search, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatCoachMutation, useMorningCoachQuery } from '@/hooks/useAi'
import { aiService } from '@/services/ai-service'
import { subscriptionService } from '@/services/subscription-service'

const suggestedPrompts = [
  'How can I improve my deep work habits?',
  'What should I prioritize this week?',
  'How do I delegate more effectively?',
  'Analyze my skill growth trends',
]

interface Message {
  role: 'user' | 'ai'
  content: string
  time?: string
}

interface ChatSession {
  id: string
  title: string
  createdAt: string;
  updatedAt: string;
}

export default function Coach() {
  const [chats, setChats] = useState<ChatSession[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Hello! I'm your AI Executive Coach. I audit your tracked activities, skills matrix, and goals to optimize your operational performance. Ask me anything or choose a prompt to begin.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  
  // Usage tracking variables
  const [aiUsageCount, setAiUsageCount] = useState(0)
  const [pricingPlan, setPricingPlan] = useState('Free Tier')

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Queries & Mutations
  const chatMutation = useChatCoachMutation()
  const morningCoachQuery = useMorningCoachQuery()

  // Fetch subscription details and AI usage limits
  useEffect(() => {
    subscriptionService.getDetails()
      .then(res => {
        setPricingPlan(res.subscription?.plan || 'Free Tier')
        setAiUsageCount(res.usage?.aiRequests || 0)
      })
      .catch(console.error)
  }, [])

  // Fetch User's chat history on load
  const loadChats = async () => {
    try {
      const data = await aiService.getUserChats()
      setChats(data)
      if (data.length > 0 && !activeChatId) {
        setActiveChatId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to load chats:', err)
    }
  }

  useEffect(() => {
    loadChats()
  }, [])

  // Fetch messages when activeChatId changes
  useEffect(() => {
    if (!activeChatId) return
    aiService.getChatMessages(activeChatId)
      .then(data => {
        if (data.length === 0) {
          setMessages([
            {
              role: 'ai',
              content: "This is a new chat session. Ask me anything about your productivity or goals to start compound progress.",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ])
        } else {
          setMessages(data.map(m => ({
            role: m.role as 'user' | 'ai',
            content: m.content,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })))
        }
      })
      .catch(console.error)
  }, [activeChatId])

  // Scroll to bottom when messages list updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const createNewChat = async () => {
    try {
      const newChat = await aiService.createUserChat(`Chat ${chats.length + 1}`)
      setChats([newChat, ...chats])
      setActiveChatId(newChat.id)
    } catch (err) {
      console.error(err)
    }
  }

  const deleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await aiService.deleteUserChat(id)
      const remaining = chats.filter(c => c.id !== id)
      setChats(remaining)
      if (activeChatId === id) {
        setActiveChatId(remaining.length > 0 ? remaining[0].id : null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const renameChat = async (id: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!editTitle.trim()) return
    try {
      await aiService.renameUserChat(id, editTitle)
      setChats(chats.map(c => c.id === id ? { ...c, title: editTitle } : c))
      setEditingChatId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || chatMutation.isPending) return
    
    // Check AI prompt limits
    const currentLimit = pricingPlan === 'Free Tier' ? 5 : pricingPlan === 'Starter' ? 20 : Infinity;
    if (aiUsageCount >= currentLimit) {
      alert(`Daily Prompt Limit Exceeded! You have used ${aiUsageCount}/${currentLimit} AI Prompts today. Please upgrade your plan in Subscriptions page to unlock unlimited access.`)
      return
    }

    let targetChatId = activeChatId
    if (!targetChatId) {
      try {
        const newChat = await aiService.createUserChat(text.slice(0, 30) || 'New Conversation')
        setChats(prev => [newChat, ...prev])
        setActiveChatId(newChat.id)
        targetChatId = newChat.id
      } catch (err) {
        console.error(err)
        return
      }
    }
    
    const userMsg: Message = {
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)

    try {
      const chatHistory = messages.slice(-12).map(m => `${m.role === 'user' ? 'User' : 'Model'}: ${m.content}`)
      
      const result = await chatMutation.mutateAsync({
        message: text,
        history: chatHistory,
        chatId: targetChatId || undefined
      })

      setIsTyping(false)
      const responseContent = (result as any).summary || (result as any).response
      
      const aiResponse: Message = {
        role: 'ai',
        content: responseContent || "I'm having trouble connecting to the AI service. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, aiResponse])
      setAiUsageCount(prev => prev + 1)
      
      // Auto-generate title if the chat session still has its default title
      const currentChat = chats.find(c => c.id === targetChatId)
      if (currentChat && (currentChat.title.startsWith('Chat ') || currentChat.title === 'New AI Coach Session')) {
        const cleanTitle = text.slice(0, 24) + (text.length > 24 ? '...' : '')
        await aiService.renameUserChat(targetChatId as string, cleanTitle)
        setChats(prev => prev.map(c => c.id === targetChatId ? { ...c, title: cleanTitle } : c))
      }
    } catch (err) {
      console.error(err)
      setIsTyping(false)
      // Keep input cleared on success, but restore on fatal error is fine. 
      // The prompt count did not increment since setAiUsageCount is only called on try block success.
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: "I am currently analyzing your performance metrics. Let me know if you would like to align on your morning focus priorities.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    }
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }

  const morningInsight = morningCoachQuery.data?.response || 'Operational efficiency is 24% higher when preceding sessions are blocked directly inside clean 90-minute morning focus windows.'
  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8.5rem)] pb-4 overflow-y-auto lg:overflow-hidden scrollbar-none">
      
      {/* ChatGPT style Left Sidebar for Chats List */}
      <div className="w-full lg:w-64 bg-surface/40 border border-border rounded-card p-4 flex flex-col space-y-4 shrink-0 h-[300px] lg:h-full">
        <button
          onClick={createNewChat}
          className="w-full py-2.5 rounded-xl border border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 transition-all text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus size={14} /> New Chat
        </button>

        {/* Search Chats Input */}
        <div className="relative shrink-0">
          <Search size={12} className="absolute left-3 top-3 text-textSecondary" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/60 text-[11px] focus:outline-none focus:border-primary transition-all"
          />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none pr-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-2.5 rounded-xl text-xs flex items-center justify-between cursor-pointer border group transition-all ${
                activeChatId === chat.id
                  ? 'bg-primary/10 border-primary/20 text-primary font-bold'
                  : 'bg-transparent border-transparent text-textSecondary hover:text-textPrimary hover:bg-surface'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <MessageSquare size={13} className="shrink-0" />
                {editingChatId === chat.id ? (
                  <form onSubmit={(e) => renameChat(chat.id, e)} onClick={e => e.stopPropagation()}>
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onBlur={(e) => renameChat(chat.id, e as any)}
                      className="bg-background border border-primary px-1 py-0.5 rounded text-[10px] w-28 focus:outline-none text-textPrimary"
                    />
                  </form>
                ) : (
                  <span className="truncate">{chat.title}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingChatId(chat.id)
                    setEditTitle(chat.title)
                  }}
                  className="p-1 hover:text-textPrimary text-textSecondary/70 rounded"
                >
                  <Edit3 size={11} />
                </button>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="p-1 hover:text-red-500 text-textSecondary/70 rounded"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat window */}
      <div className="flex bg-surface/50 border border-border rounded-card flex-col overflow-hidden relative shadow-card h-[500px] lg:h-full shrink-0 lg:flex-1">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-border bg-surface/80 dark:bg-[#0B1225]/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm flex items-center justify-center">
              <Sparkles size={16} strokeWidth={2.2} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-textPrimary">AI Performance Advisor</h2>
              <p className="text-[10px] text-success font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Connected to CEO OS Engine
              </p>
            </div>
          </div>

          <div className="text-[10px] font-extrabold text-textSecondary bg-surface border border-border px-2.5 py-1 rounded-full">
            Usage: {aiUsageCount}/{pricingPlan === 'Free Tier' ? '5' : pricingPlan === 'Starter' ? '20' : '∞'} Prompts
          </div>
        </div>

        {/* Scrollable messages container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold border ${
                    msg.role === 'user' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-accent/15 text-accent border-accent/20'
                  }`}>
                    {msg.role === 'user' ? 'ME' : 'AI'}
                  </div>
                  <div className="space-y-1">
                    <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none'
                        : 'bg-background/80 dark:bg-[#111B34] border border-border text-textPrimary rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.time && (
                      <p className={`text-[9px] text-textSecondary font-bold ${msg.role === 'user' ? 'text-right' : ''}`}>
                        {msg.time}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing animation bubble */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2.5 max-w-[80%]">
                <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold bg-accent/15 text-accent border border-accent/20">
                  AI
                </div>
                <div className="px-4 py-3 bg-background/80 dark:bg-[#111B34] border border-border text-textPrimary rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion prompt pills */}
        <div className="px-6 py-3 flex flex-wrap gap-2 border-t border-border/40 bg-surface/30 dark:bg-white/5 overflow-x-auto scrollbar-none shrink-0">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="text-[10px] font-extrabold bg-surface hover:bg-background text-textSecondary hover:text-textPrimary px-3 py-1.5 rounded-full border border-border transition-all flex items-center gap-1 shrink-0"
            >
              {prompt} <ArrowUpRight size={10} strokeWidth={2} />
            </button>
          ))}
        </div>

        {/* Sticky input container */}
        <div className="p-4 border-t border-border bg-surface/80 dark:bg-[#0B1225]/80 backdrop-blur-md flex gap-3 shrink-0">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            className="w-full px-4 py-3 border border-border rounded-input bg-background text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
            placeholder="Ask your performance coach..."
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={chatMutation.isPending}
            className="px-5 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

      {/* Right Sidebar panel */}
      <div className="w-full lg:w-72 space-y-6 shrink-0 mt-4 lg:mt-0">
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card space-y-4">
          <h3 className="text-xs font-bold text-textSecondary uppercase tracking-wider flex items-center gap-1.5">
            <Pin size={13} className="text-accent" /> AI Morning Alignment
          </h3>
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3.5 bg-background dark:bg-white/5 rounded-button border border-border space-y-1">
              <span className="font-bold text-textPrimary">Latest Advice</span>
              <p className="text-textSecondary leading-relaxed text-[10px]">
                {morningInsight}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-secondary text-white p-5 flex flex-col justify-between h-44 rounded-card shadow-card">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white/95">CEO OS Co-Pilot</h4>
            <p className="text-[11px] text-white/80 leading-relaxed mt-2.5">
              Get detailed performance logs and recommendations mapped directly to company goals.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-white/90">
            <Info size={11} /> 100% Secure Audit
          </div>
        </div>
      </div>

    </div>
  )
}
