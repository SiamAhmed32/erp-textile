import { z } from "zod";

export const SupplierFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),

    email: z.string().email("Invalid email address"),

    phone: z
      .string()
      .min(5, "Phone must be at least 5 characters")
      .max(20, "Phone must be at most 20 characters"),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must be at most 200 characters"),

    location: z
      .string()
      .min(2, "Location must be at least 2 characters")
      .max(100, "Location must be at most 100 characters"),

    supplierCode: z
      .string()
      .min(2, "Code must be at least 2 characters")
      .max(50, "Code must be at most 50 characters"),

    openingLiability: z.coerce
      .number()
      .min(0, "Liability cannot be negative"),
  })
  .strict();

export type SupplierFormData = z.infer<typeof SupplierFormSchema>;

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  supplierCode: string;
  openingLiability: number;
  userId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
