"use client";

import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/nav";
import Particles from "@/components/landing/particles";
import { ChevronRightIcon, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
export default function Home() {
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
    <div className="">
      <div className="flex flex-col items-center justify-start w-screen h-screen overflow-x-hidden bg-black/30">
        {/* <nav className="my-16 animate-fade-in overflow-hidden">
        <Navbar />
        <ul className="flex items-center justify-center gap-4"></ul>
      </nav> */}
        <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/20 to-zinc-300/0" />
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={100}
        />
        <div className="text-4xl mt-40  px-10  text-transparent flex flex-col items-start justify-start w-full">
        <div className="relative mt-[-2rem] mb-[2rem] inline-flex items-center px-6 py-2 bg-gradient-to-tr from-zinc-600/40 via-transparent to-transparent rounded-full border border-zinc-800/30 shadow-md backdrop-blur-lg cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:border-zinc-800/50 text-sm">
          <div className="flex items-center space-x-2 animate-fade-in">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 fill-current text-zinc-200/40"
              viewBox="0 0 448 512"
            >
              <path d="M400 32H48A48 48 0 000 80v352a48 48 0 0048 48h352a48 48 0 0048-48V80a48 48 0 00-48-48zm-64 352H112V128h224z" />
            </svg> */}
            <Twitter className="h-4 w-4 text-foreground" strokeWidth={2}/>
            <span className="text-zinc-200/40 select-none">
              Introducing Arch v1...
            </span>
            <ChevronRightIcon className="h-2.5 w-2.5 text-foreground" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center"></div>
          <h1 className="z-10 text-6xl text-transparent duration-1000 bg-gradient-to-tr from-zinc-400/70 via-foreground/80 to-foreground/10 cursor-default   font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
          Build.
             
          </h1>
          <h1 className="bg-clip-text text-edge-outline font-display sm:text-6xl md:text-9xl whitespace-nowrap">
            Ship.
          </h1>
          <h1 className="text-edge-outline dark:text-edge-outline-dark font-display sm:text-6xl md:text-9xl whitespace-normal bg-gradient-to-t from-zinc-700/20 via-zinc-500/20 to-zinc-100 bg-clip-text text-transparent">
             Scale.
            </h1>
          <h2 className="text-zinc-300/70 mt-7 w-[37rem] text-sm">The world's first multi-ecosystem, multi-chain developer tool. Build, deploy, scale and connect, all in one platform</h2>
        </div>
        <div className="w-full flex items-start justify-start">
          <Link
            href={"#waitlist"}
            className="font-display2 rounded-2xl text-md mt-5 px-6 py-3 mx-10 border-2 bg-gradient-to-tr from-zinc-600/40 via-transparent to-transparent  text-zinc-200/40 flex justify-center items-center border-zinc-900/20 "
          >
            <Particles
              className="absolute inset-0 -z-10 animate-fade-in"
              quantity={100}
            />
            Join the waitlist
          </Link>
        </div>
      <div ref={imageRef} className={` px-10 w-screen ${inView ? "" : "flex items-center justify-center"}`}>
      <Image
        src={require("@/assets/images/ui/dash-ui-transparent-bg.png")}
        alt="Dash-ui"
        className="w-4/5 transition-transform duration-500 hover:scale-105"
        style={{
          transform: inView ? "none" : "perspective(1000px) rotateX(20deg) rotateY(0deg)",
          opacity: 0.5,
        }}
      />
      </div>
     
        {/* <CTA />
      <Features />
      <Pricing />
      <SocialMedia /> */}
      </div>
    </div>
  );
}
