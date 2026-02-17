export interface Transaction {
    id: string;
    type: string;
    date: string;
    amount: number;
    description: string;
    isCredit?: boolean;
}

export interface SupplierLedgerItem {
    id: string;
    supplierName: string;
    supplierId: string;
    address: string;
    entries: number;
    balance: number;
    totalDebit: number;
    totalCredit: number;
    transactions: Transaction[];
}

export interface SupplierStats {
    totalSuppliers: number;
    totalPayables: number;
    avgBalance: number;
}

export const mockSupplierStats: SupplierStats = {
    totalSuppliers: 2,
    totalPayables: -2800.00,
    avgBalance: -1400.00,
};

export const mockSupplierLedgerData: SupplierLedgerItem[] = [
    {
        id: "1",
        supplierName: "Raw Materials Co.",
        supplierId: "SUP-001",
        address: "Tejgaon Industrial Area, Dhaka",
        entries: 4,
        balance: -1300.00,
        totalDebit: 1000.00,
        totalCredit: 2300.00,
        transactions: [
            { id: "t1", type: "Opening Balance", date: "01 Dec 2024", amount: 0.00, description: "Opening Balance", isCredit: true },
            { id: "t2", type: "Purchase - Labels Raw", date: "10 Dec 2024", amount: -1500.00, description: "Purchase - Labels Raw" },
            { id: "t3", type: "Payment Made", date: "20 Dec 2024", amount: 1000.00, description: "Payment Made", isCredit: true },
            { id: "t4", type: "Purchase - Thread", date: "25 Dec 2024", amount: -800.00, description: "Purchase - Thread" },
        ]
    },
    {
        id: "2",
        supplierName: "Carton Box Industries",
        supplierId: "SUP-002",
        address: "Gazipur Industrial Zone",
        entries: 3,
        balance: -1500.00,
        totalDebit: 0,
        totalCredit: 1500.00,
        transactions: [
            { id: "t5", type: "Opening Balance", date: "01 Jan 2025", amount: 0.00, description: "Opening Balance", isCredit: true },
            { id: "t6", type: "Purchase - Boxes", date: "10 Jan 2025", amount: -1000.00, description: "Purchase - Boxes" },
            { id: "t7", type: "Purchase - Tape", date: "15 Jan 2025", amount: -500.00, description: "Purchase - Tape" },
        ]
    },
];
