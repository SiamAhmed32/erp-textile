"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Package,
  Truck,
  Plus,
  Trash2,
  Layers,
  Tag,
  Box,
  Hash,
  CalendarDays,
  Building2,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Save,
  type LucideIcon,
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
import { Flex } from "@/components/reusables";
import { cn } from "@/lib/utils";

/* ─────────────── Reusable Sub-components ─────────────── */

const SectionHeader = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) => (
  <div className="flex items-start gap-4 pb-6 border-b border-slate-100 mb-6">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Icon className="size-5" />
    </div>
    <div>
      <h3 className="text-lg font-bold tracking-tight text-slate-800">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      )}
    </div>
  </div>
);

const InputGroup = ({
  id,
  label,
  placeholder,
  value,
  error,
  onChange,
  type = "text",
  icon: Icon,
  required,
  disabled,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (field: any, value: any) => void;
  type?: string;
  icon?: LucideIcon;
  required?: boolean;
  disabled?: boolean;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
      {Icon && <Icon className="size-3.5 text-primary/60" />}
      {label}
      {required && <span className="text-destructive">*</span>}
    </Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      disabled={disabled}
      className={cn(
        "h-11 transition-all border-slate-200 bg-white hover:border-primary/40 focus:ring-2 focus:ring-primary/20",
        error && "border-destructive",
      )}
    />
    {error && (
      <p className="text-[10px] font-bold text-destructive animate-in slide-in-from-top-1">
        {error}
      </p>
    )}
  </div>
);

/* ─────────────── Props ─────────────── */

const TAB_ORDER = ["basic", "details"] as const;
type TabKey = (typeof TAB_ORDER)[number];

type Props = {
  data: OrderFormData;
  buyers: Buyer[];
  companies: CompanyProfile[];
  onChange: (field: keyof OrderFormData, value: any) => void;
  onNestedChange: (path: string, value: any) => void;
  errors?: Record<string, string>;
  disableProductType?: boolean;
  disableStatus?: boolean;
  isEdit?: boolean;
  onSave?: () => void;
  saving?: boolean;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  cancelHref?: string;
};

/* ─────────────── Main Component ─────────────── */

const OrderForm = ({
  data,
  buyers,
  companies,
  onChange,
  onNestedChange,
  errors,
  disableProductType,
  disableStatus,
  isEdit,
  onSave,
  saving,
  activeTab,
  onTabChange,
  cancelHref = "/order-management/orders",
}: Props) => {
  const getError = (path: string) => errors?.[path];

  /* ─── Basic Info Tab ─── */
  const renderBasicInfo = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="border-none rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
        <CardContent className="pt-8 space-y-8">
          <SectionHeader
            icon={FileText}
            title="Primary Information"
            description="Enter the core details for this order."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <InputGroup
              id="orderNumber"
              label="Order Number"
              placeholder="e.g. ORD-2024-001"
              value={data.orderNumber}
              error={getError("orderNumber")}
              onChange={onChange}
              icon={Hash}
              required
            />
            <InputGroup
              id="orderDate"
              label="Order Date"
              type="date"
              value={data.orderDate}
              error={getError("orderDate")}
              onChange={onChange}
              icon={CalendarDays}
              required
            />

            {/* Status Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.status}
                onValueChange={(value) => onChange("status", value)}
                disabled={disableStatus}
              >
                <SelectTrigger
                  className={cn(
                    "h-11 transition-all border-slate-200 bg-white hover:border-primary/40",
                    getError("status") && "border-destructive",
                  )}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl ">
                  {[
                    "DRAFT",
                    "PENDING",
                    "PROCESSING",
                    "APPROVED",
                    "DELIVERED",
                    "CANCELLED",
                  ].map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="rounded-md my-1 focus:bg-primary/5"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError("status") && (
                <p className="text-[10px] font-bold text-destructive animate-in slide-in-from-top-1">
                  {getError("status")}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {/* Category Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Package className="size-3.5 text-primary/60" />
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.productType}
                onValueChange={(value) =>
                  onChange("productType", value as ProductType)
                }
                disabled={disableProductType}
              >
                <SelectTrigger
                  className={cn(
                    "h-11 transition-all border-slate-200 bg-white hover:border-primary/40",
                    getError("productType") && "border-destructive",
                  )}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl ">
                  <SelectItem
                    value="FABRIC"
                    className="rounded-md my-1 focus:bg-amber-50"
                  >
                    Fabric
                  </SelectItem>
                  <SelectItem
                    value="LABEL_TAG"
                    className="rounded-md my-1 focus:bg-blue-50"
                  >
                    Label & Tag
                  </SelectItem>
                  <SelectItem
                    value="CARTON"
                    className="rounded-md my-1 focus:bg-emerald-50"
                  >
                    Carton
                  </SelectItem>
                </SelectContent>
              </Select>
              {getError("productType") && (
                <p className="text-[10px] font-bold text-destructive animate-in slide-in-from-top-1">
                  {getError("productType")}
                </p>
              )}
            </div>

            {/* Buyer Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Users className="size-3.5 text-primary/60" />
                Select Buyer <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.buyerId}
                onValueChange={(value) => onChange("buyerId", value)}
              >
                <SelectTrigger
                  className={cn(
                    "h-11 transition-all border-slate-200 bg-white hover:border-primary/40",
                    getError("buyerId") && "border-destructive",
                  )}
                >
                  <SelectValue placeholder="Select buyer" />
                </SelectTrigger>
                <SelectContent className="rounded-xl ">
                  {buyers.map((buyer) => (
                    <SelectItem
                      key={buyer.id}
                      value={buyer.id}
                      className="rounded-md my-1 focus:bg-primary/5"
                    >
                      {buyer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError("buyerId") && (
                <p className="text-[10px] font-bold text-destructive animate-in slide-in-from-top-1">
                  {getError("buyerId")}
                </p>
              )}
            </div>

            {/* Company Select */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Building2 className="size-3.5 text-primary/60" />
                Manufacturing Company{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.companyProfileId}
                onValueChange={(value) => onChange("companyProfileId", value)}
              >
                <SelectTrigger
                  className={cn(
                    "h-11 transition-all border-slate-200 bg-white hover:border-primary/40",
                    getError("companyProfileId") && "border-destructive",
                  )}
                >
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent className="rounded-xl ">
                  {companies.map((company) => (
                    <SelectItem
                      key={company.id}
                      value={company.id}
                      className="rounded-md my-1 focus:bg-primary/5"
                    >
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError("companyProfileId") && (
                <p className="text-[10px] font-bold text-destructive animate-in slide-in-from-top-1">
                  {getError("companyProfileId")}
                </p>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <MessageSquare className="size-3.5 text-primary/60" />
              Remarks / Notes
            </Label>
            <Textarea
              placeholder="Enter any special instructions or notes here..."
              value={data.remarks}
              onChange={(e) => onChange("remarks", e.target.value)}
              rows={3}
              className="border-slate-200 bg-white focus-visible:ring-primary"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  /* ─── Fabric Details ─── */
  const renderFabricDetails = () => {
    const rows = data.orderItems.fabricItem?.fabricItemData || [];
    return (
      <Card className="border-none rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
        <CardContent className="pt-8 space-y-8">
          <SectionHeader
            icon={Layers}
            title="Fabric Details"
            description="Configure fabric style, dimensions, and color variants."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Style No <span className="text-destructive">*</span>
              </Label>
              <Input
                value={data.orderItems.fabricItem?.styleNo || ""}
                onChange={(e) =>
                  onNestedChange(
                    "orderItems.fabricItem.styleNo",
                    e.target.value,
                  )
                }
                placeholder="e.g. ST-001"
                className={cn(
                  "h-11 border-slate-200 bg-white hover:border-primary/40",
                  getError("orderItems.fabricItem.styleNo") &&
                    "border-destructive",
                )}
              />
              {getError("orderItems.fabricItem.styleNo") && (
                <p className="text-[10px] font-bold text-destructive">
                  {getError("orderItems.fabricItem.styleNo")}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Description
              </Label>
              <Input
                value={data.orderItems.fabricItem?.discription || ""}
                onChange={(e) =>
                  onNestedChange(
                    "orderItems.fabricItem.discription",
                    e.target.value,
                  )
                }
                placeholder="Fabric description"
                className="h-11 border-slate-200 bg-white hover:border-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Width <span className="text-destructive">*</span>
              </Label>
              <Input
                value={data.orderItems.fabricItem?.width || ""}
                onChange={(e) =>
                  onNestedChange("orderItems.fabricItem.width", e.target.value)
                }
                placeholder="e.g. 60 inches"
                className={cn(
                  "h-11 border-slate-200 bg-white hover:border-primary/40",
                  getError("orderItems.fabricItem.width") &&
                    "border-destructive",
                )}
              />
              {getError("orderItems.fabricItem.width") && (
                <p className="text-[10px] font-bold text-destructive">
                  {getError("orderItems.fabricItem.width")}
                </p>
              )}
            </div>
          </div>

          {/* Color Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <Tag className="size-3.5" />
                </div>
                <h4 className="font-bold text-slate-700">
                  Color Variants & Quantities
                </h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-slate-200 hover:bg-primary/5 hover:border-primary/30"
                onClick={() => {
                  const next: FabricItemData[] = [
                    ...rows,
                    {
                      color: "",
                      netWeight: "",
                      grossWeight: "",
                      quantityYds: "",
                      unitPrice: "",
                    },
                  ];
                  onNestedChange("orderItems.fabricItem.fabricItemData", next);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Variant
              </Button>
            </div>
            <div className="grid gap-4">
              {rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Layers className="h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-sm text-slate-400 font-medium">
                    No variants added yet. Click &quot;Add Variant&quot; to
                    start.
                  </p>
                </div>
              ) : (
                rows.map((row, index) => (
                  <div
                    key={index}
                    className="group relative grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 md:grid-cols-2 lg:grid-cols-6 items-end"
                  >
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Qty (Yds)
                      </Label>
                      <Input
                        placeholder="Yards"
                        type="number"
                        value={row.quantityYds || ""}
                        onChange={(e) =>
                          onNestedChange(
                            `orderItems.fabricItem.fabricItemData.${index}.quantityYds`,
                            e.target.value,
                          )
                        }
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Action
                      </Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="w-full h-10 flex items-center justify-center gap-2 rounded-xl"
                        onClick={() => {
                          const next = rows.filter((_, i) => i !== index);
                          onNestedChange(
                            "orderItems.fabricItem.fabricItemData",
                            next,
                          );
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  /* ─── Label & Tag Details ─── */
  const renderLabelDetails = () => {
    const rows = data.orderItems.labelItem?.labelItemData || [];
    return (
      <Card className="border-none rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
        <CardContent className="pt-8 space-y-8">
          <SectionHeader
            icon={Tag}
            title="Label & Tag Details"
            description="Configure label style and item breakdown."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Style No <span className="text-destructive">*</span>
              </Label>
              <Input
                value={data.orderItems.labelItem?.styleNo || ""}
                onChange={(e) =>
                  onNestedChange("orderItems.labelItem.styleNo", e.target.value)
                }
                placeholder="e.g. LBL-001"
                className={cn(
                  "h-11 border-slate-200 bg-white hover:border-primary/40",
                  getError("orderItems.labelItem.styleNo") &&
                    "border-destructive",
                )}
              />
              {getError("orderItems.labelItem.styleNo") && (
                <p className="text-[10px] font-bold text-destructive">
                  {getError("orderItems.labelItem.styleNo")}
                </p>
              )}
            </div>
          </div>

          {/* Label Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Tag className="size-3.5" />
                </div>
                <h4 className="font-bold text-slate-700">
                  Label Item Breakdown
                </h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-slate-200 hover:bg-primary/5 hover:border-primary/30"
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
                    },
                  ];
                  onNestedChange("orderItems.labelItem.labelItemData", next);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
            <div className="grid gap-4">
              {rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Tag className="h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-sm text-slate-400 font-medium">
                    No label items added yet. Click &quot;Add Item&quot; to
                    start.
                  </p>
                </div>
              ) : (
                rows.map((row, index) => (
                  <div
                    key={index}
                    className="group relative grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 md:grid-cols-2 lg:grid-cols-8 items-end"
                  >
                    <div className="lg:col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Description
                      </Label>
                      <Input
                        placeholder="Description"
                        value={row.desscription || ""}
                        onChange={(e) =>
                          onNestedChange(
                            `orderItems.labelItem.labelItemData.${index}.desscription`,
                            e.target.value,
                          )
                        }
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Net Wt
                      </Label>
                      <Input
                        placeholder="Net"
                        type="number"
                        value={row.netWeight || ""}
                        onChange={(e) =>
                          onNestedChange(
                            `orderItems.labelItem.labelItemData.${index}.netWeight`,
                            e.target.value,
                          )
                        }
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Gross Wt
                      </Label>
                      <Input
                        placeholder="Gross"
                        type="number"
                        value={row.grossWeight || ""}
                        onChange={(e) =>
                          onNestedChange(
                            `orderItems.labelItem.labelItemData.${index}.grossWeight`,
                            e.target.value,
                          )
                        }
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Qty (Dzn)
                      </Label>
                      <Input
                        placeholder="Dozen"
                        type="number"
                        value={row.quantityDzn || ""}
                        onChange={(e) =>
                          onNestedChange(
                            `orderItems.labelItem.labelItemData.${index}.quantityDzn`,
                            e.target.value,
                          )
                        }
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Price
                      </Label>
                      <Input
                        placeholder="Price"
                        type="number"
                        value={row.unitPrice || ""}
                        onChange={(e) =>
                          onNestedChange(
                            `orderItems.labelItem.labelItemData.${index}.unitPrice`,
                            e.target.value,
                          )
                        }
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Action
                      </Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="w-full h-10 flex items-center justify-center gap-2 rounded-xl"
                        onClick={() => {
                          const next = rows.filter((_, i) => i !== index);
                          onNestedChange(
                            "orderItems.labelItem.labelItemData",
                            next,
                          );
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  /* ─── Carton Details ─── */
  const renderCartonDetails = () => {
    const rows = data.orderItems.cartonItem?.cartonItemData || [];
    return (
      <Card className="border-none rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
        <CardContent className="pt-8 space-y-8">
          <SectionHeader
            icon={Box}
            title="Carton Packaging Details"
            description="Configure carton specifications and item breakdown."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Order No <span className="text-destructive">*</span>
              </Label>
              <Input
                value={data.orderItems.cartonItem?.orderNo || ""}
                onChange={(e) =>
                  onNestedChange(
                    "orderItems.cartonItem.orderNo",
                    e.target.value,
                  )
                }
                placeholder="e.g. CRT-001"
                className={cn(
                  "h-11 border-slate-200 bg-white hover:border-primary/40",
                  getError("orderItems.cartonItem.orderNo") &&
                    "border-destructive",
                )}
              />
              {getError("orderItems.cartonItem.orderNo") && (
                <p className="text-[10px] font-bold text-destructive">
                  {getError("orderItems.cartonItem.orderNo")}
                </p>
              )}
            </div>
          </div>

          {/* Carton Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Box className="size-3.5" />
                </div>
                <h4 className="font-bold text-slate-700">
                  Carton Item Breakdown
                </h4>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2 border-slate-200 hover:bg-primary/5 hover:border-primary/30"
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
                    },
                  ];
                  onNestedChange("orderItems.cartonItem.cartonItemData", next);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Size
              </Button>
            </div>
            <div className="grid gap-4">
              {rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Box className="h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-sm text-slate-400 font-medium">
                    No carton sizes added yet. Click &quot;Add Size&quot; to
                    start.
                  </p>
                </div>
              ) : (
                rows.map((row, index) => (
                  <div
                    key={index}
                    className="group relative grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 md:grid-cols-2 lg:grid-cols-8 items-end"
                  >
                    <div className="lg:col-span-2 space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Net Wt
                      </Label>
                      <Input
                        placeholder="Net"
                        type="number"
                        value={row.netWeight || ""}
                        onChange={(e) =>
                          onNestedChange(
                            `orderItems.cartonItem.cartonItemData.${index}.netWeight`,
                            e.target.value,
                          )
                        }
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Gross Wt
                      </Label>
                      <Input
                        placeholder="Gross"
                        type="number"
                        value={row.grossWeight || ""}
                        onChange={(e) =>
                          onNestedChange(
                            `orderItems.cartonItem.cartonItemData.${index}.grossWeight`,
                            e.target.value,
                          )
                        }
                        className="h-10 border-slate-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Action
                      </Label>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="w-full h-10 flex items-center justify-center gap-2 rounded-xl"
                        onClick={() => {
                          const next = rows.filter((_, i) => i !== index);
                          onNestedChange(
                            "orderItems.cartonItem.cartonItemData",
                            next,
                          );
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  /* ─── Product & Delivery Details Tab ─── */
  const renderDetails = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {data.productType === "FABRIC" && renderFabricDetails()}
      {data.productType === "LABEL_TAG" && renderLabelDetails()}
      {data.productType === "CARTON" && renderCartonDetails()}

      <Card className="border-none rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl">
        <CardContent className="pt-8 space-y-8">
          <SectionHeader
            icon={Truck}
            title="Delivery Timeline"
            description="Set the expected delivery date for this order."
          />
          <div className="max-w-md">
            <InputGroup
              id="deliveryDate"
              label="Expected Delivery Date"
              type="date"
              value={data.deliveryDate}
              error={getError("deliveryDate")}
              onChange={onChange}
              icon={CalendarDays}
              required
            />
          </div>
        </CardContent>
      </Card>
      <TabNav />
    </div>
  );

  const currentIndex = TAB_ORDER.indexOf(activeTab);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TAB_ORDER.length - 1;

  const goNext = () => {
    if (!isLast) onTabChange(TAB_ORDER[currentIndex + 1]);
  };

  const goBack = () => {
    if (!isFirst) onTabChange(TAB_ORDER[currentIndex - 1]);
  };

  const TabNav = () => (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
      <Button
        type="button"
        variant="outline"
        onClick={goBack}
        disabled={isFirst}
        className="gap-2"
      >
        <ChevronLeft className="size-4" />
        Back
      </Button>

      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
        Step {currentIndex + 1} of {TAB_ORDER.length}
      </p>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          asChild
        >
          <Link href={cancelHref}>Cancel</Link>
        </Button>

        {isLast ? (
          <Button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="gap-2 bg-black text-white hover:bg-black/90  px-6"
          >
            <Save className="size-4" />
            {saving ? "Saving..." : isEdit ? "Update Order" : "Save Order"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={goNext}
            className="gap-2 bg-primary text-white hover:bg-primary/90"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );

  /* ─────────────── Main Render ─────────────── */
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as TabKey)}
        className="w-full"
      >
        <TabsList className="tab-premium-list">
          <TabsTrigger value="basic" className="tab-premium-trigger">
            <Flex className="items-center gap-2">
              <FileText className="size-4" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Basic Info
              </span>
            </Flex>
          </TabsTrigger>
          <TabsTrigger value="details" className="tab-premium-trigger">
            <Flex className="items-center gap-2">
              <Package className="size-4" />
              <span className="font-bold text-xs uppercase tracking-wider">
                Order Details
              </span>
            </Flex>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          {renderBasicInfo()}
          <TabNav />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          {renderDetails()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderForm;
