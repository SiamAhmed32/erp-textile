export type Supplier = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    location: string;
    supplierCode?: string;
    openingLiability?: number;
    isDeleted?: boolean;
};

export type SupplierFormData = Omit<Supplier, "id"> & { id?: string };
