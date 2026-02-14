import { z } from "zod";

export const orderSchema = z.object({
    orderNumber: z.string().min(2, "Order number must be at least 2 characters"),
    orderDate: z
        .string()
        .refine((val) => !val || !Number.isNaN(Date.parse(val)), {
            message: "Invalid order date format",
        })
        .optional(),
    remarks: z.string().max(500).optional(),
    productType: z.enum(["FABRIC", "LABEL_TAG", "CARTON"]),
    buyerId: z.string().uuid("Invalid buyer ID"),
    companyProfileId: z.string().uuid("Invalid company profile ID"),
    status: z
        .enum(["DRAFT", "PENDING", "PROCESSING", "APPROVED", "DELIVERED", "CANCELLED"])
        .default("DRAFT"),
    deliveryDate: z
        .string()
        .refine((val) => !val || !Number.isNaN(Date.parse(val)), {
            message: "Invalid delivery date format",
        })
        .optional(),
}).strict();

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
