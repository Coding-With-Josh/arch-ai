"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import Faq from "@/components/landing/faq";
import FeaturesGrid from "@/components/landing/features-grid";
import OpenSource from "@/components/landing/open-source";
import Pricing from "@/components/landing/pricing";

export default function Home({ session }: { session: any }) {
  // Typewriter effect state
  const [currentText, setCurrentText] = useState("dApps");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const textArray = ["dApps", "DAOs", "DeFi Apps"];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleType = () => {
      const i = loopNum % textArray.length;
      const fullText = textArray[i];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(20);
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(20);
      }

      if (!isDeleting && currentText === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 800);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(50);
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, textArray]);

  return (
    <div className="overflow-x-hidden">
      <section
        id="hero"
        className="relative mx-auto w-full pt-40 px-6 text-center md:px-8 min-h-[calc(100vh-40px)] overflow-hidden bg-[linear-gradient(to_bottom,#fff,#ffffff_50%,#e8e8e8_88%)] dark:bg-[linear-gradient(to_bottom,#000,#0000_30%,#898e8e_78%,#ffffff_99%_50%)] rounded-b-xl"
      >
        {/* Grid background */}
        <div className="absolute -z-1 inset-0 opacity-10 h-[600px] w-full bg-transparent bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_5rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        {/* Radial gradient */}
        <div className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)] h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%] -translate-x-1/2 rounded-[100%] border-[#B48CDE] bg-black bg-[radial-gradient(closest-side,#000_82%,#ffffff)]"></div>

        {/* Tagline link */}
        <Link href="https://x.com/build_with_arch/status/1914665163631858117" target="_blank">
          <div className="relative mt-[-2rem] mb-[2rem] inline-flex items-center px-6 py-0 bg-gradient-to-tr from-zinc-600/40 via-transparent to-transparent rounded-full border border-zinc-800/30 shadow-md backdrop-blur-lg cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:border-zinc-800/50 text-sm">
            <div className="flex items-center space-x-2 animate-fade-in">
              <svg
                className="h-8 w-8 fill-current"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
              </svg>
              <span className="text-zinc-900/80 dark:text-zinc-200/60 select-none">
                We're joining the Colosseum Breakout Hacakthon...
              </span>
              <ChevronRightIcon className="h-2.5 w-2.5 text-foreground" />
            </div>
          </div>
        </Link>

        {/* Main heading with typewriter effect */}
        <h1 className="text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl dark:from-white dark:to-white/40">
          <span className="text-edge-outline dark:text-edge-outline-dark whitespace-normal bg-gradient-to-t from-zinc-700/40 via-zinc-500/20 to-zinc-100 bg-clip-text text-transparent">
            Ship{" "}
            <span className="relative">
              <span className="text-white">{currentText}</span>
              {/* <span className="absolute -right-2 top-4 h-20 w-1.5 bg-white animate-pulse"></span> */}
            </span>{" "}
            in days <br/>not months
          </span>
        </h1>

        {/* Subheading */}
        <p className="mb-12 text-balance text-lg tracking-tight text-gray-400 md:text-xl">
          The world's first multi-ecosystem, multi-chain developer tool.
          <br className="hidden md:block" /> Build, deploy, scale and connect, all in one platform.
        </p>

        {/* CTA button */}
        <div className="flex justify-center">
          {session ? (
            <Link href="/~/choose-workspace" className="mt-[-20px] w-fit md:w-52 z-20 tracking-tighter text-center rounded-md text-md bg-gradient-to-br from-zinc-100 to-zinc-200 px-4 py-2 text-lg text-black ring-4 ring-zinc-700/90 ring-offset-4 ring-offset-zinc-100 transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-zinc-500/70 flex items-center justify-center gap-2 cursor-pointer">
              Continue
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
      {/* ... rest of your components ... */}
      <FeaturesGrid />
      <Pricing />
      <Faq />
      <OpenSource />
    </div>
  );
}