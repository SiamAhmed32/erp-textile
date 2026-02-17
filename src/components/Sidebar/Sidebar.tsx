"use client";
import * as React from "react";
import {
  ChevronRight,
  Home,
  Settings2,
  Building2,
  Users,
  Tag,
  Package,
  Box,
  ShoppingCart,
  FileText,
  Truck,
  ClipboardList,
} from "lucide-react";
import logo from "@/assets/logo.png";

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Navigation data
const data = {
  navMain: [
    {
      title: "Dashboard",
      module: 'dashboard',
      url: "/",
      icon: Home,
    },
    {
      title: "Company Profile",
      module: 'company-profile',
      url: "/company-profile",
      icon: Building2,
    },
    {
      title: "Users",
      module: 'users',
      url: "/users",
      icon: Users,
    },
    {
      title: "Buyers",
      module: 'buyers',
      url: "/buyers",
      icon: Users,
    },
    {
      title: "Invoice Terms",
      module: 'invoice-terms',
      url: "/invoice-terms",
      icon: FileText,
    },
    {
      title: "Order Management",
      module: 'order-management',
      icon: ShoppingCart,
      items: [
        {
          title: "Order List",
          url: "/order-management/orders",
          icon: ClipboardList,
        },
        {
          title: "Order Delivered",
          url: "/order-management/delivered",
          icon: Truck,
        },
      ],
    },
    {
      title: "Proforma Invoice",
      module: 'proforma-invoice',
      icon: FileText,
      url: "/invoice-management/invoices",
      // items: [
      //   {
      //     title: "All Invoices",
      //     icon: FileText,
      //   },
      //   // {
      //   //   title: "Create Invoice",
      //   //   url: "/invoice-management/invoices/add-new-invoice",
      //   //   icon: FileText,
      //   // },
      // ],
    },
  ],
};

import { useSelector } from "react-redux";

const Sidebar = ({
  ...props
}: React.ComponentProps<typeof SidebarComponent>) => {
  const pathname = usePathname();
  // @ts-ignore
  const user = useSelector((state: any) => state.auth.user); // Get user from Redux store

  // const user = {
  //   role: "user",
  //   modules: ["dashboard", "company-profile", "users", "buyers"],
  // };

  const filteredNavMain = data.navMain.filter((item) => {
    if (user?.role === "admin") return true;

    // Check if item has a module and if it's in user's modules
    if (item.module && user?.modules?.includes(item.module)) {
      return true;
    }

    // logic for submenu items if needed, currently assuming top-level module control
    return false;
  });

  const isLinkActive = (url?: string) => {
    if (!url) return false;
    if (url === "/" && pathname === "/") return true;
    if (url !== "/" && pathname.startsWith(url)) return true;
    return false;
  };
  return (
    <SidebarComponent collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image src={logo} alt="Logo" width={50} height={50} />

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Moon Textile</span>
                  <span className="truncate text-xs">ERP System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {filteredNavMain.map((item) => {
              const isGroupActive = item.items?.some((subItem) =>
                isLinkActive(subItem.url),
              );
              const isActive = isLinkActive(item.url) || isGroupActive;

              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {item.items ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isActive}
                          >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                          <SidebarMenuSub className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isLinkActive(subItem.url)}
                                  className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0"
                                >
                                  <Link href={subItem.url}>
                                    {subItem.icon && (
                                      <subItem.icon className="size-4" />
                                    )}
                                    <span className="group-data-[collapsible=icon]:hidden">
                                      {subItem.title}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : (
                      <SidebarMenuButton
                        tooltip={item.title}
                        asChild
                        isActive={isActive}
                      >
                        <Link href={item.url}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Settings2 />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </SidebarComponent>
  );
};

export default Sidebar;
