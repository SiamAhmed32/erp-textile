import React from "react";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye } from "lucide-react";
import CustomTable from "@/components/reusables/CustomTable";
import { CustomerLedgerItem } from "./types";
import { Box, Flex, ButtonPrimary } from "@/components/reusables";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/components/reusables/PrimaryButton";

interface CustomerLedgerTableProps {
  data: CustomerLedgerItem[];
  onRowClick: (row: CustomerLedgerItem) => void;
  onSearchChange: (search: string) => void;
  onSearchSubmit: () => void;
  onAddCustomer: () => void;
  search: string;
}

const CustomerLedgerTable = ({
  data,
  onRowClick,
  onSearchChange,
  onSearchSubmit,
  onAddCustomer,
  search,
}: CustomerLedgerTableProps) => {
  const columns = [
    {
      header: "CUSTOMER",
      accessor: (row: CustomerLedgerItem) => (
        <Box className="flex flex-col">
          <span className="font-semibold text-foreground uppercase">
            {row.customerName}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.customerId}
          </span>
        </Box>
      ),
    },
    {
      header: "ADDRESS",
      accessor: (row: CustomerLedgerItem) => (
        <span className="text-xs">{row.address}</span>
      ),
    },
    {
      header: "ENTRIES",
      accessor: (row: CustomerLedgerItem) => row.entries,
      className: "text-center",
    },
    {
      header: "BALANCE",
      accessor: (row: CustomerLedgerItem) => (
        <span className="font-semibold text-secondary">
          ${row.balance.toLocaleString()}
        </span>
      ),
      className: "text-right",
    },
    {
      header: "ACTIONS",
      className: "text-left w-24 pr-4",
      accessor: (row: CustomerLedgerItem) => (
        <div className="flex justify-end pr-2">
          <Button
            size="icon"
            variant="ghost"
            title="View Detail"
            className="h-7 w-7 text-slate-500 hover:text-secondary hover:bg-secondary/10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(row);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Box className="space-y-4">
      <Flex className="items-center justify-between">
        <div className="flex w-full gap-2 lg:max-w-md lg:flex-1">
          <Input
            placeholder="Search order number, buyer, company"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button variant="outline" onClick={onSearchSubmit}>
            Search
          </Button>
        </div>
        <PrimaryButton handleClick={onAddCustomer}>Add Customer</PrimaryButton>
      </Flex>
      <CustomTable
        data={data}
        columns={columns}
        onRowClick={onRowClick}
        scrollAreaHeight="h-[calc(100vh-450px)]"
        className="bg-white rounded-lg shadow-sm border-none overflow-hidden"
      />
    </Box>
  );
};

export default React.memo(CustomerLedgerTable);
