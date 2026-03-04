"use client";

import React, { useMemo } from "react";
import { AccountHeader } from "./types";
import {
  SquarePen,
  Eye,
  ShieldCheck,
  FolderTree,
  FileCode2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  data: AccountHeader[];
  loading: boolean;
  onEdit: (header: AccountHeader) => void;
  onDelete: (header: AccountHeader) => void;
  onView: (header: AccountHeader) => void;
};

// ── Type ordering ──
const TYPE_ORDER: AccountHeader["type"][] = [
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "INCOME",
  "EXPENSE",
];

const TYPE_BADGE: Record<string, string> = {
  ASSET: "bg-sky-50 text-sky-700 border border-sky-200",
  LIABILITY: "bg-rose-50 text-rose-700 border border-rose-200",
  EQUITY: "bg-violet-50 text-violet-700 border border-violet-200",
  INCOME: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  EXPENSE: "bg-amber-50 text-amber-700 border border-amber-200",
};

// ── Tree builder ──
interface TreeNode extends AccountHeader {
  children: TreeNode[];
}

function buildTree(items: AccountHeader[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];
  for (const item of items) map.set(item.id, { ...item, children: [] });
  for (const item of items) {
    const node = map.get(item.id)!;
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// ── Flatten tree ──
function flattenTree(nodes: TreeNode[], depth = 0): { node: TreeNode; depth: number }[] {
  let result: { node: TreeNode; depth: number }[] = [];
  for (const node of nodes) {
    result.push({ node, depth });
    if (node.children.length > 0) {
      result = result.concat(flattenTree(node.children, depth + 1));
    }
  }
  return result;
}

// ── Main component ──
const AccountHeadersTable = ({ data, loading, onEdit, onDelete, onView }: Props) => {
  const flattenedData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => {
      const aIndex = TYPE_ORDER.indexOf(a.type);
      const bIndex = TYPE_ORDER.indexOf(b.type);
      return aIndex - bIndex;
    });
    const tree = buildTree(sortedData);
    return flattenTree(tree);
  }, [data]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="overflow-auto border rounded-md">
        <div className="flex items-center bg-zinc-900 h-12">
          <div className="flex-1 px-4 h-4 bg-zinc-700/50 rounded w-40 mx-4 animate-pulse" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={cn("flex items-center h-[72px] px-4 gap-3 animate-pulse", i % 2 === 0 ? "bg-white" : "bg-zinc-50/50")}>
            <div className="size-8 bg-zinc-200 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5"><div className="h-3.5 w-48 bg-zinc-200 rounded" /></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-auto border rounded-md bg-white">
      {/* ── Table Header (Exactly like Order/CustomTable) ── */}
      <div className="sticky top-0 z-10 flex items-center bg-zinc-900 h-12 border-none">
        <div className="flex-1 px-4 text-white font-bold text-xs uppercase tracking-widest pl-[62px]">
          Ledger Hierarchy
        </div>
        <div className="w-[180px] px-4 text-white font-bold text-xs uppercase tracking-widest">
          Financial Group
        </div>
        <div className="w-[140px] px-4 text-white font-bold text-xs uppercase tracking-widest text-right">
          Actions
        </div>
      </div>

      <div className="flex flex-col">
        {flattenedData.map(({ node, depth }, idx) => (
          <div
            key={node.id}
            className={cn(
              "flex items-center border-none transition-colors cursor-pointer min-h-[72px]",
              idx % 2 === 0 ? "bg-white" : "bg-secondary/5",
              "hover:bg-secondary/10",
            )}
          >
            {/* ── LEDGER HIERARCHY ── */}
            <div
              className="flex items-center flex-1 px-4 py-4 relative"
              style={{ paddingLeft: `${16 + depth * 38}px` }}
            >
              {/* Relationship Arrow (Professional L-shape) */}
              {depth > 0 && (
                <div
                  className="absolute top-0 h-1/2 border-l-2 border-b-2 border-zinc-200 rounded-bl-lg"
                  style={{
                    left: `${16 + (depth - 1) * 38 + 16}px`,
                    width: '18px'
                  }}
                >
                  <div className="absolute -right-1 bottom-[-4px] border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-4 border-l-zinc-200" />
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0 border z-10",
                  node.isControlAccount ? "bg-zinc-100 border-zinc-200 text-zinc-900" : "bg-white border-zinc-100 text-zinc-400",
                )}
              >
                {node.isControlAccount ? <FolderTree size={16} /> : <FileCode2 size={16} />}
              </div>

              {/* Name & Title */}
              <div className="flex flex-col min-w-0 ml-3">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm truncate",
                    node.isControlAccount ? "font-bold text-foreground" : "font-semibold text-foreground"
                  )}>
                    {node.name}
                  </span>
                  {node.code && (
                    <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {node.code}
                    </span>
                  )}
                  {node.isControlAccount && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-full">
                      <ShieldCheck size={10} />
                      Anchor
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                  {node.isControlAccount ? "Control Header" : "Sub-Ledger Head"}
                  {node.children.length > 0 && (
                    <span className="ml-1.5 lowercase font-medium">({node.children.length})</span>
                  )}
                </span>
              </div>
            </div>

            {/* ── FINANCIAL GROUP ── */}
            <div className="w-[180px] px-4 py-4">
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border uppercase tracking-widest",
                TYPE_BADGE[node.type] || "bg-zinc-100 text-zinc-600 border border-zinc-200",
              )}>
                {node.type}
              </span>
            </div>

            {/* ── ACTIONS ── */}
            <div className="w-[140px] flex items-center justify-end px-4 py-4 gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onView(node); }}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-zinc-100 transition-colors"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(node); }}
                className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-zinc-100 transition-colors"
              >
                <SquarePen size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountHeadersTable;
