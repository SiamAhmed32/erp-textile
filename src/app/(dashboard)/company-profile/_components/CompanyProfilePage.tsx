"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, extractArray, extractMeta } from "@/lib/api";
import { PrimaryText } from "@/components/reusables";
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
    const [profiles, setProfiles] = useState<CompanyProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deleteTarget, setDeleteTarget] = useState<CompanyProfile | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchProfiles = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const payload = await apiRequest(`/company-profiles?page=${page}&limit=10`);
            const list = extractArray<CompanyProfileApiItem>(payload).map(normalizeProfile);
            const meta = extractMeta(payload);
            setProfiles(list);
            setTotalPages(meta?.totalPage || meta?.totalPages || 1);
        } catch (err: any) {
            setError(err.message || "Failed to load company profiles");
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const filteredProfiles = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        return profiles.filter((profile) => {
            const matchesType = typeFilter === "all" || profile.companyType === typeFilter;
            const matchesStatus = statusFilter === "all" || profile.status === statusFilter;
            if (!matchesType || !matchesStatus) return false;
            if (!normalizedSearch) return true;
            const haystack = [profile.name, profile.email, profile.website, profile.city, profile.country]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return haystack.includes(normalizedSearch);
        });
    }, [profiles, search, statusFilter, typeFilter]);

    const handleRowClick = useCallback(
        (row: CompanyProfile) => {
            if (!isValidId(row.id)) {
                setError("Invalid company ID.");
                return;
            }
            router.push(`/company-profile/${row.id}`);
        },
        [router]
    );

    const handleDelete = useCallback((profile: CompanyProfile) => {
        if (!isValidId(profile.id)) {
            setError("Invalid company ID.");
            return;
        }
        setDeleteTarget(profile);
        setDeleteOpen(true);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        setError("");
        try {
            await apiRequest(`/company-profiles/${deleteTarget.id}`, {
                method: "PATCH",
                body: { isDeleted: true },
            });
            setDeleteOpen(false);
            fetchProfiles();
        } catch (err: any) {
            setError(err.message || "Failed to delete company profile");
        } finally {
            setDeleting(false);
        }
    }, [deleteTarget, fetchProfiles]);

    return (
        <div className="space-y-4">
            <CompanyProfilesTable
                data={filteredProfiles}
                loading={loading}
                error={error}
                page={page}
                totalPages={totalPages}
                search={search}
                typeFilter={typeFilter}
                statusFilter={statusFilter}
                onSearchChange={setSearch}
                onTypeFilterChange={setTypeFilter}
                onStatusFilterChange={setStatusFilter}
                onAddCompany={() => router.push("/company-profile/add-new-company")}
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
                        This will mark the company as deleted and remove it from the active list.
                    </PrimaryText>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CompanyProfilePage;
