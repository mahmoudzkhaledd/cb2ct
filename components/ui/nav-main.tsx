"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SidebarItem } from "@/constants/sidebarItems";

import { IconChartLine, IconShield } from "@tabler/icons-react";
import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { useParams, usePathname } from "next/navigation";

import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { useSession } from "../providers/SessionProvider";

export function NavMain({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();

  const params = useParams();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarSeparator />
        <SidebarMenu>
          {items.map((item, idx) => {
            const selected = pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton
                  className={cn(
                    "transition-colors hover:bg-foreground hover:text-background",
                    {
                      "bg-foreground text-background": selected,
                    },
                  )}
                  asChild
                  tooltip={item.title}
                >
                  <Link className="flex items-center" href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
