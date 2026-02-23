import { z } from "zod";

export const AccountHeaderFormSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be at most 100 characters"),
        code: z
            .string()
            .min(2, "Code must be at least 2 characters")
            .max(50, "Code must be at most 50 characters"),
        type: z.enum(["ASSET", "LIABILITY", "REVENUE", "EXPENSE", "EQUITY"]),
        description: z.string().max(200).optional(),
        openingBalance: z.number().min(0, "Opening balance cannot be negative"),
    });

export type AccountHeaderFormData = z.infer<typeof AccountHeaderFormSchema>;

export interface AccountHeader {
    id: string;
    name: string;
    code: string;
    type: "ASSET" | "LIABILITY" | "REVENUE" | "EXPENSE" | "EQUITY";
    description: string;
    openingBalance: number;
    companyProfileId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    companyProfile?: {
        id: string;
        name: string;
        [key: string]: any;
    };
}
