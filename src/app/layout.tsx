import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zero Noise CEO OS',
  description: 'Your personal operating system for focus, growth, and execution.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-bg-dark text-text-primary dark:text-gray-100 antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
