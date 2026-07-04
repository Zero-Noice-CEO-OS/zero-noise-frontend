'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'
const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  isMobileOpen: boolean
  toggleMobileOpen: () => void
  setMobileOpen: (open: boolean) => void
}>({
  theme: 'light',
  toggle: () => {},
  sidebarCollapsed: false,
  toggleSidebar: () => {},
  isMobileOpen: false,
  toggleMobileOpen: () => {},
  setMobileOpen: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme
    if (stored) {
      setTheme(stored)
    } else {
      // Check system preference
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      if (media.matches) setTheme('dark')
    }
    
    const storedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true'
    setSidebarCollapsed(storedCollapsed)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev
      localStorage.setItem('sidebarCollapsed', String(next))
      return next
    })
  }

  const toggleMobileOpen = () => setIsMobileOpen(prev => !prev)
  const setMobileOpen = (open: boolean) => setIsMobileOpen(open)

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle,
        sidebarCollapsed,
        toggleSidebar,
        isMobileOpen,
        toggleMobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
