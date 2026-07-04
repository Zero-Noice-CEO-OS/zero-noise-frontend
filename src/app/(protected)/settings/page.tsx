'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { Moon, Sun, User, Bell, Shield, AlertTriangle, Key, Check, Info } from 'lucide-react'
import PasswordRequirementsChecklist from '@/components/PasswordRequirementsChecklist'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '@/components/Modal'
import OtpInput from '@/components/OtpInput'
import { useProfile, useUpdateProfileMutation, usePreferences, useUpdatePreferencesMutation } from '@/hooks/useUser'
import { userService } from '@/services/user-service'
import { authService } from '@/services/auth-service'

export default function SettingsPage() {
  const { theme, toggle } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') as any || 'profile'

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>(initialTab)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [toast, setToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('Settings saved successfully!')

  // Profile & Preferences
  const profileQuery = useProfile()
  const updateProfileMutation = useUpdateProfileMutation()
  const preferencesQuery = usePreferences()
  const updatePreferencesMutation = useUpdatePreferencesMutation()

  // Profile Form state variables
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [timezone, setTimezone] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [role, setRole] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)

  // In-settings OTP action variables
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [emailStage, setEmailStage] = useState<'request' | 'verify'>('request')

  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passOtp, setPassOtp] = useState('')
  const [passStage, setPassStage] = useState<'request' | 'verify'>('request')
  const [isPasswordValid, setIsPasswordValid] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Sync profile details
  useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name || '')
      setEmail(profileQuery.data.email || '')
      setTimezone(profileQuery.data.timezone || 'UTC')
      setMobileNumber((profileQuery.data as any).mobileNumber || '')
      setRole((profileQuery.data as any).role || '')
      setAvatar(localStorage.getItem(`avatar_${profileQuery.data.id}`))
    }
  }, [profileQuery.data])

  const showToast = (msg?: string) => {
    if (msg) setToastMsg(msg)
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfileMutation.mutateAsync({ name, timezone, mobileNumber, role })
      showToast('Profile settings saved successfully!')
    } catch (e) {
      console.error(e)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profileQuery.data) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      localStorage.setItem(`avatar_${profileQuery.data.id}`, base64String)
      setAvatar(base64String)
      window.dispatchEvent(new Event('storage'))
      showToast('Profile picture uploaded successfully!')
    }
    reader.readAsDataURL(file)
  }

  const handleTogglePreference = async (key: 'reminderEnabled' | 'notificationEnabled' | 'aiEnabled', currentValue: boolean) => {
    try {
      await updatePreferencesMutation.mutateAsync({ [key]: !currentValue })
      showToast('Notification preference toggled!')
    } catch (e) {
      console.error(e)
    }
  }

  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    try {
      if (theme !== newTheme) {
        toggle()
      }
      await updatePreferencesMutation.mutateAsync({ theme: newTheme })
      showToast(`Switched theme to ${newTheme}!`)
    } catch (e) {
      console.error(e)
    }
  }

  // OTP Email Change handlers
  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await userService.changeEmailRequest(newEmail)
      setEmailStage('verify')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to request email change')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await userService.verifyChangeEmail(newEmail, emailOtp)
      setEmail(newEmail)
      setEmailModalOpen(false)
      showToast('Email address changed successfully!')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  // OTP Password Change handlers
  const handleRequestPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match')
      return
    }
    setLoading(true)
    setErrorMsg('')
    try {
      await userService.changePassword({ oldPassword, newPassword })
      setPassStage('verify')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await userService.verifyChangePassword(passOtp)
      setPasswordModalOpen(false)
      showToast('Password updated. Logging out...')
      
      const { setAccessToken } = require('@/services/api-client')
      setAccessToken(null)
      localStorage.clear()
      sessionStorage.clear()

      setTimeout(async () => {
        router.push('/login?message=changed')
      }, 1500)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (fullName: string) => {
    if (!fullName) return 'ZN'
    const parts = fullName.split(' ')
    return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase()
  }

  const isProfileLoading = profileQuery.isLoading || preferencesQuery.isLoading

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Settings</h1>

      {/* Tabs list without Subscription tab */}
      <div className="flex gap-2 border-b border-border overflow-x-auto scrollbar-none">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'security', label: 'Security & Access', icon: Shield },
        ].map(tab => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all relative shrink-0 ${
                active ? 'text-primary dark:text-white' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {active && (
                <motion.div
                  layoutId="settings-active-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          )
        })}
      </div>

      {isProfileLoading ? (
        <div className="bg-surface/50 border border-border rounded-card p-12 flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-textSecondary font-bold uppercase tracking-wider mt-4">Loading settings...</p>
        </div>
      ) : (
        <>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-border/40">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border border-border shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary dark:text-white text-2xl font-bold border border-border shadow-sm font-sans">
                    {getInitials(name)}
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-textPrimary">{name || 'Zero Noise CEO'}</h3>
                  <p className="text-xs text-textSecondary font-semibold">Workspace Owner — {email}</p>
                  <label className="text-xs text-primary font-bold hover:underline cursor-pointer block mt-1">
                    Upload New Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Full Name</label>
                  <input
                    className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={updateProfileMutation.isPending}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Mobile Number</label>
                  <input
                    className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={updateProfileMutation.isPending}
                    placeholder="+919876543210"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Timezone</label>
                  <input
                    className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    disabled={updateProfileMutation.isPending}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Professional Role</label>
                  <select
                    className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-bold animate-fade-in"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={updateProfileMutation.isPending}
                  >
                    {['Founder', 'CEO', 'Student Founder', 'Entrepreneur', 'Freelancer', 'Manager', 'Product Manager', 'Developer', 'Designer', 'Marketing Lead', 'Sales Leader', 'Consultant', 'Creator', 'Investor', 'Other'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="pt-4 border-t border-border/40 space-y-3">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-textSecondary">Interface Theme</h4>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <button
                    onClick={() => handleThemeChange('light')}
                    disabled={updatePreferencesMutation.isPending}
                    className={`p-4 border rounded-card text-left flex items-center justify-between transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                        : 'border-border bg-surface text-textSecondary hover:bg-background/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun size={16} className={theme === 'light' ? 'text-primary' : 'text-textSecondary'} />
                      <span className="text-xs font-bold text-textPrimary">Light Mode</span>
                    </div>
                    {theme === 'light' && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </button>

                  <button
                    onClick={() => handleThemeChange('dark')}
                    disabled={updatePreferencesMutation.isPending}
                    className={`p-4 border rounded-card text-left flex items-center justify-between transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                        : 'border-border bg-surface text-textSecondary hover:bg-background/80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon size={16} className={theme === 'dark' ? 'text-accent' : 'text-textSecondary'} />
                      <span className="text-xs font-bold text-textPrimary">Dark Mode</span>
                    </div>
                    {theme === 'dark' && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40">
                <button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2.5 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {updateProfileMutation.isPending && (
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  )}
                  Save Profile Settings
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-6 animate-fade-in">
              <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider">Workspace Preferences & System Reminders</h2>
              
              <div className="space-y-4">
                {[
                  {
                    key: 'reminderEnabled' as const,
                    title: 'Daily review reminders',
                    desc: 'Alert to complete the evening operating logs.',
                    checked: !!preferencesQuery.data?.reminderEnabled
                  },
                  {
                    key: 'notificationEnabled' as const,
                    title: 'System notifications',
                    desc: 'Display notifications when milestones are updated or achieved.',
                    checked: !!preferencesQuery.data?.notificationEnabled
                  },
                  {
                    key: 'aiEnabled' as const,
                    title: 'AI executive recommendations',
                    desc: 'Enable daily coach prompts and morning startup tips.',
                    checked: !!preferencesQuery.data?.aiEnabled
                  }
                ].map((item, i) => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 pb-4">
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-textPrimary">{item.title}</p>
                      <p className="text-xs text-textSecondary">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        disabled={updatePreferencesMutation.isPending}
                        onChange={() => handleTogglePreference(item.key, item.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-background dark:bg-border rounded-full peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
                <h2 className="text-sm font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                  <Shield size={16} /> Authentication Details
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={() => {
                      setPassStage('request')
                      setOldPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                      setPasswordModalOpen(true)
                    }}
                    className="px-4 py-2.5 rounded-xl bg-surface border border-border text-textPrimary font-bold text-xs hover:bg-background transition-all"
                  >
                    Change Workspace Password
                  </button>
                  <button
                    onClick={() => {
                      setEmailStage('request')
                      setNewEmail('')
                      setEmailOtp('')
                      setEmailModalOpen(true)
                    }}
                    className="px-4 py-2.5 rounded-xl bg-surface border border-border text-textPrimary font-bold text-xs hover:bg-background transition-all"
                  >
                    Update Email Address
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-danger/5 border border-danger/25 rounded-card p-6 shadow-card space-y-4">
                <h2 className="text-sm font-bold text-danger flex items-center gap-2">
                  <AlertTriangle size={16} /> Danger Zone
                </h2>
                <p className="text-xs text-textSecondary leading-relaxed font-semibold">
                  Once you delete your account, there is no going back. All tracked activities, goals, and history will be permanently deleted.
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-border/40">
                  <button
                    onClick={() => setDeleteOpen(true)}
                    className="text-danger text-xs font-bold hover:underline"
                  >
                    Delete Account...
                  </button>
                  <button
                    onClick={async () => {
                      await authService.logout()
                      router.push('/login')
                    }}
                    className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Change Workspace Password Modal */}
      <Modal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} title="Update Password">
        <div className="space-y-4">
          {errorMsg && <div className="p-3 text-xs rounded bg-red-500/10 border border-red-500/20 text-red-500 font-bold">{errorMsg}</div>}

          {passStage === 'request' && (
            <form onSubmit={handleRequestPasswordChange} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-textPrimary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-textPrimary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-textPrimary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <PasswordRequirementsChecklist password={newPassword} confirmPassword={confirmPassword} onValidationChange={setIsPasswordValid} />
              
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setPasswordModalOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-xs text-textPrimary">Cancel</button>
                <button type="submit" disabled={loading || !isPasswordValid} className="px-4 py-2 rounded-button bg-primary text-white text-xs font-bold disabled:opacity-50">Request OTP</button>
              </div>
            </form>
          )}

          {passStage === 'verify' && (
            <form onSubmit={handleVerifyPasswordChange} className="space-y-4">
              <p className="text-xs text-textSecondary text-center">Enter the 6-digit OTP code sent to your email to verify password changes.</p>
              <OtpInput value={passOtp} onChange={setPassOtp} length={6} disabled={loading} />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setPassStage('request')} className="px-4 py-2 rounded-button bg-surface border border-border text-xs text-textPrimary">Back</button>
                <button type="submit" disabled={passOtp.length !== 6 || loading} className="px-4 py-2 rounded-button bg-primary text-white text-xs font-bold">Verify & Update</button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Update Email Modal */}
      <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)} title="Update Email Address">
        <div className="space-y-4">
          {errorMsg && <div className="p-3 text-xs rounded bg-red-500/10 border border-red-500/20 text-red-500 font-bold">{errorMsg}</div>}

          {emailStage === 'request' && (
            <form onSubmit={handleRequestEmailChange} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">New Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs text-textPrimary focus:outline-none"
                  placeholder="arjun@newdomain.com"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEmailModalOpen(false)} className="px-4 py-2 rounded-button bg-surface border border-border text-xs text-textPrimary">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-button bg-primary text-white text-xs font-bold">Send OTP</button>
              </div>
            </form>
          )}

          {emailStage === 'verify' && (
            <form onSubmit={handleVerifyEmailChange} className="space-y-4">
              <p className="text-xs text-textSecondary text-center">We have sent a 6-digit OTP code to <strong className="text-textPrimary">{newEmail}</strong>. Verify it here to complete the change.</p>
              <OtpInput value={emailOtp} onChange={setEmailOtp} length={6} disabled={loading} />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEmailStage('request')} className="px-4 py-2 rounded-button bg-surface border border-border text-xs text-textPrimary">Back</button>
                <button type="submit" disabled={emailOtp.length !== 6 || loading} className="px-4 py-2 rounded-button bg-primary text-white text-xs font-bold">Confirm Email</button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Account" preventOverlayClose>
        <div className="space-y-4">
          <div className="bg-danger/10 border border-danger/20 rounded-card p-3.5">
            <p className="text-xs text-danger font-bold">This action is permanent and cannot be undone. All your data will be erased.</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-textSecondary">Type &quot;DELETE&quot; to confirm</label>
            <input className="w-full px-3 py-2.5 border border-border rounded-input bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="DELETE" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/40 mt-6">
            <button onClick={() => { setDeleteOpen(false); setDeleteInput('') }} className="px-4 py-2 rounded-button bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all">Cancel</button>
            <button disabled={deleteInput !== 'DELETE'} onClick={async () => {
              await authService.logout()
              router.push('/login')
            }} className="px-4 py-2 rounded-button bg-danger text-white text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed">Delete Account</button>
          </div>
        </div>
      </Modal>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-primary to-secondary text-white px-5 py-3 rounded-card shadow-lg text-xs font-bold flex items-center gap-2 z-50 glow-primary"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
