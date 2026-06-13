import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { PlusIcon, SquaresExclude } from "lucide-react";

export function AppSidebarNav() {
    const pathname = useLocation().pathname;
    const isCreate = pathname === '/events/new'
    const isMy = pathname.startsWith('/events/my')
    const isAll = pathname === '/events' ||
        (pathname.startsWith('/events/')) &&
        pathname !== '/events/new' &&
        !pathname.startsWith('/events/my')

    return (
        <SidebarMenu className="gap-3 px-1">
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={isCreate}
                    tooltip='Create event'
                    className="min-h-12 bg-primary py-3 text-primary-foreground"
                >
                    <Link to='/events/new'>
                        <PlusIcon />
                        <span>Create event</span>
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
                        <SquaresExclude />
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
                        <SquaresExclude />
                        <span>My events</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}