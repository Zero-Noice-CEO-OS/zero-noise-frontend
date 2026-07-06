'use client'

import React, { useState, useEffect } from 'react'
import PageShell from '@/components/PageShell'
import { ThumbsUp, Plus, Sparkles, Filter } from 'lucide-react'

interface FeatureRequest {
  id: string
  title: string
  description?: string
  votes: number
  status: string
}

export default function FeatureRequestsPage() {
  const breadcrumbs = [
    { label: 'Resources', href: '/documentation' },
    { label: 'Feature Requests' }
  ]

  const [requests, setRequests] = useState<FeatureRequest[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'popular' | 'newest'>('popular')
  const [loading, setLoading] = useState(false)

  const loadRequests = async () => {
    try {
      const { apiClient } = require('@/services/api-client')
      const response = await apiClient.get('/auth/features-requests')
      const data = response?.data
      setRequests(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setRequests([])
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    setLoading(true)
    try {
      const { apiClient } = require('@/services/api-client')
      const response = await apiClient.post('/auth/features-requests', { title, description })
      const newReq = response?.data
      if (newReq) {
        setRequests((prev) => [newReq, ...(Array.isArray(prev) ? prev : [])])
      }
      setTitle('')
      setDescription('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (id: string) => {
    try {
      const { apiClient } = require('@/services/api-client')
      await apiClient.post(`/auth/features-requests/${id}/vote`)
      setRequests((prev) => {
        const arr = Array.isArray(prev) ? prev : []
        return arr.map((r) => (r && r.id === id ? { ...r, votes: (r.votes || 0) + 1 } : r))
      })
    } catch (err) {
      console.error(err)
    }
  }

  const arrRequests = Array.isArray(requests) ? requests : []
  const filteredRequests = arrRequests
    .filter((r) => r && (filterStatus === 'All' || r.status === filterStatus))
    .sort((a, b) => {
      if (sortBy === 'popular') return (b.votes || 0) - (a.votes || 0)
      return (b.id || '').localeCompare(a.id || '')
    })

  const getStatusBadgeClass = (status: string) => {
    if (status === 'Planned') return 'bg-[#36D7FF]/15 text-[#36D7FF] border-[#36D7FF]/20'
    if (status === 'In Progress') return 'bg-[#7B5CFF]/15 text-[#7B5CFF] border-[#7B5CFF]/20'
    return 'bg-success/15 text-success border-success/20'
  }

  const staticFilters = ['All', 'Planned', 'In Progress', 'Completed']
  const arrFiltered = Array.isArray(filteredRequests) ? filteredRequests : []

  return (
    <PageShell
      title="Feature Requests"
      description="Submit capabilities you want to see next and vote on other requests."
      breadcrumbs={breadcrumbs}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-16">
        {/* Form Column */}
        <div className="lg:col-span-1 bg-white/5 border border-white/5 rounded-2xl p-6 h-fit space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Plus size={16} className="text-[#36D7FF]" /> Suggest a Feature
          </h3>
          <p className="text-xs text-[#A6B0CF]/70">
            Submit your idea anonymously. Personal credentials or secrets are never exposed publicly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Feature Title</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all"
                placeholder="e.g. Mobile app for iOS & Android"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-[#A6B0CF]/60">Description (Optional)</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all resize-none"
                placeholder="Explain the usecase and how it impacts your workspace..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white text-xs font-bold shadow-md hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Requests Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex gap-2">
              {staticFilters.map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                    filterStatus === st
                      ? 'bg-primary/20 border-primary text-white'
                      : 'bg-white/5 border-transparent text-[#A6B0CF]/70 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter size={12} className="text-[#A6B0CF]/40" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#050816] border border-white/10 rounded-lg px-2.5 py-1 text-white text-[10px] focus:outline-none focus:border-primary font-bold"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {arrFiltered.length === 0 ? (
              <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/5 text-xs text-[#A6B0CF]/40">
                No feature requests found matching filters. Be the first to suggest one!
              </div>
            ) : (
              arrFiltered.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-start justify-between gap-6 hover:border-white/10 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold border ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{req.title}</h4>
                    {req.description && (
                      <p className="text-[11px] text-[#A6B0CF]/70 leading-relaxed">{req.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleVote(req.id)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-[#A6B0CF] hover:text-white shrink-0 min-w-10 active:scale-90"
                  >
                    <ThumbsUp size={12} className="mb-1" />
                    <span className="text-[10px] font-bold">{req.votes}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}
