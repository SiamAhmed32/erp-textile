import React from 'react';
import Footer from '@/components/Footer/Footer';
import { Box } from '@/components/reusables';
import { Navbar } from '@/components/Navbar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Sidebar from "@/components/Sidebar/Sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Sidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="w-full">
                        <Navbar />
                    </div>
                </header>
                <Box className='min-h-screen flex-1 flex flex-col'>
                    <div className="flex-1 p-4">
                        {children}
                    </div>
                    <Footer />
                </Box>
            </SidebarInset>
        </SidebarProvider>
    );
}
