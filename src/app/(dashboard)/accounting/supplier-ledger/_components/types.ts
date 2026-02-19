export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    location: string;
    userId: string;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface SupplierFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    location: string;
}

export interface SupplierApiResponse {
    data: Supplier[];
    total: number;
    page: number;
    lastPage: number;
}
