'use client'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import { useTheme } from '@/context/ThemeContext'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useTheme()

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        <Topbar />
        <main className="pt-20 md:pt-28 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
