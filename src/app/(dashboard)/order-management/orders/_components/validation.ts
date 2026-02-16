import { z } from "zod";

/**
 * Helper to convert strings from inputs to numbers for Zod validation
 */
const stringToNumber = (val: any) => {
  if (typeof val === "number") return val;
  if (!val || typeof val !== "string") return undefined;
  const num = parseFloat(val);
  return isNaN(num) ? undefined : num;
};

export const OrderValidation = {
  // ================= CREATE ORDER =================
  create: z
    .object({
      orderNumber: z
        .string()
        .min(2, "Order number must be at least 2 characters"),

      orderDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid order date format",
      }),

      remarks: z.string().max(500).optional(),

      productType: z.enum(["FABRIC", "LABEL_TAG", "CARTON"]),

      buyerId: z.string().uuid("Invalid buyer ID"),
      userId: z.string().uuid("Invalid user ID").optional(),
      companyProfileId: z.string().uuid("Invalid company profile ID"),

      status: z
        .enum([
          "DRAFT",
          "PENDING",
          "PROCESSING",
          "APPROVED",
          "DELIVERED",
          "CANCELLED",
        ])
        .optional()
        .default("DRAFT"),

      deliveryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid delivery date format",
      }),

      orderItems: z
        .object({
          fabricItem: z
            .object({
              styleNo: z.string().min(1, "Style No is required"),
              discription: z.string().optional(),
              width: z.string().min(1, "Width is required"),
              fabricItemData: z
                .array(
                  z.object({
                    color: z.string().optional(),
                    netWeight: z.coerce.number().optional(),
                    grossWeight: z.coerce.number().optional(),
                    quantityYds: z.coerce.number().optional(),
                    unitPrice: z.coerce.number().optional(),
                  }),
                )
                .optional(),
            })
            .optional(),

          labelItem: z
            .object({
              styleNo: z.string().min(1, "Style No is required"),
              labelItemData: z
                .array(
                  z.object({
                    desscription: z.string().optional(),
                    color: z.string().optional(),
                    netWeight: z.coerce.number().optional(),
                    grossWeight: z.coerce.number().optional(),
                    quantityDzn: z.coerce.number().optional(),
                    quantityPcs: z.coerce.number().optional(),
                    unitPrice: z.coerce.number().optional(),
                  }),
                )
                .optional(),
            })
            .optional(),

          cartonItem: z
            .object({
              orderNo: z.string().min(1, "Order No is required"),
              cartonItemData: z
                .array(
                  z.object({
                    cartonMeasurement: z.string().optional(),
                    cartonPly: z.string().optional(),
                    cartonQty: z.coerce.number().optional(),
                    netWeight: z.coerce.number().optional(),
                    grossWeight: z.coerce.number().optional(),
                    unit: z.string().optional(),
                    unitPrice: z.coerce.number().optional(),
                  }),
                )
                .optional(),
            })
            .optional(),
        })
        .optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      // Conditional validation based on productType
      if (data.productType === "FABRIC") {
        if (!data.orderItems?.fabricItem) {
          ctx.addIssue({
            code: "custom",
            path: ["orderItems", "fabricItem"],
            message: "Fabric details are required",
          });
        } else {
          if (!data.orderItems.fabricItem.styleNo || data.orderItems.fabricItem.styleNo.trim() === "") {
            ctx.addIssue({
              code: "custom",
              path: ["orderItems", "fabricItem", "styleNo"],
              message: "Style No is required",
            });
          }
          if (!data.orderItems.fabricItem.width || data.orderItems.fabricItem.width.trim() === "") {
            ctx.addIssue({
              code: "custom",
              path: ["orderItems", "fabricItem", "width"],
              message: "Width is required",
            });
          }
        }
      }

      if (data.productType === "LABEL_TAG") {
        if (!data.orderItems?.labelItem) {
          ctx.addIssue({
            code: "custom",
            path: ["orderItems", "labelItem"],
            message: "Label details are required",
          });
        } else {
          if (!data.orderItems.labelItem.styleNo || data.orderItems.labelItem.styleNo.trim() === "") {
            ctx.addIssue({
              code: "custom",
              path: ["orderItems", "labelItem", "styleNo"],
              message: "Style No is required",
            });
          }
        }
      }

      if (data.productType === "CARTON") {
        if (!data.orderItems?.cartonItem) {
          ctx.addIssue({
            code: "custom",
            path: ["orderItems", "cartonItem"],
            message: "Carton details are required",
          });
        } else {
          if (!data.orderItems.cartonItem.orderNo || data.orderItems.cartonItem.orderNo.trim() === "") {
            ctx.addIssue({
              code: "custom",
              path: ["orderItems", "cartonItem", "orderNo"],
              message: "Order No is required",
            });
          }
        }
      }
    }),

  // ================= UPDATE ORDER =================
  update: z
    .object({
      orderNumber: z.string().min(2).optional(),

      orderDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid order date format",
        })
        .optional(),

      remarks: z.string().max(500).optional(),

      productType: z.enum(["FABRIC", "LABEL_TAG", "CARTON"]).optional(),

      buyerId: z.string().uuid().optional(),
      userId: z.string().uuid().optional(),
      companyProfileId: z.string().uuid().optional(),

      status: z
        .enum([
          "DRAFT",
          "PENDING",
          "PROCESSING",
          "APPROVED",
          "DELIVERED",
          "CANCELLED",
        ])
        .optional(),

      deliveryDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid delivery date format",
        })
        .optional(),

      orderItems: z.any().optional(),
      isDeleted: z.boolean().optional(),
      deletedAt: z.date().nullable().optional(),
    })
    .strict(),

  // ================= PARAMS =================
  params: {
    id: z.object({
      id: z.string().uuid("Invalid order ID"),
    }),
  },

  // ================= QUERY =================
  query: {
    list: z.object({
      page: z.preprocess(
        (val) => stringToNumber(val) || 1,
        z.number().int().min(1).default(1),
      ),
      limit: z.preprocess((val) => {
        const num = stringToNumber(val) || 10;
        return Math.min(Math.max(num, 1), 100);
      }, z.number().int().min(1).max(100).default(10)),
      search: z.string().optional(),
      status: z
        .enum([
          "DRAFT",
          "PENDING",
          "PROCESSING",
          "APPROVED",
          "DELIVERED",
          "CANCELLED",
        ])
        .optional(),
      isDeleted: z.boolean().optional(),
      isInvoice: z.boolean().optional(),
      isLc: z.boolean().optional(),
      productType: z.enum(["FABRIC", "LABEL_TAG", "CARTON"]).optional(),
      sortBy: z
        .enum(["orderNumber", "orderDate", "createdAt"])
        .default("createdAt"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }),
  },
};

// ================= TYPES =================
export type CreateOrderInput = z.infer<typeof OrderValidation.create>;
export type UpdateOrderInput = z.infer<typeof OrderValidation.update>;
export type OrderIdParams = z.infer<typeof OrderValidation.params.id>;
export type ListOrderQueryDto = z.infer<typeof OrderValidation.query.list>;

// Helper for form errors
export const toFieldErrors = (issues: z.ZodIssue[]) => {
  const errors: Record<string, string> = {};
  issues.forEach((issue) => {
    const key = issue.path.join(".");
    errors[key] = issue.message;
  });
  return errors;
};
