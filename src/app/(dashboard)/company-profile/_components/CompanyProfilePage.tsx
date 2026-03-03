"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllQuery, usePatchMutation } from "@/store/services/commonApi";
import { PrimaryText } from "@/components/reusables";
import { notify } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/reusables";

import CompanyProfilesTable from "./CompanyProfilesTable";
import { CompanyProfile, CompanyProfileApiItem } from "./types";
import { isValidId, normalizeProfile } from "./helpers";
import { useDebounce } from "use-debounce";

const CompanyProfilePage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "createdAt",
    dir: "desc",
  });
  const [deleteTarget, setDeleteTarget] = useState<CompanyProfile | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [patchItem] = usePatchMutation();
  const [searchValue] = useDebounce(search, 500);
  const {
    data: profilesPayload,
    isFetching: loading,
    error: profilesError,
    refetch,
  } = useGetAllQuery({
    path: "company-profiles",
    page,
    limit: 10,
    search: searchValue || undefined,
    sortBy: sort.field,
    sortOrder: sort.dir,
    filters: {
      ...(typeFilter !== "all" ? { companyType: typeFilter } : {}),
      ...(statusFilter !== "all" ? { status: statusFilter } : {}),
      ...(showDeleted ? { isDeleted: true } : {}),
    },
  });

  const profiles = useMemo<CompanyProfile[]>(
    () =>
      ((profilesPayload as any)?.data || []).map(
        (item: CompanyProfileApiItem) => normalizeProfile(item),
      ),
    [profilesPayload],
  );

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleTypeFilter = (val: string) => {
    setTypeFilter(val);
    setPage(1);
  };

  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleSort = (newSort: { field: string; dir: "asc" | "desc" }) => {
    setSort(newSort);
    setPage(1);
  };

  const handleRowClick = useCallback(
    (row: CompanyProfile) => {
      if (!isValidId(row.id)) {
        notify.error("Invalid company ID.");
        return;
      }
      router.push(`/company-profile/${row.id}`);
    },
    [router],
  );

  const handleDelete = useCallback((profile: CompanyProfile) => {
    if (!isValidId(profile.id)) {
      notify.error("Invalid company ID.");
      return;
    }
    setDeleteTarget(profile);
    setDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await patchItem({
        path: `company-profiles/${deleteTarget.id}`,
        body: { isDeleted: true },
        invalidate: ["company-profiles"],
      }).unwrap();
      notify.success("Company profile deleted successfully");
      setDeleteOpen(false);
      refetch();
    } catch (err: any) {
      notify.error("Could not delete the company profile. Please try again.");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, patchItem, refetch]);

  const handleRestore = useCallback(
    async (profile: CompanyProfile) => {
      try {
        await patchItem({
          path: `company-profiles/${profile.id}`,
          body: { isDeleted: false },
          invalidate: ["company-profiles"],
        }).unwrap();
        notify.success("Company profile restored successfully");
        refetch();
      } catch (err: any) {
        notify.error(
          "Could not restore the company profile. Please try again.",
        );
      }
    },
    [patchItem, refetch],
  );

  const handleToggleDeleted = useCallback(() => {
    setShowDeleted((prev) => !prev);
    setPage(1);
  }, []);

  return (
    <div className="space-y-4">
      <CompanyProfilesTable
        data={profiles}
        loading={loading}
        page={page}
        totalPages={profilesPayload?.meta?.pagination?.totalPages || 1}
        search={search}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onSearchChange={handleSearch}
        onTypeFilterChange={handleTypeFilter}
        onStatusFilterChange={handleStatusFilter}
        sort={sort}
        onSortChange={handleSort}
        onPageChange={setPage}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        showDeleted={showDeleted}
        onToggleDeleted={handleToggleDeleted}
        onRestore={handleRestore}
      />

      <CustomModal
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Company?"
        maxWidth="450px"
      >
        <div className="space-y-4 pt-2">
          <PrimaryText className="text-sm text-muted-foreground">
            This will mark the company as deleted and remove it from the active
            list.
          </PrimaryText>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default CompanyProfilePage;
