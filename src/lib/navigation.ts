import {
    Home,
    Building2,
    Users,
    FileText,
    ShoppingCart,
    ClipboardList,
    Truck,
} from "lucide-react";

export const navMain = [
    {
        title: "Dashboard",
        module: 'dashboard',
        url: "/",
        icon: Home,
    },
    {
        title: "Company Profile",
        module: 'finance',
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
        module: 'buyer',
        url: "/buyers",
        icon: Users,
    },
    {
        title: "Invoice Terms",
        module: 'invoiceTerms',
        url: "/invoice-terms",
        icon: FileText,
    },
    {
        title: "Order Management",
        module: 'orders',
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
        module: 'piManagement',
        icon: FileText,
        url: "/invoice-management/invoices",
    },
];
