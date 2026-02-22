import Link from "next/link";
import { Plus } from "lucide-react";
import { Container, PageHeader } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import LCPage from "./_components/LCPage";

export default function Page() {
  return (
    <Container className="pb-10">
      <PageHeader
        title="Back-to-Back LC (BBLC)"
        breadcrumbItems={[
          { label: "Dashboard", href: "/" },
          { label: "LC Management", href: "/lc-management/lc-managements" },
          { label: "BBLC List" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm"
            asChild
          >
            <Link href="/lc-management/lc-managements/add-new-lc">
              <Plus className="mr-2 h-4 w-4" />
              Create BBLC
            </Link>
          </Button>
        }
      />
      <LCPage />
    </Container>
  );
}
