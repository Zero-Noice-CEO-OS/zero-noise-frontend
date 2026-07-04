'use client'
import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  preventOverlayClose?: boolean
}

export default function Modal({ open, onClose, title, children, preventOverlayClose }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventOverlayClose) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose, preventOverlayClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-md"
            onClick={preventOverlayClose ? undefined : onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-surface dark:bg-surface border border-border rounded-modal shadow-modal p-6 w-full max-w-md mx-auto z-10 glass-panel overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-textPrimary tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-surface/50 dark:hover:bg-white/5 rounded-full transition-colors duration-150 border border-transparent hover:border-border/40 text-textSecondary hover:text-textPrimary"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>
            <div className="text-sm text-textSecondary leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
