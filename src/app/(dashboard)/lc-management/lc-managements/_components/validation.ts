import { z } from "zod";

export const lcSchema = z.object({
  bblcNumber: z.string().min(2, "BBLC number is required"),

  dateOfOpening: z.string().min(1, "Date of opening is required"),

  notifyParty: z.string().min(1, "Notify party is required").max(255),

  lcIssueBankName: z.string().min(2, "Bank name is required"),

  lcIssueBankBranch: z.string().min(2, "Bank branch is required"),

  destination: z.string().min(1, "Destination is required").max(255),

  exportLcNo: z.string().min(2, "Export LC No is required"),

  exportLcDate: z.string().min(1, "Export LC Date is required"),

  binNo: z.string().min(2, "BIN No is required"),

  hsCodeNo: z.string().min(2, "HS Code No is required"),

  remarks: z.string().min(1, "Remarks is required"),

  carrier: z.string().min(1, "Carrier is required"),

  salesTerm: z.string().min(1, "Sales term is required"),

  issueDate: z.string().min(1, "Issue date is required"),

  expiryDate: z.string().min(1, "Expiry date is required"),

  amount: z.coerce.number().positive("Amount must be greater than 0"),

  challanNo: z.string().min(1, "Challan No is required"),

  transportMode: z.string().min(1, "Transport mode is required"),

  vehicleNo: z.string().min(1, "Vehicle No is required"),

  driverName: z.string().min(1, "Driver name is required"),

  contactNo: z.string().min(5, "Contact No is required"),

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
