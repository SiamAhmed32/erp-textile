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
    CompanyProfile,
    Buyer,
    OrderFormData,
    ProductType,
    FabricItemData,
    LabelItemData,
    CartonItemData,
} from "./types";

const steps = ["Basic Info", "Product Details", "Delivery"] as const;

type Props = {
    data: OrderFormData;
    buyers: Buyer[];
    companies: CompanyProfile[];
    activeStep: number;
    onStepChange: (index: number) => void;
    onChange: (field: keyof OrderFormData, value: any) => void;
    onNestedChange: (path: string, value: any) => void;
    errors?: Partial<Record<keyof OrderFormData, string>>;
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
    errors,
    disableProductType,
    disableStatus,
}: Props) => {
    const renderStepButtons = () => (
        <div className="flex flex-wrap gap-2 mt-4">
            {steps.map((label, index) => (
                <Button
                    key={label}
                    type="button"
                    variant={index === activeStep ? "default" : "outline"}
                    onClick={() => onStepChange(index)}
                >
                    {label}
                </Button>
            ))}
        </div>
    );

    const renderBasicInfo = () => (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Info</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="orderNumber">Order Number *</Label>
                        <Input
                            id="orderNumber"
                            value={data.orderNumber}
                            onChange={(e) => onChange("orderNumber", e.target.value)}
                        />
                        {errors?.orderNumber && (
                            <p className="text-xs text-destructive">{errors.orderNumber}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="orderDate">Order Date</Label>
                        <Input
                            id="orderDate"
                            type="date"
                            value={data.orderDate}
                            onChange={(e) => onChange("orderDate", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            value={data.status}
                            onValueChange={(value) => onChange("status", value)}
                            disabled={disableStatus}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {["DRAFT", "PENDING", "PROCESSING", "APPROVED", "DELIVERED", "CANCELLED"].map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors?.status && (
                            <p className="text-xs text-destructive">{errors.status}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="productType">Product Type *</Label>
                        <Select
                            value={data.productType}
                            onValueChange={(value) => onChange("productType", value as ProductType)}
                            disabled={disableProductType}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select product type" />
                            </SelectTrigger>
                            <SelectContent>
                                {(["FABRIC", "LABEL_TAG", "CARTON"] as ProductType[]).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors?.productType && (
                            <p className="text-xs text-destructive">{errors.productType}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="buyerId">Buyer *</Label>
                        <Select value={data.buyerId} onValueChange={(value) => onChange("buyerId", value)}>
                            <SelectTrigger>
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
                        {errors?.buyerId && (
                            <p className="text-xs text-destructive">{errors.buyerId}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="companyProfileId">Company *</Label>
                        <Select value={data.companyProfileId} onValueChange={(value) => onChange("companyProfileId", value)}>
                            <SelectTrigger>
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
                        {errors?.companyProfileId && (
                            <p className="text-xs text-destructive">{errors.companyProfileId}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Remarks</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        value={data.remarks}
                        onChange={(e) => onChange("remarks", e.target.value)}
                        rows={4}
                    />
                </CardContent>
            </Card>
        </div>
    );

    const renderProductDetails = () => {
        if (data.productType === "FABRIC") {
            const rows = data.orderItems.fabricItem?.fabricItemData || [];
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Fabric Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Style No *</Label>
                                <Input
                                    value={data.orderItems.fabricItem?.styleNo || ""}
                                    onChange={(e) => onNestedChange("orderItems.fabricItem.styleNo", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    value={data.orderItems.fabricItem?.discription || ""}
                                    onChange={(e) => onNestedChange("orderItems.fabricItem.discription", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Width</Label>
                                <Input
                                    value={data.orderItems.fabricItem?.width || ""}
                                    onChange={(e) => onNestedChange("orderItems.fabricItem.width", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Net Weight</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.fabricItem?.totalNetWeight || ""}
                                    onChange={(e) => onNestedChange("orderItems.fabricItem.totalNetWeight", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Gross Weight</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.fabricItem?.totalGrossWeight || ""}
                                    onChange={(e) => onNestedChange("orderItems.fabricItem.totalGrossWeight", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Quantity (Yds)</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.fabricItem?.totalQuantityYds || ""}
                                    onChange={(e) => onNestedChange("orderItems.fabricItem.totalQuantityYds", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Unit Price</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.fabricItem?.totalUnitPrice || ""}
                                    onChange={(e) => onNestedChange("orderItems.fabricItem.totalUnitPrice", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Amount</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.fabricItem?.totalAmount || ""}
                                    onChange={(e) => onNestedChange("orderItems.fabricItem.totalAmount", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Fabric Item Details</Label>
                                <Button
                                    type="button"
                                    variant="outline"
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
                                        onNestedChange("orderItems.fabricItem.fabricItemData", next);
                                    }}
                                >
                                    Add Row
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {rows.map((row, index) => (
                                    <div
                                        key={index}
                                        className="grid gap-3 rounded-md border p-3 md:grid-cols-2 lg:grid-cols-6"
                                    >
                                        <Input
                                            placeholder="Color"
                                            value={row.color || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.fabricItem.fabricItemData.${index}.color`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Net Weight"
                                            type="number"
                                            value={row.netWeight || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.fabricItem.fabricItemData.${index}.netWeight`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Gross Weight"
                                            type="number"
                                            value={row.grossWeight || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.fabricItem.fabricItemData.${index}.grossWeight`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Qty (Yds)"
                                            type="number"
                                            value={row.quantityYds || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.fabricItem.fabricItemData.${index}.quantityYds`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Unit Price"
                                            type="number"
                                            value={row.unitPrice || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.fabricItem.fabricItemData.${index}.unitPrice`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Total"
                                            type="number"
                                            value={row.totalAmount || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.fabricItem.fabricItemData.${index}.totalAmount`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div className="lg:col-span-6">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="text-destructive"
                                                onClick={() => {
                                                    const next = rows.filter((_, i) => i !== index);
                                                    onNestedChange("orderItems.fabricItem.fabricItemData", next);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        if (data.productType === "LABEL_TAG") {
            const rows = data.orderItems.labelItem?.labelItemData || [];
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Label Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label>Style No *</Label>
                                <Input
                                    value={data.orderItems.labelItem?.styleNo || ""}
                                    onChange={(e) => onNestedChange("orderItems.labelItem.styleNo", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Net Weight</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.labelItem?.netWeightTotal || ""}
                                    onChange={(e) => onNestedChange("orderItems.labelItem.netWeightTotal", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Gross Weight</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.labelItem?.grossWeightTotal || ""}
                                    onChange={(e) => onNestedChange("orderItems.labelItem.grossWeightTotal", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Qty (Dzn)</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.labelItem?.quantityDznTotal || ""}
                                    onChange={(e) => onNestedChange("orderItems.labelItem.quantityDznTotal", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Qty (Pcs)</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.labelItem?.quantityPcsTotal || ""}
                                    onChange={(e) => onNestedChange("orderItems.labelItem.quantityPcsTotal", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Unit Price</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.labelItem?.unitPriceTotal || ""}
                                    onChange={(e) => onNestedChange("orderItems.labelItem.unitPriceTotal", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Total Amount</Label>
                                <Input
                                    type="number"
                                    value={data.orderItems.labelItem?.totalAmount || ""}
                                    onChange={(e) => onNestedChange("orderItems.labelItem.totalAmount", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Label Item Details</Label>
                                <Button
                                    type="button"
                                    variant="outline"
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
                                        onNestedChange("orderItems.labelItem.labelItemData", next);
                                    }}
                                >
                                    Add Row
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {rows.map((row, index) => (
                                    <div
                                        key={index}
                                        className="grid gap-3 rounded-md border p-3 md:grid-cols-2 lg:grid-cols-8"
                                    >
                                        <Input
                                            placeholder="Description"
                                            value={row.desscription || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.labelItem.labelItemData.${index}.desscription`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Color"
                                            value={row.color || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.labelItem.labelItemData.${index}.color`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Net"
                                            type="number"
                                            value={row.netWeight || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.labelItem.labelItemData.${index}.netWeight`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Gross"
                                            type="number"
                                            value={row.grossWeight || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.labelItem.labelItemData.${index}.grossWeight`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Qty Dzn"
                                            type="number"
                                            value={row.quantityDzn || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.labelItem.labelItemData.${index}.quantityDzn`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Qty Pcs"
                                            type="number"
                                            value={row.quantityPcs || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.labelItem.labelItemData.${index}.quantityPcs`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Unit Price"
                                            type="number"
                                            value={row.unitPrice || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.labelItem.labelItemData.${index}.unitPrice`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Input
                                            placeholder="Total"
                                            type="number"
                                            value={row.totalAmount || ""}
                                            onChange={(e) =>
                                                onNestedChange(
                                                    `orderItems.labelItem.labelItemData.${index}.totalAmount`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div className="lg:col-span-8">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="text-destructive"
                                                onClick={() => {
                                                    const next = rows.filter((_, i) => i !== index);
                                                    onNestedChange("orderItems.labelItem.labelItemData", next);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        const rows = data.orderItems.cartonItem?.cartonItemData || [];
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Carton Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Order No *</Label>
                            <Input
                                value={data.orderItems.cartonItem?.orderNo || ""}
                                onChange={(e) => onNestedChange("orderItems.cartonItem.orderNo", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Carton Qty</Label>
                            <Input
                                type="number"
                                value={data.orderItems.cartonItem?.totalcartonQty || ""}
                                onChange={(e) => onNestedChange("orderItems.cartonItem.totalcartonQty", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Net Weight</Label>
                            <Input
                                type="number"
                                value={data.orderItems.cartonItem?.totalNetWeight || ""}
                                onChange={(e) => onNestedChange("orderItems.cartonItem.totalNetWeight", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Gross Weight</Label>
                            <Input
                                type="number"
                                value={data.orderItems.cartonItem?.totalGrossWeight || ""}
                                onChange={(e) => onNestedChange("orderItems.cartonItem.totalGrossWeight", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Total Unit Price</Label>
                            <Input
                                type="number"
                                value={data.orderItems.cartonItem?.totalUnitPrice || ""}
                                onChange={(e) => onNestedChange("orderItems.cartonItem.totalUnitPrice", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Carton Item Details</Label>
                            <Button
                                type="button"
                                variant="outline"
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
                                    onNestedChange("orderItems.cartonItem.cartonItemData", next);
                                }}
                            >
                                Add Row
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {rows.map((row, index) => (
                                <div
                                    key={index}
                                    className="grid gap-3 rounded-md border p-3 md:grid-cols-2 lg:grid-cols-8"
                                >
                                    <Input
                                        placeholder="Measurement"
                                        value={row.cartonMeasurement || ""}
                                        onChange={(e) =>
                                            onNestedChange(
                                                `orderItems.cartonItem.cartonItemData.${index}.cartonMeasurement`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        placeholder="Ply"
                                        value={row.cartonPly || ""}
                                        onChange={(e) =>
                                            onNestedChange(
                                                `orderItems.cartonItem.cartonItemData.${index}.cartonPly`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        placeholder="Qty"
                                        type="number"
                                        value={row.cartonQty || ""}
                                        onChange={(e) =>
                                            onNestedChange(
                                                `orderItems.cartonItem.cartonItemData.${index}.cartonQty`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        placeholder="Net"
                                        type="number"
                                        value={row.netWeight || ""}
                                        onChange={(e) =>
                                            onNestedChange(
                                                `orderItems.cartonItem.cartonItemData.${index}.netWeight`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        placeholder="Gross"
                                        type="number"
                                        value={row.grossWeight || ""}
                                        onChange={(e) =>
                                            onNestedChange(
                                                `orderItems.cartonItem.cartonItemData.${index}.grossWeight`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        placeholder="Unit"
                                        value={row.unit || ""}
                                        onChange={(e) =>
                                            onNestedChange(
                                                `orderItems.cartonItem.cartonItemData.${index}.unit`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        placeholder="Unit Price"
                                        type="number"
                                        value={row.unitPrice || ""}
                                        onChange={(e) =>
                                            onNestedChange(
                                                `orderItems.cartonItem.cartonItemData.${index}.unitPrice`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Input
                                        placeholder="Total"
                                        type="number"
                                        value={row.totalAmount || ""}
                                        onChange={(e) =>
                                            onNestedChange(
                                                `orderItems.cartonItem.cartonItemData.${index}.totalAmount`,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <div className="lg:col-span-8">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="text-destructive"
                                            onClick={() => {
                                                const next = rows.filter((_, i) => i !== index);
                                                onNestedChange("orderItems.cartonItem.cartonItemData", next);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderDelivery = () => (
        <Card>
            <CardHeader>
                <CardTitle>Delivery</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input
                        id="deliveryDate"
                        type="date"
                        value={data.deliveryDate}
                        onChange={(e) => onChange("deliveryDate", e.target.value)}
                    />
                    {errors?.deliveryDate && (
                        <p className="text-xs text-destructive">{errors.deliveryDate}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-4">
            {renderStepButtons()}
            {activeStep === 0 && renderBasicInfo()}
            {activeStep === 1 && renderProductDetails()}
            {activeStep === 2 && renderDelivery()}
        </div>
    );
};

export default OrderForm;
