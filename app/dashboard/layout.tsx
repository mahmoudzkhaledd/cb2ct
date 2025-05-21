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
      <SiteHeader />
      <main className="h-full p-4 lg:p-6">{children}</main>
    </ConfigsProvider>
  );
}
