"use client";

import React, { useMemo, useState } from "react";
import { Container, CustomModal, PageHeader } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useGetAllQuery, usePostMutation } from "@/store/services/commonApi";
import {
  AlertCircle,
  ArrowUpCircle,
  Building,
  Plus,
  Search,
  ChevronDown,
  ArrowUpDown,
  History,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  Users
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Supplier, SupplierFormData, SupplierFormSchema } from "./_components/types";

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });

function SupplierFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [postItem] = usePostMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(SupplierFormSchema) as any,
    defaultValues: {
      name: "",
      supplierCode: "",
      email: "",
      phone: "",
      location: "",
      address: "",
      openingLiability: 0,
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: SupplierFormData) => {
    try {
      await postItem({
        path: "suppliers",
        body: data,
        invalidate: ["suppliers"],
      }).unwrap();
      toast.success("Supplier entity onboarded successfully");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to onboard supplier");
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => !val && handleClose()}
      title={<div className="flex items-center gap-2 uppercase tracking-widest text-[10px] font-black text-zinc-400">Onboarding — <span className="text-zinc-900">New Supply Partner</span></div>}
      maxWidth="650px"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Legal Entity Name</Label>
            <Input {...register("name")} placeholder="Karim Traders Ltd." className="h-12 rounded-xl mt-1" />
          </div>
          <div className="col-span-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Reference Code</Label>
            <Input {...register("supplierCode")} placeholder="SUPP-XXX" className="h-12 rounded-xl mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Primary Email</Label>
            <Input {...register("email")} type="email" placeholder="vendor@corp.com" className="h-12 rounded-xl mt-1" />
          </div>
          <div className="col-span-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Direct Contact</Label>
            <Input {...register("phone")} placeholder="+880..." className="h-12 rounded-xl mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Operational Hub</Label>
            <Input {...register("location")} placeholder="Dhaka, BD" className="h-12 rounded-xl mt-1" />
          </div>
          <div className="col-span-1">
            <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Opening Credit (৳)</Label>
            <Input {...register("openingLiability")} type="number" placeholder="0.00" className="h-12 rounded-xl mt-1" />
          </div>
        </div>
        <div>
          <Label className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Registered Address</Label>
          <textarea {...register("address")} className="w-full h-24 rounded-xl border border-zinc-200 p-4 mt-1 focus:ring-2 focus:ring-zinc-900 focus:outline-none" placeholder="..." />
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
          <Button type="button" variant="ghost" className="h-12 px-8 rounded-xl font-bold" onClick={handleClose}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting} className="h-12 px-10 rounded-xl bg-zinc-900 text-white font-bold hover:bg-black">
            {isSubmitting ? "Onboarding..." : "Establish Partnership"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

export default function SupplierLedgerPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({ field: "name", dir: "asc" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: supplierResponse, isLoading } = useGetAllQuery({
    path: "suppliers",
    limit: 100,
    search: search !== "" ? search : undefined,
    sort: sort ? `${sort.dir === "desc" ? "-" : ""}${sort.field}` : undefined,
  });

  const suppliers: Supplier[] = (supplierResponse as any)?.data || [];

  const columns = useMemo(
    () => [
      {
        header: "Partner Entity",
        accessor: (row: Supplier) => (
          <div className="flex items-center gap-4 py-1">
            <div className="size-10 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-black text-[12px] text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all">
              {row.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <span className="font-black text-zinc-900 text-[14px] uppercase tracking-tight">{row.name}</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[9px] font-black text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200">{row.supplierCode || "NO-CODE"}</span>
                <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 uppercase">
                  <MapPin size={10} /> {row.location}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Communications",
        accessor: (row: Supplier) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 lowercase">
              <Mail size={12} className="text-zinc-300" /> {row.email}
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500">
              <Phone size={12} className="text-zinc-300" /> {row.phone}
            </div>
          </div>
        ),
      },
      {
        header: "Financial Status",
        accessor: (row: Supplier) => (
          <div className="flex flex-col">
            <span className="text-[14px] font-mono font-black text-rose-600 italic">
              {fmt(row.openingLiability || 0)}
            </span>
            <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase mt-0.5">Accounts Payable</span>
          </div>
        ),
      },
      {
        header: "Audit Link",
        accessor: (row: Supplier) => (
          <div className="flex items-center gap-2">
            {!row.isDeleted ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black text-[9px] border border-emerald-100 uppercase tracking-widest">
                <ShieldCheck size={11} /> Verified
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-100 text-zinc-400 font-black text-[9px] border border-zinc-200 uppercase tracking-widest">
                Suspended
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Ref",
        className: "text-right pr-6",
        accessor: (row: Supplier) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all rounded-xl"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <Container className="pb-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Briefcase className="w-3 h-3" />
            <span>Supply Chain Finance</span>
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tight italic">Payable Registry</h1>
          <p className="text-zinc-500 text-sm font-medium">Global supplier ledger, credit aging, and payment reconciliation portals.</p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="h-12 px-8 bg-zinc-900 text-white font-bold rounded-xl hover:bg-black transition-all active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Onboard Partner
        </Button>
      </div>

      {/* Premium Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4 shadow-sm">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Partners</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900">{suppliers.length}</span>
            <span className="text-[10px] font-black text-emerald-500 uppercase">Synced</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4 shadow-sm">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Supply</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-zinc-900 italic">{suppliers.filter(s => !s.isDeleted).length}</span>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Entities</span>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4 shadow-sm">
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest text-zinc-400">Aggregate Liability</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 italic">৳ 1.2M</span>
          </div>
        </div>
        <div className="bg-zinc-900 rounded-[2rem] p-6 space-y-4 text-white shadow-2xl shadow-zinc-200">
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Settled (MTD)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black italic">৳ 450K</span>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50/50 border border-zinc-200 rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <Input
            placeholder="Search partner by name, code or location..."
            className="h-12 pl-11 border-zinc-200 bg-white rounded-2xl focus:ring-zinc-900 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-zinc-200 bg-white font-black text-zinc-600 gap-2">
            <ArrowUpDown className="w-4 h-4 text-zinc-400" />
            Sort Matrix
          </Button>
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-zinc-200 bg-white text-zinc-600 font-bold gap-2">
            <History className="w-4 h-4" />
            Audit
          </Button>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <CustomTable
          data={suppliers}
          columns={columns}
          onRowClick={(row) => setExpanded(expanded === row.id ? null : row.id)}
          rowClassName="group cursor-pointer hover:bg-zinc-50 transition-colors"
          scrollAreaHeight="h-[calc(100vh-480px)]"
        />
        {isLoading && (
          <div className="p-12 text-center text-zinc-400 animate-pulse font-black uppercase tracking-widest text-xs">
            Decrypting Partner Data...
          </div>
        )}
      </div>

      {suppliers.map(s => expanded === s.id && (
        <div key={`exp-${s.id}`} className="bg-zinc-50/50 p-10 border-t border-zinc-100 animate-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Registered Office</p>
              <p className="text-sm font-bold text-zinc-700 leading-relaxed italic">{s.address}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Partnership Since</p>
              <p className="text-sm font-bold text-zinc-700 italic">{new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Exposure</p>
              <p className="text-lg font-black text-rose-600 italic">HIGH RISK</p>
            </div>
            <div className="flex items-end justify-end">
              <Button className="h-10 px-6 rounded-xl bg-zinc-900 text-white font-black text-[10px] tracking-widest uppercase italic">Full Audit Report</Button>
            </div>
          </div>
        </div>
      ))}

      <SupplierFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Container>
  );
}
