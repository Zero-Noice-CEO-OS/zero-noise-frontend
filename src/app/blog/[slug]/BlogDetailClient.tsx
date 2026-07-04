'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PageShell from '@/components/PageShell'
import { Calendar, User, Clock, ArrowLeft, Share2, Twitter, Linkedin, ExternalLink } from 'lucide-react'
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

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState<BlogArticle | null>(null)
  const [loading, setLoading] = useState(true)

  const loadArticle = async () => {
    try {
      const { publicApiClient } = require('@/services/api-client')
      const response = await publicApiClient.get(`/blog/${slug}`)
      const artData = response.data?.data || response.data
      setArticle(artData || null)
    } catch (e) {
      console.error(e)
      setArticle(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      loadArticle()
    }
  }, [slug])

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      alert('Article link copied to clipboard!')
    }
  }

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'July 1, 2026'
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return 'July 1, 2026'
    }
  }

  const breadcrumbs = [
    { label: 'Blog', href: '/blog' },
    { label: 'Article Details' }
  ]

  if (loading) {
    return (
      <PageShell title="Loading Article..." description="Retrieving insights..." breadcrumbs={breadcrumbs}>
        <div className="max-w-3xl mx-auto space-y-8 py-16 animate-pulse">
          <div className="h-8 w-3/4 bg-white/5 rounded-xl" />
          <div className="h-4 w-1/4 bg-white/5 rounded-xl" />
          <div className="h-64 w-full bg-white/5 rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-2/3 bg-white/5 rounded" />
          </div>
        </div>
      </PageShell>
    )
  }

  if (!article) {
    return (
      <PageShell title="Article Not Found" description="The requested article details could not be retrieved." breadcrumbs={breadcrumbs}>
        <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
          <p className="text-sm text-[#A6B0CF]/60">This article might have expired or does not exist.</p>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title={article.title}
      description={article.description}
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-1 text-xs text-[#A6B0CF]/60 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to articles
        </Link>

        {/* Hero image if exists */}
        {article.image && (
          <div className="rounded-2xl overflow-hidden border border-white/5 aspect-video w-full relative">
            <img
              src={article.image}
              alt={article.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Metadata Header */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-[#A6B0CF]/50 border-b border-white/5 pb-6">
          <span className="flex items-center gap-1.5 text-primary font-bold">
            <User size={13} /> {article.source.name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={13} /> {formatDate(article.publishedAt)}
          </span>
          <span className="px-2 py-0.5 bg-[#4F7CFF]/15 text-[#36D7FF] font-bold rounded uppercase text-[10px]">
            {article.category}
          </span>
        </div>

        {/* Dynamic Summary Content */}
        <div className="text-xs text-[#A6B0CF]/80 leading-relaxed font-medium space-y-6">
          <p>{article.content || article.description}</p>
        </div>

        {/* Read Original Article CTA */}
        {article.url && (
          <div className="py-4">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
            >
              Read Original Article <ExternalLink size={13} />
            </a>
          </div>
        )}

        {/* Share buttons */}
        <div className="pt-8 border-t border-white/5 flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Share this article</span>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all"
              title="Copy Link"
            >
              <Share2 size={14} />
            </button>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A6B0CF] hover:text-white transition-all"
            >
              <Twitter size={14} />
            </a>
            <a 
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A6B0CF] hover:text-white transition-all"
            >
              <Linkedin size={14} />
            </a>
          </div>
        </div>

      </div>
    </PageShell>
  )
}
