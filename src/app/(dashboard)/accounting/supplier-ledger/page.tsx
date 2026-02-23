"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import { Container, CustomModal, InputField } from "@/components/reusables";
import CustomTable from "@/components/reusables/CustomTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowUpCircle, Building, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import SupplierToolbar from "./_components/SupplierToolbar";
import { PageHeader } from "@/components/reusables";

const fmt = (n: number) => "৳ " + Math.abs(n).toLocaleString("en-IN");
import { useGetAllQuery } from "@/store/services/commonApi";
import { Supplier } from "./_components/types";

import { usePostMutation } from "@/store/services/commonApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SupplierFormData, SupplierFormSchema } from "./_components/types";
import toast from "react-hot-toast";
import { Flex } from "@/components/reusables";

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

      toast.success("Supplier created successfully");
      handleClose();
    } catch (error: any) {
      console.error("Failed to create supplier:", error);
      const errorMsg =
        error?.data?.message || error?.message || "Failed to create supplier";
      toast.error(errorMsg);
    }
  };

  return (
    <CustomModal
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          handleClose();
        }
      }}
      title="Add New Supplier"
      maxWidth="650px"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>
              Supplier Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("name")}
              placeholder="e.g. Karim Traders"
              className={cn("mt-1.5", errors.name && "border-red-500")}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label>
              Supplier Code <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("supplierCode")}
              placeholder="e.g. SUPP-004"
              className={cn("mt-1.5", errors.supplierCode && "border-red-500")}
            />
            {errors.supplierCode && (
              <p className="text-xs text-red-500 mt-1">
                {errors.supplierCode.message}
              </p>
            )}
          </div>
          <div>
            <Label>
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="vendor@example.com"
              className={cn("mt-1.5", errors.email && "border-red-500")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label>
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("phone")}
              placeholder="e.g. +8801712345678"
              className={cn("mt-1.5", errors.phone && "border-red-500")}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <Label>
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("location")}
              placeholder="e.g. Dhaka"
              className={cn("mt-1.5", errors.location && "border-red-500")}
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
          <div>
            <Label>Opening Liability (৳)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("openingLiability")}
              placeholder="0.00"
              className={cn(
                "mt-1.5",
                errors.openingLiability && "border-red-500",
              )}
            />
            {errors.openingLiability && (
              <p className="text-xs text-red-500 mt-1">
                {errors.openingLiability.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="address">
            Company Details / Address <span className="text-red-500">*</span>
          </Label>
          <textarea
            {...register("address")}
            placeholder="Supplier office address..."
            className={cn(
              "font-primary input_field w-full px-4 py-2 border focus:outline-none focus:border-transparent focus:ring-2 focus:ring-button transition border-borderBg min-h-[80px] mt-1.5 rounded-lg",
              errors.address && "border-red-500 focus:ring-red-500",
            )}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-8 bg-black text-white hover:bg-black/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Create Supplier"}
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
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "name",
    dir: "asc",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch suppliers from backend
  const { data: supplierResponse, isLoading } = useGetAllQuery({
    path: "suppliers",
    limit: 100,
    search: search !== "" ? search : undefined,
    sort: sort ? `${sort.dir === "desc" ? "-" : ""}${sort.field}` : undefined,
    filters: {
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
    },
  });

  // Handle standard response wrapper { data: [...] }
  const suppliers: Supplier[] = (supplierResponse as any)?.data || [];

  const columns = useMemo(
    () => [
      {
        header: "Supplier",
        accessor: (row: Supplier) => (
          <div>
            <div className="font-semibold text-foreground">{row.name}</div>
            <div className="text-xs text-slate-500">{row.email}</div>
          </div>
        ),
      },
      {
        header: "Code",
        accessor: (row: Supplier) => (
          <span className="font-mono text-xs">{row.supplierCode || "N/A"}</span>
        ),
      },
      {
        header: "Phone",
        accessor: (row: Supplier) => (
          <span className="text-slate-600">{row.phone}</span>
        ),
      },
      {
        header: "Location",
        accessor: (row: Supplier) => (
          <span className="text-slate-600">{row.location}</span>
        ),
      },
      {
        header: "Opening Balance",
        accessor: (row: Supplier) => fmt(row.openingLiability || 0),
      },
      {
        header: "Status",
        accessor: (row: Supplier) => (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              !row.isDeleted
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600",
            )}
          >
            {!row.isDeleted ? "ACTIVE" : "INACTIVE"}
          </span>
        ),
      },
    ],
    [],
  );

  const renderExpandedRow = (row: Supplier) => {
    if (expanded !== row.id) return null;
    return (
      <div className="bg-slate-50/50 p-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Supplier Details
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
              Address
            </p>
            <p className="text-sm font-medium text-slate-700">{row.address}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">
              Created At
            </p>
            <p className="text-sm font-medium text-slate-700">
              {new Date(row.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container className="pb-10">
      <PageHeader
        title="Supplier Ledger"
        breadcrumbItems={[
          //{ label: "Dashboard", href: "/" },
          { label: "Accounting", href: "/accounting" },
          { label: "Supplier Ledger" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm px-6 rounded-lg"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        }
      />

      <div className="space-y-4">
        {/* Stats Cards - 4 column grid matching InvoicesTable */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Suppliers"
            value={suppliers.length}
            icon={Building}
            color="blue"
          />
          <StatsCard
            title="Active Suppliers"
            value={suppliers.filter((s) => !s.isDeleted).length}
            icon={Building}
            color="green"
          />
          <StatsCard
            title="Total Liability"
            value="৳ 0.00"
            icon={AlertCircle}
            color="orange"
          />
          <StatsCard
            title="Paid Amount"
            value="৳ 0.00"
            icon={ArrowUpCircle}
            color="red"
          />
        </div>

        {/* Standardized Toolbar - Matching reference layout */}
        <SupplierToolbar
          search={search}
          setSearch={setSearch}
          status={statusFilter}
          setStatus={setStatusFilter}
          sort={sort}
          setSort={setSort}
        />

        {/* Supplier Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <CustomTable
            data={suppliers}
            columns={columns}
            onRowClick={(row) =>
              setExpanded(expanded === row.id ? null : row.id)
            }
            rowClassName="cursor-pointer"
            scrollAreaHeight="h-[calc(100vh-320px)]"
          />
          {isLoading && (
            <div className="p-8 text-center text-slate-500 animate-pulse">
              Loading suppliers...
            </div>
          )}
        </div>
        {suppliers.map(
          (s) =>
            expanded === s.id && (
              <div key={`exp-${s.id}`}>{renderExpandedRow(s)}</div>
            ),
        )}
      </div>

      <SupplierFormModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Container>
  );
}
