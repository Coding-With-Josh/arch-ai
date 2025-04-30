import { usePathname } from "next/navigation";

export type Tab = { label: string; id: string; href: string };

export function useTabs({
  tabs,
}: {
  tabs: Tab[];
}) {
  const pathname = usePathname();

  return {
    tabProps: {
      tabs,
    },
    selectedTab: tabs.find(
      (tab) => pathname === tab.href
    ),
  };
}