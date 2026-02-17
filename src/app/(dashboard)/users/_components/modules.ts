// Module definitions extracted from sidebar navigation
export const AVAILABLE_MODULES = [
    { key: "dashboard", label: "Dashboard" },
    { key: "finance", label: "Company Profile" },
    { key: "users", label: "Users" },
    { key: "buyer", label: "Buyers" },
    { key: "invoiceTerms", label: "Invoice Terms" },
    { key: "orders", label: "Order Management" },
    { key: "piManagement", label: "Proforma Invoice" },
    { key: "lcManagement", label: "Lc Management" },
    { key: "accounts", label: "Accounts" }
] as const;

export type ModuleKey = typeof AVAILABLE_MODULES[number]["key"];
