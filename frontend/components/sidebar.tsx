"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { History, Home, Info, Lightbulb, LogOut, Search, Settings, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")

  const mainNavItems = [
    { icon: Home, label: "Dashboard", href: "/", active: pathname === "/" },
    { icon: Search, label: "Explore", href: "/explore", active: pathname === "/explore" },
    { icon: History, label: "History", href: "/history", active: pathname === "/history" },
    { icon: Lightbulb, label: "Insights", href: "/insights", active: pathname === "/insights" },
  ]

  const settingsNavItems = [
    { icon: User, label: "Profile", href: "/profile", active: pathname === "/profile" },
    { icon: Settings, label: "Settings", href: "/settings", active: pathname === "/settings" },
    { icon: Info, label: "About", href: "/about", active: pathname === "/about" },
  ]

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-lg transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "flex h-full flex-col border-r",
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-primary-foreground">FI</span>
            </div>
            <h1 className="text-xl font-bold">Factifi</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search facts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full"
            />
          </div>
        </div>

        {/* Sidebar content */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-6 py-3">
            {/* Main navigation */}
            <div className="space-y-2">
              <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Main</h2>
              <nav className="space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                      item.active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Settings navigation */}
            <div className="space-y-2">
              <h2 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Settings</h2>
              <nav className="space-y-1">
                {settingsNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </ScrollArea>

        {/* Sidebar footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">User Name</span>
                <span className="text-xs text-muted-foreground">user@example.com</span>
              </div>
            </div>
            <ModeToggle />
          </div>
          <Button variant="ghost" size="sm" className="mt-4 w-full justify-start rounded-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}
