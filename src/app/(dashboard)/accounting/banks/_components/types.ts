import { z } from "zod";

// ── Bank Form Schema ────────────────────────────────────────────────────────
// Banks are sub-ledgers. They do NOT link to a specific AccountHead anymore.
// Transactions are tracked via JournalLine.bankId instead.

export const BankFormSchema = z.object({
    bankName: z.string().min(2, "Bank name must be at least 2 characters"),
    accountNumber: z.string().min(2, "Account number must be at least 2 characters"),
    branchName: z.string().optional(),
    swiftCode: z.string().optional(),
    routingNumber: z.string().optional(),
});

export type BankFormValues = z.infer<typeof BankFormSchema>;

export interface Bank {
    id: string;
    bankName: string;
    accountNumber: string;
    branchName: string | null;
    swiftCode: string | null;
    routingNumber: string | null;
    companyProfileId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
