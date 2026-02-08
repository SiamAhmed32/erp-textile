export type InvoiceTerms = {
  id: string
  name: string
  payment: string
  delivery: string
  advisingBank: string
  negotiation: string
  origin: string
  swiftCode: string
  binNo: string
  hsCode: string
  remarks: string
  isDeleted?: boolean
}

export type InvoiceTermsFormData = Omit<InvoiceTerms, "id"> & { id?: string }

export type InvoiceTermsErrors = Partial<Record<keyof InvoiceTermsFormData, string>>
