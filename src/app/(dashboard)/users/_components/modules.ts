// Module definitions extracted from sidebar navigation
export const AVAILABLE_MODULES = [
    { key: "dashboard", label: "Dashboard" },
    { key: "company-profile", label: "Company Profile" },
    { key: "users", label: "Users" },
    { key: "buyers", label: "Buyers" },
    { key: "invoice-terms", label: "Invoice Terms" },
    { key: "order-management", label: "Order Management" },
    { key: "proforma-invoice", label: "Proforma Invoice" },
    { key: "settings", label: "Settings" },
] as const;

export type ModuleKey = typeof AVAILABLE_MODULES[number]["key"];
