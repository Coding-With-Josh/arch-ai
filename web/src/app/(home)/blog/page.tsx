import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import noCode from '@/assets/images/ui/no-code.png'

type Post = {
  id: number
  date: string
  slug: string
  title: string
  description: string
  authorName: string
  authorRole: string
  authorAvatar: string
  image: any
}

const mockPosts: Post[] = [
  {
    id: 1,
    date: '2022-09-02',
    slug: 'blogs/building-using-docy',
    title: 'Introducing Arch: The Ultimate Tool for Developers',
    description:
      'Arch is a powerful tool designed to simplify the development process for developers. With its user-friendly interface and robust features, Arch streamlines the workflow and enhances productivity.',
    authorName: 'Adam Smith',
    authorRole: 'Dev Rel',
    authorAvatar:
      'https://assets.basehub.com/fa068a12/uXVXN7g1Fc2EjO8OWn0HG/09.png?width=64&quality=90&format=auto',
    image: noCode,
  },
  {
    id: 2,
    date: '2022-10-15',
    slug: 'blogs/nextjs-tips',
    title: 'Next.js Tips for Professional Developers',
    description:
      'Learn best practices and effective strategies to build scalable applications using Next.js. Elevate your development skills with our expert insights.',
    authorName: 'Jane Doe',
    authorRole: 'Frontend Dev',
    authorAvatar:
      'https://assets.basehub.com/fa068a12/uXVXN7g1Fc2EjO8OWn0HG/09.png?width=64&quality=90&format=auto',
    image: noCode,
  },
]

export default function BlogPage() {
  return (
    <div className="relative">
      <div className="hidden sm:flex pointer-events-none absolute right-10 z-20 top-0 invert dark:invert-0 dark:opacity-50 brightness-50 dark:brightness-100"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative py-24 sm:py-12">
          <div className="mx-auto max-w-full px-6 lg:px-8">
            <div
              className="absolute left-0 top-44 h-56 w-[90%] opacity-55 overflow-x-hidden bg-zinc-400 bg-opacity-40 blur-[337.4px]"
              style={{ transform: 'rotate(-30deg)' }}
            ></div>
            <div className=" mt-10mr-auto max-w-2xl lg:max-w-5xl">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                Blog
              </h2>
              <p className="mt-2 text-neutral-600 max-w-lg mr-auto">
                Stay updated with the latest news, insights, and updates from Arch. Explore our blog for in-depth articles and expert tips.
              </p>
              <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
                {mockPosts.map((post) => (
                  <article key={post.id} className="relative isolate flex flex-col gap-8 lg:flex-row">
                    <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-80 lg:shrink-0">
                      <Image
                        alt={post.title}
                        src={post.image}
                        fill
                        objectFit="cover"
                        className="rounded-2xl bg-zinc-950"
                      />
                      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/10"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime={post.date} className="text-zinc-500 flex items-center gap-x-2">
                          <Calendar className="h-4 w-4 text-zinc-500" /> {post.date}
                        </time>
                        <Link
                          href={`/${post.slug}`}
                          className="relative z-10 rounded-full bg-zinc-50 dark:bg-black/20 dark:bg-page-gradient px-3 py-1.5 transition-all duration-300 font-medium text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:text-white/90"
                        >
                          {post.title}
                        </Link>
                      </div>
                      <div className="group relative max-w-xl">
                        <h3 className="mt-3 text-lg md:text-2xl lg:text-3xl font-semibold leading-6 text-zinc-900 dark:text-zinc-200 group-hover:text-zinc-400 transition-all duration-300">
                          <Link href={`/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="mt-5 text-sm leading-6 text-gray-600 dark:text-gray-400">
                          {post.description}
                        </p>
                      </div>
                      <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                        <div className="relative flex items-center gap-x-4">
                          <Image
                            alt={post.authorName}
                            src={post.authorAvatar}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full bg-gray-50"
                          />
                          <div className="text-sm leading-6">
                            <p className="font-semibold text-gray-900 dark:text-gray-300">
                              <Link href={`/${post.authorName.replace(/\s+/g, '')}`}>
                                {post.authorName}
                              </Link>
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">{post.authorRole}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
