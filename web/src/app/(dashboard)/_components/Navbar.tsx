"use client"

import { Search, Bell, User, Menu, ChevronRight, Home, Slash, Plus, ChevronsUpDown, Settings, Moon, Sun, LogOut, Boxes } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { usePathname } from "next/navigation"
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { useTheme } from "next-themes"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { Session } from "next-auth"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { CommandCenter } from "./command"
import { useAppKit, useAppKitAccount, useWalletInfo } from "@reown/appkit/react"
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter, useAppKitConnection } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWorkspace } from "@/hooks/useWorkspace"

const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [

  ],
});

const projectId = "e9023d2f88fbf472c48e4e2be75c48aa";

const metadata = {
  name: "Arch",
  description: "Arch",
  url: "https://arch-ai-dev.vercel.app",
  icons: ["../assets/brand/arch-logo.jpg"],
};

createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata,
  projectId,
  features: {
    analytics: true,
  },
});

const Navbar = ({ session, workspaces }: { session: Session | null, workspaces: any }) => {
  const { open } = useAppKit()
  const { connection } = useAppKitConnection()
  const { address } = useAppKitAccount()
  const { theme, setTheme } = useTheme()
  const { saveWallet } = useWorkspace()
  const [isCommandCenterVisible, setIsCommandCenterVisible] = useState(false)
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean)
  const usePathSegments = () => {
    const pathname = usePathname();
    return pathname.split("/").filter(Boolean);
  };

  const wallet = {
    address,
    balance: connection?.getBalance
  }

  // useEffect(() => {
  //   connection && saveWallet(wallet)
  // }, [wallet])
  

  // connection && saveWallet(wallet)

  return (
    // <header className="sticky top-0 z-10 w-full h-14 items-center gap-4 border-b bg-background px-6 lg:h-[50px] flex">
    //   <div className="flex-1 text-zinc-300/80 text-xs first-letter:uppercase font-semibold flex items-center gap-2">
    //     <Breadcrumb className="flex items-center gap-2">
    //       <BreadcrumbItem>
    //         <Home className="h-3 w-3 mr-2 text-zinc-700 dark:text-zinc-300/80 dark:hover:text-zinc-300 hover:scale-105 transition-all" />
    //         <Link href="/dashboard" className="text-zinc-700/90 dark:text-zinc-300/80 dark:hover:text-zinc-300 hover:scale-105 transition-all">Home</Link>
    //         <Slash className="h-2.5 w-2.5 mr-2 mt-1 ml-2" />
    //       </BreadcrumbItem>
    //       {usePathSegments().map((segment, index, segments) => {
    //         const url = "/" + segments.slice(0, index + 1).join("/");
    //         const decoded = decodeURIComponent(segment);
    //         const formattedSegment = decoded.charAt(0).toUpperCase() + decoded.slice(1);
    //         return (
    //           <BreadcrumbItem key={url}>
    //             <Link
    //               href={url}
    //               className="text-zinc-700/90 dark:text-zinc-300/80 dark:hover:text-zinc-300 hover:scale-105 transition-all"
    //             >
    //               {formattedSegment}
    //             </Link>
    //             <Slash className="h-2.5 w-2.5 mr-1 mt-1 ml-2 text-zinc-700/90 dark:text-zinc-300/80" />
    //           </BreadcrumbItem>
    //         );
    //       })}
    //     </Breadcrumb>
    //   </div>
    //   <Button variant="outline" className="bg-zinc-200/70 hover:bg-zinc-300 dark:bg-zinc-900 rounded-lg h-8 text-xs">
    //   Feedback
    //   </Button>
    //   <DropdownMenu>
    //     <DropdownMenuTrigger asChild className="">
    //       <Button variant="outline" size="icon" className="bg-zinc-200/70 hover:bg-zinc-300 dark:bg-zinc-900 rounded-lg h-8 min-w-fit">
    //         <Bell className="h-4 w-4" />
    //         <span className="sr-only">Toggle notification menu</span>
    //       </Button>
    //     </DropdownMenuTrigger>
    //     <DropdownMenuContent align="end" className="w-40 dark:bg-zinc-800 bg-zinc-50">
    //       <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 border-b dark:border-b-zinc-700/50 border-b-zinc-300/50 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all">Notifications</DropdownMenuItem>
    //     </DropdownMenuContent>
    //   </DropdownMenu>
    //   <DropdownMenu>
    //     <DropdownMenuTrigger asChild className="">
    //       <Button variant="outline" size="icon" className="bg-zinc-200/70 hover:bg-zinc-300 dark:bg-zinc-900 rounded-lg size-8">
    //         <Avatar className="h-8 w-8 cursor-pointer rounded-lg">
    //           <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'Me'} />
    //           <AvatarFallback>{session?.user?.name ? session?.user.name.charAt(0) : '?'}</AvatarFallback>
    //         </Avatar>
    //         <span className="sr-only">Toggle user menu</span>
    //       </Button>
    //     </DropdownMenuTrigger>
    //     <DropdownMenuContent align="end" className="w-40 dark:bg-zinc-800 bg-zinc-50">
    //       <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 border-b dark:border-b-zinc-700/20 border-b-zinc-300/20 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all">Profile</DropdownMenuItem>
    //       <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 border-b dark:border-b-zinc-700/20 border-b-zinc-300/20 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all">Settings</DropdownMenuItem>
    //       <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 border-b dark:border-b-zinc-700/20 border-b-zinc-300/20 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "Dark mode" : "Light mode"}</DropdownMenuItem>
    //       <DropdownMenuItem className="dark:bg-zinc-800 bg-zinc-50 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900/60 transition-all" onClick={() => signOut()}>Logout</DropdownMenuItem>
    //     </DropdownMenuContent>
    //   </DropdownMenu>
    // </header>

    <header className="sticky top-0 z-50 w-full min-h-12 py-2 flex items-center justify-between border-b dark:border-muted/50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm px-6">
      {/* Left section - Brand and navigation */}
      <div className="flex items-center gap-3">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src={require("@/assets/images/brand/arch_logo.jpg")}
            alt="Logo"
            width={32}
            height={32}
            className="h-6 w-6 rounded-lg transition-all group-hover:scale-105"
          />
        </Link>
        <Slash className="h-2.5 w-2.5 text-zinc-500 dark:text-zinc-600 rotate-12" />

        {/* Organization dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2.5 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
              <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {segments[0] || "Workspaces"}
              </span>
              {/* <Badge variant="secondary" className="ml-1.5 text-xs">
              Free
            </Badge> */}
              <ChevronsUpDown className="ml-1.5 h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-1 gap-2">
            <div className="relative px-2 py-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
              <Input
                type="text"
                placeholder="Find workspace..."
                className="pl-8 h-5 text-xs border-0 shadow-none focus-visible:ring-0 bg-zinc-100/50 dark:bg-zinc-900/50 "
              />
            </div>
            <Separator className="my-1 bg-zinc-300 dark:bg-zinc-700" />
            {/* Workspaces list */}
            {workspaces.map((workspace: any) => (
              <DropdownMenuItem key={workspace.id} className="px-2 py-1 text-xs hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
                <Link
                  href={`/${workspace.slug}${segments.length > 1 ? "/" + segments.slice(1).join("/") : ""}`}
                  className="flex items-center gap-2"
                >
                  {workspace.logo ? (
                    <Image
                      src={workspace.logo}
                      alt={workspace.name}
                      width={32}
                      height={32}
                      className="h-6 w-6 rounded-lg"
                    />
                  ) : (
                    <Boxes className="h-4 w-4 rounded-lg text-zinc-500 dark:text-zinc-400" />)}
                  <span className="text-zinc-800 dark:text-zinc-200">{workspace.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}

            <Separator className="my-1 bg-zinc-300 dark:bg-zinc-700" />
            <Link href={"/~/create/workspace"} className="px-2 py-1 text-xs hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
              <DropdownMenuItem className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-zinc-800 dark:text-zinc-200">Create new</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-xl mx-4 relative lg:flex hidden">
        <Button
          variant="outline"
          className="w-full h-8 px-3 bg-white dark:bg-zinc-900 border-muted/70 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 flex items-center justify-between"
          onClick={() => setIsCommandCenterVisible(!isCommandCenterVisible)}
        >
          <div className="flex items-center text-zinc-600 dark:text-zinc-400">
            <Search className="h-3.5 w-3.5 mr-2" />
            <span className="text-xs">Search or jump to...</span>
          </div>
          <div className="flex items-center">
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[0.65rem] rounded border border-muted/70 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              ⌘K
            </kbd>
          </div>
        </Button>
        {isCommandCenterVisible && (
          <div className="absolute left-0 top-full mt-1 w-full z-10">
            <CommandCenter />
          </div>
        )}
      </div>

      {/* Right section - Actions and user */}
      <div className="flex items-center gap-1.5">
        {connection ? (
          <div className="lg:flex hidden">
            <appkit-account-button />
          </div>
        ):(
          <div className="lg:flex hidden">
            <appkit-connect-button size="sm" loadingLabel="Connecting" label="Connect a wallet" />
          </div>

        )}
        {/* {connection ? (
          <Button variant="ghost" size="sm" className="h-6 px-2.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50" onClick={() => open}>
            {address?.toString()}
          </Button>) : (
          // <Button variant="ghost" size="sm" className="h-6 px-2.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50" onClick={() => open}>
          //   Connect wallet
          // </Button>
          <appkit-connect-button size="sm" />
        )}
          */}
        <Button variant="ghost" size="sm" className="h-6 px-2.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
          Feedback
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
              <Bell className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950">
            <div className="px-2 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-200">
              Notifications
            </div>
            <Separator className="bg-zinc-300 dark:bg-zinc-700" />
            <DropdownMenuItem className="px-2 py-1 text-xs hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
              No new notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
              <Avatar className="h-6 w-6">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                <AvatarFallback className="bg-zinc-300 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs">
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1">
              <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {session?.user?.name || 'User'}
              </div>
              <div className="text-[0.65rem] text-zinc-600 dark:text-zinc-400">
                {session?.user?.email || 'No email'}
              </div>
            </div>
            <Separator className="bg-zinc-300 dark:bg-zinc-700 my-1" />
            <DropdownMenuItem className="text-xs hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
              <User className="mr-2 h-3.5 w-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <>
                  <Moon className="mr-2 h-3.5 w-3.5" />
                  Dark mode
                </>
              ) : (
                <>
                  <Sun className="mr-2 h-3.5 w-3.5" />
                  Light mode
                </>
              )}
            </DropdownMenuItem>
            <Separator className="bg-zinc-300 dark:bg-zinc-700 my-1" />
            <DropdownMenuItem
              className="text-xs hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-red-600 dark:text-red-400"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

  )
}

export default Navbar