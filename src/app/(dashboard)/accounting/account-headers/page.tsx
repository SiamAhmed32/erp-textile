"use client";

import React, { useMemo, useState } from "react";
import { Container, CustomModal, InputField } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Eye, Landmark, ListTree, PieChart, SquarePen, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectBox } from "@/components/reusables";

// Mock Data for Account Headers
const mockHeaders = [
    { id: '1001', name: 'Cash in Hand', type: 'Asset', category: 'Current Asset', balance: 150000 },
    { id: '1002', name: 'Bank Asia', type: 'Asset', category: 'Bank', balance: 2500000 },
    { id: '2001', name: 'Accounts Payable', type: 'Liability', category: 'Current Liability', balance: 50000 },
    { id: '3001', name: 'Sales Revenue', type: 'Revenue', category: 'Operating', balance: 4500000 },
    { id: '4001', name: 'Office Rent', type: 'Expense', category: 'Operating', balance: 20000 },
];

const initialFormData = {
    accountCode: "",
    accountName: "",
    accountType: "",
    parentCategory: "",
    openingBalance: "",
};

function HeaderFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setFormData(initialFormData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
        resetForm();
    };

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => {
                if (!val) { onClose(); resetForm(); }
            }}
            title="Create Account Header"
            maxWidth="600px"
        >
            <form onSubmit={handleSubmit} className="space-y-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <InputField
                        label="Account Code"
                        name="accountCode"
                        value={formData.accountCode}
                        onChange={handleChange}
                        placeholder="e.g. 1003"
                        required
                    />
                    <SelectBox
                        label="Account Type"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleSelectChange}
                        options={[
                            { _id: "Asset", name: "Asset" },
                            { _id: "Liability", name: "Liability" },
                            { _id: "Revenue", name: "Revenue" },
                            { _id: "Expense", name: "Expense" },
                            { _id: "Equity", name: "Equity" },
                        ]}
                        required
                    />
                </div>
                <InputField
                    label="Account Name"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="e.g. Petty Cash"
                    required
                />
                <SelectBox
                    label="Parent Category"
                    name="parentCategory"
                    value={formData.parentCategory}
                    onChange={handleSelectChange}
                    options={[
                        { _id: "Current Asset", name: "Current Asset" },
                        { _id: "Fixed Asset", name: "Fixed Asset" },
                        { _id: "Current Liability", name: "Current Liability" },
                        { _id: "Long Term Debt", name: "Long Term Debt" },
                        { _id: "Operating Expense", name: "Operating Expense" },
                    ]}
                />
                <InputField
                    label="Opening Balance (৳)"
                    name="openingBalance"
                    value={formData.openingBalance}
                    onChange={handleChange}
                    placeholder="0.00"
                />
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }}>
                        Cancel
                    </Button>
                    <Button type="submit" className="px-8 bg-secondary hover:bg-secondary/90 text-white">
                        Save Header
                    </Button>
                </div>
            </form>
        </CustomModal>
    );
}

function HeaderDetailsModal({ open, onClose, header }: { open: boolean; onClose: () => void; header: any }) {
    if (!header) return null;

    return (
        <CustomModal
            open={open}
            onOpenChange={(val) => { if (!val) onClose(); }}
            title="Account Header Details"
            maxWidth="500px"
        >
            <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Code</p>
                        <p className="text-sm font-bold text-slate-900">{header.id}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Type</p>
                        <p className="text-sm font-bold text-slate-900">{header.type}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Name</p>
                        <p className="text-sm font-bold text-slate-900">{header.name}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                        <p className="text-sm font-bold text-slate-900">{header.category}</p>
                    </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Balance</p>
                    <p className="text-xl font-black text-secondary">৳ {header.balance.toLocaleString()}</p>
                </div>
                <div className="flex justify-end pt-2">
                    <Button onClick={onClose} className="bg-secondary text-white">
                        Close
                    </Button>
                </div>
            </div>
        </CustomModal>
    );
}

export default function AccountHeadersPage() {
    const [search, setSearch] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedHeader, setSelectedHeader] = useState<any>(null);
    const [typeFilter, setTypeFilter] = useState("all");

    // ... (rest of the component remains the same)

    const columns = useMemo(() => [
        {
            header: "Code",
            accessor: (row: any) => row.id,
        },
        {
            header: "Account Name",
            accessor: (row: any) => (
                <div className="font-semibold text-foreground">{row.name}</div>
            )
        },
        {
            header: "Type",
            accessor: (row: any) => (
                <span className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    row.type === "Asset" ? "bg-blue-50 text-blue-600" :
                        row.type === "Liability" ? "bg-purple-50 text-purple-600" :
                            row.type === "Revenue" ? "bg-emerald-50 text-emerald-600" :
                                "bg-amber-50 text-amber-600"
                )}>
                    {row.type.toUpperCase()}
                </span>
            )
        },
        {
            header: "Category",
            accessor: (row: any) => row.category,
        },
        {
            header: "Balance",
            accessor: (row: any) => `৳ ${row.balance.toLocaleString()}`,
        },
        {
            header: "Actions",
            accessor: (row: any) => (
                <div className="flex gap-1 justify-end pr-4">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
                        onClick={() => {
                            setSelectedHeader(row);
                            setIsDetailsModalOpen(true);
                        }}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }
    ], []);

    return (
        <Container className="pb-10">
            <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatsCard title="Total Heads" value="38" icon={ListTree} color="blue" />
                    <StatsCard title="Asset Accounts" value="12" icon={PieChart} color="green" />
                    <StatsCard title="Liability" value="9" icon={Activity} color="orange" />
                    <StatsCard title="Profit/Loss" value="৳ 14.2M" icon={Landmark} color="purple" />
                </div>

                {/* Toolbar */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
                        <Input
                            placeholder="Search account name, code or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="outline" onClick={() => { }}>
                            Search
                        </Button>
                    </div>
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
                        <div className="w-full sm:max-w-[160px]">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="asset">Asset</SelectItem>
                                    <SelectItem value="liability">Liability</SelectItem>
                                    <SelectItem value="revenue">Revenue</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className="bg-black text-white hover:bg-black/90"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            Create Header
                        </Button>
                    </div>
                </div>

                {/* Ledger Table */}
                <CustomTable
                    data={mockHeaders}
                    columns={columns}
                    isLoading={false}
                    scrollAreaHeight="h-[calc(100vh-320px)]"
                />
            </div>

            <HeaderFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <HeaderDetailsModal
                open={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                header={selectedHeader}
            />
        </Container>
    );
}
