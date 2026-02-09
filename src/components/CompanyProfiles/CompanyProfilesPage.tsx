"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react"
import { Container, PrimaryHeading, PrimaryText, Flex } from "@/components/reusables"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiRequest, extractArray, extractMeta } from "@/lib/api"
import { CompanyProfile, CompanyProfileApiItem } from "./types"
import { companyTypeOptions, statusOptions } from "./constants"
import { formatDate, getInitials, normalizeProfile } from "./helpers"

export function CompanyProfilesPage() {
  const [profiles, setProfiles] = React.useState<CompanyProfile[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = React.useState<CompanyProfile | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const fetchProfiles = React.useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const payload = await apiRequest(`/company-profiles?page=${page}&limit=10`)
      const list = extractArray<CompanyProfileApiItem>(payload).map(normalizeProfile)
      const meta = extractMeta(payload)
      setProfiles(list)
      setTotalPages(meta?.totalPage || meta?.totalPages || 1)
    } catch (err: any) {
      setError(err.message || "Failed to load company profiles")
    } finally {
      setLoading(false)
    }
  }, [page])

  React.useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  const filteredProfiles = React.useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return profiles.filter((profile) => {
      const matchesType = typeFilter === "all" || profile.companyType === typeFilter
      const matchesStatus = statusFilter === "all" || profile.status === statusFilter
      if (!matchesType || !matchesStatus) return false
      if (!normalizedSearch) return true
      const haystack = [profile.name, profile.email, profile.website, profile.city, profile.country]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(normalizedSearch)
    })
  }, [profiles, typeFilter, statusFilter, search])

  const handleRowClick = (profile: CompanyProfile) => {
    router.push(`/company-profile/${profile.id}`)
  }

  const handleDelete = (profile: CompanyProfile) => {
    setDeleteTarget(profile)
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setError("")
    try {
      await apiRequest(`/company-profiles/${deleteTarget.id}`, {
        method: "PATCH",
        body: { isDeleted: true },
      })
      setDeleteOpen(false)
      fetchProfiles()
    } catch (err: any) {
      setError(err.message || "Failed to delete company profile")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Container className="pb-10 pt-6">
      <div className="space-y-2">
        <PrimaryHeading>Company Profiles</PrimaryHeading>
      </div>

      <div className="mt-4" />

      <Flex className="flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <Input
            placeholder="Search by company name, email, or website"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline" className="shrink-0">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto lg:shrink-0">
          <div className="w-full sm:max-w-[180px]">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {companyTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:max-w-[180px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link href="/company-profile/new">Add Company</Link>
          </Button>
        </div>
      </Flex>

      <div className="mt-4" />

      {error && <PrimaryText className="text-sm text-destructive">{error}</PrimaryText>}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.map((profile) => (
              <TableRow
                key={profile.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(profile)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-xs font-semibold text-muted-foreground">
                      {profile.logoUrl ? (
                        <img
                          src={profile.logoUrl}
                          alt={profile.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(profile.name)
                      )}
                    </div>
                    <div>
                      <Link href={`/company-profile/${profile.id}`} className="font-semibold text-foreground">
                        {profile.name || "Unnamed Company"}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {profile.city || "-"} {profile.country ? `, ${profile.country}` : ""}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{profile.email || "-"}</TableCell>
                <TableCell>{profile.website || "-"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {companyTypeOptions.find((option) => option.value === profile.companyType)?.label ||
                    profile.companyType ||
                    "-"}
                </TableCell>
                <TableCell>{formatDate(profile.createdAt)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      profile.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {profile.status === "active" ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="hidden justify-end gap-2 lg:flex">
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Link href={`/company-profile/${profile.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      asChild
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Link href={`/company-profile/${profile.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleDelete(profile)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-end lg:hidden" onClick={(event) => event.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/company-profile/${profile.id}`}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/company-profile/${profile.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(profile)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filteredProfiles.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  No company profiles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {loading && (
        <PrimaryText className="mt-4 text-sm text-muted-foreground">Loading company profiles...</PrimaryText>
      )}

      <Flex className="mt-6 items-center justify-between">
        <PrimaryText className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </PrimaryText>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </Flex>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) setDeleteTarget(null)
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Company?</DialogTitle>
          </DialogHeader>
          <PrimaryText className="text-sm text-muted-foreground">
            This will mark the company as deleted and remove it from the active list. You can’t undo this action.
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
    </Container>
  )
}
