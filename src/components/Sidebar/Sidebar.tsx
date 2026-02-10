"use client"
import * as React from "react"
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
} from "lucide-react"
import logo from "@/assets/logo.png"

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
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from "next/link"
import Image from "next/image"

// Navigation data
const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/",
            icon: Home,
            isActive: true,
        },
        {
            title: "Company Profile",
            url: "/company-profile",
            icon: Building2,
        },
        {
            title: "Buyers",
            url: "/buyers",
            icon: Users,
        },
        {
            title: "Invoice Terms",
            url: "/invoice-terms",
            icon: FileText,
        },
        {
            title: "Order Management",
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
            icon: FileText,
            items: [
                {
                    title: "All Invoices",
                    url: "/proforma-invoice/all",
                    icon: FileText,
                },
                {
                    title: "Create - Labels",
                    url: "/proforma-invoice/create-labels",
                    icon: Tag,
                },
                {
                    title: "Create - Fabric",
                    url: "/proforma-invoice/create-fabric",
                    icon: Package,
                },
                {
                    title: "Create - Cartons",
                    url: "/proforma-invoice/create-cartons",
                    icon: Box,
                },
            ],
        },

    ],
}

const Sidebar = ({ ...props }: React.ComponentProps<typeof SidebarComponent>) => {
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
                        {data.navMain.map((item) => (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={item.isActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    {item.items ? (
                                        <>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={item.title}>
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                                <SidebarMenuSub className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0">
                                                                <Link href={subItem.url}>
                                                                    {subItem.icon && <subItem.icon className="size-4" />}
                                                                    <span className="group-data-[collapsible=icon]:hidden">{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </>
                                    ) : (
                                        <SidebarMenuButton tooltip={item.title} asChild>
                                            <Link href={item.url}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
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
    )
}

export default Sidebar
