'use client'

import React, { useState, useEffect } from 'react'
import PageShell from '@/components/PageShell'
import { Calendar, Search, Mail, ArrowRight, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface BlogArticle {
  title: string
  description: string
  content: string
  url: string
  image: string
  publishedAt: string
  source: {
    name: string
    url: string
  }
  category: string
  slug: string
}

export default function BlogPage() {
  const breadcrumbs = [
    { label: 'Resources', href: '/documentation' },
    { label: 'Blog' }
  ]

  const [articles, setArticles] = useState<BlogArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('productivity')
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const loadArticles = async (cat: string, q: string) => {
    setLoading(true)
    try {
      const { publicApiClient } = require('@/services/api-client')
      const response = await publicApiClient.get(`/blog?category=${cat}&q=${q}`)
      const rawList = response.data?.data || response.data || []
      setArticles(Array.isArray(rawList) ? rawList : [])
    } catch (e) {
      console.error(e)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles(category, searchQuery)
  }, [category])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadArticles(category, searchQuery)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 2000)
  }

  const [pageLimit, setPageLimit] = useState(6)

  // Relative published date utility formatter
  const formatDate = (isoString: string) => {
    try {
      const dateObj = new Date(isoString);
      const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days}d ago`;
      
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  }

  // Duplicate article removal by title signature
  const uniqueArticles = Array.from(new Map(articles.map(art => [art.title, art])).values())

  const featured = uniqueArticles[0]
  const listArticles = uniqueArticles.slice(1, pageLimit)
  const hasMore = uniqueArticles.length > pageLimit

  return (
    <PageShell
      title="Zero Noise Blog"
      description="Compounding productivity insights, AI coach parameters, and startup metrics benchmarks."
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-12 pb-16">
        
        {/* Search & Category Filter Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div className="flex gap-2 flex-wrap">
            {['productivity', 'ai', 'startup', 'technology', 'business'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-[10px] uppercase font-bold tracking-wider border transition-all ${
                  category === cat
                    ? 'bg-primary/20 border-primary text-white'
                    : 'bg-white/5 border-transparent text-[#A6B0CF]/70 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search startup insights..."
              className="w-full pl-9 pr-4 py-2 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-primary transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-[#A6B0CF]/40" size={14} />
          </form>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 py-12">
            <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured ? (
              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/5 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F7CFF]/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-4">
                  <span className="px-2.5 py-1 bg-[#4F7CFF]/15 text-[#36D7FF] text-[10px] font-bold rounded-lg uppercase tracking-wider">
                    FEATURED ARTICLE
                  </span>
                  <Link href={`/blog/${featured.slug}`} className="block group space-y-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight group-hover:text-primary transition-all">
                      {featured.title}
                    </h2>
                    <p className="text-xs text-[#A6B0CF]/70 leading-relaxed">
                      {featured.description}
                    </p>
                  </Link>
                  <div className="flex items-center gap-4 text-[10px] text-[#A6B0CF]/50">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(featured.publishedAt)}</span>
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {featured.source.name}</span>
                  </div>
                </div>
                
                {featured.image && (
                  <div className="rounded-xl overflow-hidden border border-white/5 aspect-video w-full relative">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 border border-white/5 rounded-2xl bg-white/5 text-xs text-[#A6B0CF]/40">
                No articles found. Try modifying your search parameters.
              </div>
            )}

            {/* Latest Articles list */}
            {listArticles.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Latest Articles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listArticles.map((art) => (
                    <Link
                      key={art.slug}
                      href={`/blog/${art.slug}`}
                      className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/[0.07] transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="rounded-xl overflow-hidden border border-white/5 aspect-video w-full mb-2">
                          <img
                            src={art.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600'}
                            alt={art.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
                          />
                        </div>
                        <span className="text-[10px] text-[#36D7FF] font-bold uppercase">{art.category}</span>
                        <h4 className="text-sm font-bold text-white leading-snug group-hover:text-primary transition-all">{art.title}</h4>
                        <p className="text-xs text-[#A6B0CF]/70 leading-relaxed line-clamp-2">{art.description}</p>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#A6B0CF]/50 pt-2">
                        <span>{formatDate(art.publishedAt)}</span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[#A6B0CF]/70 border border-white/5 font-extrabold text-[8px] uppercase tracking-wider">
                          {art.source.name}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={() => setPageLimit(prev => prev + 4)}
                      className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-bold text-xs hover:bg-white/5 transition-all active:scale-95"
                    >
                      Load More Articles
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Newsletter Subscription Banner */}
        <div className="p-8 bg-gradient-to-r from-[#7B5CFF]/15 via-[#4F7CFF]/5 to-transparent border border-white/5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-2">
            <h4 className="text-md font-bold text-white">Subscribe to Founder Productivity</h4>
            <p className="text-xs text-[#A6B0CF]/70 max-w-sm">Receive zero-spam articles on calendar audit strategies and execution tips.</p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              required
              type="email"
              disabled={subscribed}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-[#050816] border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-[#4F7CFF] text-xs transition-all disabled:opacity-50"
              placeholder="founder@sprint.com"
            />
            <button
              type="submit"
              disabled={subscribed}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7CFF] to-[#7B5CFF] text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              {subscribed ? 'Subscribed' : 'Join'} <ArrowRight size={13} />
            </button>
          </form>
        </div>

      </div>
    </PageShell>
  )
}
