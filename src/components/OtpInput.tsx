'use client'

import { useState, useEffect, useRef } from 'react'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (code: string) => void
  disabled?: boolean
  error?: boolean
}

export default function OtpInput({ length = 6, value, onChange, disabled = false, error = false }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    // Sync external value updates
    const codeDigits = value.split('').slice(0, length)
    const newDigits = Array(length).fill('')
    codeDigits.forEach((char, idx) => {
      newDigits[idx] = char
    })
    setDigits(newDigits)
  }, [value, length])

  const handleChange = (val: string, index: number) => {
    const cleaned = val.replace(/[^0-9]/g, '')
    if (!cleaned) {
      const newDigits = [...digits]
      newDigits[index] = ''
      setDigits(newDigits)
      onChange(newDigits.join(''))
      return
    }

    const lastChar = cleaned[cleaned.length - 1]
    const newDigits = [...digits]
    newDigits[index] = lastChar
    setDigits(newDigits)
    onChange(newDigits.join(''))

    // Auto-focus next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length)
    if (!pastedData) return

    const newDigits = [...digits]
    pastedData.split('').forEach((char, idx) => {
      newDigits[idx] = char
    })
    setDigits(newDigits)
    onChange(newDigits.join(''))

    // Focus last active slot or next empty slot
    const focusIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={el => { inputRefs.current[idx] = el }}
          type="text"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={e => handleChange(e.target.value, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          className={`w-10 h-12 text-center text-lg font-bold border rounded-xl bg-surface focus:outline-none transition-all ${
            error
              ? 'border-red-500 text-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-border text-textPrimary focus:ring-2 focus:ring-primary/20 focus:border-primary'
          } disabled:opacity-50`}
        />
      ))}
    </div>
  )
}
