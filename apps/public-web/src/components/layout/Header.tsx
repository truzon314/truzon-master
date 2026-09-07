"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Info,
  Building2,
  BookOpen,
  Phone,
  Heart,
  Scale,
  HelpCircle,
  ChevronRight,
  ImageIcon,
  MessageSquare,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";
import logoHeader from "@/public/images/extracted/Logo.svg";
import { GetInTouchMenu } from "@/components/layout/GetInTouchMenu";
import { Container } from "@/components/ui/Container";
import { useScrolled } from "@/hooks/useScrolled";
import { CONTACT_INFO } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import type { NavLink } from "@/types";

const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/about": Info,
  "/projects": Building2,
  "/blog": BookOpen,
  "/contact": Phone,
};

const QUICK_TOOLS = [
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Saved", href: "/saved-properties", icon: Heart },
  { label: "Compare", href: "/compare", icon: Scale },
  { label: "FAQs", href: "/faqs", icon: HelpCircle },
];

const overlayVariants = {
  closed: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.18,
      ease: [0.32, 0.72, 0, 1],
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.035,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -8, y: 4 },
  open: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Header({
  mainNav,
  logoUrl,
}: {
  mainNav: NavLink[];
  logoUrl?: string | null;
}) {
  const scrolled = useScrolled(80);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = pathname === "/";
  const isSolid = !isHome || scrolled;

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/projects") {
      return (
        pathname === "/projects" ||
        pathname.startsWith("/projects/") ||
        pathname.startsWith("/property/")
      );
    }

    return pathname.startsWith(href);
  };

  // Close mobile menu automatically on navigation route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scrolling while full-screen mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const headerBg = isSolid
    ? "bg-[#FCFCFD] lg:bg-[rgba(255,250,250,0.98)]"
    : "bg-[#FCFCFD] lg:bg-transparent";

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed inset-x-0 top-0 z-[1000] border-b border-navy-900/8 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md transition-[background,backdrop-filter,border-color,padding] duration-300",
          headerBg,
          !isHome && "lg:sticky",
          !isSolid &&
            "lg:border-transparent lg:shadow-none lg:backdrop-blur-none",
        )}
      >
        <Container size="wide">
          <div
            className={cn(
              "flex items-center justify-between gap-3 py-2 transition-[padding] duration-300 lg:grid lg:grid-cols-[auto_1fr_auto] lg:justify-normal lg:gap-6",
              isSolid ? "lg:py-2" : "lg:py-1.5",
            )}
          >
            {/* Main Header Logo */}
            <Link
              href="/"
              className="relative flex shrink-0 items-center focus:outline-none"
              aria-label="Truzon Homes - Home"
            >
              <Image
                src={logoUrl || logoHeader}
                alt="Truzon Homes"
                priority
                {...(logoUrl ? { width: 400, height: 120 } : {})}
                className={cn(
                  "relative h-[88px] sm:h-[106px] w-auto transition-[height] duration-300",
                  isSolid ? "lg:h-[106px]" : "lg:h-[115px]",
                )}
              />
            </Link>

            {/* Desktop navigation */}
            <nav
              aria-label="Primary"
              className="hidden flex-wrap items-center justify-center gap-9 lg:flex"
            >
              {mainNav.map((link) => {
                const active = isActiveLink(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "border-b-2 pb-1.5 text-[13px] font-medium tracking-[0.5px] transition-all hover:-translate-y-0.5",
                      isSolid
                        ? active
                          ? "border-gold-500 font-semibold text-gold-600"
                          : "border-transparent text-navy-800 hover:border-navy-900 hover:text-navy-900"
                        : active
                          ? "border-gold-200 font-semibold text-gold-200 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
                          : "border-transparent text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] hover:border-gold-200 hover:text-gold-200",
                    )}
                  >
                    {link.label.toUpperCase()}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA & Mobile Actions */}
            <div className="flex items-center justify-end gap-2.5 sm:gap-3 lg:gap-[22px]">
              <div className="hidden items-center gap-5 lg:flex">
                <GetInTouchMenu scrolled={isSolid} />
              </div>

              {/* Mobile Call Shortcut */}
              <a
                href={CONTACT_INFO.callbackPhoneHref}
                aria-label="Call Truzon Homes"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900/5 text-navy-900 transition-all hover:bg-gold-400/20 active:scale-95 lg:hidden"
              >
                <Phone size={20} className="text-gold-500" />
              </a>

              {/* Mobile Menu Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-primary-nav"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900/5 text-navy-950 transition-all duration-200 hover:bg-gold-400/15 active:scale-95 lg:hidden cursor-pointer"
              >
                <Menu size={24} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Modern Luxury Full-Screen Mobile Navigation (Portaled to document.body to prevent containing block trap) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ backgroundColor: "#ffffff" }}
                className="fixed inset-0 z-[9999] flex h-full w-full flex-col overflow-hidden bg-white text-navy-950 lg:hidden"
              >
                {/* Full-Screen Top Header Bar */}
                <div className="flex shrink-0 items-center justify-between border-b border-navy-900/10 px-5 pt-[calc(14px+env(safe-area-inset-top))] pb-3.5 bg-white/95 backdrop-blur-md">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center focus:outline-none"
                    aria-label="Truzon Homes Home"
                  >
                    <Image
                      src={logoUrl || logoHeader}
                      alt="Truzon Homes"
                      priority
                      {...(logoUrl ? { width: 380, height: 110 } : {})}
                      className="h-[75px] sm:h-[88px] w-auto max-w-[300px] object-contain"
                    />
                  </Link>

                  <div className="flex items-center gap-2.5">
                    {/* 1-Tap Mobile Call Shortcut */}
                    <a
                      href={CONTACT_INFO.callbackPhoneHref}
                      aria-label="Call Truzon Homes"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900/5 text-navy-900 border border-navy-900/8 transition-all hover:bg-gold-500/15 active:scale-95"
                    >
                      <Phone size={19} className="text-gold-600" />
                    </a>

                    {/* Prominent Gold Close Button */}
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Close menu"
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-navy-950 shadow-md shadow-gold-500/20 active:scale-95 transition-all cursor-pointer ring-2 ring-gold-400/40"
                    >
                      <X size={23} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Scrollable Full-Screen Menu Body */}
                <nav
                  id="mobile-primary-nav"
                  aria-label="Mobile primary"
                  className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 flex flex-col gap-6 touch-pan-y [webkit-overflow-scrolling:touch]"
                >


                  {/* Primary Nav Links */}
                  <div className="flex flex-col gap-1.5">
                    {mainNav.map((link) => {
                      const active = isActiveLink(link.href);
                      const Icon = NAV_ICONS[link.href] || Building2;

                      return (
                        <motion.div key={link.href} variants={itemVariants}>
                          <Link
                            href={link.href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "group flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold tracking-[0.4px] transition-all duration-200",
                              active
                                ? "bg-gradient-to-r from-gold-500/15 via-gold-500/5 to-transparent text-navy-950 border-l-4 border-gold-500 shadow-xs font-bold"
                                : "text-navy-800 hover:bg-navy-900/[0.04] hover:text-navy-950 active:bg-navy-900/[0.07]"
                            )}
                          >
                            <div className="flex items-center gap-3.5">
                              <span
                                className={cn(
                                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                                  active
                                    ? "bg-gradient-to-br from-gold-500 to-gold-400 text-navy-950 shadow-sm shadow-gold-500/25"
                                    : "bg-navy-900/5 text-navy-600 group-hover:bg-gold-500/15 group-hover:text-gold-700"
                                )}
                              >
                                <Icon size={18} strokeWidth={2.2} />
                              </span>
                              <span>{link.label}</span>
                            </div>
                            <ChevronRight
                              size={18}
                              className={cn(
                                "transition-transform duration-200 group-hover:translate-x-1",
                                active ? "text-gold-600 font-bold" : "text-navy-300 group-hover:text-navy-600"
                              )}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Quick Access Tools Grid */}
                  <motion.div variants={itemVariants} className="pt-1">
                    <span className="mb-2.5 block text-[11px] font-bold uppercase tracking-[1.2px] text-navy-500 font-semibold">
                      Explore Tools
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {QUICK_TOOLS.map((tool) => {
                        const Icon = tool.icon;
                        const active = pathname === tool.href;
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-xs font-medium transition-all duration-150 shadow-xs",
                              active
                                ? "border-gold-500/40 bg-gold-50 text-gold-800 font-semibold"
                                : "border-navy-900/8 bg-slate-50/80 text-navy-800 hover:bg-slate-100 hover:text-navy-950"
                            )}
                          >
                            <Icon size={15} className="text-gold-600 shrink-0" />
                            <span className="truncate">{tool.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Direct Advisory & CTA Card */}
                  <motion.div
                    variants={itemVariants}
                    className="rounded-2xl border border-gold-500/25 bg-gradient-to-br from-gold-500/[0.08] via-white to-slate-50/90 p-5 shadow-sm"
                  >
                    <div className="mb-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-navy-950">Direct Advisory</p>
                        <p className="text-xs text-navy-600">
                          Connect with our senior property consultant
                        </p>
                      </div>
                      <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                      <a
                        href={CONTACT_INFO.callbackPhoneHref}
                        className="flex items-center justify-center gap-2 rounded-xl bg-white border border-navy-900/10 py-3 text-xs font-semibold text-navy-900 shadow-xs transition-all hover:bg-navy-50 active:scale-98"
                      >
                        <Phone size={15} className="text-gold-600" />
                        Call Now
                      </a>
                      <a
                        href={CONTACT_INFO.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-500/30 py-3 text-xs font-semibold text-emerald-800 shadow-xs transition-all hover:bg-emerald-100 active:scale-98"
                      >
                        <MessageSquare size={15} className="text-emerald-600" />
                        WhatsApp
                      </a>
                    </div>

                    <Link
                      href="/contact#request-callback"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 py-3.5 text-xs font-bold tracking-[0.5px] text-navy-950 shadow-md shadow-gold-500/25 transition-all hover:brightness-105 active:scale-[0.99]"
                    >
                      <CalendarClock size={16} />
                      BOOK A PRIVATE SITE VISIT
                    </Link>
                  </motion.div>

                  {/* Footer Assurance Tag */}
                  <div className="text-center pt-2 pb-[calc(24px+env(safe-area-inset-bottom))]">
                    <p className="text-[10.5px] uppercase tracking-[1px] text-navy-400 font-medium">
                      DTCP & RERA Approved • 15+ Years of Excellence
                    </p>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}