'use client'
import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'

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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={preventOverlayClose ? undefined : onClose}
      />
      <div className="relative bg-white dark:bg-surface-dark rounded-modal shadow-xl p-6 w-full max-w-md mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-surface-light dark:hover:bg-gray-700 rounded-full transition-colors duration-150">
            <X size={20} className="text-text-muted" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
