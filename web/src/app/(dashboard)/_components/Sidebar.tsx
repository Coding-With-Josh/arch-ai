"use client"

import Link from "next/link"
import { Home, Users, Settings, LineChart, Package, ShoppingCart, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NavItem, navItems, projectNavItems, workspaceNavItems } from "../data/navigation"
import { Input } from "@/components/ui/input"
import { useParams, usePathname } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const Sidebar = () => {
  const pathname = usePathname()
  const params = useParams()
  const segments = pathname.split("/").filter(Boolean)

  // Determine which navigation items to show
  let items: NavItem[] = navItems

  if (params.workspaceSlug && params.projectSlug) {
    // Project context - /[workspaceSlug]/[projectSlug]
    items = projectNavItems.map(item => ({
      ...item,
      href: `/${params.workspaceSlug}/${params.projectSlug}${item.href.replace('/project', '')}`
    }))
  } else if (params.workspaceSlug && !params.projectSlug ) {
    // Workspace context - /[workspaceSlug]/~/
    items = workspaceNavItems.map(item => ({
      ...item,
      href: `/${params.workspaceSlug}/~${item.href.replace('/workspace', '')}`
    }))
  }

  // Check if a nav item is active
  const isActive = (itemHref: string) => {
    // For project root
    if (itemHref === `/${params.workspaceSlug}/${params.projectSlug}`) {
      return pathname === itemHref || 
             (pathname.startsWith(`${itemHref}/`) && !pathname.includes('/~/'))
    }
    return pathname === itemHref
  }

  return (
    <div className="hidden border-r bg-background lg:block w-80 h-[calc(100vh-50px)] sticky top-[50px] overflow-y-auto">      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* <div className="flex h-[50px] border-b items-center px-6">
          <Link className="flex items-center gap-2 text-sm font-semibold" href="/">
            <Image
              src={require("@/assets/images/brand/arch_logo-transparent-bg.png")}
              alt="Logo"
              width={40}
              height={40}
              className="h-8 w-8 rounded-full"
            />
            <span>Arch</span>
          </Link>
        </div> */}    
        {/* <div className="mx-4 flex group mt-4 group-hover:bg-blue-500 items-center rounded-md border dark:border-muted/50 focus-visible:border-zinc-600 px-3 h-9">
          <Search className="mr-2 h-4 w-4 text-xs text-zinc-500 dark:text-zinc-400" />
          <Input
            className="flex-1 border-none focus-visible:ring-0 focus:ring-transparent focus-visible:ring-offset-0 w-full bg-transparent focus-visible:ring-transparent"
            placeholder="Search..."
            type="text"
          />
          <div className="ml-1 placeholder:text-xs rounded bg-zinc-200 dark:bg-zinc-900/70 px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300">
            /
          </div>
        </div> */}
        <div className="flex-1 overflow-auto py-2 mt-4">
          <nav className="grid items-start px-4 text-sm font-medium gap-[0.2rem]">
            {items.map((item) => (
              <Link
                key={item.name}
                className={cn(
                  "relative flex items-center gap-3 text-xs rounded-lg px-3 py-2 text-zinc-500 transition-all hover:bg-zinc-200/50 duration-300",
                  "dark:text-zinc-400 dark:hover:bg-zinc-800/50",
                  isActive(item.href) && "bg-zinc-200 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-800 dark:text-zinc-50"
                )}
                href={item.href}
                aria-disabled={item.isComingSoon}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
                {item.isComingSoon && (
                                  <Badge variant={"outline"} className="absolute right-2">Coming Soon</Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-lg bg-zinc-200/40 border hover:bg-zinc-200/70 transition-all duration-300 cursor-pointer p-4 dark:bg-zinc-900">
            <h3 className="text-md font-bold animate-pin bg-gradient-to-r from-pink-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              <Sparkles className="mr-2 inline h-4 w-4 text-yellow-500" />
              Upgrade to Gold
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Get access to all Gold features.
            </p>
            <Button className="mt-4 w-full" size="sm">
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar