'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'
import { useProfile } from '@/hooks/useUser'
import { subscriptionService, SubscriptionDetails } from '@/services/subscription-service'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CreditCard, Download, Info, AlertCircle, ShieldAlert, Sparkles, ClipboardCheck, Timer } from 'lucide-react'
import Modal from '@/components/Modal'

const PRICING_TIERS = [
  {
    name: 'Free',
    price: 0,
    cycle: 'lifetime',
    desc: 'Automatically assigned to every newly registered user.',
    features: ['Dashboard & Daily Logs', 'Activity Tracking', 'Weekly Reviews', '5 AI prompts / day', '5 Active Goals']
  },
  {
    name: 'Starter',
    price: 499,
    cycle: 'monthly',
    desc: 'For early-stage founders beginning to track metrics.',
    features: ['Everything in Free', 'Unlimited Goals & Activities', 'Unlimited Deep Work tracking', '20 AI prompts / day', 'Email Support']
  },
  {
    name: 'Founder Pro',
    price: 4899,
    cycle: 'yearly',
    desc: 'Best Value for Growing Founders',
    features: ['Everything in Starter', 'Unlimited AI prompts', 'Capability Engine', 'AI Chat History & Reports', 'Priority Support']
  },
  {
    name: 'Founder Elite',
    price: 18999,
    cycle: '6-years',
    desc: 'For High-Performance Leaders',
    features: ['Everything in Pro', 'Premium Analytics', 'Priority AI Queue', 'Early-Access Features', 'Exclusive Community']
  },
  {
    name: 'Lifetime Founder',
    price: 32999,
    cycle: 'lifetime',
    desc: 'Pay Once. Own Forever.',
    features: ['Everything in Elite', 'Lifetime Access', 'No Recurring Payments', 'All Future Updates', 'VIP Support']
  }
]

export default function SubscriptionPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const profileQuery = useProfile()

  const [subDetails, setSubDetails] = useState<SubscriptionDetails | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [viewPlanOpen, setViewPlanOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [autoRenew, setAutoRenew] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [upgradePriceDetails, setUpgradePriceDetails] = useState<any>(null)
  const [toast, setToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const name = profileQuery.data?.name || ''
  const email = profileQuery.data?.email || ''
  const mobileNumber = (profileQuery.data as any)?.mobileNumber || ''

  const loadSubscriptionInfo = async () => {
    try {
      const data = await subscriptionService.getDetails()
      setSubDetails(data)
      setAutoRenew(data.subscription.autoRenew)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadSubscriptionInfo()
  }, [])

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  const initiatePurchaseFlow = async (tier: any) => {
    setSelectedPlan(tier)
    setErrorMsg('')
    setUpgradePriceDetails(null)

    // FREE PLAN activation: instant bypass
    if (tier.name === 'Free') {
      setPaymentLoading(true)
      try {
        await subscriptionService.purchase({
          planName: 'Free',
          billingCycle: 'lifetime',
          name: name || 'Founder',
          email: email || 'co@zeronoise.co',
          mobileNumber: 'N/A',
          autoRenew: false,
          method: 'cod'
        })
        showToast('Free Plan activated successfully!')
        loadSubscriptionInfo()
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Bypass failed')
      } finally {
        setPaymentLoading(false)
      }
      return
    }

    const isUpgrade = subDetails && subDetails.subscription && subDetails.subscription.status === 'active' && subDetails.subscription.plan !== 'Free'
    if (isUpgrade) {
      setPaymentLoading(true)
      try {
        const upgradeDetails = await subscriptionService.calculateUpgrade({
          planName: tier.name,
          billingCycle: tier.cycle
        })
        setUpgradePriceDetails(upgradeDetails)
        setCheckoutOpen(true)
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Failed to calculate upgrade price')
      } finally {
        setPaymentLoading(false)
      }
    } else {
      setCheckoutOpen(true)
    }
  }

  const handleCodPayment = async () => {
    if (!selectedPlan) return
    setPaymentLoading(true)
    setErrorMsg('')
    try {
      await subscriptionService.purchase({
        planName: selectedPlan.name,
        billingCycle: selectedPlan.cycle,
        name: name || 'Valued Founder',
        email: email || 'co@zeronoise.co',
        mobileNumber: mobileNumber || '0000000000',
        autoRenew,
        method: 'cod'
      })
      setCheckoutOpen(false)
      showToast('Subscription activated successfully via COD!')
      loadSubscriptionInfo()
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'COD Activation failed')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleRazorpayPayment = async () => {
    if (!selectedPlan) return
    setPaymentLoading(true)
    setErrorMsg('')
    
    const amountToCharge = upgradePriceDetails ? upgradePriceDetails.amountDue : selectedPlan.price
    
    // Inject Razorpay script
    const loadScript = () => new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

    const scriptLoaded = await loadScript()
    if (!scriptLoaded) {
      setErrorMsg('Razorpay SDK failed to load. Are you connected to the internet?')
      setPaymentLoading(false)
      return
    }

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountToCharge * 100, // paise
        currency: 'INR',
        name: 'Zero Noise CEO OS',
        description: `Upgrade to ${selectedPlan.name}`,
        handler: async (response: any) => {
          setPaymentLoading(true)
          try {
            await subscriptionService.purchase({
              planName: selectedPlan.name,
              billingCycle: selectedPlan.cycle,
              name: name || 'Founder',
              email: email || 'founder@zeronoise.co',
              mobileNumber: mobileNumber || '9999999999',
              autoRenew,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              method: 'razorpay'
            })
            setCheckoutOpen(false)
            showToast('Razorpay payment verified & plan active!')
            loadSubscriptionInfo()
          } catch (err: any) {
            setErrorMsg(err.response?.data?.message || 'Payment verification failed')
          } finally {
            setPaymentLoading(false)
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: mobileNumber
        },
        theme: {
          color: '#3B82F6'
        }
      }
      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      setErrorMsg(err.message || 'Razorpay initiation failed')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleToggleAutoRenew = async (checked: boolean) => {
    try {
      await subscriptionService.toggleAutoRenew(checked)
      setAutoRenew(checked)
      showToast(checked ? 'Auto renewal enabled!' : 'Auto renewal disabled!')
      loadSubscriptionInfo()
    } catch (e) {
      console.error(e)
      showToast('Failed to update auto renewal status.')
    }
  }

  const getPlanLimitLabel = (plan: string) => {
    switch (plan) {
      case 'Free':
        return { ai: '5 requests / day', goals: '5 active goals', reports: 'Not included' }
      case 'Starter':
        return { ai: '20 requests / day', goals: 'Unlimited active goals', reports: 'Weekly logs only' }
      default:
        return { ai: 'Unlimited requests', goals: 'Unlimited active goals', reports: 'Advanced reports included' }
    }
  }

  const activePlan = subDetails?.subscription?.plan || 'Free'
  const planLimits = getPlanLimitLabel(activePlan)

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-textPrimary">Subscription Management</h1>
          <p className="text-xs text-textSecondary font-semibold mt-1">Upgrade your capacity, manage active plans, and track billing logs.</p>
        </div>
      </div>

      {subDetails && subDetails.subscription && (
        <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-textSecondary">Active Tier</span>
            <h3 className="text-2xl font-black text-primary flex items-center gap-1.5">
              {subDetails.subscription.plan} 
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-success uppercase tracking-widest font-extrabold">
                {subDetails.subscription.status}
              </span>
            </h3>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-textSecondary">Plan Cycle / Expiration</span>
            <p className="text-sm font-bold text-textPrimary">
              {subDetails.subscription.expiresAt 
                ? new Date(subDetails.subscription.expiresAt).toLocaleDateString()
                : 'Unlimited Duration'
              }
            </p>
            {subDetails.subscription.expiresAt && (
              <p className="text-[10px] text-textSecondary font-semibold">
                Remaining Days: {Math.max(0, Math.ceil((new Date(subDetails.subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
              </p>
            )}
          </div>

          <div className="space-y-2 flex flex-col justify-center sm:items-end">
            <button
              onClick={() => setViewPlanOpen(true)}
              className="px-4 py-2.5 text-xs font-bold bg-primary text-white rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Info size={14} /> View Plan details
            </button>
          </div>
        </div>
      )}

      {/* Tiers Pricing Matrix */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-textPrimary uppercase tracking-wider">Available Subscription Tiers</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {PRICING_TIERS.map((tier) => {
            const isActive = activePlan === tier.name
            return (
              <div
                key={tier.name}
                className={`bg-surface/50 border rounded-card p-5 flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all ${
                  isActive ? 'border-primary ring-2 ring-primary/10' : 'border-border'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2.5 right-4 bg-primary text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold shadow-sm">
                    Active
                  </span>
                )}

                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-textPrimary uppercase">{tier.name}</h4>
                    <p className="text-[10px] text-textSecondary mt-1 leading-relaxed">{tier.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-textPrimary">₹{tier.price.toLocaleString()}</span>
                    <span className="text-[10px] text-textSecondary font-semibold">
                      /{tier.cycle === 'lifetime' ? 'once' : tier.cycle === 'yearly' ? 'yr' : tier.cycle === '6-years' ? '6 yrs' : 'mo'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-border/40">
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-textSecondary font-medium">
                        <Check size={11} className="text-success shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => initiatePurchaseFlow(tier)}
                    disabled={isActive}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isActive
                        ? 'bg-surface text-textSecondary/60 cursor-not-allowed border border-border'
                        : 'bg-primary text-white hover:opacity-90 active:scale-95'
                    }`}
                  >
                    {isActive ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Payment History Invoices Section */}
      <div className="bg-surface/50 border border-border rounded-card p-6 shadow-card space-y-4">
        <h3 className="text-sm font-black text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
          <Download size={14} /> Invoices & Billing Logs
        </h3>

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs font-medium text-textSecondary">
            <thead>
              <tr className="border-b border-border/60 text-[10px] uppercase text-textSecondary font-extrabold pb-2">
                <th className="py-2">Invoice No</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subDetails?.invoices && subDetails.invoices.length > 0 ? (
                subDetails.invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/40 last:border-0 hover:bg-background/20">
                    <td className="py-3 font-bold text-textPrimary">{inv.invoiceNumber}</td>
                    <td className="py-3">{inv.planName}</td>
                    <td className="py-3 font-bold text-textPrimary">₹{inv.amountPaid / 100}</td>
                    <td className="py-3">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-success/15 text-success uppercase">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/subscriptions/invoice/${inv.id}`}
                        download
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-xs text-textSecondary/70 font-bold uppercase tracking-wider">
                    No payment invoice records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Details Modal */}
      <Modal open={viewPlanOpen} onClose={() => setViewPlanOpen(false)} title="Active Plan Details">
        <div className="space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-border/40">
            <div>
              <span className="text-[10px] uppercase font-bold text-textSecondary">Current Subscription</span>
              <h3 className="text-xl font-black text-primary">{activePlan}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-textSecondary">Billing Cycle</span>
              <p className="text-sm font-bold capitalize text-textPrimary">{subDetails?.subscription?.billingCycle || 'N/A'}</p>
            </div>
          </div>

          {/* Usage Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-background border border-border/60 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-textSecondary">AI Coach Prompts</span>
                <p className="text-xs font-semibold text-textPrimary mt-0.5">{subDetails?.usage?.aiRequests ?? 0} Used today</p>
                <p className="text-[10px] text-textSecondary">Limit: {planLimits.ai}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background border border-border/60 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <Timer size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-textSecondary">Deep Work Sessions</span>
                <p className="text-xs font-semibold text-textPrimary mt-0.5">{subDetails?.usage?.deepWorkHours ?? 0} Sessions tracked</p>
                <p className="text-[10px] text-textSecondary">Limit: Unlimited</p>
              </div>
            </div>
          </div>

          {/* Limits Info */}
          <div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
            <h4 className="text-xs font-bold text-textPrimary flex items-center gap-1.5"><ClipboardCheck size={14} /> Plan Limitations</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-textSecondary">
              <p>Active Goals Limit: <strong className="text-textPrimary">{planLimits.goals}</strong></p>
              <p>Weekly/Monthly Reports: <strong className="text-textPrimary">{planLimits.reports}</strong></p>
            </div>
          </div>

          {/* Auto Renewal Toggle */}
          {activePlan !== 'Free' && activePlan !== 'Lifetime Founder' && subDetails?.subscription?.expiresAt && (
            <div className="flex items-center justify-between py-3 border-t border-border/40">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-textPrimary">Auto-renew plan</p>
                <p className="text-[10px] text-textSecondary">Extend validity automatically at next cycle.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => handleToggleAutoRenew(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-background dark:bg-border rounded-full peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-border/40">
            <button
              onClick={() => setViewPlanOpen(false)}
              className="px-4 py-2 rounded-xl bg-surface border border-border text-textPrimary text-xs font-bold hover:bg-background/80 transition-all"
            >
              Close Plan details
            </button>
          </div>
        </div>
      </Modal>

      {/* Checkout Payment Flow Modal */}
      <Modal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} title="Confirm Payment Details">
        <div className="space-y-4">
          {errorMsg && <div className="p-3 text-xs rounded bg-red-500/10 border border-red-500/20 text-red-500 font-bold">{errorMsg}</div>}

          {selectedPlan && (
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-card border border-border/60 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-textSecondary">Selected Tier</span>
                  <p className="text-sm font-black text-textPrimary">{selectedPlan.name}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-textSecondary">Cycle</span>
                  <p className="text-sm font-bold text-textPrimary uppercase">{selectedPlan.cycle}</p>
                </div>
                <div className="col-span-2 border-t border-border/40 pt-3 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-textSecondary">Amount Due</span>
                  <p className="text-lg font-black text-primary">
                    ₹{upgradePriceDetails ? upgradePriceDetails.amountDue : selectedPlan.price}
                  </p>
                </div>
              </div>

              {upgradePriceDetails && (
                <div className="bg-success/5 border border-success/20 rounded-xl p-3 text-[10px] text-textSecondary space-y-1.5">
                  <p className="font-bold text-textPrimary flex items-center gap-1">
                    <Info size={12} className="text-success" /> Prorated Upgrade Active
                  </p>
                  <p>Remaining credit from old plan: <strong className="text-textPrimary">₹{upgradePriceDetails.prorationCredit}</strong></p>
                </div>
              )}

              {/* Auto Renew Switch */}
              <div className="flex items-center justify-between py-2 border-b border-border/40">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-textPrimary">Auto-renew subscription</p>
                  <p className="text-[10px] text-textSecondary">Automatically charge and extend plan validity.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRenew}
                    onChange={() => setAutoRenew(!autoRenew)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-background dark:bg-border rounded-full peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>

              {/* Developer COD Bypass Switch if development env */}
              {process.env.NEXT_ENV !== 'production' && (
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-card space-y-2">
                  <p className="text-xs font-bold text-yellow-500 flex items-center gap-1"><AlertCircle size={13} /> Development Mode Active</p>
                  <button
                    disabled={paymentLoading}
                    onClick={handleCodPayment}
                    className="w-full py-2.5 rounded-xl bg-yellow-500 text-white font-bold text-xs shadow-md hover:bg-yellow-600 transition-all flex items-center justify-center gap-1"
                  >
                    {paymentLoading ? 'Activating COD...' : 'Bypass with Cash on Delivery'}
                  </button>
                </div>
              )}

              {/* Standard Razorpay Checkout */}
              <button
                onClick={handleRazorpayPayment}
                disabled={paymentLoading}
                className="w-full py-3 rounded-button bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {paymentLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                    Processing Checkout...
                  </>
                ) : (
                  <>
                    <CreditCard size={14} /> Pay securely with Razorpay
                  </>
                )}
              </button>
            </div>
          )}
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
