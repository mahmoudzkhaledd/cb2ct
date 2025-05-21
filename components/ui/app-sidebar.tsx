"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarItems } from "@/constants/sidebarItems";

import { cn } from "@/lib/utils";
import { useSession } from "../providers/SessionProvider";
import { ShieldCheck } from "lucide-react";

import { NavMain } from "./nav-main";
import Logo from "../general/Logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className={cn("bg-muted border-r", props.className)}
    >
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2 pt-0">
        <NavMain items={sidebarItems.navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
