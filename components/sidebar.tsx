"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  LayoutGrid,
  Globe,
  Users,
  Wand2,
  Send,
  LogOut,
  BarChart3,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/analytics" },
    { id: "countries-sources", label: "Countries & Sources", icon: Globe, href: "/countries-sources" },
    { id: "sponsors", label: "Sponsors", icon: Users, href: "/sponsors" },
    { id: "script-generation", label: "Script Generation", icon: Wand2, href: "/script-generation" },
    { id: "publishing", label: "Publishing", icon: Send, href: "/publishing" },
    { id: "social-rotations", label: "Social Rotations", icon: Send, href: "/social-rotations" },
    { id: "configurations", label: "Script Configurations", icon: Settings, href: "/configurations" },
  ]

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-sm">J</span>
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">Jarayid Automation</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full justify-center gap-2 bg-transparent"
          onClick={() => console.log("Sign out")}
        >
          <LogOut size={18} />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
