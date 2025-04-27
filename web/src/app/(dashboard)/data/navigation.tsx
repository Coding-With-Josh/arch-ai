import { Home, Users, Settings, LineChart, Package, ShoppingCart, Boxes, FolderOpen, Sparkles, Trees, CircleHelp, FilesIcon } from "lucide-react"


export type NavItem = {
    name: string;
    icon: React.ComponentType<any>;
    href: string;
};


export const navItems: NavItem[] = [
    {
        name: "Dashboard",
        icon: Home,
        href: "/dashboard"
    },
    {
        name: "Workspaces",
        icon: Boxes,
        href: "/dashboard/workspaces"
    },
    {
        name: "Billing",
        icon: ShoppingCart,
        href: "/dashboard/billing"
    },
    {
        name: "Settings",
        icon: Settings,
        href: "/settings"
    },
    {
        name: "Documentation",
        icon: FilesIcon,
        href: "/docs"
    },
    {
        name: "Help",
        icon: CircleHelp,
        href: "/dashboard/help"
    },
]
export const workspaceNavItems: NavItem[] = [
    {
        name: "Dashboard",
        icon: Home,
        href: "/dashboard/workspace/[workspaceSlug]"
    },
    {
        name: "Projects",
        icon: FolderOpen,
        href: "/dashboard/workspace/[workspaceSlug]/projects"
    },
    {
        name: "Teams",
        icon: Users,
        href: "/dashboard/workspace/[workspaceSlug]/teams"
    },
    {
        name: "Activity",
        icon:  LineChart,
        href: "/dashboard/workspace/[workspaceSlug]/activity"
    },
    {
        name: "Settings",
        icon: Settings,
        href: "/dashboard/workspace/[workspaceSlug]/settings"
    },
]

export const projectNavItems: NavItem[] = [
    {
        name: "Overview",
        icon: Home,
        href: "/dashboard/workspace/[workspaceSlug]/project/[projectSlug]",
    },
    {
        name: "Studios",
        icon: Boxes,
        href: "/dashboard/workspace/[workspaceSlug]/project/[projectSlug]/studios",
    },
    {
        name: "Editors",
        icon: Package,
        href: "/dashboard/workspace/[workspaceSlug]/project/[projectSlug]/editors",
    },
    {
        name: "Integrations",
        icon: ShoppingCart,
        href: "/dashboard/workspace/[workspaceSlug]/project/[projectSlug]/integrations",
    },
    {
        name: "Analytics",
        icon: LineChart,
        href: "/dashboard/workspace/[workspaceSlug]/project/[projectSlug]/activity",
    },
    {
        name: "APIs",
        icon: Trees,
        href: "/dashboard/workspace/[workspaceSlug]/project/[projectSlug]/apis",
    },
    {
        name: "Settings",
        icon: Settings,
        href: "/dashboard/workspace/[workspaceSlug]/project/[projectSlug]/settings",
    },
];