import { User } from "@/app/(dashboard)/users/_components/types";
import { Invoice } from "@/app/(dashboard)/invoice-management/invoices/_components/types";

export type LCManagement = {
  id: string;
  bblcNumber: string;
  dateOfOpening: string;
  notifyParty?: string;
  lcIssueBankName: string;
  lcIssueBankBranch: string;
  destination?: string;
  issueDate: string;
  expiryDate: string;
  amount: number;
  userId: string;
  user?: User;
  invoiceId: string;
  invoice?: Invoice;
  createdAt: string;
  updatedAt: string;
};

export type CreateLCManagementInput = {
  bblcNumber: string;
  dateOfOpening: string;
  notifyParty?: string;
  lcIssueBankName: string;
  lcIssueBankBranch: string;
  destination?: string;
  issueDate: string;
  expiryDate: string;
  amount: number;
  invoiceId: string;
};

export type UpdateLCManagementInput = Partial<CreateLCManagementInput>;
