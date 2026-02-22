import Link from "next/link";
import { Plus } from "lucide-react";
import { Container, PageHeader } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import CompanyProfilePage from "./_components/CompanyProfilePage";

export default function Page() {
  return (
    <Container className="pb-10">
      <PageHeader
        title="Company Profiles"
        breadcrumbItems={[
          { label: "Dashboard", href: "/" },
          { label: "Company Profiles" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm"
            asChild
          >
            <Link href="/company-profile/add-new-company">
              <Plus className="mr-2 h-4 w-4" />
              Create New Company
            </Link>
          </Button>
        }
      />
      <div className="mt-4" />
      <CompanyProfilePage />
    </Container>
  );
}
