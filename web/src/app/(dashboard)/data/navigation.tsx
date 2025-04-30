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
        href: "/"
    },
    {
        name: "Workspaces",
        icon: Boxes,
        href: "/workspaces"
    },
    {
        name: "Billing",
        icon: ShoppingCart,
        href: "/billing"
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
        href: "/help"
    },
];

export const workspaceNavItems: NavItem[] = [
    {
        name: "Overview",
        icon: Home,
        href: "/workspace/overview"
    },
    {
        name: "Projects",
        icon: FolderOpen,
        href: "/workspace/projects"
    },
    {
        name: "Team",
        icon: Users,
        href: "/workspace/team"
    },
    {
        name: "Activity",
        icon: LineChart,
        href: "/workspace/activity"
    },
    {
        name: "Settings",
        icon: Settings,
        href: "/workspace/settings"
    },
];

export const projectNavItems: NavItem[] = [
    {
        name: "Overview",
        icon: Home,
        href: "/project"
    },
    {
        name: "Studios",
        icon: Boxes,
        href: "/project/studios"
    },
    {
        name: "Editors",
        icon: Package,
        href: "/project/editors"
    },
    {
        name: "Integrations",
        icon: ShoppingCart,
        href: "/project/integrations"
    },
    {
        name: "Analytics",
        icon: LineChart,
        href: "/project/analytics"
    },
    {
        name: "APIs",
        icon: Trees,
        href: "/project/apis"
    },
    {
        name: "Settings",
        icon: Settings,
        href: "/project/settings"
    },
];