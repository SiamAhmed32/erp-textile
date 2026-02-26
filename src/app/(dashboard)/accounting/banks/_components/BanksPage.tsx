"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/reusables";
import { Landmark, Activity, Building2 } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { useGetAllQuery, usePutMutation } from "@/store/services/commonApi";
import { Bank } from "./types";
import BankToolbar from "./BankToolbar";
import BanksTable from "./BanksTable";
import BankCreateModal from "./BankCreateModal";
import BankEditModal from "./BankEditModal";
import BankDetailsModal from "./BankDetailsModal";
import toast from "react-hot-toast";

const BanksPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({ field: "createdAt", dir: "desc" });

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

    const handleSearchSubmit = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const handleSortChange = (newSort: { field: string; dir: "asc" | "desc" }) => {
        setSort(newSort);
        setPage(1);
    };

    const banks = useMemo(() => (banksPayload?.data || []) as Bank[], [banksPayload]);

    const stats = useMemo(() => {
        const total = banksPayload?.meta?.pagination?.total || 0;
        const activeCount = banks.filter(b => !b.isDeleted).length;
        const totalLiquidity = banks.reduce((acc, bank) => acc + (bank.balance || 0), 0);
        return {
            total,
            active: activeCount,
            archived: total - activeCount,
            totalLiquidity,
        };
    }, [banks, banksPayload]);

    const handleArchive = async (bank: Bank) => {
        const isArchiving = !bank.isDeleted;
        try {
            await putItem({
                path: `accounting/banks/${bank.id}`,
                body: { isDeleted: isArchiving },
                invalidate: ["accounting/banks"],
            }).unwrap();
            toast.success(`Bank ${isArchiving ? "archived" : "restored"} successfully`);
        } catch (error: any) {
            toast.error(error?.data?.message || `Failed to ${isArchiving ? "archive" : "restore"} bank`);
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
                actions={
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="h-10 px-6 bg-zinc-900 text-white font-bold rounded-lg hover:bg-black transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Building2 className="w-4 h-4" />
                        Connect New Bank
                    </Button>
                }
            />

            {/* ── Stats Area ────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    title="Liquid Facilities"
                    value={`৳ ${stats.totalLiquidity.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                    icon={Landmark}
                    description="Total aggregated liquidity"
                    loading={isLoading}
                />
                <StatsCard
                    title="Active Channels"
                    value={stats.active}
                    icon={Activity}
                    description="Operational bank accounts"
                    loading={isLoading}
                    className="border-emerald-100"
                />
                <StatsCard
                    title="Archived"
                    value={stats.archived}
                    icon={Building2}
                    description="Inactive bank profiles"
                    loading={isLoading}
                />
            </div>

            {/* ── Workspace Area ────────────────────────────────────────── */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50/30">
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
            </div>

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
