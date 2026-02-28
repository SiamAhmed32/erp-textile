import { z } from "zod";

export const AccountHeaderFormSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters"),
        code: z
            .string()
            .max(50, "Code must be at most 50 characters")
            .optional(),
        type: z.enum(["ASSET", "LIABILITY", "INCOME", "EXPENSE", "EQUITY"]),
        description: z.string().max(200).optional(),
        parentId: z.string().uuid().nullable().optional(),
        isControlAccount: z.boolean().default(false).optional(),
    });

export type AccountHeaderFormData = z.infer<typeof AccountHeaderFormSchema>;

export interface AccountHeader {
    id: string;
    name: string;
    code: string;
    type: "ASSET" | "LIABILITY" | "INCOME" | "EXPENSE" | "EQUITY";
    description: string;
    openingBalance?: number;
    parentId: string | null;
    parent?: AccountHeader;
    isControlAccount: boolean;
    companyProfileId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
