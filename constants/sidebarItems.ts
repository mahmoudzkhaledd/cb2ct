import {
  Icon,
  IconCalendar,
  IconChartLine,
  IconCircleCheck,
  IconCoins,
  IconCube,
  IconDashboard,
  IconInvoice,
  IconLogs,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon: Icon;
  collapse?: boolean;

  trailing?: Icon;
}
export const sidebarItems: Record<string, SidebarItem[]> = {
  navMain: [
    {
      title: "dashboard",
      url: "/dashboard/home",
      icon: IconDashboard,
    },
  ],
};
