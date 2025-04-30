import classNames from "classnames";
import {
  useEffect,
  useRef,
  useState,
  PointerEvent,
  FocusEvent,
  CSSProperties,
  JSX,  
} from "react";
import { Transition } from "react-transition-group";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  label: string;
  href: string;
  id: string;
};

type Props = {
  tabs: Tab[];
};

const duration = 300;

const transitionStyles = {
  entering: {
    opacity: 1,
    transition: `transform 0ms, opacity 150ms, width 0ms`,
  },
  entered: {
    opacity: 1,
    transition: `transform 150ms 0ms, opacity 150ms 0ms, width 150ms`,
  },
  exiting: {
    opacity: 0,
    transition: `transform 0ms, opacity 150ms, width 0ms`,
  },
  exited: { opacity: 0 },
  unmounted: {},
};

export const TransitionGroupTabs = ({ tabs }: Props): JSX.Element => {
  const pathname = usePathname();
  const [buttonRefs, setButtonRefs] = useState<Array<HTMLButtonElement | null>>(
    []
  );

  useEffect(() => {
    setButtonRefs((prev) => prev.slice(0, tabs.length));
  }, [tabs.length]);

  const navRef = useRef<HTMLDivElement>(null);
  const navRect = navRef.current?.getBoundingClientRect();

  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);

  // Find the index of the currently active tab based on route
  const selectedTabIndex = tabs.findIndex(
    (tab) => pathname === tab.href
  );
  const selectedRect = buttonRefs[selectedTabIndex]?.getBoundingClientRect();

  const onLeaveTabs = () => {
    setHoveredTabIndex(null);
  };

  const onEnterTab = (
    e: PointerEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>,
    i: number
  ) => {
    if (!e.target || !(e.target instanceof HTMLButtonElement)) return;

    setHoveredTabIndex(i);
    setHoveredRect(e.target.getBoundingClientRect());
  };

  const hoverStyles: CSSProperties =
    navRect && hoveredRect
      ? {
          transform: `translate3d(${hoveredRect.left - navRect.left}px,${
            hoveredRect.top - navRect.top
          }px,0px)`,
          width: hoveredRect.width,
          height: hoveredRect.height,
        }
      : {};

  const selectStyles: CSSProperties =
    navRect && selectedRect
      ? {
          width: selectedRect.width * 0.8,
          transform: `translateX(calc(${
            selectedRect.left - navRect.left
          }px + 10%))`,
        }
      : {};

  return (
    <nav
      ref={navRef}
      className="flex flex-shrink-0 justify-center items-center relative z-0 py-2"
      onPointerLeave={onLeaveTabs}
    >
      {tabs.map((item, i) => {
        return (
          <Link key={i} href={item.href}>
            <button
              className={classNames(
                "text-md relative rounded-md flex items-center h-8 px-4 z-20 bg-transparent text-sm text-zinc- 500 cursor-pointer select-none transition-colors",
                {
                  "text-slate-700":
                    hoveredTabIndex === i || selectedTabIndex === i,
                }
              )}
              ref={(el) => {
                buttonRefs[i] = el;
              }}
              onPointerEnter={(e) => onEnterTab(e, i)}
              onFocus={(e) => onEnterTab(e, i)}
            >
              {item.label}
            </button>
          </Link>
        );
      })}

      <Transition in={hoveredTabIndex != null} timeout={duration}>
        {(state) => (
          <div
            className="absolute z-10 top-0 left-0 rounded-md bg-gray-200 transition-[width]"
            style={{
              ...hoverStyles,
              ...transitionStyles[state],
            }}
          />
        )}
      </Transition>
      <Transition in={selectedRect != null} timeout={duration}>
        {(state) => (
          <div
            className={"absolute z-10 bottom-0 left-0 h-0.5 bg-slate-500"}
            style={{
              ...selectStyles,
              ...transitionStyles[state],
            }}
          />
        )}
      </Transition>
    </nav>
  );
};  