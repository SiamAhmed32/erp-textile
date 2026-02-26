import React from "react";
import { CustomModal, InputField } from "@/components/reusables";
import { SupplierFormData } from "./types";
import { toast } from "sonner";

export type SupplierFormMode = "create" | "edit";

type Props = {
    open: boolean;
    mode: SupplierFormMode;
    data: SupplierFormData;
    onClose: () => void;
    onChange: (field: keyof SupplierFormData, value: string | number) => void;
    onSubmit: () => void;
    errors?: Partial<Record<keyof SupplierFormData, string>>;
};

export function SupplierForm({
    open,
    mode,
    data,
    onClose,
    onChange,
    onSubmit,
    errors = {},
}: Props) {
    const isCreate = mode === "create";
    const title = isCreate ? "Add New Supplier" : "Edit Supplier Profile";
    const description = isCreate
        ? "Create a supplier profile to track purchases, accounting, and communication."
        : "Update supplier information to keep records accurate and consistent.";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(value) => !value && onClose()}
            title={title}
            maxWidth="600px"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-500 mb-4">{description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <InputField
                            label="Supplier Name"
                            name="name"
                            value={data.name}
                            onChange={(e) => onChange("name", e.target.value)}
                            placeholder="Supplier name"
                            required
                        />
                        {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => onChange("email", e.target.value)}
                            placeholder="supplier@example.com"
                            required
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                        <InputField
                            label="Supplier Code (Optional)"
                            name="supplierCode"
                            value={data.supplierCode || ""}
                            onChange={(e) => onChange("supplierCode", e.target.value)}
                            placeholder="e.g. SUP-001"
                        />
                    </div>

                    <div className="space-y-1">
                        <InputField
                            label="Phone"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => onChange("phone", e.target.value)}
                            placeholder="+880..."
                            required
                        />
                        {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1">
                        <InputField
                            label="Location"
                            name="location"
                            value={data.location}
                            onChange={(e) => onChange("location", e.target.value)}
                            placeholder="Dhaka"
                            required
                        />
                        {errors.location && <p className="text-[10px] text-red-500 font-medium">{errors.location}</p>}
                    </div>

                    {isCreate && (
                        <div className="space-y-1">
                            <InputField
                                label="Opening Liability (৳)"
                                name="openingLiability"
                                type="number"
                                value={data.openingLiability || ""}
                                onChange={(e) => onChange("openingLiability", parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                            />
                            <p className="text-[10px] text-zinc-500 leading-tight">Optional start balance. Leave empty for 0.</p>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.address}
                        onChange={(e) => onChange("address", e.target.value)}
                        placeholder="Full address"
                        required
                    />
                    {errors.address && <p className="text-[10px] text-red-500 font-medium">{errors.address}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 px-4 py-2 bg-black text-white hover:bg-black/90"
                    >
                        {isCreate ? "Create Supplier" : "Save Changes"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
}
