"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllQuery, usePatchMutation } from "@/store/services/commonApi";
import { PrimaryText } from "@/components/reusables";
import { notify } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CompanyProfilesTable from "./CompanyProfilesTable";
import { CompanyProfile, CompanyProfileApiItem } from "./types";
import { isValidId, normalizeProfile } from "./helpers";

const CompanyProfilePage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<CompanyProfile | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [patchItem] = usePatchMutation();

  const {
    data: profilesPayload,
    isFetching: loading,
    error: profilesError,
    refetch,
  } = useGetAllQuery({
    path: "company-profiles",
    page,
    limit: 10,
  });

  const profiles = useMemo<CompanyProfile[]>(
    () =>
      ((profilesPayload as any)?.data || []).map(
        (item: CompanyProfileApiItem) => normalizeProfile(item),
      ),
    [profilesPayload],
  );
  const totalPages =
    (profilesPayload as any)?.meta?.pagination?.totalPages || 1;

  useEffect(() => {
    const apiErr = profilesError as any;
    if (!apiErr) return;
    const message =
      apiErr?.data?.error?.message ||
      apiErr?.data?.message ||
      apiErr?.error ||
      "Failed to load company profiles";
    notify.error(message);
  }, [profilesError]);

  const filteredProfiles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return profiles.filter((profile: CompanyProfile) => {
      const matchesType =
        typeFilter === "all" || profile.companyType === typeFilter;
      const matchesStatus =
        statusFilter === "all" || profile.status === statusFilter;
      if (!matchesType || !matchesStatus) return false;
      if (!normalizedSearch) return true;
      const haystack = [
        profile.name,
        profile.email,
        profile.website,
        profile.city,
        profile.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [profiles, search, statusFilter, typeFilter]);

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
      notify.error(err.message || "Failed to delete company profile");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, patchItem, refetch]);

  return (
    <div className="space-y-4">
      <CompanyProfilesTable
        data={filteredProfiles}
        loading={loading}
        page={page}
        totalPages={totalPages}
        search={search}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onTypeFilterChange={setTypeFilter}
        onStatusFilterChange={setStatusFilter}
        onPageChange={setPage}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
      />

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Company?</DialogTitle>
          </DialogHeader>
          <PrimaryText className="text-sm text-muted-foreground">
            This will mark the company as deleted and remove it from the active
            list.
          </PrimaryText>
          <DialogFooter>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyProfilePage;
