import { z } from "zod";

export const lcSchema = z.object({
  bblcNumber: z.string().min(2, "BBLC number must be at least 2 characters"),
  dateOfOpening: z.string().min(1, "Date of opening is required"),
  notifyParty: z.string().max(255).optional(),
  lcIssueBankName: z.string().min(2, "Bank name is required"),
  lcIssueBankBranch: z.string().min(2, "Bank branch is required"),
  destination: z.string().max(255).optional(),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  invoiceId: z.string().uuid("Please select an invoice"),
});

export type LCFormData = z.infer<typeof lcSchema>;

export const toFieldErrors = (issues: z.ZodIssue[]) => {
  const errors: Record<string, string> = {};
  issues.forEach((issue) => {
    const path = issue.path[0] as string;
    errors[path] = issue.message;
  });
  return errors;
};
