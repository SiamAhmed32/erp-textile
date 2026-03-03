"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/reusables";
import { Plus } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import {
  useGetAllQuery,
  usePutMutation,
  usePatchMutation,
} from "@/store/services/commonApi";
import { Bank } from "./types";
import BankToolbar from "./BankToolbar";
import BanksTable from "./BanksTable";
import BankCreateModal from "./BankCreateModal";
import BankEditModal from "./BankEditModal";
import BankDetailsModal from "./BankDetailsModal";
import { notify } from "@/lib/notifications";

const BanksPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [viewingBank, setViewingBank] = useState<Bank | null>(null);

  const { data: banksPayload, isLoading } = useGetAllQuery({
    path: "accounting/banks",
    page,
    limit: 10,
    search: search !== "" ? search : undefined,
    sortBy: sort.field,
    sortOrder: sort.dir,
  });

  const [putItem] = usePutMutation();
  const [patchItem] = usePatchMutation();

  const handleSearchSubmit = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleSortChange = (newSort: {
    field: string;
    dir: "asc" | "desc";
  }) => {
    setSort(newSort);
    setPage(1);
  };

  const banks = useMemo(
    () => (banksPayload?.data || []) as Bank[],
    [banksPayload],
  );

  const handleArchive = async (bank: Bank) => {
    const isArchiving = !bank.isDeleted;
    try {
      await patchItem({
        path: `accounting/banks/${bank.id}`,
        body: { isDeleted: isArchiving },
        invalidate: ["accounting/banks"],
      }).unwrap();
      notify.success(
        `Bank ${isArchiving ? "archived" : "restored"} successfully`,
      );
    } catch (error: any) {
      notify.error(
        error?.data?.message ||
          `Could not ${isArchiving ? "archive" : "restore"} the bank account. Please try again.`,
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ───────────────────────────────────────────── */}
      <PageHeader
        title="Bank Management"
        breadcrumbItems={[
          { label: "Accounting", href: "/accounting/overview" },
          { label: "Bank Management" },
        ]}
        // actions={
        //   <Button
        //     onClick={() => setIsCreateModalOpen(true)}
        //     className="h-10 px-6 bg-zinc-900 text-white font-bold rounded-lg hover:bg-black transition-all active:scale-95 flex items-center gap-2"
        //   >
        //     <Plus className="w-4 h-4" />
        //     Connect New Bank
        //   </Button>
        // }
      />

      {/* Toolbar - Redesigned for Consistency */}
      <div className="py-2 mb-4">
        <BankToolbar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSearch={handleSearchSubmit}
          sort={sort}
          setSort={handleSortChange}
          onAdd={() => setIsCreateModalOpen(true)}
        />
      </div>

      <BanksTable
        data={banks}
        loading={isLoading}
        page={page}
        totalPages={banksPayload?.meta?.pagination?.totalPages || 1}
        onPageChange={setPage}
        onEdit={setEditingBank}
        onView={setViewingBank}
        onDelete={handleArchive}
      />

      {/* ── Modals ────────────────────────────────────────────────── */}
      <BankCreateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <BankEditModal
        open={!!editingBank}
        onOpenChange={(open) => !open && setEditingBank(null)}
        bank={editingBank}
      />

      <BankDetailsModal
        open={!!viewingBank}
        onOpenChange={(open) => !open && setViewingBank(null)}
        bank={viewingBank}
      />
    </div>
  );
};
export default BanksPage;
