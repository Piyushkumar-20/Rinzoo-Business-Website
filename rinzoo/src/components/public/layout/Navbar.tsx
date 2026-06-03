"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/why-choose-us", label: "Why Choose Us" },
  { href: "/distributor", label: "Distributor" },
  { href: "/contact", label: "Contact Us" },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999";
const ADMIN_ROLES = ["super_admin", "marketing_manager", "sales_manager", "content_manager"];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = ADMIN_ROLES.includes(session?.user?.role ?? "");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300",
        scrolled ? "shadow-md" : "shadow-sm"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center select-none">
          <Image
            src="/images/logo.png"
            alt="Rinzoo"
            width={130}
            height={52}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "text-[#e91e63] font-semibold"
                      : "text-gray-700 hover:text-[#e91e63]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: WhatsApp + Auth + mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          {/* Auth menu — desktop */}
          <div className="hidden lg:block">
            <UserMenu />
          </div>

          <button
            className="lg:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <ul className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-3 py-2.5 rounded-md text-sm font-medium",
                      pathname === link.href
                        ? "bg-pink-50 text-[#e91e63]"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Mobile WhatsApp */}
              <li className="pt-2 border-t border-gray-100">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </a>
              </li>

              {/* Mobile auth section */}
              <li className="pt-2 border-t border-gray-100">
                {session ? (
                  <div className="space-y-1">
                    <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {session.user.name}
                    </p>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-blue-700 bg-blue-50"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-full bg-[#e91e63] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <UserPlus className="h-4 w-4" />
                      Sign Up Free
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
