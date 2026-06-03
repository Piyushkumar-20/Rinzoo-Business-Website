"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut, LayoutDashboard, LogIn, UserPlus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ADMIN_ROLES = ["super_admin", "marketing_manager", "sales_manager", "content_manager"];

export function UserMenu() {
  const { data: session, status } = useSession();

  // Still loading — render a placeholder to avoid layout shift
  if (status === "loading") {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />;
  }

  // Not logged in — show Login + Sign Up
  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/signin"
          className="flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogIn className="h-3.5 w-3.5" />
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="flex items-center gap-1.5 rounded-full bg-[#e91e63] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c2185b] transition-colors"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Sign Up
        </Link>
      </div>
    );
  }

  const isAdmin = ADMIN_ROLES.includes(session.user.role ?? "");
  const displayName = session.user.name?.split(" ")[0] ?? "Account";
  const initials = (session.user.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 py-1.5 pl-2 pr-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none">
          {/* Avatar */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d1f4a] text-[11px] font-bold text-white">
            {initials}
          </span>
          <span className="max-w-[80px] truncate">{displayName}</span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <p className="font-semibold text-gray-900 truncate">{session.user.name}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{session.user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard" className="cursor-pointer">
                <LayoutDashboard className="h-4 w-4 text-blue-600" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="h-4 w-4 text-gray-500" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
