import { Order, OrderApiItem, OrderFormData, OrderStatus, ProductType } from "./types";

const ORDER_STATUSES: OrderStatus[] = [
    "DRAFT",
    "PENDING",
    "PROCESSING",
    "APPROVED",
    "DELIVERED",
    "CANCELLED",
];

const PRODUCT_TYPES: ProductType[] = ["FABRIC", "LABEL_TAG", "CARTON"];

const coerceStatus = (value?: string | null): OrderStatus =>
    ORDER_STATUSES.includes(value as OrderStatus) ? (value as OrderStatus) : "DRAFT";

const coerceProductType = (value?: string | null): ProductType =>
    PRODUCT_TYPES.includes(value as ProductType) ? (value as ProductType) : "FABRIC";

export const normalizeOrder = (item: OrderApiItem): Order => ({
    id: item.id ?? "",
    orderNumber: item.orderNumber ?? "",
    orderDate: item.orderDate ?? null,
    remarks: item.remarks ?? "",
    productType: coerceProductType(item.productType),
    buyerId: item.buyerId ?? "",
    userId: item.userId ?? null,
    companyProfileId: item.companyProfileId ?? "",
    status: coerceStatus(item.status),
    deliveryDate: item.deliveryDate ?? null,
    createdAt: item.createdAt ?? "",
    updatedAt: item.updatedAt ?? "",
    buyer: item.buyer ?? null,
    user: item.user ?? null,
    companyProfile: item.companyProfile ?? null,
    orderItems: item.orderItems ?? [],
    isInvoice: item.isInvoice ?? !!item.invoices,
    isLc: item.isLc ?? !!item.invoices?.lcManagement,
    invoices: item.invoices ?? null,
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

export const statusBadgeClass = (status: OrderStatus) => {
    switch (status) {
        case "DRAFT":
            return "bg-slate-200 text-slate-700";
        case "PENDING":
            return "bg-blue-100 text-blue-700";
        case "PROCESSING":
            return "bg-yellow-100 text-yellow-700";
        case "APPROVED":
            return "bg-emerald-100 text-emerald-700";
        case "DELIVERED":
            return "bg-green-100 text-green-700";
        case "CANCELLED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-slate-200 text-slate-700";
    }
};

export const toOrderFormData = (order: Order): OrderFormData => {
    const firstItem = Array.isArray(order.orderItems)
        ? order.orderItems[0]
        : order.orderItems;

    return {
        orderNumber: order.orderNumber || "",
        orderDate: order.orderDate ? order.orderDate.slice(0, 10) : "",
        remarks: order.remarks || "",
        productType: coerceProductType(order.productType),
        buyerId: order.buyerId || "",
        companyProfileId: order.companyProfileId || "",
        status: coerceStatus(order.status),
        deliveryDate: order.deliveryDate ? order.deliveryDate.slice(0, 10) : "",
        orderItems: {
            fabricItem: firstItem?.fabricItem || undefined,
            labelItem: firstItem?.labelItem || undefined,
            cartonItem: firstItem?.cartonItem || undefined,
        },
    };
};

const sanitizeOrderItems = (items: any) => {
    if (!items) return undefined;
    const sanitized = { ...items };

    if (sanitized.fabricItem) {
        sanitized.fabricItem = {
            ...sanitized.fabricItem,
            fabricItemData: sanitized.fabricItem.fabricItemData?.map((d: any) => ({
                ...d,
                netWeight: d.netWeight ? Number(d.netWeight) : undefined,
                grossWeight: d.grossWeight ? Number(d.grossWeight) : undefined,
                quantityYds: d.quantityYds ? Number(d.quantityYds) : undefined,
                unitPrice: d.unitPrice ? Number(d.unitPrice) : undefined,
            })),
        };
    }

    if (sanitized.labelItem) {
        sanitized.labelItem = {
            ...sanitized.labelItem,
            labelItemData: sanitized.labelItem.labelItemData?.map((d: any) => ({
                ...d,
                netWeight: d.netWeight ? Number(d.netWeight) : undefined,
                grossWeight: d.grossWeight ? Number(d.grossWeight) : undefined,
                quantityDzn: d.quantityDzn ? Number(d.quantityDzn) : undefined,
                quantityPcs: d.quantityPcs ? Number(d.quantityPcs) : undefined,
                unitPrice: d.unitPrice ? Number(d.unitPrice) : undefined,
            })),
        };
    }

    if (sanitized.cartonItem) {
        sanitized.cartonItem = {
            ...sanitized.cartonItem,
            cartonItemData: sanitized.cartonItem.cartonItemData?.map((d: any) => ({
                ...d,
                cartonQty: d.cartonQty ? Number(d.cartonQty) : undefined,
                netWeight: d.netWeight ? Number(d.netWeight) : undefined,
                grossWeight: d.grossWeight ? Number(d.grossWeight) : undefined,
                unitPrice: d.unitPrice ? Number(d.unitPrice) : undefined,
            })),
        };
    }

    return sanitized;
};

export const toOrderPayload = (data: OrderFormData) => ({
    orderNumber: data.orderNumber,
    orderDate: data.orderDate ? new Date(data.orderDate).toISOString() : undefined,
    remarks: data.remarks || undefined,
    productType: coerceProductType(data.productType),
    buyerId: data.buyerId,
    companyProfileId: data.companyProfileId,
    status: coerceStatus(data.status),
    deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString() : undefined,
    orderItems: sanitizeOrderItems(data.orderItems),
});

export const toOrderUpdatePayload = (data: OrderFormData) => ({
    orderNumber: data.orderNumber,
    orderDate: data.orderDate ? new Date(data.orderDate).toISOString() : undefined,
    remarks: data.remarks || undefined,
    buyerId: data.buyerId,
    companyProfileId: data.companyProfileId,
    deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString() : undefined,
    orderItems: sanitizeOrderItems(data.orderItems),
});
