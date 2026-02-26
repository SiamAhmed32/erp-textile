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

    const { data, isLoading } = useGetAllQuery({
        path: "accounting/banks",
        page,
        limit: 10,
        search: search !== "" ? search : undefined,
        sort: sort ? `${sort.dir === "desc" ? "-" : ""}${sort.field}` : undefined,
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

    const banks = useMemo(() => (data?.data || []) as Bank[], [data]);

    const stats = useMemo(() => {
        return {
            total: data?.meta?.pagination?.total || 0,
            active: banks.filter(b => !b.isDeleted).length,
        };
    }, [banks, data]);

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
        <div className="space-y-8 pb-10">
            {/* ── Header Section ─────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                        <Landmark className="w-3 h-3" />
                        <span>Financial Control</span>
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Bank Accounts</h1>
                    <p className="text-zinc-500 text-sm font-medium">Manage your organizational bank sub-ledgers and liquidity.</p>
                </div>

                <Button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="h-12 px-8 bg-zinc-900 text-white font-bold rounded-xl hover:bg-black transition-all active:scale-95 flex items-center gap-2"
                >
                    <Building2 className="w-4 h-4" />
                    Connect New Bank
                </Button>
            </div>

            {/* ── Stats Carousel Mockup ────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 rounded-[2rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-zinc-200">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Landmark className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Global Liquidity</p>
                            <h3 className="text-3xl font-black tracking-tight italic">Sub-Ledger Control</h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black">{stats.active}</span>
                            <span className="text-zinc-500 font-bold uppercase text-xs">Active Portals</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-2 border-zinc-100 rounded-[2rem] p-8 space-y-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
                            <Activity className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase">Operational</span>
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-zinc-900 font-black text-xl italic uppercase tracking-tight">System Status</h4>
                        <p className="text-zinc-500 text-xs font-medium">Journal synchronization active.</p>
                    </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200/50 rounded-[2rem] p-8 flex flex-col justify-center gap-4">
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Archived Entities</p>
                    <div className="flex items-center gap-4">
                        <span className="text-4xl font-black text-zinc-300">{stats.total - stats.active}</span>
                        <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-zinc-400" style={{ width: `${((stats.total - stats.active) / stats.total) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Workspace ────────────────────────────────────────── */}
            <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-zinc-100">
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
                    totalPages={data?.meta?.pagination?.totalPages || 1}
                    onPageChange={setPage}
                    onEdit={(bank) => setEditingBank(bank)}
                    onDelete={handleArchive}
                    onView={(bank) => setViewingBank(bank)}
                />
            </div>

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
