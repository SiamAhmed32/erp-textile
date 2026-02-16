import { Invoice, InvoiceApiItem, InvoiceFormData, PIStatus, ProductType } from "./types";

const STATUSES: PIStatus[] = ["DRAFT", "SENT", "APPROVED", "CANCELLED"];
const TYPES: ProductType[] = ["FABRIC", "LABEL_TAG", "CARTON"];

const coerceStatus = (value?: string | null): PIStatus =>
    STATUSES.includes(value as PIStatus) ? (value as PIStatus) : "DRAFT";

const coerceType = (value?: string | null): ProductType =>
    TYPES.includes(value as ProductType) ? (value as ProductType) : "FABRIC";

export const normalizeInvoice = (item: InvoiceApiItem): Invoice => ({
    id: item.id ?? "",
    piNumber: item.piNumber ?? "",
    date: item.date ?? "",
    status: coerceStatus(item.status),
    orderId: item.orderId ?? "",
    invoiceTermsId: item.invoiceTermsId ?? "",
    createdAt: item.createdAt ?? "",
    updatedAt: item.updatedAt ?? "",
    order: item.order
        ? {
              ...item.order,
              productType: coerceType(item.order.productType),
              orderItems: item.order.orderItems ?? [],
          }
        : null,
    invoiceTerms: item.invoiceTerms ?? null,
    user: item.user ?? null,
});

export const toInvoiceFormData = (invoice: Invoice): InvoiceFormData => ({
    piNumber: invoice.piNumber || "",
    date: invoice.date ? invoice.date.slice(0, 10) : "",
    orderId: invoice.orderId || "",
    invoiceTermsId: invoice.invoiceTermsId || "",
    status: coerceStatus(invoice.status),
});

export const toInvoicePayload = (data: InvoiceFormData) => ({
    piNumber: data.piNumber,
    date: data.date,
    orderId: data.orderId,
    invoiceTermsId: data.invoiceTermsId,
    status: coerceStatus(data.status),
});

export const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

export const statusBadgeClass = (status: PIStatus) => {
    switch (status) {
        case "DRAFT":
            return "bg-slate-200 text-slate-700";
        case "SENT":
            return "bg-blue-100 text-blue-700";
        case "APPROVED":
            return "bg-green-100 text-green-700";
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-slate-200 text-slate-700";
    }
};

export const countByType = (items: Invoice[]) => {
    const counts = { all: items.length, FABRIC: 0, LABEL_TAG: 0, CARTON: 0 };
    items.forEach((invoice) => {
        const type = invoice.order?.productType;
        if (type === "FABRIC" || type === "LABEL_TAG" || type === "CARTON") {
            counts[type] += 1;
        }
    });
    return counts;
};
