"use client"

import type React from "react"

import { useState } from "react"
import { History, Home, Info, Lightbulb, LogOut, RotateCcw, Search, Settings, User } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useFactCheckStore } from "@/lib/store"

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { setClaim, setAutoSubmit } = useFactCheckStore()

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setClaim(searchQuery)
      setAutoSubmit(true)
      router.push("/")
      setSearchQuery("")
    }
  }

  const handleReset = () => {
    router.push("/")
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Factifi Logo" />
            <AvatarFallback>FI</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold">Factifi</h1>
        </div>
        <form onSubmit={handleSearchSubmit} className="px-2 py-2">
          <SidebarInput
            placeholder="Search facts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <div className="px-2 py-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center gap-2 rounded-full"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={item.active} tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={item.active} tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <a href="/logout">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
      <SidebarTrigger className="absolute left-4 top-4 z-50 md:hidden" />
    </Sidebar>
  )
}
