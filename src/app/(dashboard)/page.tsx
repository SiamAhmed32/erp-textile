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
} from "lucide-react";
import { useGetCountQuery } from "@/store/services/commonApi";
import { useGetSummaryAnalyticsQuery } from "@/store/services/analyticsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DateFilter from "@/components/dashboard/DateFilter";
import BuyerAnalytics from "@/components/dashboard/BuyerAnalytics";
import OrderAnalytics from "@/components/dashboard/OrderAnalytics";
import UserAnalytics from "@/components/dashboard/UserAnalytics";
import OrderStatusChart from "@/components/dashboard/OrderStatusChart";

const Dashboard = () => {
  const { data: summaryData, isLoading: loadingSummary } = useGetSummaryAnalyticsQuery(undefined);

  const summary = summaryData?.data;

  return (
    <Container className="py-8">
      <Flex className="flex-col gap-8">
        <Flex className="justify-between items-center w-full">
          <div>
            <PrimaryHeading>Dashboard</PrimaryHeading>
            <PrimarySubHeading>
              Overview of your store's performance.
            </PrimarySubHeading>
          </div>
        </Flex>

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Total Orders"
            value={summary?.orders ?? 0}
            icon={ShoppingCart}
            description="Total orders placed"
            loading={loadingSummary}
          />
          <StatsCard
            title="Total Buyers"
            value={summary?.buyers ?? 0}
            icon={Users}
            description="Total buyers available"
            loading={loadingSummary}
          />
          <StatsCard
            title="Total Users"
            value={summary?.users ?? 0}
            icon={Users}
            description="Total registered users"
            loading={loadingSummary}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[35%_65%]">

          <OrderStatusChart />
          <OrderAnalytics />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <BuyerAnalytics />
          <UserAnalytics />
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
