"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
