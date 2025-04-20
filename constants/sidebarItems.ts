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
    {
      title: "subscriptions",
      url: "/dashboard/subscriptions",
      icon: IconChartLine,
      collapse: true,
    },
    {
      title: "all_subscribers",
      url: "/dashboard/all-subscribers",
      icon: IconUsers,
    },

    {
      title: "plans",
      url: "/pricing",
      icon: IconCube,
    },
    {
      title: "calendar",
      url: "/dashboard/calendar",
      icon: IconCalendar,
    },
    {
      title: "points",
      url: "/dashboard/points",
      icon: IconCoins,
    },
    {
      title: "settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],

  navSecondary: [
    {
      title: "invoices",
      url: "/dashboard/invoices",
      icon: IconInvoice,
    },
    {
      title: "settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
};
