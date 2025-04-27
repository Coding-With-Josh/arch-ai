"use client"

import { Search, Bell, User, Menu, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { useTheme } from "next-themes"

const Navbar = () => {
  const { theme, setTheme } = useTheme()
  const usePathSegments = () => {
    const pathname = usePathname();
    return pathname.split("/").filter(Boolean);
  };
  return (
    <header className="flex w-full h-10 items-center gap-4 border-b bg-background px-6 lg:h-[50px]">   

      <div className="flex-1 text-zinc-300/80 text-sm first-letter:uppercase font-semibold flex items-center gap-2">
        <Breadcrumb>
          {/* <BreadcrumbItem>
            <Link href="/">Home</Link>
          <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem> */}
          {usePathSegments().map((segment, index, segments) => {
            const url = "/" + segments.slice(0, index + 1).join("/");
            const formattedSegment = decodeURIComponent(segment).charAt(0).toUpperCase() + decodeURIComponent(segment).slice(1);
            return (
              <BreadcrumbItem key={url}>
                <Link href={url} className="text-zinc-700/90 dark:text-zinc-300/80 dark:hover:text-zinc-300 hover:scale-105 transition-all">{formattedSegment}</Link>
                <ChevronRight className="h-4 w-4 mr-1 text-zinc-700/90 dark:text-zinc-300/80" />
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="">
          <Button variant="outline" size="icon" className="bg-zinc-200/70 hover:bg-zinc-300 dark:bg-zinc-900 rounded-lg size-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notification menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 dark:bg-zinc-800 bg-zinc-50">
          <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 border-b dark:border-b-zinc-700/50 border-b-zinc-300/50 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all">Notifications</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="">
          <Button variant="outline" size="icon" className="bg-zinc-200/70 hover:bg-zinc-300 dark:bg-zinc-900 rounded-lg size-8">
            <User className="h-4 w-4" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 dark:bg-zinc-800 bg-zinc-50">
          <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 border-b dark:border-b-zinc-700/20 border-b-zinc-300/20 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all">Profile</DropdownMenuItem>
          <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 border-b dark:border-b-zinc-700/20 border-b-zinc-300/20 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all">Settings</DropdownMenuItem>
          <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 border-b dark:border-b-zinc-700/20 border-b-zinc-300/20 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all" onClick={()=> setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "Dark mode" : "Light mode"}</DropdownMenuItem>
          <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default Navbar