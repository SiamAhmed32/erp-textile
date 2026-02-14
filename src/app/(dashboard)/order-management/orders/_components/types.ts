export type OrderStatus = "DRAFT" | "PENDING" | "PROCESSING" | "APPROVED" | "DELIVERED" | "CANCELLED";
export type ProductType = "FABRIC" | "LABEL_TAG" | "CARTON";

export type Buyer = {
    id: string;
    name: string;
    email: string;
};

export type CompanyProfile = {
    id: string;
    name: string;
};

export type User = {
    id: string;
    displayName?: string;
    email?: string;
};

export type FabricItemData = {
    color?: string;
    netWeight?: number | string;
    grossWeight?: number | string;
    quantityYds?: number | string;
    unitPrice?: number | string;
    totalAmount?: number | string;
};

export type LabelItemData = {
    desscription?: string;
    color?: string;
    netWeight?: number | string;
    grossWeight?: number | string;
    quantityDzn?: number | string;
    quantityPcs?: number | string;
    unitPrice?: number | string;
    totalAmount?: number | string;
};

export type CartonItemData = {
    cartonMeasurement?: string;
    cartonPly?: string;
    cartonQty?: number | string;
    netWeight?: number | string;
    grossWeight?: number | string;
    unit?: string;
    unitPrice?: number | string;
    totalAmount?: number | string;
};

export type FabricItem = {
    styleNo?: string;
    discription?: string;
    width?: string;
    totalNetWeight?: number | string;
    totalGrossWeight?: number | string;
    totalQuantityYds?: number | string;
    totalUnitPrice?: number | string;
    totalAmount?: number | string;
    fabricItemData?: FabricItemData[];
};

export type LabelItem = {
    styleNo?: string;
    netWeightTotal?: number | string;
    grossWeightTotal?: number | string;
    quantityDznTotal?: number | string;
    quantityPcsTotal?: number | string;
    unitPriceTotal?: number | string;
    totalAmount?: number | string;
    labelItemData?: LabelItemData[];
};

export type CartonItem = {
    orderNo?: string;
    totalcartonQty?: number | string;
    totalNetWeight?: number | string;
    totalGrossWeight?: number | string;
    totalUnitPrice?: number | string;
    cartonItemData?: CartonItemData[];
};

export type OrderItem = {
    id: string;
    fabricItem?: FabricItem | null;
    labelItem?: LabelItem | null;
    cartonItem?: CartonItem | null;
};

export type Order = {
    id: string;
    orderNumber: string;
    orderDate: string | null;
    remarks?: string | null;
    productType: ProductType;
    buyerId: string;
    userId?: string | null;
    companyProfileId: string;
    status: OrderStatus;
    deliveryDate?: string | null;
    createdAt: string;
    updatedAt: string;
    buyer?: Buyer | null;
    user?: User | null;
    companyProfile?: CompanyProfile | null;
    orderItems?: OrderItem[];
};

export type OrderApiItem = Partial<Order>;

export type OrderFormData = {
    orderNumber: string;
    orderDate: string;
    remarks: string;
    productType: ProductType;
    buyerId: string;
    companyProfileId: string;
    status: OrderStatus;
    deliveryDate: string;
    orderItems: {
        fabricItem?: FabricItem;
        labelItem?: LabelItem;
        cartonItem?: CartonItem;
    };
};
