'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '@/components/Modal'
import OtpInput from '@/components/OtpInput'
import { useTheme } from '@/context/ThemeContext'
import { Sparkles, ChevronLeft, Sun, Moon, Eye, EyeOff } from 'lucide-react'
import { useLoginMutation } from '@/hooks/useAuth'
import { authService } from '@/services/auth-service'

import PasswordRequirementsChecklist from '@/components/PasswordRequirementsChecklist'

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme, toggle } = useTheme()
  
  // Login form states
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [isPasswordValid, setIsPasswordValid] = useState(false)

  useEffect(() => {
    const msg = searchParams.get('message')
    if (msg === 'changed') {
      setToastMessage('Password updated successfully. Please log in again using your new password.')
      setTimeout(() => setToastMessage(''), 5000)
    }
  }, [searchParams])
  
  // Forgot Password state stages
  const [resetOpen, setResetOpen] = useState(false)
  const [resetStage, setResetStage] = useState<'email' | 'otp' | 'password' | 'success'>('email')
  const [resetEmail, setResetEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpTimer, setOtpTimer] = useState(300) // 5 minutes
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const loginMutation = useLoginMutation()

  // Countdown logic for Reset Password OTP
  useEffect(() => {
    if (resetOpen && resetStage === 'otp' && otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer(t => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [resetOpen, resetStage, otpTimer])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await authService.forgotPassword(resetEmail)
      setOtpTimer(300)
      setResetStage('otp')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to dispatch OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await authService.verifyOtp(resetEmail, otpCode)
      if (res.verified) {
        setResetStage('password')
      } else {
        setErrorMsg('Invalid verification code')
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      return
    }
    setLoading(true)
    setErrorMsg('')
    try {
      await authService.resetPassword({
        email: resetEmail,
        code: otpCode,
        password: newPassword
      })
      
      // Enforce immediate session clearing and redirection
      setResetStage('success')
      const { setAccessToken } = require('@/services/api-client')
      setAccessToken(null)
      localStorage.clear()
      sessionStorage.clear()
      
      setTimeout(() => {
        setResetOpen(false)
        router.push('/login?message=changed')
      }, 1500)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background font-sans overflow-hidden transition-colors duration-500 relative">
      
      {/* Floating Theme Toggle (Top Right) */}
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
      <div className="hidden md:flex md:w-[50%] lg:w-[55%] bg-gradient-to-br from-surface to-background dark:from-[#080d21] dark:to-[#050816] border-r border-border p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-72 h-72 rounded-full bg-primary/10 blur-[80px] animate-pulse-ring" />
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-secondary/10 blur-[100px]" />
        
        <div className="flex items-center gap-2.5 z-10">
          <span className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-sm shadow-sm">ZN</span>
          <div>
            <span className="text-md font-extrabold tracking-tight text-textPrimary">Zero Noise</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-textSecondary block -mt-1">CEO OS</span>
          </div>
        </div>

        <div className="my-auto space-y-6 z-10 max-w-lg">
          <h2 className="text-4xl font-extrabold text-textPrimary leading-tight tracking-tight">
            The professional workspace for startup leaders.
          </h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            Zero Noise CEO OS is an integrated suite built to manage priorities, track focus capacity, benchmark metrics, and coach you daily using AI insights.
          </p>

          <div className="bg-surface/50 dark:bg-white/5 border border-border rounded-card p-5 shadow-sm relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <span className="text-xs font-bold text-textPrimary flex items-center gap-1.5"><Sparkles size={13} className="text-primary" /> AI Recommendation</span>
              <span className="text-[10px] text-textSecondary">Just now</span>
            </div>
            <p className="text-xs text-textSecondary leading-relaxed italic">
              &ldquo;Welcome back, founder. Strategic focus time is predicted at 09:00 AM today. Start a Deep Work block to begin.&rdquo;
            </p>
          </div>
        </div>

        <div className="text-xs text-textSecondary z-10">
          © 2026 Zero Noise CEO OS. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] md:hidden -z-10" />

        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-1 text-xs font-bold text-textSecondary hover:text-textPrimary transition-all"
        >
          <ChevronLeft size={14} /> Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-card border border-border bg-surface/50 dark:bg-surface/40 backdrop-blur-xl shadow-card relative overflow-hidden"
        >
          <div className="md:hidden flex items-center gap-2 mb-6">
            <span className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-extrabold text-xs">ZN</span>
            <div>
              <h2 className="text-sm font-extrabold text-textPrimary leading-none">Zero Noise</h2>
              <span className="text-[9px] uppercase font-bold tracking-widest text-textSecondary">CEO OS</span>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-textPrimary tracking-tight">Welcome Back</h1>
          <p className="text-xs text-textSecondary mt-1 mb-6 font-semibold">Sign in to your private cockpit</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 text-xs rounded bg-success/15 border border-success/30 text-success font-semibold"
                >
                  {toastMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {loginMutation.isError && (
              <div className="p-3 text-xs rounded bg-red-500/10 border border-red-500/20 text-red-500 font-semibold animate-shake">
                Invalid email or password.
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled={loginMutation.isPending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:opacity-55"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetStage('email')
                    setResetOpen(true)
                  }}
                  disabled={loginMutation.isPending}
                  className="text-xs font-bold text-primary hover:text-secondary transition-all disabled:opacity-50"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={loginMutation.isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm disabled:opacity-55"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loginMutation.isPending}
                  className="absolute right-3 top-3.5 text-textSecondary hover:text-textPrimary disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3.5 mt-2 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                'Sign In to Workspace'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-textSecondary font-bold mt-6">
            Don&apos;t have a workspace?{' '}
            <Link href="/signup" className="text-primary hover:text-secondary transition-all">
              Register Account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Forgot Password Flow Modal utilizing reusable OtpInput component */}
      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Forgot Password">
        <div className="space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs rounded bg-red-500/10 border border-red-500/20 text-red-500 font-bold">
              {errorMsg}
            </div>
          )}

          {resetStage === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <p className="text-xs text-textSecondary">Enter your registered email and we will send you a 6-digit OTP code.</p>
              <input
                type="email"
                required
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-input bg-surface text-textPrimary placeholder:text-textSecondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                placeholder="arjun@zeronoise.co"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setResetOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-button bg-primary text-white font-bold text-xs shadow-md">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}

          {resetStage === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-xs text-textSecondary text-center">We&apos;ve sent a 6-digit code to <strong className="text-textPrimary">{resetEmail}</strong></p>
              
              <OtpInput value={otpCode} onChange={setOtpCode} length={6} disabled={loading} />

              <div className="text-center text-[11px] text-textSecondary font-semibold">
                {otpTimer > 0 ? (
                  <span>Resend OTP in ({formatTimer(otpTimer)})</span>
                ) : (
                  <button type="button" onClick={handleSendOtp} className="text-primary hover:underline">Resend OTP</button>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setResetStage('email')} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Back</button>
                <button type="submit" disabled={otpCode.length !== 6 || loading} className="px-4 py-2 rounded-button bg-primary text-white font-bold text-xs shadow-md">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          {resetStage === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-textSecondary">Enter your new workspace password credentials.</p>
              
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-input bg-surface text-textPrimary focus:outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-input bg-surface text-textPrimary focus:outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>

              <PasswordRequirementsChecklist password={newPassword} confirmPassword={confirmPassword} onValidationChange={setIsPasswordValid} />

              <div className="flex justify-end gap-3 pt-2">
                <button type="submit" disabled={loading || !isPasswordValid} className="w-full py-3 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md disabled:opacity-50">
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {resetStage === 'success' && (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <span className="w-12 h-12 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</span>
              <h3 className="text-sm font-bold text-textPrimary">Password Updated!</h3>
              <p className="text-xs text-textSecondary">Your password has been changed successfully. You can now close this and sign in.</p>
              <button onClick={() => setResetOpen(false)} className="w-full py-2.5 rounded-button bg-primary text-white font-bold text-xs shadow-sm">
                Go to Sign In
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
