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
  LogOut,
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
import { usePathname, useRouter } from "next/navigation";

import { navMain } from "@/lib/navigation";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";

const Sidebar = ({
  ...props
}: React.ComponentProps<typeof SidebarComponent>) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  // @ts-ignore
  const user = useSelector((state: any) => state.auth.user); // Get user from Redux store

  // const user = {
  //   role: "user",
  //   modules: ["dashboard", "company-profile", "users", "buyers"],
  // };

  const filteredNavMain = navMain.filter((item) => {
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
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };
  return (
    <SidebarComponent collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent hover:text-white" size="lg" asChild>
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
            <SidebarMenuButton asChild isActive={pathname === "/login"}>
              <Link className="text-red-500 hover:text-red-600 cursor-pointer hover:bg-red-500/10" onClick={handleLogout} href="/login">
                <LogOut />
                <span>Logout</span>
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
