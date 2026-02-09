export type CompanyProfile = {
  id: string
  name: string
  address: string
  phone: string
  email: string
  website: string
  logoUrl: string | null
  city: string
  country: string
  companyType: "PARENT" | "SISTER" | string
  postalCode: string
  taxId: string
  registrationNumber: string
  tradeLicenseNumber: string
  tradeLicenseExpiryDate: string
  status: "active" | "inactive" | string
  bankName: string
  bankAccountNumber: string
  branchName: string
  swiftCode: string
  routingNumber: string
  createdAt: string
  updatedAt: string
}

export type CompanyProfileFormData = Omit<CompanyProfile, "createdAt" | "updatedAt">

export type CompanyProfileApiItem = Partial<CompanyProfile>
