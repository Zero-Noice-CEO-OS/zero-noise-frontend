'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  Send,
  Sparkles,
  Pin,
  Info,
  ArrowUpRight,
  Plus,
  Trash2,
  Edit3,
  Search,
  MessageSquare,
  Database,
  TrendingUp,
  Clock,
  Target,
  Brain,
  History,
  Lock,
  Smile,
  Meh,
  Frown,
  Activity,
  AlertTriangle,
  Award,
  Zap,
  BookOpen
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatCoachMutation } from '@/hooks/useAi'
import { aiService } from '@/services/ai-service'
import { subscriptionService } from '@/services/subscription-service'
import { useDashboardSummary, useDashboardToday } from '@/hooks/useDashboard'

const suggestedPrompts = [
  'Summarize my day',
  'How can I improve focus?',
  'Analyse my goals',
  'Analyse my skill growth',
  'Review my deep work',
  'What should I prioritize?'
]

interface Message {
  role: 'user' | 'ai'
  content: string
  time?: string
  customCard?: any
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
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  // Coach Modes
  const [selectedCoachType, setSelectedCoachType] = useState<'morning' | 'review' | 'strategic'>('morning')
  const [coachData, setCoachData] = useState<any>(null)
  const [coachLoading, setCoachLoading] = useState(false)

  // Rate Limiting States
  const [usageCount, setUsageCount] = useState(0)
  const [usageLimit, setUsageLimit] = useState(20)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Queries
  const chatMutation = useChatCoachMutation()
  const dashboardSummaryQuery = useDashboardSummary()
  const todayOverviewQuery = useDashboardToday()

  const summary = dashboardSummaryQuery.data
  const todayOverview = todayOverviewQuery.data

  const loadUsage = async () => {
    try {
      const data = await aiService.getUsage()
      setUsageCount(data.count)
      setUsageLimit(data.limit)
    } catch (e) {
      console.error(e)
    }
  }

  // Load coach mode details
  const loadCoachAdvice = async (type: 'morning' | 'review' | 'strategic') => {
    setCoachLoading(true)
    setCoachData(null)
    try {
      let res: any;
      if (type === 'morning') {
        res = await aiService.getMorningCoachAdvice()
      } else if (type === 'review') {
        res = await aiService.getDailyReviewAdvice()
      } else {
        res = await aiService.getStrategicAdvice()
      }
      setCoachData(res)
    } catch (err) {
      console.error(err)
      setCoachData({
        error: true,
        summary: "AI Coach is temporarily unavailable.",
        recommendations: ["Verify backend connection."]
      })
    } finally {
      setCoachLoading(false)
    }
  }

  useEffect(() => {
    loadCoachAdvice(selectedCoachType)
  }, [selectedCoachType])

  useEffect(() => {
    loadUsage()
  }, [messages])

  // Load chat history
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
    if (usageCount >= usageLimit) {
      alert("You've reached today's AI limit.")
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

      // Auto-generate title
      const currentChat = chats.find(c => c.id === targetChatId)
      if (currentChat && (currentChat.title.startsWith('Chat ') || currentChat.title === 'New AI Coach Session')) {
        const cleanTitle = text.slice(0, 24) + (text.length > 24 ? '...' : '')
        await aiService.renameUserChat(targetChatId as string, cleanTitle)
        setChats(prev => prev.map(c => c.id === targetChatId ? { ...c, title: cleanTitle } : c))
      }
    } catch (err) {
      console.error(err)
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: "AI Coach is temporarily unavailable.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    }
  }

  const filteredChats = chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatMinutes = (mins: number) => {
    if (!mins) return '0 min'
    return `${mins} min`
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8.5rem)] pb-4 overflow-y-auto lg:overflow-hidden scrollbar-none">
      
      {/* Chats Sidebar */}
      <div className="w-full lg:w-64 bg-surface/40 border border-border rounded-card p-4 flex flex-col space-y-4 shrink-0 h-[300px] lg:h-full">
        <button
          onClick={createNewChat}
          className="w-full py-2.5 rounded-xl border border-dashed border-primary/30 hover:border-primary text-primary hover:bg-primary/5 transition-all text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus size={14} /> New Chat
        </button>

        <div className="relative shrink-0">
          <Search size={12} className="absolute left-3 top-3 text-textSecondary" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-xl text-textPrimary placeholder:text-textSecondary/60 text-[11px] focus:outline-none focus:border-primary transition-all"
          />
        </div>

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

      {/* Center Pane */}
      <div className="flex flex-col lg:flex-1 h-[550px] lg:h-full space-y-6">
        
        {/* Top Coach Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface/50 border border-border rounded-card p-4">
          {[
            { id: 'morning', label: 'Morning Coach', desc: 'Plan your day with clarity', icon: Sparkles, locked: false },
            { id: 'review', label: 'Review Coach', desc: 'Reflect and improve daily', icon: Brain, locked: false },
            { id: 'strategic', label: 'Strategic Coach', desc: 'Long-term growth partner', icon: Target, locked: true },
          ].map((c) => {
            const isActive = selectedCoachType === c.id
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCoachType(c.id as any)}
                className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between h-24 relative overflow-hidden group ${
                  isActive
                    ? 'bg-primary/10 border-primary text-primary font-bold'
                    : 'bg-background/40 border-border text-textSecondary hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-extrabold text-textPrimary uppercase tracking-wider">{c.label}</span>
                  <c.icon size={16} className={isActive ? 'text-primary' : 'text-textSecondary/70'} />
                </div>
                <p className="text-[10px] text-textSecondary mt-1 leading-snug">{c.desc}</p>
                {c.locked && (
                  <span className="absolute bottom-2 right-2 text-textSecondary/40 group-hover:text-primary transition-colors">
                    <Lock size={12} />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Chat Pane */}
        <div className="flex bg-surface/50 border border-border rounded-card flex-col overflow-hidden relative shadow-card flex-1">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-secondary text-white shadow-sm flex items-center justify-center">
                <Sparkles size={16} strokeWidth={2.2} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">AI Executive Advisor</h2>
                <p className="text-[10px] text-success font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Connected to CEO OS Engine
                </p>
              </div>
            </div>

            {/* Daily AI Limit Progress Tracker */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[9px] font-extrabold uppercase text-textSecondary">Daily AI Limit</span>
                <p className="text-xs font-black text-textPrimary">{usageCount} / {usageLimit} used</p>
              </div>
              <div className="w-20 h-1.5 bg-background rounded-full overflow-hidden border border-border/60">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${(usageCount / usageLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            
            {/* Prepend loaded coach advice formatted response if available */}
            {coachLoading ? (
              <div className="p-6 border border-border/60 bg-background/20 rounded-card space-y-4 animate-pulse">
                <div className="h-3 w-1/3 bg-border rounded" />
                <div className="h-10 w-full bg-border rounded" />
                <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-border rounded" />
                  ))}
                </div>
              </div>
            ) : coachData ? (
              <div className="p-6 border border-primary/20 bg-primary/5 rounded-card space-y-5 animate-fade-in relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-border/40 pb-3">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase text-primary tracking-wider">Performance Audit Snapshot</h4>
                    <p className="text-[10px] text-textSecondary mt-0.5">Analysed with Gemini &bull; Today</p>
                  </div>
                  {coachData.locked && (
                    <span className="text-[9px] bg-warning/10 text-warning px-2.5 py-0.5 rounded border border-warning/20 font-extrabold uppercase tracking-wide flex items-center gap-1">
                      <Lock size={10} /> Locked
                    </span>
                  )}
                </div>

                <p className="text-xs leading-relaxed text-textPrimary font-semibold">
                  {coachData.summary}
                </p>

                {!coachData.locked && (
                  <>
                    {/* Today at a glance row */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-center">
                      <div className="bg-surface border border-border p-2.5 rounded-lg">
                        <span className="text-[9px] font-bold text-textSecondary uppercase">Activities</span>
                        <p className="text-xs font-black text-textPrimary mt-1">{summary?.todayActivitiesCount ?? 0} Completed</p>
                      </div>
                      <div className="bg-surface border border-border p-2.5 rounded-lg">
                        <span className="text-[9px] font-bold text-textSecondary uppercase">Deep Work</span>
                        <p className="text-xs font-black text-textPrimary mt-1">{formatMinutes(todayOverview?.deepWorkSummary?.totalMinutes ?? 0)}</p>
                      </div>
                      <div className="bg-surface border border-border p-2.5 rounded-lg">
                        <span className="text-[9px] font-bold text-textSecondary uppercase">Goals Progress</span>
                        <p className="text-xs font-black text-primary mt-1">On Track</p>
                      </div>
                      <div className="bg-surface border border-border p-2.5 rounded-lg">
                        <span className="text-[9px] font-bold text-textSecondary uppercase">Skills</span>
                        <p className="text-xs font-black text-textPrimary mt-1">7 Tracked</p>
                      </div>
                      <div className="bg-surface border border-border p-2.5 rounded-lg">
                        <span className="text-[9px] font-bold text-textSecondary uppercase">CEO Score</span>
                        <p className="text-xs font-black text-success mt-1">{summary?.currentCeoScore ?? 78}/100</p>
                      </div>
                    </div>

                    {/* Wins & Misses bullets */}
                    {coachData.strengths && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/40 pt-4">
                        <div className="space-y-2">
                          <h5 className="text-[9px] font-extrabold uppercase text-success flex items-center gap-1"><Smile size={12} /> Wins</h5>
                          {coachData.strengths.map((s: string, idx: number) => (
                            <p key={idx} className="text-xs text-textSecondary font-medium">&bull; {s}</p>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <h5 className="text-[9px] font-extrabold uppercase text-danger flex items-center gap-1"><AlertTriangle size={12} /> Misses</h5>
                          {coachData.weaknesses?.map((w: string, idx: number) => (
                            <p key={idx} className="text-xs text-textSecondary font-medium">&bull; {w}</p>
                          )) || <p className="text-xs text-textSecondary italic">&bull; None identified.</p>}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {coachData.recommendations && (
                      <div className="border-t border-border/40 pt-4 space-y-2">
                        <h5 className="text-[9px] font-extrabold uppercase text-primary flex items-center gap-1"><TrendingUp size={12} /> Action Recommendations</h5>
                        {coachData.recommendations.map((r: string, idx: number) => (
                          <p key={idx} className="text-xs text-textSecondary font-medium">&bull; {r}</p>
                        ))}
                      </div>
                    )}
                  </>
                )}

              </div>
            ) : null}

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
                          : 'bg-background/80 border border-border text-textPrimary rounded-tl-none'
                      }`}>
                        {msg.content === "AI Coach is temporarily unavailable." ? (
                          <span className="text-danger font-extrabold flex items-center gap-1.5">
                            <AlertTriangle size={14} /> AI Coach is temporarily unavailable.
                          </span>
                        ) : msg.content}
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

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2.5 max-w-[80%]">
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold bg-accent/15 text-accent border border-accent/20">
                    AI
                  </div>
                  <div className="px-4 py-3 bg-background border border-border text-textPrimary rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-6 py-3 flex flex-wrap gap-2 border-t border-border/40 bg-surface/30 overflow-x-auto scrollbar-none shrink-0">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p)}
                disabled={usageCount >= usageLimit}
                className="text-[10px] font-extrabold bg-surface hover:bg-background text-textSecondary hover:text-textPrimary px-3 py-1.5 rounded-full border border-border transition-all flex items-center gap-1 shrink-0 disabled:opacity-50"
              >
                {p} <ArrowUpRight size={10} strokeWidth={2} />
              </button>
            ))}
          </div>

          {/* Sticky input */}
          <div className="p-4 border-t border-border bg-surface/80 backdrop-blur-md flex gap-3 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              disabled={usageCount >= usageLimit}
              className="w-full px-4 py-3 border border-border rounded-input bg-background text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs disabled:opacity-50"
              placeholder={usageCount >= usageLimit ? "You've reached today's AI limit." : "Ask your performance coach..."}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={chatMutation.isPending || usageCount >= usageLimit}
              className="px-5 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Context Used, AI Insights, Conversation History */}
      <div className="w-full lg:w-72 space-y-6 shrink-0 mt-4 lg:mt-0 overflow-y-auto scrollbar-none">
        
        {/* Context Used Panel */}
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card space-y-3">
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
              <Database size={13} className="text-primary" /> Context Used
            </h3>
            <span className="text-[9px] font-extrabold text-success flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live
            </span>
          </div>
          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-textSecondary flex items-center gap-1.5"><Activity size={12} /> Activities</span>
              <span className="font-bold text-textPrimary">{summary?.todayActivitiesCount ?? 0} today</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary flex items-center gap-1.5"><Clock size={12} /> Deep Work Sessions</span>
              <span className="font-bold text-textPrimary">{summary?.todayDeepWorkSessionsCount ?? 0} today</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary flex items-center gap-1.5"><Target size={12} /> Goals</span>
              <span className="font-bold text-textPrimary">{summary?.currentGoalsCount ?? 0} active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary flex items-center gap-1.5"><Brain size={12} /> Skills</span>
              <span className="font-bold text-textPrimary">7 tracked</span>
            </div>
            <div className="flex justify-between items-center border-t border-border/40 pt-2.5">
              <span className="text-textSecondary">Morning Check-in</span>
              <span className={`font-bold text-[10px] uppercase ${todayOverview?.morningCheckIn ? 'text-success' : 'text-warning'}`}>
                {todayOverview?.morningCheckIn ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary">Latest Review</span>
              <span className="font-bold text-textPrimary">Today</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary">CEO Score</span>
              <span className="font-bold text-primary">{summary?.currentCeoScore ?? 78} / 100</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary">Weekly Trend</span>
              <span className="font-bold text-success">Good</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-textSecondary">Monthly Trend</span>
              <span className="font-bold text-success">On Track</span>
            </div>
          </div>
        </div>

        {/* AI Insights panel */}
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card space-y-4">
          <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} className="text-accent" /> AI Insights
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-background rounded border border-border/60">
              <span className="font-bold text-primary block text-[10px] uppercase">Goal Insight</span>
              <p className="text-textSecondary text-[10px] leading-relaxed mt-1">You're 18% toward your MRR goal. Maintain this pace!</p>
            </div>
            <div className="p-3 bg-background rounded border border-border/60">
              <span className="font-bold text-success block text-[10px] uppercase">Focus Insight</span>
              <p className="text-textSecondary text-[10px] leading-relaxed mt-1">Your deep work consistency is improving. Keep protecting focus time.</p>
            </div>
            <div className="p-3 bg-background rounded border border-border/60">
              <span className="font-bold text-indigo-500 block text-[10px] uppercase">Skill Insight</span>
              <p className="text-textSecondary text-[10px] leading-relaxed mt-1">You practiced 7 skills today. Communication is your top skill!</p>
            </div>
          </div>
        </div>

        {/* Conversation History */}
        <div className="bg-surface/50 border border-border rounded-card p-5 shadow-card space-y-3">
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider">Conversation History</h3>
            <button onClick={createNewChat} className="text-[10px] text-primary font-bold hover:underline">New Chat</button>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[180px] pr-1">
            {filteredChats.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChatId(c.id)}
                className={`w-full flex items-center justify-between py-1.5 border-b border-border last:border-0 text-left transition-all ${
                  activeChatId === c.id ? 'text-primary font-bold' : 'hover:opacity-85'
                }`}
              >
                <span className="text-[10px] text-textPrimary truncate">{c.title}</span>
                <span className="text-[9px] text-textSecondary shrink-0">{new Date(c.updatedAt).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
