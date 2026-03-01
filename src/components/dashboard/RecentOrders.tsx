"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useGetAllQuery } from "@/store/services/commonApi";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const RecentOrders = () => {
  const { data: ordersPayload, isLoading } = useGetAllQuery({
    path: "orders",
    page: 1,
    limit: 5,
    sort: "-createdAt",
  });

  const orders = (ordersPayload as any)?.data || [];

  return (
    <div className="bg-white dark:bg-slate-950 p-0">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-6 h-10">
              Order ID
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10">
              Buyer
            </TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right pr-6 h-10">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow
                key={i}
                className="border-b border-slate-50 dark:border-slate-900/50"
              >
                <TableCell className="pl-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-40 md:inline hidden" />
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center py-10 text-slate-400"
              >
                No recent transactions found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order: any) => (
              <TableRow
                key={order.id}
                className="group border-b border-slate-50 dark:border-slate-900 last:border-0 hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="pl-6 py-4">
                  <div className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    #{order.orderId}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="font-bold text-slate-700 dark:text-slate-200">
                    {order.buyer?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {order.buyer?.email}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <div className="font-black text-slate-900 dark:text-slate-100 tabular-nums">
                    $
                    {order.totalAmount?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentOrders;
