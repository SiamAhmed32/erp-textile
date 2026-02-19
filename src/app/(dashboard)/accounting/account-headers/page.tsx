"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import { Box, ButtonPrimary, Container, CustomModal, PrimaryHeading, PrimarySubHeading } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Activity, Eye, Info, Landmark, ListTree, PieChart, Plus, SquarePen, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

// Mock Data for Account Headers
const mockHeaders = [
    { id: '1001', name: 'Cash in Hand', type: 'Asset', category: 'Current Asset', balance: 150000 },
    { id: '1002', name: 'Bank Asia', type: 'Asset', category: 'Bank', balance: 2500000 },
    { id: '2001', name: 'Accounts Payable', type: 'Liability', category: 'Current Liability', balance: 50000 },
    { id: '3001', name: 'Sales Revenue', type: 'Revenue', category: 'Operating', balance: 4500000 },
    { id: '4001', name: 'Office Rent', type: 'Expense', category: 'Operating', balance: 20000 },
];

function HeaderFormModal({ open, onClose }: { open: boolean, onClose: () => void }) {
    return (
        <CustomModal open={open} onOpenChange={(v) => !v && onClose()} title="Create Account Header" maxWidth="600px">
            <div className="space-y-4 pt-2 font-outfit">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Code</label>
                        <input type="text" className="form-input" placeholder="e.g. 1003" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Type</label>
                        <select className="form-input">
                            <option>Asset</option>
                            <option>Liability</option>
                            <option>Revenue</option>
                            <option>Expense</option>
                            <option>Equity</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Name</label>
                    <input type="text" className="form-input" placeholder="e.g. Petty Cash" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parent Category</label>
                    <select className="form-input">
                        <option>Current Asset</option>
                        <option>Fixed Asset</option>
                        <option>Current Liability</option>
                        <option>Long Term Debt</option>
                        <option>Operating Expense</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Balance (৳)</label>
                    <input type="text" className="form-input" placeholder="0.00" />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={onClose} className="font-bold">Cancel</Button>
                    <ButtonPrimary onClick={onClose} className="font-bold">Save Header</ButtonPrimary>
                </div>
            </div>
        </CustomModal>
    );
}

export default function AccountHeadersPage() {
    const [search, setSearch] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const columns = useMemo(() => [
        {
            header: "Code",
            accessor: (row: any) => <span className="font-mono text-xs font-bold text-slate-500">{row.id}</span>
        },
        {
            header: "Account Name",
            accessor: (row: any) => (
                <div className="py-2">
                    <span className="font-bold text-slate-900">{row.name}</span>
                </div>
            )
        },
        {
            header: "Type",
            accessor: (row: any) => (
                <span className={cn(
                    "inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-tight",
                    row.type === "Asset" ? "bg-blue-50 text-blue-600" :
                        row.type === "Liability" ? "bg-purple-50 text-purple-600" :
                            row.type === "Revenue" ? "bg-emerald-50 text-emerald-600" :
                                "bg-amber-50 text-amber-600"
                )}>
                    {row.type}
                </span>
            )
        },
        {
            header: "Category",
            accessor: (row: any) => <span className="text-xs text-slate-500 font-medium">{row.category}</span>
        },
        {
            header: "Balance",
            className: "text-right",
            accessor: (row: any) => <span className="font-mono font-black text-slate-900">৳ {row.balance.toLocaleString()}</span>
        },
        {
            header: "Actions",
            className: "text-right w-32 pr-4",
            accessor: (row: any) => (
                <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-black hover:bg-slate-100">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-black hover:bg-slate-100">
                        <SquarePen className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }
    ], []);

    return (
        <Container className="space-y-6 !p-0 pb-10 font-outfit">
            <Box>
                <PrimaryHeading>Account Headers</PrimaryHeading>
                <PrimarySubHeading>Definition and structure of the consolidated Chart of Accounts</PrimarySubHeading>
            </Box>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatsCard title="Total Heads" value="38" icon={ListTree} color="blue" description="Active ledger accounts" />
                <StatsCard title="Asset Accounts" value="12" icon={PieChart} color="green" description="Current & fixed assets" />
                <StatsCard title="Liability" value="9" icon={Activity} color="orange" description="Current & long-term" />
                <StatsCard title="Profit/Loss" value="৳ 14.2M" icon={Landmark} color="purple" description="Net retained earnings" />
            </div>

            {/* Standardized Toolbar - Matches Image Reference */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 flex-1 min-w-[300px]">
                    <Input
                        placeholder="Search account name, code or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white border-slate-200 focus:bg-white transition-all font-medium h-10 flex-1"
                    />
                    <Button variant="outline" className="h-10 px-6 font-bold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 shrink-0">
                        Search
                    </Button>
                </div>

                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-black text-white hover:bg-slate-800 shrink-0 h-10 px-8 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 ml-auto"
                >
                    <Plus className="size-3.5" /> Create Header
                </Button>
            </div>

            {/* Ledger Table */}
            <Box className="bg-white border-2 border-slate-100 rounded-2xl shadow-sm overflow-hidden p-0">
                <CustomTable
                    data={mockHeaders}
                    columns={columns}
                    isLoading={false}
                    scrollAreaHeight="h-auto"
                    rowClassName="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                />
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                    <Info className="size-3" /> System accounts are locked and cannot be deleted
                </div>
            </Box>

            <HeaderFormModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </Container>
    );
}
