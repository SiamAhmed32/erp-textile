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
    History as HistoryIcon,
} from "lucide-react";

export const navMain = [
    {
        title: "Dashboard",
        module: "dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Order Management",
        module: "orders",
        url: "/order-management/orders",
        icon: ClipboardList,
    },
    {
        title: "Proforma Invoice",
        module: "piManagement",
        icon: FileText,
        url: "/invoice-management/invoices",
    },
    {
        title: "Invoice Terms",
        module: "invoiceTerms",
        url: "/invoice-terms",
        icon: FileText,
    },
    {
        title: "Buyers",
        module: "buyers",
        url: "/buyers",
        icon: Contact,
    },
    {
        title: "Suppliers",
        module: "suppliers", // Temporarily using 'buyers' permission since 'suppliers' is not in the backend enum yet
        url: "/suppliers",
        icon: Truck,
    },
    {
        title: "LC Management",
        module: "lcManagement",
        url: "/lc-management/lc-managements",
        icon: ClipboardList,
    },
    {
        title: "Accounting",
        module: "accounts",
        icon: Calculator,
        items: [
            {
                title: "Daily Bookkeeping",
                url: "/accounting/daily-bookkeeping",
                icon: BookOpen,
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
                title: "Bank Management",
                url: "/accounting/banks",
                icon: Landmark,
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
                title: "Trial Balance",
                url: "/accounting/trial-balance",
                icon: FileText,
            },
            {
                title: "Audit Trail",
                url: "/accounting/audit-trail",
                icon: HistoryIcon,
            },
            {
                title: "Account Headers",
                url: "/accounting/account-headers",
                icon: FileText,
            },
        ],
    },
    {
        title: "Users",
        module: "users",
        url: "/users",
        icon: Users,
    },
    {
        title: "Company Profile",
        module: "companyProfile",
        url: "/company-profile",
        icon: Building2,
    },
];
