export type Buyer = {
  id: string
  name: string
  email: string
  merchandiser: string
  phone: string
  address: string
  location: string
  isDeleted?: boolean
}

export type BuyerFormData = Omit<Buyer, "id"> & { id?: string }
