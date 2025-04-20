import { 
  ArrowUpRight, 
  BarChart3, 
  Clock, 
  Gauge, 
  Lock, 
  Shield, 
  Zap,
  Plus,
  Terminal,
  LineChart,
  Plug2,
  Earth,
  CircleGauge,
  Rabbit,
  ChevronsDownUp,
  Database
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import analyticsLargeDark from "@/assets/images/ui/analytics-large-dark.png"

export default function FeaturesGrid() {
  return (
    <div className="relative my-32 mx-auto rounded-none md:w-full xl:w-4/5 2xl:w-3/5 max-w-[1300px] font-geist md:border-[1.2px]">
      <Plus className="absolute w-8 h-8 top-[-17px] left-[-17px] text-black/20 dark:text-white/30" />
      <div className="grid grid-cols-1 w-full md:grid-cols-3 grid-rows-10 md:grid-rows-9">
        <div className="flex relative flex-col justify-start items-start p-10 transform-gpu border-l-[1.2px] overflow-clip">
          <Plus className="absolute w-8 h-8 bottom-[-17px] left-[-17px] text-black/20 dark:text-white/30" />
          <div className="flex gap-2 items-center my-1">
              <Earth className="w-4 h-4" />
              <p className="text-gray-600 dark:text-gray-400">Unified DevOps</p>
            </div>
            <div className="mt-2">
              <div className="max-w-full">
                <p className="max-w-lg text-2xl font-normal tracking-tighter">
                  Accelerate web development across ecosystems.
                </p>
              </div>
              <p className="mt-2 text-sm text-left text-muted-foreground">
                Arch streamlines traditional web development and blockchain smart contracts in one platform. Web2 and Web3 are now one.
                {' '}
                <a className="text-gray-50" href="#" target="_blank" rel="noopener noreferrer">Learn more</a>
              </p>
            </div>
        </div>
        
        <div className="flex relative flex-col justify-start items-start p-10 transform-gpu border-l-[1.2px]">
          <Plus className="absolute w-8 h-8 bottom-[-17px] left-[-17px] text-black/20 dark:text-white/30" />
          <div className="flex gap-2 items-center my-1">
              <Terminal className="w-4 h-4" />
              <p className="text-gray-600 dark:text-gray-400">AI-Powered Studio</p>
            </div>
            <div className="mt-2">
              <div className="max-w-full">
                <p className="max-w-lg text-2xl font-normal tracking-tighter">
                 AI meets blockchain: code smarter, not harder.
                </p>
              </div>
              <p className="mt-2 text-sm text-left text-muted-foreground">
                 Write, audit and deploy smart contracts with real-time AI suggestions.
                {' '}
                <a className="text-gray-50" href="#" target="_blank" rel="noopener noreferrer">Learn more</a>
              </p>
            </div>
        </div>
        
        <div className="flex relative flex-col justify-start items-start p-10 md:border-l-[0.2px]">
          <Plus className="absolute w-8 h-8 bottom-[-17px] left-[-17px] text-black/20 dark:text-white/30" />
         
 <div className="flex gap-2 items-center my-1">
              <Database className="w-4 h-4" />
              <p className="text-gray-600 dark:text-gray-400">Blockchain Database</p>
            </div>
            <div className="mt-2">
              <div className="max-w-full">
              <p className="max-w-lg text-2xl font-normal tracking-tighter">
               Database Versatility: On-Chain ∼ Off-Chain
              </p>
              </div>
              <p className="mt-2 text-sm text-left text-muted-foreground">
              Developers can sync on-chain data with off-chain logic, query indexed data, and react to smart contract events in real-time.
              {' '}
              <a className="text-gray-50" href="#" target="_blank" rel="noopener noreferrer">Learn more</a>
              </p>
            </div>

        </div>
        
        <div className="flex flex-col justify-start items-start p-10 border-l-[1.2px] border-t-[1.2px]">
        <div className="flex gap-2 items-center my-1">
              <Zap className="w-4 h-4" />
              <p className="text-gray-600 dark:text-gray-400">dApp Deployment</p>
            </div>
            <div className="mt-2">
              <div className="max-w-full">
                <p className="max-w-lg text-2xl font-normal tracking-tighter">
                  Deploy decentralized applications with a single click.
                </p>
              </div>
              <p className="mt-2 text-sm text-left text-muted-foreground">
                Arch manages infrastructure, hosting, and smart contract deployment automatically.
                {' '}
                <a className="text-gray-50" href="#" target="_blank" rel="noopener noreferrer">Learn more</a>
              </p>
            </div>
        </div>
        
        <div className="flex flex-col items-start p-10 justify-staart border-l-[1.2px] border-t-[1.2px]">
        <div className="flex gap-2 items-center my-1">
              <Rabbit className="w-4 h-4" />
              <p className="text-gray-600 dark:text-gray-400">API Gateway</p>
            </div>
            <div className="mt-2">
              <div className="max-w-full">
                <p className="max-w-lg text-2xl font-normal tracking-tighter">
                  Seamlessly connect Web2 & Web3 with robust APIs.
                </p>
              </div>
              <p className="mt-2 text-sm text-left text-muted-foreground">
                Expose smart contracts and data models via REST, GraphQL, and RPC.
                {' '}
                <a className="text-gray-50" href="#" target="_blank" rel="noopener noreferrer">Learn more</a>
              </p>
            </div>
        </div>
        
        <div className="flex relative flex-col justify-start items-start p-10 transform-gpu border-l-[1.2px] border-t-[1.2px]">
          <Plus className="absolute w-8 h-8 bottom-[-15px] right-[-15px] text-black/20 dark:text-white/40" />
          <div className="flex gap-2 items-center my-1">
              <Gauge className="w-4 h-4" />
              <p className="text-gray-600 dark:text-gray-400">No-Code Editor</p>
            </div>
            <div className="max-w-full">
              <p className="max-w-lg text-2xl font-normal tracking-tighter">
                Create decentralized apps without writing code.
              </p>
            </div>
            <div className="mt-2">
              <p className="mt-2 text-sm text-left text-muted-foreground">
                Utilize a no-code developement interface with customizable templates for instant deployment.
                {' '}
                <a className="text-gray-50" href="#" target="_blank" rel="noopener noreferrer">Learn more</a>
              </p>
            </div>
        </div>
        
        <div className="overflow-visible relative grid-cols-2 row-span-1 h-full md:grid md:col-span-3 dark:border-b-0 border-t-[1.2px] md:border-b-[1.2px]">
          <div className="top-0 left-0 p-16 pt-10 w-full h-full md:absolute md:px-10">
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex gap-2 items-center">
              <Earth className="w-4 h-4" />
                  <p className="text-gray-600 dark:text-gray-400">Multi-Chain</p>
                </div>
                <p className="mx-auto mt-4 max-w-lg text-4xl font-normal tracking-tighter text-center line-clamp-2 md:text-4xl">
                  Solana, Ethereum, and Sui <br /> <strong>Deploy anywhere seamlessly</strong>
                </p>
                <Link href="/auth" className="z-50">
                  <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 p-5 mt-6 ml-auto rounded-lg">
                    Get Started!
                  </button>
              </Link>
              <div className="absolute opacity-65 w-full inset-0 flex items-center justify-center bg-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute animate-ripple rounded-full bg-foreground/25 shadow-xl border"
                    style={{
                      width: `${180 + i * 70}px`,
                      height: `${180 + i * 70}px`,
                      opacity: `${0.2 - i * 0.02}`,
                      animationDelay: `${i * 0.06}s`,
                      borderStyle: i === 9 ? 'dashed' : 'solid',
                      borderWidth: '1px',
                      borderColor: `hsl(var(--foreground), ${0.05 + i * 0.05})`,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) scale(1)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <Plus className="absolute w-8 h-8 bottom-[-15px] left-[-15px] text-black/20 dark:text-white/40" />
          <Plus className="absolute w-8 h-8 bottom-[-15px] right-[-15px] text-black/20 dark:text-white/40" />
          <Plus className="absolute w-8 h-8 top-[-15px] left-[-15px] text-black/20 dark:text-white/40" />
        </div>
        
        <div className="relative md:grid md:col-span-3 grid-cols-2 row-span-2 border-b-0 border-t-0 w-full h-full dark:[border:0.01px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_rgb(255_255_255_/_0.05)_inset]">
          <div className="flex top-0 left-0 flex-col p-16 pt-7 w-full h-full md:absolute md:px-10">
            <div className="h-10">
              <div className="flex flex-col gap-2 justify-center items-start w-full">
              <div className="flex gap-2 items-center my-1">
                    <CircleGauge className="w-4 h-4" />
                    <p className="text-gray-600 dark:text-gray-400">On-Chain Git</p>
                  </div>
                  <div className="max-w-full">
                    <p className="max-w-lg text-2xl font-normal tracking-tighter">
                      Track every change with decentralized version control for instant rollbacks.
                    </p>
                  </div>
                <div className="mt-2 w-full">
                  <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="flex-col p-6 flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                      <div className="grid flex-1 gap-1 text-center sm:text-left">
                      <h3 className="font-semibold leading-none tracking-tight">On-Chain Versioning</h3>
                      <p className="text-sm text-muted-foreground">Secure, decentralized change history</p>
                      </div>
                      <button type="button" role="combobox" aria-controls="radix-:Rjoijtaja:" aria-expanded="false" aria-autocomplete="none" dir="ltr" data-state="closed" className="flex h-9 items-center justify-between border border-input bg-transparent px-3 py-2 text-left text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>span]:text-left w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
                        <span style={{pointerEvents: 'none'}}>Last 3 months</span>
                        <ChevronsDownUp className="h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </div>
                    <div className="p-6 px-2 pt-4 sm:px-6 sm:pt-6">
                      <div data-chart="chart-R5oijtaja" className="flex justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none aspect-auto h-[180px] w-full">
                        <style jsx>{`
                          [data-chart=chart-R5oijtaja] {
                            --color-desktop: hsl(var(--chart-1));
                            --color-mobile: hsl(var(--chart-2));
                          }
                          .dark [data-chart=chart-R5oijtaja] {
                            --color-desktop: hsl(var(--chart-1));
                            --color-mobile: hsl(var(--chart-2));
                          }
                        `}</style>
                        <div className="recharts-responsive-container" style={{width: '100%', height: '100%', minWidth: 0}}>
                          <div className="recharts-wrapper" style={{position: 'relative', cursor: 'default', width: '890px', height: '180px'}}>
                            <svg className="recharts-surface" width="890" height="180" viewBox="0 0 890 180" style={{width: '100%', height: '100%'}}>
                              <defs>
                                <clipPath id="recharts1-clip">
                                  <rect x="5" y="5" height="112" width="880"></rect>
                                </clipPath>
                                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity="0.8"></stop>
                                  <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity="0.1"></stop>
                                </linearGradient>
                                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity="0.8"></stop>
                                  <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity="0.1"></stop>
                                </linearGradient>
                              </defs>
                              <g className="recharts-cartesian-grid">
                                <g className="recharts-cartesian-grid-horizontal">
                                  <line stroke="#ccc" fill="none" x="5" y="5" width="880" height="112" x1="5" y1="117" x2="885" y2="117"></line>
                                  <line stroke="#ccc" fill="none" x="5" y="5" width="880" height="112" x1="5" y1="61" x2="885" y2="61"></line>
                                  <line stroke="#ccc" fill="none" x="5" y="5" width="880" height="112" x1="5" y1="5" x2="885" y2="5"></line>
                                </g>
                              </g>
                            </svg>
                            <div className="recharts-legend-wrapper" style={{position: 'absolute', width: '880px', height: 'auto', left: '5px', bottom: '5px'}}>
                              <div className="flex items-center justify-center gap-4 pt-3">
                                <div className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground">
                                  <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{backgroundColor: 'var(--color-mobile)'}}></div>Mobile
                                </div>
                                <div className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground">
                                  <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{backgroundColor: 'var(--color-desktop)'}}></div>Desktop
                                </div>
                              </div>
                            </div>
                            <div tabIndex="-1" className="recharts-tooltip-wrapper" style={{visibility: 'hidden', pointerEvents: 'none', position: 'absolute', top: '0px', left: '0px'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative grid-cols-2 row-span-1 md:grid md:col-span-3 dark:border-t-0 border-t-[1.2px] overflow-clip">
          <div className="flex top-0 left-0 flex-col p-16 pt-6 h-full md:absolute md:px-10">
            <div className="">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                <Terminal className="w-4 h-4" />
                <p className="text-gray-600 dark:text-gray-400">RBAC</p>
                </div>
                <p className="max-w-md text-2xl font-normal tracking-tighter">
                  Grow with us and move forward with 10x. <strong>Accelerate as speed of light</strong>
                </p>
                <div className="flex flex-col gap-3 md:flex-col">
                  <p className="mt-1 text-md text-muted-foreground">
                  Assign roles and secure your projects with built-in role-based access control.
                                      <a className="text-gray-50" href="https://docs.arc-browser.app/themes-store/themes-marketplace">Learn more</a>
                  </p>
                  <div className="flex mt-[-10px]">
                    <div className="flex gap-7 flex-wrap mt-3 items-center max-w-4xl">
                      {/* Language icons would go here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Plus className="absolute w-8 h-8 top-[-15px] left-[-15px] text-black/20 dark:text-white/40" />
          <Plus className="absolute w-8 h-8 bottom-[-15px] left-[-15px] text-black/20 dark:text-white/40" />
          <Plus className="absolute w-8 h-8 top-[-15px] right-[-15px] text-black/20 dark:text-white/40" />
          <Plus className="absolute w-8 h-8 bottom-[-15px] right-[-15px] text-black/20 dark:text-white/40" />
        </div>
        
        <div className="hidden relative flex-col row-span-2 p-16 px-10 pt-10 md:block md:border-t-2 scrollarea">
          <div className="py-32 mx-auto">
            <div className="flex gap-2 items-center my-2">
              <Plug2 className="w-4 h-4" />
              <p className="text-gray-600 dark:text-gray-400">Integrate</p>
            </div>
            <h2 className="text-3xl font-normal tracking-tighter">Integrate with a <strong>seconds. </strong></h2>
            <p className="mt-2 text-md text-muted-foreground">
              We are always looking for ways to make your experience better. Always looking for feedback and suggestions!
            </p>
          </div>
        </div>
        
        <div className="relative md:grid border-t-2 border-l-[1.2px] dark:[border:0.01px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_rgb(255_255_255_/_0.05)_inset] md:col-span-2 md:grid-cols-2 row-span-2 overflow-clip">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute animate-lightray -left-10 top-0 z-[-1] h-[1000px] max-h-[100vw] origin-top-right rotate-45 bg-gradient-to-b from-primary blur-xl"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                animation: `${i * 2 + 4}s linear 0s infinite normal none running lightray`
              }}
            />
          ))}
          <div className="flex top-0 left-0 flex-col p-16 pt-8 h-full md:absolute md:px-10">
            <div className="">
              <div className="flex flex-col gap-4">
              <div className="flex gap-2 items-center">
                  <LineChart className="w-4 h-4" />
                  <p className="text-gray-600 dark:text-gray-400">Analytics</p>
                </div>
                <p className="max-w-md text-2xl font-normal tracking-tighter">
                  Get insights into smart contract performance, transactions, and user behavior.
                </p>
                <Image
                  src={analyticsLargeDark}
                  alt="Developer analytics dashboard"
                  width={500}
                  height={230}
                  className="object-cover md:object-center h-[230px]"
                />
                <p className="mt-2 text-md text-muted-foreground">
                  A comprehensive dashboard to monitor your decentralized apps.
                  {' '}
                  <a className="text-gray-50" href="#" target="_blank" rel="noopener noreferrer">Learn more</a>
                </p>
              </div>
              <Link href="/auth">
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 p-5 mt-4 ml-auto rounded-lg">
                  Launch Arch now!
                </button>
              </Link>


            </div>
          </div>
          <Plus className="absolute w-8 h-8 bottom-[-15px] left-[-15px] text-black/20 dark:text-white/40" />
        </div>
        
        <div className="relative grid-cols-2 row-span-1 h-full md:grid md:col-span-3 overflow-clip border-t-[0.01px] border-b-[0.09px]">
          <div className="flex top-0 left-0 flex-col p-16 pt-10 h-full md:absolute md:px-10">
            <div className="">
              <div className="flex flex-row gap-4 justify-between">
                <div className="border-none">
                <div className="flex gap-2 items-center">
                    <Terminal className="w-4 h-4" />
                    <p className="text-gray-600 dark:text-gray-400">Who is it for?</p>
                  </div>
                  <p className="mt-4 max-w-md text-2xl font-normal tracking-tighter">
                    Ideal for Web3 Developers, Web2 Teams, Startups, DAOs, No-Code Builders, and Enterprises.
                  </p>
                  <Link href="/docs">
                    <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 p-5 mt-4 ml-auto rounded-lg">
                      Learn More
                    </button>
                  </Link>
                </div>
                <div className="flex flex-col gap-3 md:flex-col mt-[-100px]">
                  {/* Orbiting icons would go here */}
                </div>
              </div>
            </div>
          </div>
          <Plus className="absolute w-8 h-8 top-[-15px] left-[-15px] text-black/20 dark:text-white/40" />
          <Plus className="absolute w-8 h-8 bottom-[-15px] left-[-15px] text-black/20 dark:text-white/40" />
          <Plus className="absolute w-8 h-8 top-[-15px] right-[-15px] text-black/20 dark:text-white/40" />
          <Plus className="absolute w-8 h-8 bottom-[-15px] right-[-15px] text-black/20 dark:text-white/40" />
        </div>
      </div>
    </div>
  )
}