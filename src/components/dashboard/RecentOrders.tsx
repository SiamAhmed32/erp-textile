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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Badge } from "lucide-react";
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
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Orders</CardTitle>
          <div className="text-sm text-muted-foreground">
            Latest transactions from your store.
          </div>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/order-management/orders">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden xl:table-column">Type</TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="hidden xl:table-column">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-40 md:inline hidden" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No recent orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">#{order.orderId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.buyer?.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.buyer?.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    {order.productType}
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    <Badge className="text-xs">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    {format(new Date(order.createdAt), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.totalAmount?.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
