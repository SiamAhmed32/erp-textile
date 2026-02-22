const fs = require('fs');
const files = [
  "src/app/(dashboard)/invoice-management/invoices/_components/InvoiceFormModal.tsx",
  "src/app/(dashboard)/users/_components/UserCreateModal.tsx",
  "src/app/(dashboard)/invoice-management/invoices/_components/InvoiceCreateModal.tsx",
  "src/app/(dashboard)/users/_components/UserEditModal.tsx",
  "src/app/(dashboard)/lc-management/lc-managements/_components/LCEdit.tsx",
  "src/app/(dashboard)/lc-management/lc-managements/_components/LCCreate.tsx",
  "src/app/(dashboard)/users/_components/UsersPage.tsx",
  "src/app/(dashboard)/order-management/orders/_components/OrderCreate.tsx",
  "src/app/(dashboard)/order-management/orders/_components/OrderEdit.tsx",
  "src/components/auth/ForgotPasswordModal.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/toast\./g, 'notify.');
  if (content.includes('import { toast } from "react-toastify"')) {
    content = content.replace(/import { toast } from "react-toastify";?\r?\n/g, '');
  }
  if (!content.includes('import { notify }')) {
    content = 'import { notify } from "@/lib/notifications";\n' + content;
  }
  fs.writeFileSync(file, content);
}
console.log("Done fixing toast to notify");
