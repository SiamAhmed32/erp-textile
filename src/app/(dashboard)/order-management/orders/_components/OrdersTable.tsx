"use client";

import React, { useMemo } from "react";
import { Check, X, Trash2, ArrowUpDown, Search } from "lucide-react";
import CustomTable from "@/components/reusables/CustomTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PrimaryText,
  DateRangeFilter,
  SearchBar,
} from "@/components/reusables";
import { Order } from "./types";
import { formatDate, statusBadgeClass } from "./helpers";
import OrderActions from "./OrderActions";
import PrimaryButton from "@/components/reusables/PrimaryButton";

type Props = {
  data: Order[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  search: string;
  statusFilter: string;
  typeFilter: string;
  dateFrom: string;
  dateTo: string;
  deliveryDateFrom: string;
  deliveryDateTo: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onDeliveryDateFromChange: (value: string) => void;
  onDeliveryDateToChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRowClick: (row: Order) => void;
  onView: (row: Order) => void;
  onEdit: (row: Order) => void;
  onDuplicate: (row: Order) => void;
  onExport: (row: Order) => void;
  onDelete: (row: Order) => void;
  onRestore: (row: Order) => void;
  showDeleted: boolean;
  onToggleDeleted: () => void;
  sort: { field: string; dir: "asc" | "desc" };
  onSortChange: (sort: { field: string; dir: "asc" | "desc" }) => void;
};

const OrdersTable = ({
  data,
  loading,
  error,
  page,
  totalPages,
  search,
  statusFilter,
  typeFilter,
  dateFrom,
  dateTo,
  deliveryDateFrom,
  deliveryDateTo,
  onSearchChange,
  onSearchSubmit,
  onStatusFilterChange,
  onTypeFilterChange,
  onDateFromChange,
  onDateToChange,
  onDeliveryDateFromChange,
  onDeliveryDateToChange,
  onPageChange,
  onRowClick,
  onView,
  onEdit,
  onDuplicate,
  onExport,
  onDelete,
  onRestore,
  showDeleted,
  onToggleDeleted,
  sort,
  onSortChange,
}: Props) => {
  const sortOptions = [
    {
      value: "createdAt_desc",
      label: "Newest First",
      field: "createdAt",
      dir: "desc",
    },
    {
      value: "createdAt_asc",
      label: "Oldest First",
      field: "createdAt",
      dir: "asc",
    },
    {
      value: "updatedAt_desc",
      label: "Recently Updated",
      field: "updatedAt",
      dir: "desc",
    },
  ];

  const currentSortValue =
    sortOptions.find((opt) => opt.field === sort.field && opt.dir === sort.dir)
      ?.value || "createdAt_desc";
  // Helper to extract sub-items from an order
  const extractItems = (order: Order) => {
    const orderItems = Array.isArray(order.orderItems)
      ? order.orderItems
      : order.orderItems
        ? [order.orderItems]
        : [];

    const items: any[] = [];
    orderItems.forEach((orderItem: any) => {
      const productType = order.productType;
      let subItems: any[] = [];
      let prefix = "";

      if (productType === "FABRIC" && orderItem.fabricItem) {
        subItems = orderItem.fabricItem.fabricItemData || [];
        prefix = orderItem.fabricItem.styleNo
          ? `[${orderItem.fabricItem.styleNo}] `
          : "";
      } else if (productType === "LABEL_TAG" && orderItem.labelItem) {
        subItems = orderItem.labelItem.labelItemData || [];
        prefix = orderItem.labelItem.styleNo
          ? `[${orderItem.labelItem.styleNo}] `
          : "";
      } else if (productType === "CARTON" && orderItem.cartonItem) {
        subItems = orderItem.cartonItem.cartonItemData || [];
        prefix = orderItem.cartonItem.orderNo
          ? `[${orderItem.cartonItem.orderNo}] `
          : "";
      }

      subItems.forEach((item) => {
        let detail = "";
        let qty: string | number = "";
        let price: string | number = "";
        let amount: string | number = "";

        if (productType === "FABRIC") {
          detail = `${prefix}${item.color || "Standard"}`;
          qty = item.quantityYds || "0";
          price = item.unitPrice || "0";
          amount = item.totalAmount || "0";
        } else if (productType === "LABEL_TAG") {
          detail = `${prefix}${item.desscription}${item.color ? ` (${item.color})` : ""}`;
          qty = item.quantityPcs || "0";
          price = item.unitPrice || "0";
          amount = item.totalAmount || "0";
        } else if (productType === "CARTON") {
          detail = `${prefix}${item.cartonMeasurement} - ${item.cartonPly}`;
          qty = item.cartonQty || "0";
          price = item.unitPrice || "0";
          amount = item.totalAmount || "0";
        }

        items.push({ detail, qty, price, amount });
      });
    });

    return items.length > 0
      ? items
      : [{ detail: "-", qty: "-", price: "-", amount: "-" }];
  };

  const columns = useMemo(
    () => [
      {
        header: "Date",
        className: "px-4 ",
        accessor: (row: Order) => (
          <div className="whitespace-nowrap">{formatDate(row.orderDate)}</div>
        ),
      },
      {
        header: "Order",
        className: "",
        accessor: (row: Order) => (
          <div className="">
            <div className="font-semibold text-foreground text-nowrap underline">
              {row.orderNumber}
            </div>
          </div>
        ),
      },
      {
        header: "Buyer",
        className: " ",
        accessor: (row: Order) => (
          <div className="">
            <div className="text-xs text-foreground whitespace-nowrap">
              {row.buyer?.name}
            </div>
          </div>
        ),
      },
      {
        header: "Type",
        className: "",
        accessor: (row: Order) => <div className="">{row.productType}</div>,
      },
      {
        header: "PI",
        className: " ",
        accessor: (row: Order) => (
          <div className="flex justify-center">
            {row.isInvoice ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
        ),
      },
      {
        header: "LC",
        className: " ",
        accessor: (row: Order) => (
          <div className="flex justify-center">
            {row.isLc ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
        ),
      },
      {
        header: "Delivery",
        className: "",
        accessor: (row: Order) => (
          <div className="">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(
                row.status,
              )}`}
            >
              {row.status}
            </span>
          </div>
        ),
      },
      {
        header: "Delivery Date",
        className: "px-4 ",
        accessor: (row: Order) => (
          <div className="whitespace-nowrap">
            {formatDate(row.deliveryDate)}
          </div>
        ),
      },

      /*
                        {
                            header: "Order Details",
                            className: "p-0 border-r ",
                            accessor: (row: Order) => {
                                const items = extractItems(row);
                                return (
                                    <div className="divide-y w-full divide-border">
                                        {items.map((item, i) => (
                                            <div
                                                key={i}
                                                className=" px-4 py-2 truncate"
                                                title={item.detail}
                                            >
                                                {item.detail.slice(0, 30)}
                                                {item.detail.length > 30 ? "..." : ""}
                                            </div>
                                        ))}
                                    </div>
                                );
                            },
                        },
            */
      {
        header: "Amount",
        className: "",
        accessor: (row: Order) => {
          const amount = row.totalAmount ?? "-";
          return (
            <div className="px-4 py-2 font-semibold">
              {amount !== "-" ? `৳${Number(amount).toLocaleString()}` : "-"}
            </div>
          );
        },
      },
      {
        header: "Actions",
        className: "text-left w-40 pr-4",
        accessor: (row: Order) => (
          <div className="flex items-center justify-end px-4 py-2">
            <OrderActions
              onView={() => onView(row)}
              onEdit={() => onEdit(row)}
              onDuplicate={() => onDuplicate(row)}
              onExport={() => onExport(row)}
              onDelete={() => onDelete(row)}
              onRestore={() => onRestore(row)}
              isDeletedView={showDeleted}
            />
          </div>
        ),
      },
    ],
    [onDelete, onDuplicate, onEdit, onExport, onRestore, onView, showDeleted],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {/* DESKTOP VIEW (>1280px) - ALL IN ONE LINE */}
        <div className="hidden xl:flex items-center gap-2 2xl:gap-3 w-full">
          <SearchBar
            placeholder="Search..."
            value={search}
            onChange={onSearchChange}
            onSearch={onSearchSubmit}
            containerClassName="max-w-[350px]"
          />

          <Button
            variant={showDeleted ? "destructive" : "outline"}
            className={cn(
              "h-11 px-3 2xl:px-4 gap-2 rounded-lg font-medium shrink-0 ml-auto",
              !showDeleted && "bg-white border-slate-200 text-slate-500",
            )}
            onClick={onToggleDeleted}
            title={showDeleted ? "Show Active Orders" : "Show Deleted Orders"}
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden 2xl:inline">
              {showDeleted ? "Exit" : "Trash"}
            </span>
          </Button>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 2xl:px-3 h-11 shadow-sm shrink-0">
            <Select
              value={currentSortValue}
              onValueChange={(val) => {
                const opt = sortOptions.find((o) => o.value === val);
                if (opt)
                  onSortChange({
                    field: opt.field,
                    dir: opt.dir as "asc" | "desc",
                  });
              }}
            >
              <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-xs font-bold uppercase tracking-wider w-[100px] 2xl:w-[120px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent align="end">
                {sortOptions.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="h-11 text-xs w-[110px] 2xl:w-[130px] shrink-0 font-bold">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {["FABRIC", "LABEL_TAG", "CARTON"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-11 text-xs w-[110px] 2xl:w-[130px] shrink-0 font-bold">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {[
                "DRAFT",
                "PENDING",
                "PROCESSING",
                "APPROVED",
                "DELIVERED",
                "CANCELLED",
              ].map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DateRangeFilter
            start={dateFrom}
            end={dateTo}
            onFilterChange={({ start, end }) => {
              onDateFromChange(start);
              onDateToChange(end);
            }}
            placeholder="Order Dates"
            className="h-11 text-xs w-[180px] shrink-0"
          />
          <DateRangeFilter
            start={deliveryDateFrom}
            end={deliveryDateTo}
            onFilterChange={({ start, end }) => {
              onDeliveryDateFromChange(start);
              onDeliveryDateToChange(end);
            }}
            placeholder="Delivery Dates"
            className="h-11 text-xs w-[180px] shrink-0"
          />
        </div>

        {/* SMALL DESKTOP / IPAD PRO (1024px - 1279px) */}
        <div className="hidden lg:flex xl:hidden flex-col gap-3">
          {/* Row 1: Search, SearchBtn, Trash, Sort */}
          <div className="flex items-center gap-3">
            <SearchBar
              placeholder="Search..."
              value={search}
              onChange={onSearchChange}
              onSearch={onSearchSubmit}
            />
            <Button
              variant={showDeleted ? "destructive" : "outline"}
              className={cn(
                "h-11 px-4 gap-2 rounded-lg font-medium shrink-0 ml-auto",
                !showDeleted && "bg-white border-slate-200 text-slate-500",
              )}
              onClick={onToggleDeleted}
            >
              <Trash2 className="h-4 w-4" />
              <span>{showDeleted ? "Exit" : "Trash"}</span>
            </Button>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-11 shadow-sm shrink-0">
              <Select
                value={currentSortValue}
                onValueChange={(val) => {
                  const opt = sortOptions.find((o) => o.value === val);
                  if (opt)
                    onSortChange({
                      field: opt.field,
                      dir: opt.dir as "asc" | "desc",
                    });
                }}
              >
                <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-xs font-bold uppercase tracking-wider w-[120px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent align="end">
                  {sortOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Type, Status, Order Dates, Delivery Dates */}
          <div className="flex items-center justify-end gap-3 w-full">
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="h-11 text-xs w-[130px] font-bold">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {["FABRIC", "LABEL_TAG", "CARTON"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-11 text-xs w-[130px] font-bold">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {[
                  "DRAFT",
                  "PENDING",
                  "PROCESSING",
                  "APPROVED",
                  "DELIVERED",
                  "CANCELLED",
                ].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DateRangeFilter
              start={dateFrom}
              end={dateTo}
              onFilterChange={({ start, end }) => {
                onDateFromChange(start);
                onDateToChange(end);
              }}
              placeholder="Order Dates"
              className="h-11 text-xs w-[190px]"
            />
            <DateRangeFilter
              start={deliveryDateFrom}
              end={deliveryDateTo}
              onFilterChange={({ start, end }) => {
                onDeliveryDateFromChange(start);
                onDeliveryDateToChange(end);
              }}
              placeholder="Delivery Dates"
              className="h-11 text-xs w-[190px]"
            />
          </div>
        </div>

        {/* TABLET & MOBILE (<1024px) */}
        <div className="flex lg:hidden flex-col gap-2 sm:gap-3">
          {/* Row 1: Search, SearchBtn, Trash */}
          <div className="flex items-center gap-2">
            <SearchBar
              placeholder="Search..."
              value={search}
              onChange={onSearchChange}
              onSearch={onSearchSubmit}
              inputClassName="h-10 sm:h-11"
              buttonClassName="h-10 sm:h-11"
            />
            <Button
              variant={showDeleted ? "destructive" : "outline"}
              className={cn(
                "h-10 sm:h-11 px-3 gap-2 rounded-lg font-medium shrink-0 ml-auto",
                !showDeleted && "bg-white border-slate-200 text-slate-500",
              )}
              onClick={onToggleDeleted}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">
                {showDeleted ? "Exit" : "Trash"}
              </span>
            </Button>
          </div>

          {/* Row 2: Sort, Type */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 sm:px-3 h-10 sm:h-11 shadow-sm flex-1 min-w-0">
              <Select
                value={currentSortValue}
                onValueChange={(val) => {
                  const opt = sortOptions.find((o) => o.value === val);
                  if (opt)
                    onSortChange({
                      field: opt.field,
                      dir: opt.dir as "asc" | "desc",
                    });
                }}
              >
                <SelectTrigger className="border-0 bg-transparent h-auto p-0 focus:ring-0 shadow-none text-[10px] sm:text-xs font-bold uppercase tracking-wider w-full">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent align="end">
                  {sortOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="h-10 sm:h-11 text-[10px] sm:text-xs font-bold flex-1 min-w-0">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {["FABRIC", "LABEL_TAG", "CARTON"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 3: Status, Dates */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="col-span-2 sm:col-span-1">
              <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                <SelectTrigger className="h-10 sm:h-11 text-[10px] sm:text-xs font-bold w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {[
                    "DRAFT",
                    "PENDING",
                    "PROCESSING",
                    "APPROVED",
                    "DELIVERED",
                    "CANCELLED",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DateRangeFilter
              start={dateFrom}
              end={dateTo}
              onFilterChange={({ start, end }) => {
                onDateFromChange(start);
                onDateToChange(end);
              }}
              placeholder="Order Dates"
              className="h-10 sm:h-11 text-[10px] sm:text-xs w-full"
            />
            <DateRangeFilter
              start={deliveryDateFrom}
              end={deliveryDateTo}
              onFilterChange={({ start, end }) => {
                onDeliveryDateFromChange(start);
                onDeliveryDateToChange(end);
              }}
              placeholder="Delivery Dates"
              className="h-10 sm:h-11 text-[10px] sm:text-xs w-full"
            />
          </div>
        </div>
      </div>

      <CustomTable
        data={data}
        columns={columns}
        isLoading={loading}
        skeletonRows={10}
        pagination={{
          currentPage: page,
          totalPages,
          onPageChange,
        }}
        onRowClick={onRowClick}
        scrollAreaHeight="h-[67vh]"
      />
    </div>
  );
};

export default React.memo(OrdersTable);
