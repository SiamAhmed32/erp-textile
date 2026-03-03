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
    search: searchInput.trim() !== "" ? searchInput.trim() : undefined,
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

  const visibleHeaders = useMemo(() => {
    let rows = [...headers];

    const query = searchInput.trim().toLowerCase();
    if (query) {
      rows = rows.filter((row) =>
        [row.name, row.code, row.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      );
    }

    if (typeFilter !== "all") {
      rows = rows.filter((row) => row.type === typeFilter);
    }

    rows.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;

      if (sort.field === "createdAt" || sort.field === "updatedAt") {
        const aTime = new Date((a as any)[sort.field] ?? 0).getTime();
        const bTime = new Date((b as any)[sort.field] ?? 0).getTime();
        if (aTime !== bTime) return (aTime - bTime) * dir;
        const byName = a.name.localeCompare(b.name);
        if (byName !== 0) return byName * dir;
        return a.id.localeCompare(b.id) * dir;
      }

      const aVal = String((a as any)[sort.field] ?? "").toLowerCase();
      const bVal = String((b as any)[sort.field] ?? "").toLowerCase();
      return aVal.localeCompare(bVal) * dir;
    });

    return rows;
  }, [headers, searchInput, sort, typeFilter]);

  const handleSearchSubmit = () => {
    // Search is applied live from searchInput; keep button for UX consistency.
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
        data={visibleHeaders}
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
