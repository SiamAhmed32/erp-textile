"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  const [debouncedSearch, setDebouncedSearch] = useState("");
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

  // Debounced search logic like order management
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useGetAllQuery({
    path: "accounting/accountHeads",
    page: 1,
    limit: 500,
    search: debouncedSearch || undefined,
    sort: null,
    sortBy: sort.field,
    sortOrder: sort.dir,
    filters: {
      ...(typeFilter !== "all" ? { type: typeFilter } : {}),
    },
  });

  const handleSearchSubmit = () => {
    setDebouncedSearch(search);
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

  const headers = useMemo(() => {
    const rawData = (data?.data || []) as AccountHeader[];

    // Custom sort order for financial types
    const typeOrder: Record<string, number> = {
      ASSET: 1,
      LIABILITY: 2,
      EQUITY: 3,
      INCOME: 4,
      REVENUE: 4,
      EXPENSE: 5,
    };

    // Build hierarchy within a set of accounts
    const buildTree = (accounts: AccountHeader[]) => {
      const accountMap: Record<string, AccountHeader & { children: any[] }> = {};
      const roots: any[] = [];

      accounts.forEach((acc) => {
        accountMap[acc.id] = { ...acc, children: [] };
      });

      accounts.forEach((acc) => {
        if (acc.parentId && accountMap[acc.parentId]) {
          accountMap[acc.parentId].children.push(accountMap[acc.id]);
        } else {
          roots.push(accountMap[acc.id]);
        }
      });

      return roots;
    };

    // Flatten tree for table display with depth level
    const flattenTree = (nodes: any[], level = 0): any[] => {
      return nodes.reduce((acc, node) => {
        const { children, ...rest } = node;
        const sortedChildren = [...children].sort((a, b) => a.name.localeCompare(b.name));
        return [
          ...acc,
          { ...rest, level },
          ...flattenTree(sortedChildren, level + 1)
        ];
      }, []);
    };

    const categories: Record<string, AccountHeader[]> = {};
    rawData.forEach((acc) => {
      const type = acc.type || "OTHER";
      if (!categories[type]) categories[type] = [];
      categories[type].push(acc);
    });

    const sortedTypes = Object.keys(categories).sort(
      (a, b) => (typeOrder[a] || 99) - (typeOrder[b] || 99),
    );

    let result: AccountHeader[] = [];
    sortedTypes.forEach((type) => {
      const categoryAccounts = categories[type];
      const tree = buildTree(categoryAccounts);
      tree.sort((a, b) => a.name.localeCompare(b.name));
      result = [...result, ...flattenTree(tree)];
    });

    return result;
  }, [data]);

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
        searchInput={search}
        setSearchInput={setSearch}
        onSearch={handleSearchSubmit}
        type={typeFilter}
        setType={handleTypeChange}
        sort={sort}
        setSort={handleSortChange}
      />

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
