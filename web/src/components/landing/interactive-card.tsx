import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const InteractiveCard = ({ children, className }: { children: React.ReactNode, className: any }) => {
  const [style, setStyle] = useState({})

  function onMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // Compute a simple transformation based on mouse position
    const { offsetX, offsetY } = e.nativeEvent
    setStyle({
      transform: `translate(${offsetX / 15}px, ${offsetY / 15}px)`
    })
  }

  return (
    <div
      onMouseMove={onMouseMove}
      className={cn("overflow-hidden relative duration-700 border rounded-2xl hover:bg-zinc-600/10 group md:gap-8 hover:border-zinc-400/50 border-zinc-600", className)}
    >
      <div className="pointer-events-none">
        <div className="absolute inset-0 z-0 transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-br opacity-100 via-zinc-100/10 transition duration-1000 group-hover:opacity-50"
          style={style}
        />
        <motion.div
          className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
          style={style}
        />
      </div>
      {children}
    </div>
  )
}