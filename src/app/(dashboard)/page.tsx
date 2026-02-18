"use client";

import React from "react";
import {
  PrimaryHeading,
  PrimarySubHeading,
  Container,
  Flex,
  SectionGap,
} from "@/components/reusables";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import {
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useGetCountQuery } from "@/store/services/commonApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { data: ordersCount, isLoading: loadingOrders } = useGetCountQuery({
    path: "orders",
    filters: {},
  });
  const { data: buyersCount, isLoading: loadingBuyers } = useGetCountQuery({
    path: "buyers",
    filters: {},
  });
  const { data: productsCount, isLoading: loadingProducts } = useGetCountQuery({
    path: "products",
    filters: {},
  });

  return (
    <Container className="py-8">
      <Flex className="flex-col gap-8">
        <div>
          <PrimaryHeading>Dashboard</PrimaryHeading>
          <PrimarySubHeading>
            Overview of your store's performance.
          </PrimarySubHeading>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="$45,231.89"
            icon={TrendingUp}
            description="+20.1% from last month"
            color="indigo"
          />
          <StatsCard
            title="Orders"
            value={ordersCount?.count || "+0"}
            icon={ShoppingCart}
            description="+180.1% from last month"
            loading={loadingOrders}
            color="orange"
          />
          <StatsCard
            title="Products"
            value={productsCount?.count || "+0"}
            icon={Package}
            description="+19% from last month"
            loading={loadingProducts}
            color="purple"
          />
          <StatsCard
            title="Active Buyers"
            value={buyersCount?.count || "+0"}
            icon={Users}
            description="+201 since last hour"
            loading={loadingBuyers}
            color="green"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <RecentOrders />
          </div>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button asChild className="w-full justify-between">
                <Link href="/order-management/orders/add-new-order">
                  Create New Order <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between"
              >
                <Link href="/invoice-management/invoices/add-new-invoice">
                  Create Invoice <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between"
              >
                <Link href="/buyers/add-new-buyer">
                  Add New Buyer <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Flex>
    </Container>
  );
};

export default Dashboard;
