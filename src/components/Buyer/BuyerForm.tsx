import React from "react";
import { CustomModal, InputField } from "@/components/reusables";
import { BuyerFormData } from "./types";

export type BuyerFormMode = "create" | "edit";

type Props = {
  open: boolean;
  mode: BuyerFormMode;
  data: BuyerFormData;
  onClose: () => void;
  onChange: (field: keyof BuyerFormData, value: string) => void;
  onSubmit: () => void;
};

export function BuyerForm({
  open,
  mode,
  data,
  onClose,
  onChange,
  onSubmit,
}: Props) {
  const isCreate = mode === "create";
  const title = isCreate ? "Add New Buyer" : "Edit Buyer Profile";
  const description = isCreate
    ? "Create a buyer profile to track orders, communication, and compliance."
    : "Update buyer information to keep records accurate and consistent.";

  return (
    <CustomModal
      open={open}
      onOpenChange={(value) => !value && onClose()}
      title={title}
      maxWidth="600px"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-500 mb-4">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Buyer Name"
            name="name"
            value={data.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Buyer name"
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="buyer@example.com"
            required
          />
          <InputField
            label="Merchandiser"
            name="merchandiser"
            value={data.merchandiser}
            onChange={(e) => onChange("merchandiser", e.target.value)}
            placeholder="Merchandiser name"
            required
          />
          <InputField
            label="Phone"
            name="phone"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+880..."
            required
          />
          <InputField
            label="Location"
            name="location"
            value={data.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="Dhaka"
            required
          />
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
            type="button"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-9 px-4 py-2 bg-black text-white hover:bg-black/90"
            onClick={onSubmit}
          >
            {isCreate ? "Create Buyer" : "Save Changes"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
}
