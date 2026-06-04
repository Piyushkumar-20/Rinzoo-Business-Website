"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Home, Package, Star, TrendingUp, Mail, Bell, ChevronDown,
  Menu, X, LayoutDashboard, LogOut, LogIn, UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/why-choose-us", label: "Why Rinzoo", icon: Star },
  { href: "/distributor", label: "Distributor", icon: TrendingUp },
  { href: "/contact", label: "Contact", icon: Mail },
];

const ADMIN_ROLES = ["super_admin", "marketing_manager", "sales_manager", "content_manager"];

export function LandingHeader({ logoUrl = "/images/logo.png" }: { logoUrl?: string }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = ADMIN_ROLES.includes(session?.user?.role ?? "");
  const initials = (session?.user?.name ?? "RA")
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur bg-neutral-900/80 border-b border-white/10 transition-shadow",
        scrolled && "shadow-lg shadow-black/30"
      )}
    >
      <div className="max-w-[1140px] mx-auto flex items-center justify-between h-20 px-5 sm:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="size-10 shadow-sm rounded-xl bg-[#2b7fff] flex justify-center items-center overflow-hidden">
            <Image src={logoUrl} alt="Rinzoo logo" width={40} height={40} className="object-cover w-full h-full" priority />
          </div>
          <div className="leading-none flex flex-col">
            <span className="font-extrabold text-[#5ea3ff] text-xl leading-7 tracking-tight">Rinzoo</span>
            <span className="font-medium uppercase text-[#a1a1a1] text-[10px] tracking-widest">by Ropox Industries</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex justify-center items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex px-3 py-2 items-center gap-1.5 text-sm leading-5 border-b-2 transition-colors",
                  isActive(link.href)
                    ? "font-semibold text-[#5ea3ff] border-[#5ea3ff]"
                    : "font-medium text-neutral-50 border-transparent hover:text-[#5ea3ff]"
                )}
              >
                <Icon className="size-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button className="size-10 rounded-full bg-neutral-800 text-neutral-50 p-0 hover:bg-neutral-700" variant="ghost" aria-label="Notifications">
            <Bell className="size-5" />
          </Button>

          {/* Account */}
          {status === "loading" ? (
            <div className="h-10 w-32 rounded-full bg-neutral-800 animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full bg-neutral-800 border border-white/10 flex pl-1 pr-3 py-1 items-center gap-2 hover:bg-neutral-700 transition-colors focus:outline-none">
                  <Avatar className="size-8">
                    <AvatarImage src={session.user.image ?? undefined} alt={session.user.name ?? "Profile"} />
                    <AvatarFallback className="bg-[#2b7fff] text-white text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="leading-none hidden sm:flex flex-col items-start">
                    <span className="font-semibold text-neutral-50 text-sm leading-4 max-w-[90px] truncate">
                      {session.user.name}
                    </span>
                    <span className="text-[#a1a1a1] text-[11px] leading-3">My Account</span>
                  </div>
                  <ChevronDown className="size-4 text-[#a1a1a1]" />
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
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-neutral-50 hover:bg-neutral-800 transition-colors"
              >
                <LogIn className="size-3.5" /> Login
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-1.5 rounded-full bg-[#2b7fff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2b7fff]/90 transition-colors"
              >
                <UserPlus className="size-3.5" /> Sign Up
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="lg:hidden size-10 rounded-full bg-neutral-800 text-neutral-50 flex items-center justify-center"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-neutral-900/95 backdrop-blur">
          <nav className="max-w-[1140px] mx-auto px-5 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(link.href) ? "bg-neutral-800 text-[#5ea3ff]" : "text-neutral-50 hover:bg-neutral-800"
                  )}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
            {!session && (
              <div className="flex gap-2 pt-2 border-t border-white/10 mt-1">
                <Link href="/auth/signin" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-neutral-50">
                  Login
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-lg bg-[#2b7fff] px-4 py-2.5 text-sm font-semibold text-white">
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
