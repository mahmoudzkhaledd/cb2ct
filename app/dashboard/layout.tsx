import ConfigsProvider from "@/components/providers/ConfigsProvider";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { prisma } from "@/lib/db";
import { getConfigs } from "@/utils/configs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const configs = await getConfigs();

  return (
    <ConfigsProvider configs={configs}>
      <SidebarProvider
        defaultOpen={cookieStore.get("sidebar")?.value === "true"}
        className="relative"
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar className="p-0" variant="inset" />
        <SidebarInset className="mb-0">
          <SiteHeader />
          <main className="h-full p-4 lg:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ConfigsProvider>
  );
}
