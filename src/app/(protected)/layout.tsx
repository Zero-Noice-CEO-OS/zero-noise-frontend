import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-16 p-8">{children}</main>
    </div>
  )
}
