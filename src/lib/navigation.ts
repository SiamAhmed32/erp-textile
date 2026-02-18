import {
    Home,
    Building2,
    Users,
    FileText,
    ShoppingCart,
    ClipboardList,
    Truck,
    Calculator,
    LayoutDashboard,
    UserRound,
    Building,
    ReceiptText,
    BookOpen,
    Wallet,
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
        module: 'companyProfile',
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
    {
        title: "LC Management",
        module: 'lcManagement',
        icon: FileText,
        items: [
            {
                title: "LC List",
                url: "/lc-management/lc-managements",
                icon: ClipboardList,
            },

        ],
    },
    {
        title: "Accounting",
        module: 'accounts',
        icon: Calculator,
        items: [
            {
                title: "Overview",
                url: "/accounting/overview",
                icon: LayoutDashboard,
            },
            {
                title: "Daily Bookkeeping",
                url: "/accounting/daily-bookkeeping",
                icon: BookOpen,
            },
            {
                title: "MOI (Cash Book)",
                url: "/accounting/cash-book",
                icon: ReceiptText,
            },
            {
                title: "Loan Management",
                url: "/accounting/loan-management",
                icon: Wallet,
            },
            {
                title: "Account Headers",
                url: "/accounting/account-headers",
                icon: FileText,
            },
        ],
    },
];
