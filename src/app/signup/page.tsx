'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const router = useRouter()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-bg-dark px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-[30px] font-bold text-primary dark:text-white mb-2">Create Account</h1>
        <p className="text-text-muted mb-6">Start building your CEO operating system</p>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <input type="text" className="input-field" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input type="password" className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary w-full">Create Account</button>
        </form>
        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
