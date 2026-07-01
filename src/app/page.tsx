import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 border-b border-border-light">
        <h1 className="text-xl font-bold text-primary">Zero Noise</h1>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary">Log In</Link>
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-2xl text-center space-y-6">
          <h2 className="text-[48px] font-bold leading-tight text-primary">Your Operating System for<br />Focus & Execution</h2>
          <p className="text-lg text-text-muted max-w-lg mx-auto">Track activities, build skills, run deep work sessions, set layered goals, and get AI-powered coaching — all in one distraction-free workspace.</p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/signup" className="btn-primary text-lg px-8 py-3">Get Started — Free</Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-3">Log In</Link>
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-text-muted border-t border-border-light">
        © 2024 Zero Noise CEO OS
      </footer>
    </div>
  )
}
