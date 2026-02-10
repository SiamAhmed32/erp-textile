import { z } from "zod";

export const companyProfileSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    address: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    email: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Enter a valid email address."),
    website: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || /^(https?:\/\/).+/i.test(value), "Enter a valid website URL (https://...)."),
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
    companyType: z.string().trim().min(1, "Select a company type."),
    taxId: z.string().trim().optional(),
    registrationNumber: z.string().trim().optional(),
    tradeLicenseNumber: z.string().trim().optional(),
    tradeLicenseExpiryDate: z
        .string()
        .trim()
        .optional()
        .refine((value) => !value || !Number.isNaN(Date.parse(value)), "Invalid date."),
    bankName: z.string().trim().optional(),
    bankAccountNumber: z.string().trim().optional(),
    branchName: z.string().trim().optional(),
    routingNumber: z.string().trim().optional(),
    swiftCode: z.string().trim().optional(),
    status: z.string().trim().min(1, "Select a status."),
});

export type CompanyProfileValidation = z.infer<typeof companyProfileSchema>;

export const toFieldErrors = (issues: z.ZodIssue[]) => {
    const errors: Record<string, string> = {};
    issues.forEach((issue) => {
        const key = issue.path?.[0];
        if (typeof key === "string") {
            errors[key] = issue.message;
        }
    });
    return errors;
};
