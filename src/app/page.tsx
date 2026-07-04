'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { Sparkles, Play, Target, Brain, Shield, ChevronRight, Zap, TrendingUp, Cpu, Moon, Sun, ArrowRight, Check, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import Footer from '@/components/Footer'

export default function Landing() {
  const { theme, toggle } = useTheme()
  const { user } = useAuth()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100 } }
  }

  const faqs = [
    { q: "What is Zero Noise CEO OS?", a: "It is an executive workspace designed specifically for startup founders and chief executives to minimize daily operational noise, focus on strategic growth, benchmark key skills, and receive daily coaching." },
    { q: "Is my workspace data secure?", a: "Absolutely. All logged activities, skill scores, reflections, and insights are encrypted and accessible only within your secure personal session." },
    { q: "How does the AI Coach work?", a: "The AI Coach processes your daily reflection score, deep work blocks, and energy levels to suggest focus times, calendar adjustments, and strategic priorities." }
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans transition-colors duration-500 relative overflow-hidden">
      
      {/* Dynamic Animated Particles & Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-primary/10 to-secondary/15 blur-[120px] -z-10 animate-pulse-ring" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-accent/10 to-primary/10 blur-[100px] -z-10" />

      {/* Sticky Glass Navbar */}
      <header className="fixed top-0 left-0 right-0 h-20 border-b border-border bg-surface/60 backdrop-blur-xl z-50 flex items-center justify-between px-6 sm:px-12 transition-all">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-sm shadow-sm">ZN</span>
          <div>
            <span className="text-md font-extrabold tracking-tight text-textPrimary">Zero Noise</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-textSecondary block -mt-1">CEO OS</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggle}
            className="p-2.5 hover:bg-surface/80 dark:hover:bg-white/5 rounded-full transition-all border border-border/40 text-textSecondary hover:text-textPrimary"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} className="text-warning" /> : <Moon size={16} className="text-primary" />}
          </button>
          
          {user ? (
            <Link href="/dashboard" className="text-xs font-semibold px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary hover:opacity-90 active:scale-95 text-white flex items-center gap-1.5 transition-all shadow-md">
              Enter Cockpit <ChevronRight size={14} />
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-xs font-semibold text-textSecondary hover:text-textPrimary px-3 py-2 transition-all">
                Log In
              </Link>
              <Link href="/signup" className="text-xs font-semibold px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary hover:opacity-90 active:scale-95 text-white flex items-center gap-1.5 transition-all shadow-md">
                Get Started <ChevronRight size={14} />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24">
        
        {/* Hero Section */}
        <section className="relative px-6 sm:px-12 py-20 sm:py-32 max-w-6xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary dark:text-white dark:bg-primary/20"
          >
            <Sparkles size={13} className="text-primary dark:text-accent animate-spin" style={{ animationDuration: '4s' }} /> 
            The Executive OS for founders
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl sm:text-6xl font-extrabold leading-tight text-textPrimary max-w-4xl mx-auto tracking-tight"
          >
            The daily OS for founders who want to get <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">sharper — not just busier.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-md sm:text-lg text-textSecondary max-w-xl mx-auto font-medium leading-relaxed"
          >
            Turn your daily actions into one honest score, and let an AI coach show you what to improve tomorrow.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-sm mx-auto"
          >
            {user ? (
              <Link href="/dashboard" className="px-6 py-3.5 rounded-button bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all">
                Enter Cockpit <ChevronRight size={15} />
              </Link>
            ) : (
              <>
                <Link href="/signup" className="px-6 py-3.5 rounded-button bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-semibold text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all">
                  Initialize OS — Free <ChevronRight size={15} />
                </Link>
                <Link href="/login" className="px-6 py-3.5 rounded-button bg-surface hover:bg-surface/80 border border-border text-textPrimary font-semibold text-sm flex items-center justify-center active:scale-95 transition-all glass-panel">
                  Enter Cockpit
                </Link>
              </>
            )}
          </motion.div>
        </section>

        {/* Executive Stats Showroom */}
        <section className="px-6 sm:px-12 py-10 max-w-5xl mx-auto border border-border bg-surface/40 backdrop-blur-md rounded-card shadow-card grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-primary">14.5h</p>
            <p className="text-[10px] text-textSecondary uppercase font-bold tracking-widest mt-1">Weekly Deep Work</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-accent">92%</p>
            <p className="text-[10px] text-textSecondary uppercase font-bold tracking-widest mt-1">Goal Alignment</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-success">Level 7.2</p>
            <p className="text-[10px] text-textSecondary uppercase font-bold tracking-widest mt-1">Avg Strategic Index</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-textPrimary">2.5x</p>
            <p className="text-[10px] text-textSecondary uppercase font-bold tracking-widest mt-1">Output velocity</p>
          </div>
        </section>

        {/* Features Grids */}
        <section className="px-6 sm:px-12 py-24 sm:py-32 max-w-6xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-textPrimary tracking-tight">Structured for peak cognitive capacity</h2>
            <p className="text-sm text-textSecondary">An executive hub engineered to eliminate operational noise.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-surface/50 border border-border p-6 rounded-card shadow-sm hover:border-primary/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <span className="p-3.5 rounded-xl bg-primary/10 text-primary inline-block mb-4">
                <Play size={20} />
              </span>
              <h3 className="text-lg font-bold text-textPrimary mb-2">Structured Audits</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Log activities and score them by business value. Audit how much time goes to high-impact strategy vs daily noise.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-surface/50 border border-border p-6 rounded-card shadow-sm hover:border-secondary/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <span className="p-3.5 rounded-xl bg-secondary/10 text-secondary inline-block mb-4">
                <Brain size={20} />
              </span>
              <h3 className="text-lg font-bold text-textPrimary mb-2">Skills Benchmarks</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                Score core skill dimensions (Speed, Quality, Consistency) and watch your leadership capacity increase over time.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-surface/50 border border-border p-6 rounded-card shadow-sm hover:border-accent/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <span className="p-3.5 rounded-xl bg-accent/10 text-accent inline-block mb-4">
                <Cpu size={20} />
              </span>
              <h3 className="text-lg font-bold text-textPrimary mb-2">AI Performance Advisor</h3>
              <p className="text-sm text-textSecondary leading-relaxed">
                An integrated co-pilot analyzing metrics, goals, and focus streak data to deliver actionable calendar coaching.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Timeline Engine and Showcase */}
        <section className="px-6 sm:px-12 py-20 bg-surface/30 dark:bg-white/5 border-y border-border">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-textPrimary tracking-tight">Continuous Review & Execution Loops</h2>
              <p className="text-sm text-textSecondary leading-relaxed">
                The CEO OS connects daily reflections, weekly goals, and skills benchmarks into a clean, unified dashboard. Keep your metrics high, avoid context-switching, and lead with clarity.
              </p>
              
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Audit Focus Areas', desc: 'Audit daily activities by impact scores.' },
                  { step: '2', title: 'Protect Deep Blocks', desc: 'Run circular timers in focus modes.' },
                  { step: '3', title: 'Consult AI Co-Pilot', desc: 'Extract strategic opportunities directly.' }
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-textPrimary">{s.title}</h4>
                      <p className="text-xs text-textSecondary">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Preview Glass Container */}
            <div className="bg-surface/50 dark:bg-surface/40 backdrop-blur-xl border border-border p-6 shadow-hover rounded-card space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-textPrimary">Executive Status</span>
                <span className="text-[10px] uppercase font-bold bg-success/15 text-success px-2.5 py-0.5 rounded-full">Active</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-textSecondary">CEO Operating Score</span>
                  <span className="text-success font-bold">+8%</span>
                </div>
                <div className="h-2.5 bg-background dark:bg-border/60 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="p-3 bg-background/50 dark:bg-white/5 rounded-button border border-border/40 text-xs text-textSecondary leading-relaxed italic">
                  &ldquo;Protect a 90-min deep work session this morning to finalize MVP features.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 sm:px-12 py-24 max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-textPrimary tracking-tight">How It Works</h2>
            <p className="text-sm text-textSecondary">A premium step-by-step workflow designed to build long-term executive capabilities.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up in seconds and get your free workspace instantly.', label: 'Start Free' },
              { step: '2', title: 'Set Goals', desc: 'Define what matters and align your daily execution blocks.', label: 'Setup Focus' },
              { step: '3', title: 'Log Activities', desc: 'Track your daily actions and build an honest score.', label: 'Track Now' },
              { step: '4', title: 'Deep Work', desc: 'Block distractions and complete 90-minute building sprints.', label: 'Start Timer' },
              { step: '5', title: 'AI Coach', desc: 'Interact with your advisor to retrieve calendar recommendations.', label: 'Ask Coach' },
              { step: '6', title: 'Weekly Reviews', desc: 'Audit your metrics and identify priority bottlenecks.', label: 'Review Loop' },
              { step: '7', title: 'Improve Score', desc: 'Watch your performance score compound day over day.', label: 'Scale Output' },
              { step: '8', title: 'Build Capability', desc: 'Benchmark radar metrics and grow key executive skills.', label: 'Audit Radar' }
            ].map((workflowStep, index) => (
              <div
                key={index}
                className="bg-surface/50 border border-border p-6 rounded-card hover:border-primary/20 hover:shadow-md transition-all duration-300 relative group"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold flex items-center justify-center mb-4">
                  {workflowStep.step}
                </span>
                <h4 className="text-sm font-bold text-textPrimary mb-1.5 group-hover:text-primary transition-all">
                  {workflowStep.title}
                </h4>
                <p className="text-xs text-textSecondary leading-relaxed">
                  {workflowStep.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="px-6 sm:px-12 py-24 sm:py-32 max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-textPrimary tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-sm text-textSecondary">Choose the perfect plan for your executive growth journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                name: 'Free',
                price: 0,
                cycle: 'forever',
                desc: 'Automatically assigned to new registrations.',
                features: ['Dashboard', 'Daily Logs', 'Activity Tracking', 'Weekly Reviews', '5 AI prompts / day', '5 Active Goals']
              },
              {
                name: 'Starter',
                price: 499,
                cycle: 'month',
                desc: 'For early-stage founders beginning to track metrics.',
                features: ['Everything in Free', 'Unlimited Goals', 'Unlimited Activities', 'Unlimited Deep Work', '20 AI prompts / day', 'Email Support']
              },
              {
                name: 'Founder Pro',
                price: 4899,
                cycle: 'year',
                tag: 'Best Value',
                desc: 'Best Value for Growing Founders',
                features: ['Everything in Starter', 'Unlimited AI prompts', 'Capability Engine', 'AI Chat History', 'Monthly Reviews', 'Advanced Reports', 'Priority Support']
              },
              {
                name: 'Founder Elite',
                price: 18999,
                cycle: '6 years',
                desc: 'For High-Performance Leaders',
                features: ['Everything in Pro', 'Premium Analytics', 'Priority AI Queue', 'Early-Access Features', 'Exclusive Community']
              },
              {
                name: 'Lifetime Founder',
                price: 32999,
                cycle: 'once',
                desc: 'Pay Once. Own Forever.',
                features: ['Everything in Elite', 'Lifetime Access', 'No Recurring Payments', 'All Future Updates', 'VIP Support']
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`bg-surface/50 border rounded-card p-6 shadow-sm flex flex-col justify-between relative hover:border-primary/20 hover:shadow-md transition-all ${
                  plan.tag ? 'border-primary ring-2 ring-primary/10' : 'border-border'
                }`}
              >
                {plan.tag && (
                  <span className="absolute -top-2.5 right-4 bg-primary text-white text-[8px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full">
                    {plan.tag}
                  </span>
                )}
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-textPrimary uppercase">{plan.name}</h3>
                    <p className="text-[10px] text-textSecondary mt-1 leading-relaxed">{plan.desc}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-2xl font-black text-textPrimary">₹{plan.price.toLocaleString()}</span>
                    <span className="text-[9px] text-textSecondary font-semibold">/{plan.cycle}</span>
                  </div>

                  <div className="h-[1px] bg-border/40" />

                  <ul className="space-y-1.5 text-[10px] text-textSecondary font-medium">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-1">
                        <Check size={11} className="text-success shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 mt-6">
                  <Link
                    href={`/pricing/${plan.name.toLowerCase().replace(' ', '-')}`}
                    className="w-full py-1.5 border border-white/10 rounded-xl text-center text-[10px] font-bold text-[#A6B0CF] hover:text-white hover:bg-white/5 block transition-all"
                  >
                    View Details
                  </Link>
                  <Link
                    href={user ? '/settings?tab=subscription' : '/login'}
                    className={`w-full py-2 rounded-xl text-center text-xs font-bold block transition-all ${
                      plan.tag
                        ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'
                        : 'bg-surface border border-border text-textPrimary hover:bg-background'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="px-6 sm:px-12 py-20 bg-surface/30 dark:bg-white/5 border-t border-border">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-textPrimary text-center mb-6 flex items-center justify-center gap-2">
              <HelpCircle size={22} className="text-primary" /> FAQ
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border rounded-card bg-surface/50 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-bold text-textPrimary hover:bg-background/40 transition-all"
                  >
                    <span>{faq.q}</span>
                    <span className="text-textSecondary">{activeFaq === i ? '−' : '+'}</span>
                  </button>
                  {activeFaq === i && (
                    <div className="px-6 pb-4 text-xs text-textSecondary leading-relaxed border-t border-border/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer and CTA */}
      <Footer />
    </div>
  )
}
