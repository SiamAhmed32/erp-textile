export interface AccountingStat {
    label: string;
    value: string;
    subLabel: string;
    trend: 'up' | 'down' | 'neutral';
    color: string;
    icon: string;
}

export interface ModuleSummary {
    title: string;
    description: string;
    icon: string;
    href: string;
    color: string;
    metrics: {
        label: string;
        value: string;
    }[];
}

export interface Transaction {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
    type: 'income' | 'expense' | 'neutral';
}

export interface Loan {
    id: string;
    name: string;
    type: string;
    outstanding: number;
    total: number;
    color: string;
}

export const mockAccountingStats: AccountingStat[] = [
    {
        label: "Total Receivables",
        value: "$11,990.81",
        subLabel: "From 2 customers",
        trend: 'up',
        color: "green",
        icon: "TrendingUp"
    },
    {
        label: "Total Payables",
        value: "-$2,800.00",
        subLabel: "To 2 suppliers",
        trend: 'down',
        color: "red",
        icon: "TrendingDown"
    },
    {
        label: "Net Position",
        value: "$14,790.81",
        subLabel: "Net receivable",
        trend: 'neutral',
        color: "emerald",
        icon: "DollarSign"
    },
    {
        label: "Outstanding Loans",
        value: "$499,617.33",
        subLabel: "2 active loans",
        trend: 'neutral',
        color: "amber",
        icon: "Landmark"
    }
];

export const mockModuleSummaries: ModuleSummary[] = [

    {
        title: "Supplier Ledger",
        description: "Manage supplier accounts and payments",
        icon: "Truck",
        href: "/accounting/supplier-ledger",
        color: "bg-emerald-50",
        metrics: [
            { label: "Total Suppliers", value: "2" },
            { label: "Total Payables", value: "-$2,800.00" }
        ]
    },
    {
        title: "MOI / Cash Book",
        description: "IOU and convenience bill management",
        icon: "BookOpen",
        href: "/accounting/cash-book",
        color: "bg-amber-50",
        metrics: [
            { label: "Total Entries", value: "2" },
            { label: "Current Balance", value: "$860.00" }
        ]
    },
    {
        title: "Daily Bookkeeping",
        description: "Track daily income and expenses",
        icon: "ClipboardList",
        href: "/accounting/daily-bookkeeping",
        color: "bg-purple-50",
        metrics: [
            { label: "Monthly Income", value: "$86,200.00" },
            { label: "Monthly Expense", value: "$125,000.00" }
        ]
    },
    {
        title: "Loan Management",
        description: "Manage loans and repayments",
        icon: "Landmark",
        href: "/accounting/loan-management",
        color: "bg-rose-50",
        metrics: [
            { label: "Active Loans", value: "2" },
            { label: "Outstanding", value: "$499,617.33" }
        ]
    }
];

export const mockRecentTransactions: Transaction[] = [
    {
        id: "1",
        description: "Cash received from Trouser World",
        category: "Sales",
        amount: 50000,
        date: "Today",
        type: "income"
    },
    {
        id: "2",
        description: "Paid to Raw Materials Co.",
        category: "Purchase",
        amount: -25000,
        date: "Yesterday",
        type: "expense"
    },
    {
        id: "3",
        description: "Depreciation Entry",
        category: "Depreciation",
        amount: 5000,
        date: "Feb 15, 2026",
        type: "neutral"
    },
    {
        id: "4",
        description: "Bank Interest Received",
        category: "Interest Income",
        amount: 1200,
        date: "Feb 14, 2026",
        type: "income"
    },
    {
        id: "5",
        description: "Electricity Bill",
        category: "Utilities",
        amount: -15000,
        date: "Feb 12, 2026",
        type: "expense"
    }
];

export const mockActiveLoans: Loan[] = [
    {
        id: "L1",
        name: "National Bank Limited",
        type: "bank",
        outstanding: 366284.01,
        total: 500000,
        color: "bg-indigo-500"
    },
    {
        id: "L2",
        name: "Mr. Rahman (Director)",
        type: "director",
        outstanding: 133333.32,
        total: 200000,
        color: "bg-indigo-400"
    }
];
