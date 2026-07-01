'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'

export default function Login() {
  const router = useRouter()
  const [resetOpen, setResetOpen] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-bg-dark px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-[30px] font-bold text-primary dark:text-white mb-2">Welcome Back</h1>
        <p className="text-text-muted mb-6">Sign in to your CEO OS</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>
          <button type="button" onClick={() => setResetOpen(true)} className="text-sm text-primary hover:underline">Forgot password?</button>
          <button type="submit" className="btn-primary w-full">Log In</button>
        </form>
        <p className="text-center text-sm text-text-muted mt-6">
          Don&apos;t have an account? <Link href="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} title="Reset Password">
        <div className="space-y-4">
          <p className="text-sm text-text-muted">Enter your email and we&apos;ll send a reset link.</p>
          <input type="email" className="input-field" placeholder="you@example.com" />
          <div className="flex justify-end gap-3">
            <button onClick={() => setResetOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={() => setResetOpen(false)} className="btn-primary">Send Link</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
