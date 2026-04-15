"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ClipboardList, LogOut, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Natijalar", href: "/admin/results", icon: BarChart3 },
    { name: "Testlar", href: "/admin/tests", icon: ClipboardList },
  ]

  const isActive = (href: string) => pathname === href

  if (pathname === "/admin/login") return <>{children}</>

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-950 hidden md:flex flex-col p-4 fixed h-full">
        <div className="mb-10 px-2 mt-2">
          <img src="/Frame 344.png" alt="ICE Logo" className="h-10 w-auto" />
        </div>

        <nav className="space-y-1 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium text-sm",
                isActive(item.href) 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm mt-auto"
        >
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow md:ml-64 p-6 md:p-8">
        {children}
      </main>
    </div>
  )
}
