"use client";

import { Blog } from "@/components/landing/blog";
import FeaturesGrid from "@/components/landing/features-grid";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/nav";
import Particles from "@/components/landing/particles";
import Pricing from "@/components/landing/pricing";
import { SessionCheck } from "@/components/landing/session-check";
import { UserDropdown } from "@/components/navbar/user-dropdown";
import { ChevronRight, ChevronRightIcon, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";


export default function Home({ session }: { session: any }) {

  return (
    <div className="">
      {/* <div className="flex flex-col items-center justify-start w-screen h-screen overflow-x-hidden bg-black/30">
        <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/20 to-zinc-300/0" />
        */}
        {/* <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={100}
        />  */}
       
        <section 
      id="hero" 
      className="relative mx-auto w-full pt-40 px-6 text-center md:px-8 min-h-[calc(100vh-40px)] overflow-hidden bg-[linear-gradient(to_bottom,#fff,#ffffff_50%,#e8e8e8_88%)] dark:bg-[linear-gradient(to_bottom,#000,#0000_30%,#898e8e_78%,#ffffff_99%_50%)] rounded-b-xl"
    >
      {/* Grid background */}
      <div className="absolute -z-1 inset-0 opacity-10 h-[600px] w-full bg-transparent bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_5rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Radial gradient */}
      <div className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)] h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%] -translate-x-1/2 rounded-[100%] border-[#B48CDE] bg-black bg-[radial-gradient(closest-side,#000_82%,#ffffff)]"></div>
      
      {/* Tagline link */}
      <Link href="https://x.com/build_with_arch" target="_blank">
        <div className="relative mt-[-2rem] mb-[2rem] inline-flex items-center px-6 py-2 bg-gradient-to-tr from-zinc-600/40 via-transparent to-transparent rounded-full border border-zinc-800/30 shadow-md backdrop-blur-lg cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:border-zinc-800/50 text-sm">
          <div className="flex items-center space-x-2 animate-fade-in">
            <Twitter className="h-4 w-4 text-foreground" strokeWidth={2} />
            <span className="text-zinc-200/40 select-none">
              Introducing Arch v1...
            </span>
            <ChevronRightIcon className="h-2.5 w-2.5 text-foreground" />
          </div>
        </div>
      </Link>
      
      {/* Main heading */}
<h1 className="text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl dark:from-white dark:to-white/40">
  <span className="text-edge-outline dark:text-edge-outline-dark whitespace-normal bg-gradient-to-t from-zinc-700/40 via-zinc-500/20 to-zinc-100 bg-clip-text text-transparent">Arch</span> is a new way of<br className="hidden md:block" /> creating software
</h1>

{/* Subheading */}
<p className="mb-12 text-balance text-lg tracking-tight text-gray-400 md:text-xl">
The world's first multi-ecosystem, multi-chain developer tool.
<br className="hidden md:block" /> Build, deploy, scale and connect, all in one platform.
</p>
      
      {/* CTA button */}
      <div className="flex justify-center">
      {session ? (
                  <Link href="/dashboard" className="mt-[-20px] w-fit md:w-52 z-20 tracking-tighter text-center rounded-md text-md bg-gradient-to-br from-zinc-100 to-zinc-200 px-4 py-2 text-lg text-black ring-4 ring-zinc-700/90 ring-offset-4 ring-offset-zinc-100 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-zinc-500/70 flex items-center justify-center gap-2 cursor-pointer">
                  Go to dashboard
              </Link>
              ) : (
                <Link href="/auth" className="mt-[-20px] w-fit md:w-52 z-20 tracking-tighter text-center rounded-md text-md bg-gradient-to-br from-zinc-100 to-zinc-200 px-4 py-2 text-lg text-black ring-4 ring-zinc-700/90 ring-offset-4 ring-offset-zinc-100 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-zinc-500/70 flex items-center justify-center gap-2 cursor-pointer">
                Get Started
            </Link>
              )}
     
      </div>
      
      {/* Animation container */}
      <div className="animate-fade-up relative mt-32 opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]"></div>
    </section>
        {/* <div className="w-full flex items-center justify-center">
          {session ? (
            <UserDropdown session={session} />
          ) : (
            <a
              href={"/auth"}
              className="font-display2 rounded-2xl text-md mt-5 px-6 py-3 border-2 bg-gradient-to-tr from-zinc-600/40 via-transparent to-transparent text-zinc-200/40 flex justify-center items-center border-zinc-900/20"
            >
              <span className="relative flex items-center">
                <Particles
                  className="absolute inset-0 -z-10 animate-fade-in"
                  quantity={100}
                />
                Auth
              </span>
            </a>
          )}
        </div> */}
        {/* <div ref={imageRef} className={` px-10 w-screen ${inView ? "flex items-center justify-center" : ""}`}>
          <Image
            src={require("@/assets/images/ui/dash-ui-transparent-bg.png")}
            alt="Dash-ui"
            className="w-4/5 transition-all rounded-xl duration-500 hover:scale-105"
            style={{
              transform: inView ? "none" : "perspective(1000px) rotateX(30deg) rotateY(720deg)",
              opacity: 0.5,
            }}
          />
        </div> */}
        <FeaturesGrid />
        <Pricing />
        <Blog/>
        {/* <CTA />
      <SocialMedia /> */}
      </div>
    // </div>
  );
}
