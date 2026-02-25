import { z } from "zod";

export const BankFormSchema = z.object({
    bankName: z.string().min(2, "Bank name must be at least 2 characters"),
    accountNumber: z.string().min(2, "Account number must be at least 2 characters"),
    branchName: z.string().optional(),
    swiftCode: z.string().optional(),
    routingNumber: z.string().optional(),
    accountHeadId: z.string().uuid("Invalid Account Head").nullable().optional(),
});

export type BankFormValues = z.infer<typeof BankFormSchema>;

export type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "INCOME" | "EXPENSE";


export interface AccountHead {
    id: string;
    name: string;
    code: string | null;
    type: AccountType;
    description: string | null;
    openingBalance: string;
    parentId: string | null;
    isControlAccount: boolean;
    companyProfileId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Bank {
    id: string;
    bankName: string;
    accountNumber: string;
    branchName: string | null;
    swiftCode: string | null;
    routingNumber: string | null;
    accountHeadId: string | null;
    companyProfileId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    accountHead?: AccountHead;
}

export interface BankFormData {
    bankName: string;
    accountNumber: string;
    branchName: string;
    swiftCode: string;
    routingNumber: string;
    accountHeadId: string | null;
    companyProfileId: string;
}
