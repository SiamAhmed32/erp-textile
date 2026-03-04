export interface AuditEntry {
  id: string;
  voucherNo: string;
  category: string;
  date: string;
  narration: string;
  status: string;
  buyer?: { name: string } | null;
  supplier?: { name: string } | null;
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  lines?: {
    type: string;
    amount: string | number;
    accountHead?: { name: string };
  }[];
}
