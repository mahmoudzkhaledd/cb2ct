"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import Logo from "../general/Logo";

export function SiteHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 lg:gap-2 lg:px-6">
      <Logo />
      <div className="flex items-center gap-3">
        <NavUser
          user={{
            avatar: "",
            email: "mahmoud@gmail.com",
            name: "Mahmoud Khaled",
          }}
        />
      </div>
    </header>
  );
}
