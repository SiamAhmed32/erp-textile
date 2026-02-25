"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/reusables";
import { Landmark, Activity, Building2 } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { useGetAllQuery, usePutMutation } from "@/store/services/commonApi";
import { Bank } from "./types";
import BankToolbar from "./BankToolbar";
import BanksTable from "./BanksTable";
import BankCreateModal from "./BankCreateModal";
import BankEditModal from "./BankEditModal";
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
        <div className="space-y-6">
            <PageHeader
                title="Bank Management"
                breadcrumbItems={[
                    { label: "Dashboard", href: "/" },
                    { label: "Accounting", href: "/accounting" },
                    { label: "Banks" },
                ]}
            />

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                    title="Total Banks"
                    value={stats.total}
                    icon={Building2}
                    color="blue"
                    description="Total registered accounts"
                />
                <StatsCard
                    title="Active Banks"
                    value={stats.active}
                    icon={Landmark}
                    color="green"
                    description="Currently active sub-ledgers"
                />
                <StatsCard
                    title="System Status"
                    value="Stable"
                    icon={Activity}
                    color="purple"
                    description="Synchronization active"
                />
            </div>

            <div className="space-y-4">
                <BankToolbar
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onSearch={handleSearchSubmit}
                    sort={sort}
                    setSort={handleSortChange}
                    onAdd={() => setIsCreateModalOpen(true)}
                />

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
        </div>
    );
};

export default BanksPage;
