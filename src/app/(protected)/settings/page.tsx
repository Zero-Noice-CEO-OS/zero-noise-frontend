'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { Moon, Sun } from 'lucide-react'
import Modal from '@/components/Modal'

export default function SettingsPage() {
  const { theme, toggle } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [toast, setToast] = useState(false)

  const showToast = () => {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl relative">
      <h1 className="text-[30px] font-bold">Settings</h1>

      <div className="flex gap-1 border-b border-border-light dark:border-border-dark">
        {(['profile', 'notifications', 'security'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-sm font-medium capitalize transition-all duration-150 border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-primary'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Full Name</label><input className="input-field" defaultValue="John Doe" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Email</label><input className="input-field" defaultValue="john@example.com" type="email" /></div>
          <div className="flex items-center justify-between py-3 border-t border-border-light dark:border-border-dark">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-text-muted">Toggle dark/light theme</p>
            </div>
            <button onClick={toggle} className="p-2 rounded-card bg-surface-light dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {theme === 'dark' ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
            </button>
          </div>
          <div className="flex justify-end"><button onClick={showToast} className="btn-primary">Save</button></div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card space-y-4">
          {['Daily review reminders', 'Weekly summary emails', 'Goal deadline alerts', 'Deep work session reminders'].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-sm">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-300 peer-checked:bg-primary rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>
          ))}
          <div className="flex justify-end pt-2"><button onClick={showToast} className="btn-primary">Save</button></div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card space-y-4">
          <div><label className="block text-sm font-medium mb-1.5">Current Password</label><input type="password" className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1.5">New Password</label><input type="password" className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1.5">Confirm New Password</label><input type="password" className="input-field" /></div>
          <div className="flex justify-between items-center pt-4 border-t border-border-light dark:border-border-dark">
            <button onClick={() => setDeleteOpen(true)} className="text-destructive text-sm font-medium hover:underline">Delete Account</button>
            <div className="flex gap-3">
              <button onClick={() => router.push('/login')} className="btn-secondary">Log Out</button>
              <button onClick={showToast} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Account" preventOverlayClose>
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-card p-3">
            <p className="text-sm text-destructive font-medium">This action is permanent and cannot be undone. All your data will be erased.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Type &quot;DELETE&quot; to confirm</label>
            <input className="input-field" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="DELETE" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => { setDeleteOpen(false); setDeleteInput('') }} className="btn-secondary">Cancel</button>
            <button disabled={deleteInput !== 'DELETE'} onClick={() => router.push('/login')} className="btn-destructive disabled:opacity-50 disabled:cursor-not-allowed">Delete Account</button>
          </div>
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-success text-white px-5 py-3 rounded-card shadow-lg animate-fade-in text-sm font-medium">
          Settings saved successfully!
        </div>
      )}
    </div>
  )
}
