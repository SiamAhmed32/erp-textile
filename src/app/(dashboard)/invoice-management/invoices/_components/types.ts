export type PIStatus = "DRAFT" | "SENT" | "APPROVED" | "CANCELLED";
export type ProductType = "FABRIC" | "LABEL_TAG" | "CARTON";

export type InvoiceTerms = {
    id: string;
    name: string;
    payment?: string | null;
    delivery?: string | null;
    advisingBank?: string | null;
    negotiation?: string | null;
    origin?: string | null;
    swiftCode?: string | null;
    binNo?: string | null;
    hsCode?: string | null;
    remarks?: string | null;
};

export type OrderItem = {
    fabricItem?: any | null;
    labelItem?: any | null;
    cartonItem?: any | null;
};

export type OrderSummary = {
    id: string;
    orderNumber?: string | null;
    productType?: ProductType | null;
    deliveryDate?: string | null;
    orderDate?: string | null;
    companyProfileId?: string | null;
    orderItems?: OrderItem[];
};

export type UserSummary = {
    id: string;
    displayName?: string | null;
    email?: string | null;
};

export type Invoice = {
    id: string;
    piNumber: string;
    date: string;
    status: PIStatus;
    orderId: string;
    invoiceTermsId: string;
    createdAt: string;
    updatedAt: string;
    order?: OrderSummary | null;
    invoiceTerms?: InvoiceTerms | null;
    user?: UserSummary | null;
};

export type InvoiceApiItem = Partial<Invoice>;

export type InvoiceFormData = {
    piNumber: string;
    date: string;
    orderId: string;
    invoiceTermsId: string;
    status: PIStatus;
};
