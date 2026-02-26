"use client";

import React, { useMemo } from "react";
import { Check, X } from "lucide-react";
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
import { PrimaryText, DateRangeFilter } from "@/components/reusables";
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
}: Props) => {
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
          <div className="whitespace-nowrap">{formatDate(row.deliveryDate)}</div>
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
          const orderItem = Array.isArray(row.orderItems)
            ? row.orderItems[0]
            : row.orderItems;
          const amount =
            orderItem?.fabricItem?.totalAmount ||
            orderItem?.labelItem?.totalAmount ||
            orderItem?.cartonItem?.totalAmount ||
            "-";
          return <div className="px-4 py-2 font-semibold">{amount}</div>;
        },
      },
      // {
      //     header: "Qty",
      //     className: "p-0 text-center border-r",
      //     accessor: (row: Order) => {
      //         const items = extractItems(row);
      //         return (
      //             <div className="divide-y divide-border text-center">
      //                 {items.map((item, i) => (
      //                     <div key={i} className="px-4 py-2">
      //                         {item.qty}
      //                     </div>
      //                 ))}
      //             </div>
      //         );
      //     },
      // },
      // {
      //     header: "Price",
      //     className: "p-0 text-center border-r",
      //     accessor: (row: Order) => {
      //         const items = extractItems(row);
      //         return (
      //             <div className="divide-y divide-border text-center">
      //                 {items.map((item, i) => (
      //                     <div key={i} className="px-4 py-2">
      //                         {item.price}
      //                     </div>
      //                 ))}
      //             </div>
      //         );
      //     },
      // },
      // {
      //     header: "Amount",
      //     className: "p-0 text-center border-r",
      //     accessor: (row: Order) => {
      //         const items = extractItems(row);
      //         return (
      //             <div className="divide-y divide-border text-center font-medium">
      //                 {items.map((item, i) => (
      //                     <div key={i} className="px-4 py-2">
      //                         {item.amount}
      //                     </div>
      //                 ))}
      //             </div>
      //         );
      //     },
      // },

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
            />
          </div>
        ),
      },
    ],
    [onDelete, onDuplicate, onEdit, onExport, onView],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <Input
            placeholder="Search order number, buyer, company"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button
            className="bg-black text-white hover:bg-black/80"
            onClick={onSearchSubmit}
          >
            Search
          </Button>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
          <div className="w-full sm:max-w-[180px]">
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
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
                ].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:max-w-[180px]">
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Product Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {["FABRIC", "LABEL_TAG", "CARTON"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
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
          />
          <DateRangeFilter
            start={deliveryDateFrom}
            end={deliveryDateTo}
            onFilterChange={({ start, end }) => {
              onDeliveryDateFromChange(start);
              onDeliveryDateToChange(end);
            }}
            placeholder="Delivery Dates"
          />
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
