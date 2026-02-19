# Accounting Module — Prisma Models

> **Usage:** Replace the commented-out accounting models in `schema.prisma` with everything below.  
> Also add the noted relation fields to existing `Buyer`, `User`, and `CompanyProfile` models.

---

## New Enums

```prisma
enum JournalEntryType {
  CUSTOMER_DUE
  RECEIPT
  SUPPLIER_DUE
  PAYMENT
  JOURNAL
  CONTRA
}

enum JournalEntryStatus {
  DRAFT
  POSTED
}
```

> `AccountType` and `EntryType` enums already exist in your schema — keep them as-is.

---

## New Models

### Supplier

```prisma
model Supplier {
  id        String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String
  phone     String?
  email     String?
  address   String?

  journalEntries JournalEntry[]
  journalLines   JournalLine[]

  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("suppliers")
}
```

---

### AccountHead

```prisma
model AccountHead {
  id          String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name        String
  code        String?     @unique
  type        AccountType
  description String?

  companyProfileId String         @db.Uuid
  companyProfile   CompanyProfile @relation(fields: [companyProfileId], references: [id], onDelete: Cascade)

  journalLines JournalLine[]

  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("account_heads")
}
```

---

### JournalEntry

```prisma
model JournalEntry {
  id          String             @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  voucherNo   String             @unique
  date        DateTime
  type        JournalEntryType
  status      JournalEntryStatus @default(DRAFT)
  narration   String?

  buyerId     String?  @db.Uuid
  buyer       Buyer?   @relation(fields: [buyerId], references: [id])

  supplierId  String?  @db.Uuid
  supplier    Supplier? @relation(fields: [supplierId], references: [id])

  reversesId  String?        @db.Uuid
  reverses    JournalEntry?  @relation("Reversal", fields: [reversesId], references: [id])
  reversedBy  JournalEntry[] @relation("Reversal")

  invoiceRef  String?
  dueDate     DateTime?

  companyProfileId String         @db.Uuid
  companyProfile   CompanyProfile @relation(fields: [companyProfileId], references: [id], onDelete: Cascade)

  createdById String? @db.Uuid
  createdBy   User?   @relation(fields: [createdById], references: [id])

  lines JournalLine[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([type, status])
  @@index([buyerId])
  @@index([supplierId])
  @@index([date])
  @@map("journal_entries")
}
```

---

### JournalLine

```prisma
model JournalLine {
  id             String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid

  journalEntryId String       @db.Uuid
  journalEntry   JournalEntry @relation(fields: [journalEntryId], references: [id], onDelete: Cascade)

  accountHeadId  String       @db.Uuid
  accountHead    AccountHead  @relation(fields: [accountHeadId], references: [id])

  type           EntryType
  amount         Decimal

  buyerId        String?   @db.Uuid
  buyer          Buyer?    @relation(fields: [buyerId], references: [id])

  supplierId     String?   @db.Uuid
  supplier       Supplier? @relation(fields: [supplierId], references: [id])

  createdAt      DateTime  @default(now())

  @@index([journalEntryId])
  @@index([accountHeadId])
  @@map("journal_lines")
}
```

---

### Loan

```prisma
model Loan {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  lenderName      String
  loanType        String?
  principalAmount Decimal
  interestRate    Decimal  @default(0)
  startDate       DateTime
  endDate         DateTime?
  remarks         String?

  companyProfileId String         @db.Uuid
  companyProfile   CompanyProfile @relation(fields: [companyProfileId], references: [id], onDelete: Cascade)

  repayments LoanRepayment[]

  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("loans")
}
```

---

### LoanRepayment

```prisma
model LoanRepayment {
  id               String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid

  loanId           String   @db.Uuid
  loan             Loan     @relation(fields: [loanId], references: [id], onDelete: Cascade)

  installmentNo    Int
  date             DateTime
  principal        Decimal
  interest         Decimal  @default(0)
  totalPaid        Decimal
  remainingBalance Decimal

  journalEntryId   String?  @db.Uuid

  createdAt        DateTime @default(now())

  @@map("loan_repayments")
}
```

---

## Relation Fields to Add to Existing Models

### Add to `Buyer`

```prisma
  journalEntries JournalEntry[]
  journalLines   JournalLine[]
```

### Add to `User`

```prisma
  journalEntries JournalEntry[]
```

### Add to `CompanyProfile`

```prisma
  accountHeads   AccountHead[]
  journalEntries JournalEntry[]
  loans          Loan[]
```

---

## Default Account Heads (Seed Data)

| Code | Name                     | Type      |
| ---- | ------------------------ | --------- |
| 1001 | Cash / Bank Account      | ASSET     |
| 1002 | Accounts Receivable      | ASSET     |
| 1003 | Employee Advance         | ASSET     |
| 2001 | Accounts Payable         | LIABILITY |
| 2002 | Loan Payable             | LIABILITY |
| 2003 | Tax Payable              | LIABILITY |
| 4001 | Sales Revenue            | INCOME    |
| 5001 | Purchase / Expense       | EXPENSE   |
| 5002 | Salary Expense           | EXPENSE   |
| 5003 | Depreciation Expense     | EXPENSE   |
| 5004 | Interest Expense         | EXPENSE   |
| 1004 | Accumulated Depreciation | ASSET     |
