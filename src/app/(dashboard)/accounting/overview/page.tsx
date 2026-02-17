"use client";

import React from 'react';
import AccountingStats from "./_components/AccountingStats";
import ModuleSummaries from "./_components/ModuleSummaries";
import RecentTransactions from "./_components/RecentTransactions";
import ActiveLoans from "./_components/ActiveLoans";
import {
    mockAccountingStats,
    mockModuleSummaries,
    mockRecentTransactions,
    mockActiveLoans
} from "./_components/types";
import { Flex, Box, PrimaryHeading, PrimarySubHeading } from "@/components/reusables";

const AccountingOverviewPage = () => {
    return (
        <Flex className="flex-col gap-8 p-4 h-full overflow-auto bg-slate-50/30">
            {/* Header section with date and icons handled by main layout, just heading here */}
            <Box>
                <PrimaryHeading>Accounting</PrimaryHeading>
                <PrimarySubHeading>Financial management and bookkeeping</PrimarySubHeading>
            </Box>

            {/* Top Stats Cards */}
            <AccountingStats stats={mockAccountingStats} />

            {/* Middle Section: Module Grid */}
            <Box className="space-y-4">
                <ModuleSummaries modules={mockModuleSummaries} />
            </Box>

            {/* Bottom Section: Transactions and Loans */}
            <Flex className="gap-6 flex-col xl:flex-row">
                <Box className="flex-[3]">
                    <RecentTransactions transactions={mockRecentTransactions} />
                </Box>
                <Box className="flex-[2]">
                    <ActiveLoans loans={mockActiveLoans} />
                </Box>
            </Flex>
        </Flex>
    );
};

export default AccountingOverviewPage;
