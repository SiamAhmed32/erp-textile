import Link from "next/link";
import { Plus } from "lucide-react";
import { Container, PageHeader } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import OrderPage from "./_components/OrderPage";

export default function Page() {
  return (
    <Container className="pb-10">
      <PageHeader
        title="Production Orders"
        breadcrumbItems={[
          { label: "Dashboard", href: "/" },
          { label: "Order Management", href: "/order-management/orders" },
          { label: "Orders" },
        ]}
        actions={
          <Button
            className="bg-black text-white hover:bg-black/90 shadow-sm"
            asChild
          >
            <Link href="/order-management/orders/add-new-order">
              <Plus className="mr-2 h-4 w-4" />
              Create New Order
            </Link>
          </Button>
        }
      />
      <OrderPage />
    </Container>
  );
}
