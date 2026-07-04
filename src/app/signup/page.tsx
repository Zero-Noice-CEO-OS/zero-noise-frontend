'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { Sparkles, ChevronLeft, Sun, Moon, Eye, EyeOff, Check, User, Briefcase, Award, GraduationCap, Zap, Users, Code, Brush, BarChart, ShieldCheck, Heart, Landmark, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useSignupMutation } from '@/hooks/useAuth'
import PasswordRequirementsChecklist from '@/components/PasswordRequirementsChecklist'

const ROLES = [
  { name: 'Founder', icon: Award },
  { name: 'CEO', icon: Briefcase },
  { name: 'Student Founder', icon: GraduationCap },
  { name: 'Entrepreneur', icon: Zap },
  { name: 'Freelancer', icon: User },
  { name: 'Manager', icon: Users },
  { name: 'Product Manager', icon: ShieldCheck },
  { name: 'Developer', icon: Code },
  { name: 'Designer', icon: Brush },
  { name: 'Marketing Lead', icon: BarChart },
  { name: 'Sales Leader', icon: Landmark },
  { name: 'Consultant', icon: Heart },
  { name: 'Creator', icon: Sparkles },
  { name: 'Investor', icon: Landmark },
  { name: 'Other', icon: HelpCircle },
]

export default function Signup() {
  const router = useRouter()
  const { theme, toggle } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState('Founder')

  const signupMutation = useSignupMutation()

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && email.trim() && isPasswordValid) {
      setStep(2)
    }
  }

  const handleSignup = () => {
    signupMutation.mutate({ name, email, password, role: selectedRole })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans overflow-hidden transition-colors duration-500 relative">
      
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggle}
          className="p-2.5 hover:bg-surface/80 dark:hover:bg-white/5 rounded-full transition-all border border-border/40 text-textSecondary hover:text-textPrimary"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} className="text-warning" /> : <Moon size={16} className="text-primary" />}
        </button>
      </div>

      {/* LEFT PANEL: Branding & Visuals */}
      <div className="hidden md:flex md:w-[40%] lg:w-[45%] bg-gradient-to-br from-surface to-background dark:from-[#080d21] dark:to-[#050816] border-r border-border p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[20%] right-[20%] w-72 h-72 rounded-full bg-secondary/10 blur-[80px] animate-pulse-ring" />
        <div className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full bg-primary/10 blur-[100px]" />
        
        {/* Top Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <span className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-sm shadow-sm">ZN</span>
          <div>
            <span className="text-md font-extrabold tracking-tight text-textPrimary">Zero Noise</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-textSecondary block -mt-1">CEO OS</span>
          </div>
        </div>

        {/* Feature Visual Preview */}
        <div className="my-auto space-y-6 z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold text-textPrimary leading-tight tracking-tight">
            Build your personal growth engine.
          </h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            Configure your focus slots, score daily energy indicators, monitor skill radars, and align operational tasks with high-level priorities.
          </p>

          <div className="bg-surface/50 dark:bg-white/5 border border-border rounded-card p-5 shadow-sm relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <span className="text-xs font-bold text-textPrimary flex items-center gap-1.5"><Sparkles size={13} className="text-secondary" /> Setup Wizard</span>
              <span className="text-[10px] text-textSecondary font-semibold">Step {step} of 2</span>
            </div>
            <p className="text-xs text-textSecondary leading-relaxed italic">
              {step === 1 
                ? "“Welcome aboard. Initialize your dashboard by providing your account details. No credit card required during setup.”"
                : "“Let's customize your Zero Noise CEO OS dashboard experience based on your professional role.”"
              }
            </p>
          </div>
        </div>

        <div className="text-xs text-textSecondary z-10">
          © 2026 Zero Noise CEO OS. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] md:hidden -z-10" />

        <button
          onClick={() => step === 2 ? setStep(1) : router.push('/')}
          className="absolute top-6 left-6 flex items-center gap-1 text-xs font-bold text-textSecondary hover:text-textPrimary transition-all"
        >
          <ChevronLeft size={14} /> Back
        </button>

        <motion.div
          layout
          className={`w-full ${step === 2 ? 'max-w-2xl' : 'max-w-md'} p-8 rounded-card border border-border bg-surface/50 dark:bg-surface/40 backdrop-blur-xl shadow-card relative overflow-hidden transition-all duration-300`}
        >
          {/* Header Step Indicators */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-border text-textSecondary'}`}>
                {step > 1 ? <Check size={10} /> : '1'}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${step >= 1 ? 'text-textPrimary' : 'text-textSecondary'}`}>Account Info</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-border text-textSecondary'}`}>
                2
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${step >= 2 ? 'text-textPrimary' : 'text-textSecondary'}`}>Your Role</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-border text-textSecondary`}>
                3
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-textSecondary">Verify Email</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-extrabold text-textPrimary tracking-tight">Create Workspace</h1>
                <p className="text-xs text-textSecondary mt-1 mb-6 font-semibold">Start building your executive operating system</p>

                <form onSubmit={handleNextStep} className="space-y-4">
                  {signupMutation.isError && (
                    <div className="p-3 text-xs rounded bg-red-500/10 border border-red-500/20 text-red-500 font-semibold animate-shake">
                      {(signupMutation.error as any)?.response?.data?.message || 'Registration failed. Please try again.'}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Email address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-textSecondary hover:text-textPrimary"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <PasswordRequirementsChecklist password={password} onValidationChange={setIsPasswordValid} />
                  </div>

                  <button
                    type="submit"
                    disabled={!isPasswordValid || !name.trim() || !email.trim()}
                    className="w-full py-3.5 mt-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                  >
                    Continue &rarr;
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-extrabold text-textPrimary tracking-tight">What best describes you?</h1>
                  <p className="text-xs text-textSecondary mt-1 font-semibold">This helps us personalize your Zero Noise experience.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROLES.map((r) => {
                    const active = selectedRole === r.name
                    const Icon = r.icon
                    return (
                      <button
                        key={r.name}
                        onClick={() => setSelectedRole(r.name)}
                        className={`p-4 border rounded-card text-center flex flex-col items-center justify-center gap-2.5 transition-all ${
                          active
                            ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20 shadow-sm text-primary dark:text-white font-bold'
                            : 'border-border bg-surface text-textSecondary hover:bg-background/80 hover:text-textPrimary'
                        }`}
                      >
                        <Icon size={20} className={active ? 'text-primary dark:text-accent' : 'text-textSecondary'} />
                        <span className="text-[11px] truncate w-full">{r.name}</span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-4 pt-4 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-button bg-surface border border-border text-textPrimary font-bold text-sm hover:bg-background/80 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSignup}
                    disabled={signupMutation.isPending}
                    className="flex-1 py-3.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {signupMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      'Complete Setup'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-textSecondary font-bold mt-6">
            Already have a workspace?{' '}
            <Link href="/login" className="text-primary hover:text-secondary transition-all">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
