"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  label: string;
  href: string;
  id: string; // Added for unique key
};

export default function AnimatedTabs() {
  const pathname = usePathname();
  const tabs: Tab[] = [
    { label: "Project", href: "/project", id: "project" },
    { label: "Deployments", href: "/deployments", id: "deployments" },
    { label: "Speed Insights", href: "/speed-insights", id: "speed-insights" },
    { label: "Logs", href: "/logs", id: "logs" },
  ];

  const [tabElements, setTabElements] = useState<(HTMLButtonElement | null)[]>([]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const hoveredTab = hoveredIdx !== null ? tabElements[hoveredIdx]?.getBoundingClientRect() : null;

  const setRef = (index: number) => (el: HTMLButtonElement | null) => {
    setTabElements(prev => {
      const newRefs = [...prev];
      newRefs[index] = el;
      return newRefs;
    });
  };

  return (
    <nav
      onMouseLeave={() => setHoveredIdx(null)}
      className="flex items-center relative p-2 bg-white border-b border-gray-200"
    >
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.href;
        
        return (
          <Link
            key={tab.id} // Using unique id instead of href
            href={tab.href}
            passHref
            legacyBehavior
          >
            <button
              ref={setRef(index)}
              className={`px-4 py-2 z-10 font-medium text-sm relative transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
              onPointerEnter={() => setHoveredIdx(index)}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </Link>
        );
      })}

      <AnimatePresence>
        {hoveredTab && hoveredIdx !== null && pathname !== tabs[hoveredIdx].href && (
          <motion.div
            className="absolute top-0 left-0 bg-gray-100 rounded-md -z-10"
            initial={{
              top: hoveredTab.top,
              left: hoveredTab.left,
              width: hoveredTab.width,
              height: hoveredTab.height,
              opacity: 0,
            }}
            animate={{
              top: hoveredTab.top,
              left: hoveredTab.left,
              width: hoveredTab.width,
              height: hoveredTab.height,
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.15,
              ease: "easeOut",
            }}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}