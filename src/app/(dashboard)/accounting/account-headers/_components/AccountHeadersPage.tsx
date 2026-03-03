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

  const { data: apiResponse, isLoading } = useGetAllQuery({
    path: "accounting/accountHeads",
    search: search !== "" ? search : undefined,
    sort: null,
    sortBy: sort.field,
    sortOrder: sort.dir,
    filters: {
      ...(typeFilter !== "all" ? { type: typeFilter } : {}),
    },
  });

  const headers = useMemo(
    () =>
      ((apiResponse as any)?.data ||
        (apiResponse as any)?.data?.data ||
        []) as AccountHeader[],
    [apiResponse],
  );

  const handleSearchSubmit = () => {
    setSearch(searchInput);
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
  };

  const handleSortChange = (newSort: {
    field: string;
    dir: "asc" | "desc";
  }) => {
    setSort(newSort);
  };

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

      <div className="flex flex-col gap-4">
        <AccountHeaderToolbar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={handleSearchSubmit}
          type={typeFilter}
          setType={handleTypeChange}
          sort={sort}
          setSort={handleSortChange}
        />
        <div className="flex justify-end pr-2">
          {/* <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
            {totalRecords} Records Found
          </p> */}
        </div>
      </div>

      <AccountHeadersTable
        data={headers}
        loading={isLoading}
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
