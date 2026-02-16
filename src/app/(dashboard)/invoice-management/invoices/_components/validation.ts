import { z } from "zod";

export const invoiceSchema = z
    .object({
        piNumber: z.string().min(2, "PI number must be at least 2 characters"),
        date: z
            .string()
            .refine((val) => !Number.isNaN(Date.parse(val)), {
                message: "Invalid date format",
            }),
        orderId: z.string().uuid("Invalid order ID"),
        invoiceTermsId: z.string().uuid("Invalid invoice terms ID"),
        status: z.enum(["DRAFT", "SENT", "APPROVED", "CANCELLED"]).default("DRAFT"),
    })
    .strict();

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
