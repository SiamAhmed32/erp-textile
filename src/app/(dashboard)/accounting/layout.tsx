"use client";

import React from 'react';

export default function AccountingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {children}
        </div>
    );
}
