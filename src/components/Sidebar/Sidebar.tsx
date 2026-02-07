import * as React from "react"
import {
    ChevronRight,
    FileText,
    Home,
    Settings2,
    Building2,
    Tag,
    Package,
    Box,
    ShoppingCart,
    Truck,
    ClipboardList,
} from "lucide-react"

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
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Package className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">ERP Textile</span>
                                    <span className="truncate text-xs">Management</span>
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
                                                <SidebarMenuSub>
                                                    {item.items.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link href={subItem.url}>
                                                                    {subItem.icon && <subItem.icon className="size-4" />}
                                                                    <span>{subItem.title}</span>
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
