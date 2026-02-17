export interface Transaction {
    id: string;
    type: string;
    date: string;
    amount: number;
    description: string;
    isCredit?: boolean;
}

export interface CustomerLedgerItem {
    id: string;
    customerName: string;
    customerId: string;
    address: string;
    entries: number;
    balance: number;
    totalDebit: number;
    totalCredit: number;
    transactions: Transaction[];
}

export interface CustomerStats {
    totalCustomers: number;
    totalReceivables: number;
    avgBalance: number;
}

export const mockCustomerStats: CustomerStats = {
    totalCustomers: 2,
    totalReceivables: 11990.81,
    avgBalance: 5995.41,
};

export const mockCustomerLedgerData: CustomerLedgerItem[] = [
    {
        id: "1",
        customerName: "TROUSER WORLD (PVT) LTD",
        customerId: "CUST-001",
        address: "PLOT 3/B/1, KUNIA JAYILB...",
        entries: 5,
        balance: 4718.21,
        totalDebit: 9218.21,
        totalCredit: 4500.00,
        transactions: [
            { id: "t1", type: "Opening Balance", date: "01 Dec 2024", amount: 50.00, description: "Opening Balance" },
            { id: "t2", type: "PI F R B-22/2025 (D)", date: "05 Dec 2024", amount: 2933.33, description: "PI F R B-22/2025 (D)" },
            { id: "t3", type: "Payment Received - L/C", date: "15 Dec 2024", amount: -1500.00, description: "Payment Received - L/C", isCredit: true },
            { id: "t4", type: "PI MT-31/25 SP", date: "18 Dec 2024", amount: 6284.88, description: "PI MT-31/25 SP" },
            { id: "t5", type: "Payment Received - Cash", date: "20 Dec 2024", amount: -3000.00, description: "Payment Received - Cash", isCredit: true },
        ]
    },
    {
        id: "2",
        customerName: "Knit Bazaar (Pvt) Ltd.",
        customerId: "CUST-002",
        address: "Plot 40/41, Vadam, Tongi, Ga...",
        entries: 2,
        balance: 7272.60,
        totalDebit: 7272.60,
        totalCredit: 0,
        transactions: [
            { id: "t6", type: "Opening Balance", date: "01 Jan 2025", amount: 1000.00, description: "Opening Balance" },
            { id: "t7", type: "PI KB-01/25", date: "10 Jan 2025", amount: 6272.60, description: "PI KB-01/25" },
        ]
    },
];
