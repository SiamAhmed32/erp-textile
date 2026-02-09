import { CompanyProfile, CompanyProfileApiItem, CompanyProfileFormData } from "./types"

export const normalizeProfile = (item: CompanyProfileApiItem): CompanyProfile => ({
  id: item.id ?? "",
  name: item.name ?? "",
  address: item.address ?? "",
  phone: item.phone ?? "",
  email: item.email ?? "",
  website: item.website ?? "",
  logoUrl: item.logoUrl ?? null,
  city: item.city ?? "",
  country: item.country ?? "",
  companyType: item.companyType ?? "",
  postalCode: item.postalCode ?? "",
  taxId: item.taxId ?? "",
  registrationNumber: item.registrationNumber ?? "",
  tradeLicenseNumber: item.tradeLicenseNumber ?? "",
  tradeLicenseExpiryDate: item.tradeLicenseExpiryDate
    ? item.tradeLicenseExpiryDate.slice(0, 10)
    : "",
  status: item.status ?? "",
  bankName: item.bankName ?? "",
  bankAccountNumber: item.bankAccountNumber ?? "",
  branchName: item.branchName ?? "",
  swiftCode: item.swiftCode ?? "",
  routingNumber: item.routingNumber ?? "",
  createdAt: item.createdAt ?? "",
  updatedAt: item.updatedAt ?? "",
})

export const toFormData = (profile: CompanyProfile): CompanyProfileFormData => ({
  id: profile.id,
  name: profile.name,
  address: profile.address,
  phone: profile.phone,
  email: profile.email,
  website: profile.website,
  logoUrl: profile.logoUrl ?? "",
  city: profile.city,
  country: profile.country,
  companyType: profile.companyType,
  postalCode: profile.postalCode,
  taxId: profile.taxId,
  registrationNumber: profile.registrationNumber,
  tradeLicenseNumber: profile.tradeLicenseNumber,
  tradeLicenseExpiryDate: profile.tradeLicenseExpiryDate,
  status: profile.status,
  bankName: profile.bankName,
  bankAccountNumber: profile.bankAccountNumber,
  branchName: profile.branchName,
  swiftCode: profile.swiftCode,
  routingNumber: profile.routingNumber,
})

export const toApiPayload = (data: CompanyProfileFormData) => {
  const payload: Record<string, string> = {
    name: data.name,
    address: data.address,
    phone: data.phone,
    email: data.email,
    website: data.website,
    city: data.city,
    country: data.country,
    companyType: data.companyType,
    postalCode: data.postalCode,
    taxId: data.taxId,
    registrationNumber: data.registrationNumber,
    tradeLicenseNumber: data.tradeLicenseNumber,
    status: data.status,
    bankName: data.bankName,
    bankAccountNumber: data.bankAccountNumber,
    branchName: data.branchName,
    swiftCode: data.swiftCode,
    routingNumber: data.routingNumber,
  }

  if (data.logoUrl) payload.logoUrl = data.logoUrl
  if (data.tradeLicenseExpiryDate) {
    payload.tradeLicenseExpiryDate = new Date(data.tradeLicenseExpiryDate).toISOString()
  }

  return payload
}

export const getInitials = (name: string) => {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const second = parts[1]?.[0] ?? ""
  return `${first}${second}`.toUpperCase()
}

export const formatDate = (value: string) => {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}
