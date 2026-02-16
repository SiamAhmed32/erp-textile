import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Package,
  Truck,
  Plus,
  Trash2,
  Info,
  Layers,
  Tag,
  Box,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  CompanyProfile,
  Buyer,
  OrderFormData,
  ProductType,
  FabricItemData,
  LabelItemData,
  CartonItemData,
} from "./types";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Basic Info", icon: FileText, color: "text-blue-500" },
  { label: "Product Details", icon: Package, color: "text-amber-500" },
  { label: "Delivery", icon: Truck, color: "text-emerald-500" },
] as const;

type Props = {
  data: OrderFormData;
  buyers: Buyer[];
  companies: CompanyProfile[];
  activeStep: number;
  onStepChange: (index: number) => void;
  onChange: (field: keyof OrderFormData, value: any) => void;
  onNestedChange: (path: string, value: any) => void;
  onValidateStep?: (stepIndex: number) => boolean;
  errors?: Record<string, string>;
  disableProductType?: boolean;
  disableStatus?: boolean;
};

const OrderForm = ({
  data,
  buyers,
  companies,
  activeStep,
  onStepChange,
  onChange,
  onNestedChange,
  onValidateStep,
  errors,
  disableProductType,
  disableStatus,
}: Props) => {
  const getError = (path: string) => errors?.[path];

  const renderStepButtons = () => (
    <div className="my-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 text-foreground">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;

        return (
          <button
            key={step.label}
            type="button"
            onClick={() => {
              if (index > activeStep) {
                const isValid = onValidateStep?.(activeStep);
                if (isValid) onStepChange(index);
              } else {
                onStepChange(index);
              }
            }}
            className={cn(
              "flex w-full max-w-[240px] items-center justify-center space-x-3 rounded-full border px-6 py-2.5 transition-all duration-200",
              isActive
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-slate-200 bg-slate-100/80 text-muted-foreground hover:bg-slate-200",
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors duration-200",
                isActive
                  ? "bg-primary"
                  : isCompleted
                    ? "bg-emerald-500"
                    : "bg-muted-foreground/30",
              )}
            >
              {isCompleted ? "✓" : index + 1}
            </div>
            <span className="font-semibold">{step.label}</span>
          </button>
        );
      })}
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="overflow-hidden border-none shadow-premium bg-slate-50 ">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Info className="h-5 w-5 text-blue-500" />
            <span>Primary Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="orderNumber" className="text-sm font-semibold">
              Order Number *
            </Label>
            <Input
              id="orderNumber"
              placeholder="e.g. ORD-2024-001"
              value={data.orderNumber}
              onChange={(e) => onChange("orderNumber", e.target.value)}
              className={cn(
                "h-11 border-slate-200",
                getError("orderNumber") && "border-destructive",
              )}
            />
            {getError("orderNumber") && (
              <p className="text-xs font-medium text-destructive">
                {getError("orderNumber")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderDate" className="text-sm font-semibold">
              Order Date *
            </Label>
            <Input
              id="orderDate"
              type="date"
              value={data.orderDate}
              onChange={(e) => onChange("orderDate", e.target.value)}
              className="h-11 border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="status"
              className="text-sm font-semibold text-foreground"
            >
              Status *
            </Label>
            <Select
              value={data.status}
              onValueChange={(value) => onChange("status", value)}
              disabled={disableStatus}
            >
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "DRAFT",
                  "PENDING",
                  "PROCESSING",
                  "APPROVED",
                  "DELIVERED",
                  "CANCELLED",
                ].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("status") && (
              <p className="text-xs font-medium text-destructive">
                {getError("status")}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="productType"
              className="text-sm font-semibold text-foreground"
            >
              Category *
            </Label>
            <Select
              value={data.productType}
              onValueChange={(value) =>
                onChange("productType", value as ProductType)
              }
              disabled={disableProductType}
            >
              <SelectTrigger className="h-11 border-slate-200 bg-amber-50/30">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FABRIC" className="focus:bg-amber-50">
                  Fabric
                </SelectItem>
                <SelectItem value="LABEL_TAG" className="focus:bg-blue-50">
                  Label & Tag
                </SelectItem>
                <SelectItem value="CARTON" className="focus:bg-emerald-50">
                  Carton
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="buyerId"
              className="text-sm font-semibold text-foreground"
            >
              Select Buyer *
            </Label>
            <Select
              value={data.buyerId}
              onValueChange={(value) => onChange("buyerId", value)}
            >
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Select buyer" />
              </SelectTrigger>
              <SelectContent>
                {buyers.map((buyer) => (
                  <SelectItem key={buyer.id} value={buyer.id}>
                    {buyer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("buyerId") && (
              <p className="text-xs font-medium text-destructive">
                {getError("buyerId")}
              </p>
            )}
          </div>
          <div className="space-y-2 text-foreground">
            <Label htmlFor="companyProfileId" className="text-sm font-semibold">
              Manufacturing Company *
            </Label>
            <Select
              value={data.companyProfileId}
              onValueChange={(value) => onChange("companyProfileId", value)}
            >
              <SelectTrigger className="h-11 border-slate-200">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("companyProfileId") && (
              <p className="text-xs font-medium text-destructive">
                {getError("companyProfileId")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-premium bg-white">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <FileText className="h-5 w-5 text-slate-500" />
            <span>Additional Remarks</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            placeholder="Enter any special instructions or notes here..."
            value={data.remarks}
            onChange={(e) => onChange("remarks", e.target.value)}
            rows={4}
            className="border-slate-200 focus-visible:ring-primary"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          size="lg"
          onClick={() => {
            const isValid = onValidateStep?.(0);
            if (isValid) onStepChange(1);
          }}
          className="px-8 shadow-md"
        >
          Next: Product Details
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderProductDetails = () => {
    if (data.productType === "FABRIC") {
      const rows = data.orderItems.fabricItem?.fabricItemData || [];
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="overflow-hidden border-none shadow-premium bg-amber-100/40">
            <CardHeader className=" border-b border-amber-200/50">
              <CardTitle className="flex items-center space-x-2 text-xl text-amber-900">
                <Layers className="h-5 w-5" />
                <span>Fabric Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Style No *</Label>
                  <Input
                    value={data.orderItems.fabricItem?.styleNo || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.fabricItem.styleNo",
                        e.target.value,
                      )
                    }
                    className={cn(
                      "bg-white border-amber-200",
                      getError("orderItems.orderItems.fabricItem.styleNo") &&
                        "border-destructive",
                    )}
                  />
                  {getError("orderItems.orderItems.fabricItem.styleNo") && (
                    <p className="text-xs text-destructive">
                      {getError("orderItems.orderItems.fabricItem.styleNo")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Description</Label>
                  <Input
                    value={data.orderItems.fabricItem?.discription || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.fabricItem.discription",
                        e.target.value,
                      )
                    }
                    className="bg-white border-amber-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Width *
                  </Label>
                  <Input
                    value={data.orderItems.fabricItem?.width || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.fabricItem.width",
                        e.target.value,
                      )
                    }
                    className="bg-white border-amber-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Total Net Weight
                  </Label>
                  <Input
                    type="number"
                    value={data.orderItems.fabricItem?.totalNetWeight || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.fabricItem.totalNetWeight",
                        e.target.value,
                      )
                    }
                    className="bg-white border-amber-200"
                  />
                </div>
                <div className="space-y-2 text-foreground">
                  <Label className="text-sm font-semibold text-foreground">
                    Total Gross Weight
                  </Label>
                  <Input
                    type="number"
                    value={data.orderItems.fabricItem?.totalGrossWeight || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.fabricItem.totalGrossWeight",
                        e.target.value,
                      )
                    }
                    className="bg-white border-amber-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Total Quantity (Yds)
                  </Label>
                  <Input
                    type="number"
                    value={data.orderItems.fabricItem?.totalQuantityYds || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.fabricItem.totalQuantityYds",
                        e.target.value,
                      )
                    }
                    className="bg-white border-amber-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Total Unit Price
                  </Label>
                  <Input
                    type="number"
                    value={data.orderItems.fabricItem?.totalUnitPrice || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.fabricItem.totalUnitPrice",
                        e.target.value,
                      )
                    }
                    className="bg-white border-amber-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Total Amount
                  </Label>
                  <Input
                    type="number"
                    value={data.orderItems.fabricItem?.totalAmount || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.fabricItem.totalAmount",
                        e.target.value,
                      )
                    }
                    className="bg-white border-amber-200 font-bold text-amber-700"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-amber-600" />
                    <h3 className="font-bold text-amber-900">
                      Color Variants & Quantities
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-amber-500 text-amber-700 hover:bg-amber-100"
                    onClick={() => {
                      const next: FabricItemData[] = [
                        ...rows,
                        {
                          color: "",
                          netWeight: "",
                          grossWeight: "",
                          quantityYds: "",
                          unitPrice: "",
                          totalAmount: "",
                        },
                      ];
                      onNestedChange(
                        "orderItems.fabricItem.fabricItemData",
                        next,
                      );
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant
                  </Button>
                </div>
                <div className="grid gap-4">
                  {rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-amber-200 rounded-lg bg-amber-50/50">
                      <p className="text-sm text-amber-600 font-medium">
                        No variants added yet. Click "Add Variant" to start.
                      </p>
                    </div>
                  ) : (
                    rows.map((row, index) => (
                      <div
                        key={index}
                        className="group relative grid gap-4 rounded-xl border border-amber-200 bg-white p-5 shadow-sm transition-all hover:shadow-md md:grid-cols-2 lg:grid-cols-6 items-end"
                      >
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Color
                          </Label>
                          <Input
                            placeholder="Color"
                            value={row.color || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.fabricItem.fabricItemData.${index}.color`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Net Wt
                          </Label>
                          <Input
                            placeholder="Net"
                            type="number"
                            value={row.netWeight || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.fabricItem.fabricItemData.${index}.netWeight`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Gross Wt
                          </Label>
                          <Input
                            placeholder="Gross"
                            type="number"
                            value={row.grossWeight || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.fabricItem.fabricItemData.${index}.grossWeight`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Qty (Yds)
                          </Label>
                          <Input
                            placeholder="Qty"
                            type="number"
                            value={row.quantityYds || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.fabricItem.fabricItemData.${index}.quantityYds`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Unit Price
                          </Label>
                          <Input
                            placeholder="Price"
                            type="number"
                            value={row.unitPrice || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.fabricItem.fabricItemData.${index}.unitPrice`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Total
                          </Label>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Total"
                              type="number"
                              value={row.totalAmount || ""}
                              onChange={(e) =>
                                onNestedChange(
                                  `orderItems.fabricItem.fabricItemData.${index}.totalAmount`,
                                  e.target.value,
                                )
                              }
                              className="bg-slate-50 font-semibold"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-red-50"
                              onClick={() => {
                                const next = rows.filter((_, i) => i !== index);
                                onNestedChange(
                                  "orderItems.fabricItem.fabricItemData",
                                  next,
                                );
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (data.productType === "LABEL_TAG") {
      const rows = data.orderItems.labelItem?.labelItemData || [];
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="overflow-hidden border-none shadow-premium bg-blue-50/30">
            <CardHeader className="bg-blue-100/50 border-b border-blue-200/50">
              <CardTitle className="flex items-center space-x-2 text-xl text-blue-900">
                <Tag className="h-5 w-5" />
                <span>Label & Tag Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Style No *</Label>
                  <Input
                    value={data.orderItems.labelItem?.styleNo || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.labelItem.styleNo",
                        e.target.value,
                      )
                    }
                    className={cn(
                      "bg-white border-blue-200",
                      getError("orderItems.orderItems.labelItem.styleNo") &&
                        "border-destructive",
                    )}
                  />
                  {getError("orderItems.orderItems.labelItem.styleNo") && (
                    <p className="text-xs text-destructive">
                      {getError("orderItems.orderItems.labelItem.styleNo")}
                    </p>
                  )}
                </div>
                {/* Add other summary fields here... abbreviated for length but following same pattern */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Total Amount
                  </Label>
                  <Input
                    type="number"
                    value={data.orderItems.labelItem?.totalAmount || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.labelItem.totalAmount",
                        e.target.value,
                      )
                    }
                    className="bg-white border-blue-200 font-bold text-blue-700"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200/50 pb-2">
                  <div className="flex items-center space-x-2">
                    <Box className="h-4 w-4 text-blue-600" />
                    <h3 className="font-bold text-blue-900">
                      Item Specifications
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-blue-500 text-blue-700 hover:bg-blue-100"
                    onClick={() => {
                      const next: LabelItemData[] = [
                        ...rows,
                        {
                          desscription: "",
                          color: "",
                          netWeight: "",
                          grossWeight: "",
                          quantityDzn: "",
                          quantityPcs: "",
                          unitPrice: "",
                          totalAmount: "",
                        },
                      ];
                      onNestedChange(
                        "orderItems.labelItem.labelItemData",
                        next,
                      );
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                <div className="grid gap-4">
                  {rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/50">
                      <p className="text-sm text-blue-600 font-medium">
                        No items added yet.
                      </p>
                    </div>
                  ) : (
                    rows.map((row, index) => (
                      <div
                        key={index}
                        className="group relative grid gap-4 rounded-xl border border-blue-200 bg-white p-5 shadow-sm transition-all hover:shadow-md md:grid-cols-2 lg:grid-cols-8 items-end"
                      >
                        <div className="lg:col-span-2 space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Desscription
                          </Label>
                          <Input
                            placeholder="Desscription"
                            value={row.desscription || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.labelItem.labelItemData.${index}.desscription`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Color
                          </Label>
                          <Input
                            placeholder="Color"
                            value={row.color || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.labelItem.labelItemData.${index}.color`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        {/* ... other fields ... */}
                        <div className="space-y-2 lg:col-start-8">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Action
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-destructive hover:bg-red-50"
                            onClick={() => {
                              const next = rows.filter((_, i) => i !== index);
                              onNestedChange(
                                "orderItems.labelItem.labelItemData",
                                next,
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (data.productType === "CARTON") {
      const rows = data.orderItems.cartonItem?.cartonItemData || [];
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="overflow-hidden border-none shadow-premium bg-emerald-50/30">
            <CardHeader className="border-b border-emerald-200/50">
              <CardTitle className="flex items-center space-x-2 text-xl text-emerald-900">
                <Box className="h-5 w-5" />
                <span>Carton Packaging Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Order No *</Label>
                  <Input
                    value={data.orderItems.cartonItem?.orderNo || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.cartonItem.orderNo",
                        e.target.value,
                      )
                    }
                    className={cn(
                      "bg-white border-emerald-200",
                      getError("orderItems.orderItems.cartonItem.orderNo") &&
                        "border-destructive",
                    )}
                  />
                  {getError("orderItems.orderItems.cartonItem.orderNo") && (
                    <p className="text-xs text-destructive">
                      {getError("orderItems.orderItems.cartonItem.orderNo")}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Total Carton Qty
                  </Label>
                  <Input
                    type="number"
                    value={data.orderItems.cartonItem?.totalcartonQty || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.cartonItem.totalcartonQty",
                        e.target.value,
                      )
                    }
                    className="bg-white border-emerald-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Total Amount
                  </Label>
                  <Input
                    type="number"
                    value={data.orderItems.cartonItem?.totalAmount || ""}
                    onChange={(e) =>
                      onNestedChange(
                        "orderItems.cartonItem.totalAmount",
                        e.target.value,
                      )
                    }
                    className="bg-white border-emerald-200 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/50 pb-2">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-emerald-600" />
                    <h3 className="font-bold text-emerald-900">
                      Carton Item Breakdown
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-emerald-500 text-emerald-700 hover:bg-emerald-100"
                    onClick={() => {
                      const next: CartonItemData[] = [
                        ...rows,
                        {
                          cartonMeasurement: "",
                          cartonPly: "",
                          cartonQty: "",
                          netWeight: "",
                          grossWeight: "",
                          unit: "",
                          unitPrice: "",
                          totalAmount: "",
                        },
                      ];
                      onNestedChange(
                        "orderItems.cartonItem.cartonItemData",
                        next,
                      );
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Size
                  </Button>
                </div>
                <div className="grid gap-4">
                  {rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-emerald-200 rounded-lg bg-emerald-50/50">
                      <p className="text-sm text-emerald-600 font-medium">
                        Add carton sizes to continue.
                      </p>
                    </div>
                  ) : (
                    rows.map((row, index) => (
                      <div
                        key={index}
                        className="group relative grid gap-4 rounded-xl border border-emerald-200 bg-white p-5 shadow-sm transition-all hover:shadow-md md:grid-cols-2 lg:grid-cols-8 items-end"
                      >
                        <div className="lg:col-span-2 space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Measurement
                          </Label>
                          <Input
                            placeholder="e.g. 24x18x12"
                            value={row.cartonMeasurement || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.cartonItem.cartonItemData.${index}.cartonMeasurement`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Ply
                          </Label>
                          <Input
                            placeholder="e.g. 5 Ply"
                            value={row.cartonPly || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.cartonItem.cartonItemData.${index}.cartonPly`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2 text-foreground">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Qty
                          </Label>
                          <Input
                            placeholder="Qty"
                            type="number"
                            value={row.cartonQty || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.cartonItem.cartonItemData.${index}.cartonQty`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Unit
                          </Label>
                          <Input
                            placeholder="PCS"
                            value={row.unit || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.cartonItem.cartonItemData.${index}.unit`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 uppercase">
                            Price
                          </Label>
                          <Input
                            placeholder="Price"
                            type="number"
                            value={row.unitPrice || ""}
                            onChange={(e) =>
                              onNestedChange(
                                `orderItems.cartonItem.cartonItemData.${index}.unitPrice`,
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="lg:col-span-2 flex space-x-2 items-end">
                          <div className="flex-1 space-y-2">
                            <Label className="text-xs font-bold text-slate-500 uppercase">
                              Total Amount
                            </Label>
                            <Input
                              placeholder="Total"
                              type="number"
                              value={row.totalAmount || ""}
                              onChange={(e) =>
                                onNestedChange(
                                  `orderItems.cartonItem.cartonItemData.${index}.totalAmount`,
                                  e.target.value,
                                )
                              }
                              className="bg-slate-50"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-red-50 mb-0.5"
                            onClick={() => {
                              const next = rows.filter((_, i) => i !== index);
                              onNestedChange(
                                "orderItems.cartonItem.cartonItemData",
                                next,
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  const renderDelivery = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="overflow-hidden border-none shadow-premium bg-white">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Truck className="h-5 w-5 text-emerald-500" />
            <span>Delivery Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:w-1/2">
          <div className="space-y-2">
            <Label htmlFor="deliveryDate" className="text-sm font-semibold">
              Expected Delivery Date *
            </Label>
            <Input
              id="deliveryDate"
              type="date"
              value={data.deliveryDate}
              onChange={(e) => onChange("deliveryDate", e.target.value)}
              className="h-11 border-slate-200"
            />
            {getError("deliveryDate") && (
              <p className="text-xs font-medium text-destructive">
                {getError("deliveryDate")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-start pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onStepChange(1)}
          className="px-8"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Details
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 lg:pb-20">
      {renderStepButtons()}
      <div className="min-h-[400px]">
        {activeStep === 0 && renderBasicInfo()}
        {activeStep === 1 && renderProductDetails()}
        {activeStep === 2 && renderDelivery()}
      </div>
    </div>
  );
};

export default OrderForm;
