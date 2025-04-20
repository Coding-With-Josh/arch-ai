import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import noCode from "@/assets/images/ui/no-code.avif"

        export const Blog = () => {
            return (
                <div className="relative">
                    {/* Replace heavy inline SVG with a corresponding icon */}
                    <div className="hidden sm:flex pointer-events-none absolute right-10 z-20 top-0 invert dark:invert-0 dark:opacity-50 brightness-50 dark:brightness-100">
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative py-24 sm:py-12">
                            <div className="mx-auto max-w-full px-6 lg:px-8">
                                <div
                                    className="absolute left-0 top-44 h-56 w-[90%] opacity-55 overflow-x-hidden bg-zinc-400 bg-opacity-40 blur-[337.4px]"
                                    style={{ transform: "rotate(-30deg)" }}
                                ></div>
                                <div className="mr-auto max-w-2xl lg:max-w-5xl">
                                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                                        From the blog
                                    </h2>
                                    <p className="mt-2 text-lg leading-8 text-zinc-600 max-w-lg mr-auto">
                                        Stay updated with the latest news and updates from Arch. Explore our blog for insights, updates, and more.
                                    </p>
                                    <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
                                        <article className="relative isolate flex flex-col gap-8 lg:flex-row">
                                            <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-80 lg:shrink-0">
                                                <Image
                                                    alt=""
                                                    src={noCode}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-2xl bg-zinc-950"
                                                />
                                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/10"></div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-x-4 text-xs">
                                                    <time dateTime="2022-09-02" className="text-zinc-500 flex items-center justify-center gap-x-2">
                                                       <Calendar className='h-4 w-4 text-zinc-500'/> 2022-09-02
                                                    </time>
                                                    <Link
                                                        href="blogs/building-using-docy"
                                                        className="relative z-10 rounded-full bg-zinc-50 dark:bg-black/20 dark:bg-page-gradient px-3 py-1.5 transition-all duration-300 font-medium text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:text-white/90"
                                                    >
                                                        Introducing Arch: Multi-Chain Developer Tool
                                                    </Link>
                                                </div>
                                                <div className="group relative max-w-xl">
                                                    <h3 className="mt-3 text-lg md:text-2xl lg:text-3xl font-semibold leading-6 text-zinc-900 dark:text-zinc-200 group-hover:text-zinc-400 transition-all duration-300"> 
                                                        <Link href="blogs/building-using-docy">
                                                            Introducing Arch: The Ultimate Tool for Developers
                                                        </Link>
                                                    </h3>
                                                    <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                                        Arch is a powerful tool designed to simplify the development process for developers. With its user-friendly interface and robust features, Arch streamlines the workflow and enhances productivity.
                                                    </p>
                                                </div>
                                                <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                                                    <div className="relative flex items-center gap-x-4">
                                                        <Image
                                                            alt="Adam Smith"
                                                            src="https://assets.basehub.com/fa068a12/uXVXN7g1Fc2EjO8OWn0HG/09.png?width=64&amp;quality=90&amp;format=auto"
                                                            width={40}
                                                            height={40}
                                                            className="h-10 w-10 rounded-full bg-gray-50"
                                                        />
                                                        <div className="text-sm leading-6">
                                                            <p className="font-semibold text-gray-900 dark:text-gray-300">
                                                                <Link href="AdamT">
                                                                    Adam Smith
                                                                </Link>
                                                            </p>
                                                            <p className="text-gray-600 dark:text-gray-400">Dev Rel</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }