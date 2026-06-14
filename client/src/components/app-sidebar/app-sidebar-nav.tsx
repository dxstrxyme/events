import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { PlusIcon, SquaresExclude } from "lucide-react";

export function AppSidebarNav() {
    const pathname = useLocation().pathname;
    const isCreate = pathname === '/events/new'
    const isMy = pathname.startsWith('/events/my')
    const isAll = pathname === '/events' ||
        (pathname.startsWith('/events/')) &&
        pathname !== '/events/new' &&
        !pathname.startsWith('/events/my')

    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    return (
        <SidebarMenu className="gap-3 px-1">
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={isCreate}
                    tooltip='Create event'
                    className={`bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary/90
                        ${isCollapsed
                            ? "h-8 w-8 p-0 justify-center rounded-md"
                            : "min-h-12 py-3 px-3"
                        }
                    `}
                >
                    <Link to='/events/new'>
                        <PlusIcon className="size-4 shrink-0" />
                        <span className={isCollapsed ? "hidden" : "block"}>Create event</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={isAll}
                    tooltip='All events'
                >
                    <Link to='/events'>
                        <SquaresExclude className="size-4 shrink-0" />
                        <span>All events</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={isMy}
                    tooltip='My events'
                >
                    <Link to='/events/my'>
                        <SquaresExclude className="size-4 shrink-0" />
                        <span>My events</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}