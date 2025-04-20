import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

        export const Blog = () => {
            return (
                <div className="relative">
                    {/* Replace heavy inline SVG with a corresponding icon */}
                    <div className="hidden sm:flex pointer-events-none absolute right-10 z-20 top-0 invert dark:invert-0 dark:opacity-50 brightness-50 dark:brightness-100">
                        {/* <FaRegCalendarAlt size={1368} /> */}
                    </div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white relative dark:bg-black py-24 sm:py-12">
                            <div className="mx-auto max-w-full px-6 lg:px-8">
                                <div
                                    className="absolute left-0 top-44 h-56 w-[90%] opacity-55 overflow-x-hidden bg-[#9560EB] bg-opacity-40 blur-[337.4px]"
                                    style={{ transform: "rotate(-30deg)" }}
                                ></div>
                                <div className="mr-auto max-w-2xl lg:max-w-5xl">
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                        From the blog
                                    </h2>
                                    <p className="mt-2 text-lg leading-8 text-gray-600 max-w-lg mr-auto">
                                        Learn how to grow your business with our expert advice. - image taken from{" "}
                                        <a
                                            href="https://resend.com"
                                            target="_blank"
                                            className="text-black dark:text-white underline-offset-1 underline"
                                        >
                                            Resend
                                        </a>
                                    </p>
                                    <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
                                        <article className="relative isolate flex flex-col gap-8 lg:flex-row">
                                            <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-80 lg:shrink-0">
                                                <Image
                                                    alt=""
                                                    src="https://resend.com/_next/image?url=%2Fstatic%2Fposts%2Fwebhooks.jpg&w=640&q=75"
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-2xl bg-gray-50"
                                                />
                                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-x-4 text-xs">
                                                    <time dateTime="2022-09-02" className="text-gray-500">
                                                        2022-09-02
                                                    </time>
                                                    <Link
                                                        href="blogs/building-using-docy"
                                                        className="relative z-10 rounded-full bg-gray-50 dark:bg-black/20 dark:bg-page-gradient px-3 py-1.5 font-medium text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:text-white/90"
                                                    >
                                                        Introducing Docy: Developer first headless CMS
                                                    </Link>
                                                </div>
                                                <div className="group relative max-w-xl">
                                                    <h3 className="mt-3 text-lg md:text-2xl lg:text-3xl font-semibold leading-6 text-gray-900 dark:text-gray-200 group-hover:text-gray-600">
                                                        <Link href="blogs/building-using-docy">
                                                            Introducing Docy: Developer first headless CMS
                                                        </Link>
                                                    </h3>
                                                    <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                                        When you’re building a website for a company as ambitious as Planetaria, you need to make an impression. I wanted people to visit our website and see
                                                        animations that looked more realistic than reality itself.
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