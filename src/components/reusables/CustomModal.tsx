import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CustomModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
    width?: string;
    className?: string;
}

const CustomModal = ({
    open,
    onOpenChange,
    title,
    children,
    maxWidth = "800px",
    width = "90vw",
    className,
}: CustomModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "p-0 overflow-hidden border-none [&>button]:text-white [&>button]:opacity-100 [&>button]:cursor-pointer [&>button]:h-8 [&>button]:w-8 [&>button]:top-6 [&>button]:right-6 [&>button]:rounded-full [&>button]:transition-all [&>button:hover]:bg-white/10 [&>button:hover]:border [&>button:hover]:border-white/50 [&>button]:flex [&>button]:items-center [&>button]:justify-center",
                    className
                )}
                style={{ maxWidth, width }}
            >
                <DialogHeader className="bg-secondary p-6 relative flex flex-row items-center justify-between space-y-0">
                    <DialogTitle className="text-white text-xl font-semibold">{title}</DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CustomModal;
