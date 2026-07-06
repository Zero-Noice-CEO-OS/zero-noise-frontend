'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Smile,
  Zap,
  BookOpen,
  CheckCircle2
} from 'lucide-react'
import { useReview } from '@/hooks/useReviews'

function ReviewDetailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams?.get('id') as string

  const { data: review, isLoading } = useReview(id)

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Syncing review log...</p>
      </div>
    )
  }

  if (!review) {
    return (
      <div className="space-y-6 pb-16 animate-fade-in">
        <Link href="/reviews" className="inline-flex items-center gap-1.5 text-xs font-bold text-textSecondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Reviews
        </Link>
        <div className="bg-surface/50 border border-border rounded-card p-12 text-center text-xs text-textSecondary font-semibold">
          Review not found.
        </div>
      </div>
    )
  }

  const recs = review.recommendations as any
  const stats = recs?.stats || {}
  const reflection = recs?.reflection || {}

  const formatMinutes = (mins: number) => {
    if (!mins) return '0h 0m'
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}m`
  }

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/reviews" className="inline-flex items-center gap-1.5 text-xs font-bold text-textSecondary hover:text-primary transition-colors mb-2">
            <ArrowLeft size={14} /> Back to Reviews
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">
            {review.type} Review &bull; {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h1>
          <p className="text-xs text-textSecondary mt-1">Generated on {new Date(review.createdAt).toLocaleString()}</p>
        </div>
        <span className="flex items-center gap-1.5 bg-success/10 border border-success/20 text-success px-4 py-2.5 rounded-button text-xs font-extrabold shadow-sm uppercase tracking-wider self-start sm:self-auto">
          <Lock size={13} /> Locked Review
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Reflection Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Coach Summary */}
          <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-6">
            <div className="flex items-center gap-2 border-b border-border/40 pb-4">
              <Sparkles size={16} className="text-primary animate-pulse" />
              <h3 className="text-sm font-extrabold text-textPrimary uppercase tracking-wider">AI Coach Summary</h3>
            </div>

            <p className="text-xs leading-relaxed text-textPrimary font-semibold border-l-2 border-primary pl-4 py-1 bg-primary/5 rounded-r">
              {review.summary}
            </p>

            {recs?.strengths && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase text-success tracking-wider">Wins & Accomplishments</h4>
                  <div className="space-y-1.5">
                    {recs.strengths.map((str: string, i: number) => (
                      <p key={i} className="text-xs text-textSecondary font-medium">• {str}</p>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold uppercase text-primary tracking-wider">Recommendations</h4>
                  <div className="space-y-1.5">
                    {recs.recommendations.map((rec: string, i: number) => (
                      <p key={i} className="text-xs text-textSecondary font-medium">• {rec}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reflection answers card */}
          {review.type === 'Daily' && (
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-6">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <CheckCircle2 size={16} className="text-success" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-textPrimary">Reflection Answers</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1">
                  <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">What went well today?</p>
                  <p className="text-textPrimary leading-relaxed">{reflection.wins || 'No answer recorded.'}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">What didn't go well?</p>
                  <p className="text-textPrimary leading-relaxed">{reflection.misses || 'No answer recorded.'}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">Biggest achievement</p>
                  <p className="text-textPrimary leading-relaxed">{reflection.achievement || 'No answer recorded.'}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">Biggest challenge</p>
                  <p className="text-textPrimary leading-relaxed">{reflection.challenge || 'No answer recorded.'}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">What did I improve today?</p>
                  <p className="text-textPrimary leading-relaxed">{reflection.lessons || 'No answer recorded.'}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="font-extrabold text-[9px] text-textSecondary uppercase tracking-wider">Top priorities for tomorrow</p>
                  <p className="text-textPrimary leading-relaxed">{reflection.tomorrowPriorities || 'No answer recorded.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Score Metrics Cards */}
        <div className="space-y-6">
          <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-textPrimary uppercase tracking-wider border-b border-border/40 pb-2">Metrics Snapshot</h3>

            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-full shadow-inner">
                  <span className="text-lg font-black text-primary">{stats.ceoScore || 70}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-textSecondary">CEO Score Snapshot</span>
                  <p className="text-xs font-black text-textPrimary mt-0.5">{stats.ceoScore || 70} / 100</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-border/40 pt-3">
                <div className="p-2 bg-success/10 rounded-lg text-success">
                  <Smile size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-textSecondary">Energy level</span>
                  <p className="text-xs font-black text-textPrimary mt-0.5">{stats.energy || 7} / 10</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-border/40 pt-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <Zap size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-textSecondary">Deep work time</span>
                  <p className="text-xs font-black text-textPrimary mt-0.5">{formatMinutes(stats.deepWorkTotalMinutes)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-border/40 pt-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                  <BookOpen size={18} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-textSecondary">Activities logged</span>
                  <p className="text-xs font-black text-textPrimary mt-0.5">{stats.activitiesLogged || 0} sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReviewDetail() {
  return (
    <Suspense fallback={
      <div className="space-y-6 pb-16 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-textSecondary font-bold mt-4 uppercase tracking-wider">Syncing review log...</p>
      </div>
    }>
      <ReviewDetailContent />
    </Suspense>
  )
}
