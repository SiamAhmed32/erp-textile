"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Landmark,
  LayoutGrid,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllQuery } from "@/store/services/commonApi";
import { AccountHeader } from "./types";
import AccountHeaderToolbar from "./AccountHeaderToolbar";
import AccountHeadersTable from "./AccountHeadersTable";
import AccountHeaderCreateModal from "./AccountHeaderCreateModal";
import AccountHeaderEditModal from "./AccountHeaderEditModal";
import AccountHeaderDeleteModal from "./AccountHeaderDeleteModal";
import AccountHeaderDetailsModal from "./AccountHeaderDetailsModal";
import { cn } from "@/lib/utils";

const AccountHeadersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingHeader, setEditingHeader] = useState<AccountHeader | null>(
    null,
  );
  const [deletingHeader, setDeletingHeader] = useState<AccountHeader | null>(
    null,
  );
  const [viewingHeader, setViewingHeader] = useState<AccountHeader | null>(
    null,
  );

  const { data, isLoading } = useGetAllQuery({
    path: "accounting/accountHeads",
    page,
    limit: 10,
    search: search !== "" ? search : undefined,
    sort: null,
    sortBy: sort.field,
    sortOrder: sort.dir,
    filters: {
      ...(typeFilter !== "all" ? { type: typeFilter } : {}),
    },
  });

  const handleSearchSubmit = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    setPage(1);
  };

  const handleSortChange = (newSort: {
    field: string;
    dir: "asc" | "desc";
  }) => {
    setSort(newSort);
    setPage(1);
  };

  const headers = useMemo(() => (data?.data || []) as AccountHeader[], [data]);

  const stats = useMemo(() => {
    return {
      total: headers.length,
      asset: headers.filter((h) => h.type === "ASSET").length,
      liability: headers.filter((h) => h.type === "LIABILITY").length,
      revenue: headers.filter((h) => h.type === "REVENUE").length,
    };
  }, [headers]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account Headers"
        breadcrumbItems={[
          { label: "Dashboard", href: "/" },
          { label: "Accounting", href: "/accounting" },
          { label: "Account Headers" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Head
          </Button>
        }
      />

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Account Heads",
            value: stats.total,
            icon: LayoutGrid,
            description: "Ledger collection",
            bg: "bg-zinc-100",
            iconColor: "text-zinc-600",
          },
          {
            label: "Asset Accounts",
            value: stats.asset,
            icon: ArrowDownCircle,
            description: "Current & Fixed",
            bg: "bg-sky-100",
            iconColor: "text-sky-600",
          },
          {
            label: "Liability",
            value: stats.liability,
            icon: ArrowUpCircle,
            description: "Debts & Obligations",
            bg: "bg-rose-100",
            iconColor: "text-rose-600",
          },
          {
            label: "Revenue",
            value: stats.revenue,
            icon: TrendingUp,
            description: "Income accounts",
            bg: "bg-emerald-100",
            iconColor: "text-emerald-600",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border border-zinc-100 shadow-xl shadow-zinc-200/50 rounded-2xl overflow-hidden bg-white"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "size-12 rounded-xl flex items-center justify-center",
                    stat.bg,
                    stat.iconColor,
                  )}
                >
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-[10px] font-medium text-zinc-400 mt-0.5">
                    {stat.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AccountHeaderToolbar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearchSubmit}
        type={typeFilter}
        setType={handleTypeChange}
        sort={sort}
        setSort={handleSortChange}
      />

      <AccountHeadersTable
        data={headers}
        loading={isLoading}
        page={page}
        totalPages={data?.lastPage || 1}
        onPageChange={setPage}
        onEdit={setEditingHeader}
        onDelete={setDeletingHeader}
        onView={setViewingHeader}
      />

      <AccountHeaderCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <AccountHeaderEditModal
        open={!!editingHeader}
        onOpenChange={(open) => !open && setEditingHeader(null)}
        header={editingHeader}
      />

      <AccountHeaderDeleteModal
        open={!!deletingHeader}
        onOpenChange={(open) => !open && setDeletingHeader(null)}
        header={deletingHeader}
        onSuccess={() => setDeletingHeader(null)}
      />

      <AccountHeaderDetailsModal
        open={!!viewingHeader}
        onOpenChange={(open) => !open && setViewingHeader(null)}
        header={viewingHeader}
      />
    </div>
  );
};

export default AccountHeadersPage;
