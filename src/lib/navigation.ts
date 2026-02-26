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
    ReceiptText,
    BookOpen,
    Wallet,
    Contact,
    Building,
    Landmark,
} from "lucide-react";

export const navMain = [
    {
        title: "Dashboard",
        module: 'dashboard',
        url: "/",
        icon: Home,
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
            // {
            //     title: "Order Delivered",
            //     url: "/order-management/delivered",
            //     icon: Truck,
            // },
        ],
    },
    {
        title: "Buyers",
        module: 'buyers',
        url: "/buyers",
        icon: Contact,
    },
    {
        title: "Suppliers",
        module: 'suppliers', // Temporarily using 'buyers' permission since 'suppliers' is not in the backend enum yet
        url: "/suppliers",
        icon: Truck,
    },
    {
        title: "Users",
        module: 'users',
        url: "/users",
        icon: Users,
    },
    {
        title: "Company Profile",
        module: 'companyProfile',
        url: "/company-profile",
        icon: Building2,
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
                title: "Buyer Ledger",
                url: "/accounting/buyer-ledger",
                icon: Users,
            },
            {
                title: "Supplier Ledger",
                url: "/accounting/supplier-ledger",
                icon: Building,
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
                title: "Bank Management",
                url: "/accounting/banks",
                icon: Landmark,
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
    {
        title: "Proforma Invoice",
        module: 'piManagement',
        icon: FileText,
        url: "/invoice-management/invoices",
    },
    {
        title: "Invoice Terms",
        module: 'invoiceTerms',
        url: "/invoice-terms",
        icon: FileText,
    },
];
