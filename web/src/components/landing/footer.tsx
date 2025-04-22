import { Button } from '@/components/ui/button';
import Image from 'next/image';

export const Footer = () => {
  return (
    <footer className="overflow-x-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 py-8 sm:grid-cols-12 md:py-12">
          <div className="space-y-2 sm:col-span-12 lg:col-span-4">
            {/* <div className="flex items-center">
              <Image
                src={require('@/assets/images/brand/arch_logo-transparent-bg.png')}
                alt="A"
                className="h-10 w-auto"
                width={100}
                height={100}
              /><span className="text-2xl ">rch</span>
            </div> */}
            <div className="text-sm ml-2 text-black/60 dark:text-gray-400">
              © Arch - All rights reserved.
            </div>
          </div>
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Integrations
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Pricing &amp; Plans
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Our method
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Diversity &amp; Inclusion
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Financial statements
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Terms of service
                </a>
              </li>
              <li>
                <a
                  className="text-black/40 dark:text-gray-400 transition hover:text-gray-900"
                  href="#0"
                >
                  Report a vulnerability
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Social</h3>
            <ul className="flex gap-1">
              <li>
                <a
                  className="flex items-center justify-center text-zinc-500 transition hover:text-zinc-600"
                  aria-label="Twitter"
                  href="https://x.com/build_with_arch"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m13.063 9 3.495 4.475L20.601 9h2.454l-5.359 5.931L24 23h-4.938l-3.866-4.893L10.771 23H8.316l5.735-6.342L8 9h5.063Zm-.74 1.347h-1.457l8.875 11.232h1.36l-8.778-11.232Z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  className="flex items-center justify-center text-zinc-500 transition hover:text-zinc-600"
                  aria-label="Medium"
                  href="#0"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23 8H9a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1Zm-1.708 3.791-.858.823a.251.251 0 0 0-.1.241V18.9a.251.251 0 0 0 .1.241l.838.823v.181h-4.215v-.181l.868-.843c.085-.085.085-.11.085-.241v-4.887l-2.41 6.131h-.329l-2.81-6.13V18.1a.567.567 0 0 0 .156.472l1.129 1.37v.181h-3.2v-.181l1.129-1.37a.547.547 0 0 0 .146-.472v-4.749a.416.416 0 0 0-.138-.351l-1-1.209v-.181H13.8l2.4 5.283 2.122-5.283h2.971l-.001.181Z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  className="flex items-center justify-center text-zinc-500 transition hover:text-zinc-600"
                  aria-label="Github"
                  href="https://github.com/Coding-With-Josh/arch-ai"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-start items-start" />
    </footer>
  );
};
