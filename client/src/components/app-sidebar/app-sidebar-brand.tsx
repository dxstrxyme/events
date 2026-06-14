import { Link } from "react-router-dom";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

import { CalendarIcon } from "lucide-react";



export function AppSidebarBrand() {



    return (

        <SidebarMenu className="gap-2 px-1">

            <SidebarMenuItem>

                <SidebarMenuButton size="lg" asChild>

                    <Link to='/events' className="flex items-center gap-2 w-full">

                        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">

                            <CalendarIcon className="size-4" />

                        </span>

                        <span className="font-heading font-semibold">

                            EventsHub

                        </span>

                    </Link>

                </SidebarMenuButton>

            </SidebarMenuItem>

        </SidebarMenu>

    )

} 