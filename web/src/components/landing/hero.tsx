import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import Particles from './particles'
import { UserDropdown } from '../navbar/user-dropdown'
import { ChevronRightIcon, Twitter } from 'lucide-react'

export const Hero = () => {
    const imageRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setInView(entry.isIntersecting);
          });
        },
        { threshold: 0.5 }
      );
      if (imageRef.current) observer.observe(imageRef.current);
      return () => observer.disconnect();
    }, []);
  return (
    <>
      <div className="text-4xl mt-40 px-10 text-transparent flex flex-col items-center justify-center w-full">
              <div className="relative mt-[-2rem] mb-[2rem] inline-flex items-center px-6 py-2 bg-gradient-to-tr from-zinc-600/40 via-transparent to-transparent rounded-full border border-zinc-800/30 shadow-md backdrop-blur-lg cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:border-zinc-800/50 text-sm">
                <div className="flex items-center space-x-2 animate-fade-in">
                  <Twitter className="h-4 w-4 text-foreground" strokeWidth={2} />
                  <span className="text-zinc-200/40 select-none">
              Introducing Arch v1...
                  </span>
                  <ChevronRightIcon className="h-2.5 w-2.5 text-foreground" />
                </div>
              </div>
              <div className="flex flex-col justify-center items-center"></div>
              <h1 className="z-10 text-6xl text-transparent duration-1000 bg-gradient-to-tr from-zinc-400/70 via-foreground/80 to-foreground/10 cursor-default font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
                Build.
              </h1>
              <h1 className="bg-clip-text text-edge-outline font-display sm:text-6xl md:text-9xl whitespace-nowrap">
                Ship.
              </h1>
              <h1 className="text-edge-outline dark:text-edge-outline-dark font-display sm:text-6xl md:text-9xl whitespace-normal bg-gradient-to-t from-zinc-700/20 via-zinc-500/20 to-zinc-100 bg-clip-text text-transparent">
                Scale.
              </h1>
              <h2 className="text-zinc-300/70 mt-7 w-[37rem] text-sm">
                The world's first multi-ecosystem, multi-chain developer tool. Build, deploy, scale and connect, all in one platform
              </h2>
            </div>
            <div className="w-full flex items-center justify-center">
              {/* {session ? (
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
              )} */}
            </div>
            <div ref={imageRef} className={` px-10 w-screen ${inView ? "flex items-center justify-center" : ""}`}>
              <Image
                src={require("@/assets/images/ui/dash-ui-transparent-bg.png")}
                alt="Dash-ui"
                className="w-4/5 transition-all rounded-xl duration-500 hover:scale-105"
                style={{
                  transform: inView ? "none" : "perspective(1000px) rotateX(30deg) rotateY(720deg)",
                  opacity: 0.5,
                }}
              />
            </div></>
  )
}
