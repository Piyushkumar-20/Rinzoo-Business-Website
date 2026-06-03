"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUSES = [
  { value: "",         label: "All" },
  { value: "UNREAD",   label: "Unread" },
  { value: "READ",     label: "Read" },
  { value: "REPLIED",  label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
];

export function ContactFilters({ unreadCount }: { unreadCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") ?? "";
  const currentQ = searchParams.get("q") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value); else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          defaultValue={currentQ}
          placeholder="Search name, email, subject…"
          className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const val = e.target.value;
            clearTimeout((window as unknown as Record<string, number>)._contactSearchTimer);
            (window as unknown as Record<string, number>)._contactSearchTimer = window.setTimeout(
              () => updateParam("q", val),
              400
            );
          }}
        />
        {currentQ && (
          <button onClick={() => updateParam("q", "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 shrink-0">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => updateParam("status", s.value)}
            className={cn(
              "relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              currentStatus === s.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {s.label}
            {s.value === "UNREAD" && unreadCount > 0 && (
              <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#e91e63] text-[9px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
