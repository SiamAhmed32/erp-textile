import { z } from "zod";

export const BuyerFormSchema = z
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

        merchandiser: z
            .string()
            .min(2, "Merchandiser must be at least 2 characters")
            .max(100, "Merchandiser must be at most 100 characters"),
    })
    .strict();

export type BuyerFormData = z.infer<typeof BuyerFormSchema>;

export interface Buyer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    location: string;
    merchandiser: string;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}
