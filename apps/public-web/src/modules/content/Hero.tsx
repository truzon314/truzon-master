"use client";

import { useState, useRef } from "react";
import { getImageProps } from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EnquiryForm } from "@/modules/leads/EnquiryForm";
import { SearchBar } from "@/modules/properties/SearchBar";
import { useAutoRotate } from "@/hooks/useAutoRotate";
import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/cms-client";
import heroVillaStreet from "@/public/images/extracted/hero-villa-street.jpg";
import heroTownshipAerial from "@/public/images/extracted/hero-township-aerial.jpg";
import heroVillaTwilight from "@/public/images/extracted/hero-villa-twilight.jpg";

const DEFAULT_SLIDE_IMAGES = [
  heroVillaStreet,
  heroTownshipAerial,
  heroVillaTwilight,
];

export interface HeroSlide {
  heading: string;
  subheading: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  /** Text alignment for the heading & subheading. Defaults to "left". */
  alignment?: "left" | "center" | "right";
}

interface HeroProps {
  slides: HeroSlide[];
  buttonLabel: string;
  buttonHref: string;
  propertyTypes?: string[];
}

export function Hero({ slides, buttonLabel, buttonHref, propertyTypes }: HeroProps) {
  const { index, pause, resume, select } = useAutoRotate(slides.length, 5000);
  const slide = slides[index];

  const [mobileEnquiryOpen, setMobileEnquiryOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = () => select((index - 1 + slides.length) % slides.length);
  const nextSlide = () => select((index + 1) % slides.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (diff > 45) {
      prevSlide();
    } else if (diff < -45) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  return (
    <>
      <section
        className="relative z-20 min-h-dvh lg:min-h-[880px]"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
        aria-label="Featured collections"
      >
        {/* Background slider container (overflow-hidden keeps image zoom contained without clipping the bottom search bar) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {slides.map((s, i) => {
          const common = { alt: "", fill: true as const, sizes: "100vw" };
          const defaultImage = DEFAULT_SLIDE_IMAGES[i % DEFAULT_SLIDE_IMAGES.length];

          const desktopSrc = resolveMediaUrl(s.imageUrl) ?? defaultImage;
          const mobileSrc =
            resolveMediaUrl(s.mobileImageUrl) ??
            resolveMediaUrl(s.imageUrl) ??
            defaultImage;

          const { props: desktopImg } = getImageProps({
            ...common,
            src: desktopSrc,
          });

          const { props: mobileImg } = getImageProps({
            ...common,
            src: mobileSrc,
            loading: i === 0 ? "eager" : "lazy",
          });

          return (
            <div
              key={i}
              className="absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out"
              style={{ opacity: i === index ? 1 : 0 }}
              aria-hidden={i !== index}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ scale: i === index ? 1.05 : 1 }}
                transition={{ duration: 7, ease: "easeOut" }}
              >
                <picture>
                  <source
                    media="(min-width: 1024px)"
                    srcSet={desktopImg.srcSet}
                    sizes={desktopImg.sizes}
                  />
                  <img {...mobileImg} alt="" className="object-cover" />
                </picture>
              </motion.div>
            </div>
          );
        })}

        {/* Soft, Light Scrims — Lighter overlay for enhanced image vibrancy & brightness */}
        {/* 1. Desktop directional soft vignette: subtle left text shading, right side 100% clear */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(8,15,32,0.55)_0%,rgba(8,15,32,0.3)_35%,rgba(8,15,32,0.05)_60%,transparent_75%)] hidden lg:block pointer-events-none" />

        {/* 2. Mobile vertical soft vignette: luminous center with gentle edge shading */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,15,32,0.5)_0%,rgba(8,15,32,0.15)_30%,rgba(8,15,32,0.2)_65%,rgba(8,15,32,0.6)_100%)] lg:hidden pointer-events-none" />

        {/* 3. Gentle header top edge feather */}
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(8,15,32,0.4)_0%,transparent_100%)] pointer-events-none" />

        {/* 4. Gentle bottom edge feather behind search bar */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,rgba(8,15,32,0.5)_0%,transparent_100%)] pointer-events-none" />
      </div>

      {/* ================= DESKTOP SLIDER CONTROLS (Floating Prev/Next) ================= */}
        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-5 top-[48%] -translate-y-1/2 z-20 hidden lg:flex items-center justify-center h-12 w-12 rounded-full bg-navy-950/45 hover:bg-navy-950/85 border border-white/20 hover:border-gold-400 text-white hover:text-gold-300 backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-5 top-[48%] -translate-y-1/2 z-20 hidden lg:flex items-center justify-center h-12 w-12 rounded-full bg-navy-950/45 hover:bg-navy-950/85 border border-white/20 hover:border-gold-400 text-white hover:text-gold-300 backdrop-blur-md transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRight size={24} />
            </button>
          </>
        ) : null}

        {/* ================= DESKTOP VIEW (lg:flex) ================= */}
        <div className="hidden lg:block">
          <Container
            size="wide"
            className="relative z-10 pt-[210px] pb-24"
          >
            <div className="flex flex-col flex-wrap items-start justify-between gap-12 lg:flex-row">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    "max-w-[620px]",
                    slide.alignment === "center" && "text-center",
                    slide.alignment === "right" && "text-right",
                    (!slide.alignment || slide.alignment === "left") && "text-left"
                  )}
                >
                  {/* Luxury Eyebrow Badge */}
                  <div
                    className={cn(
                      "inline-flex items-center gap-2.5 px-3.5 py-1.5 mb-5 rounded-full bg-gold-400/20 border border-gold-400/40 backdrop-blur-md shadow-[0_2px_12px_rgba(212,165,55,0.2)]",
                      slide.alignment === "center" && "mx-auto",
                      slide.alignment === "right" && "ml-auto"
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-gold-300">
                      Truzon Signature Living
                    </span>
                  </div>

                  {/* Desktop Headline with High-Contrast Text Shadows */}
                  <h1 className="mb-5 font-heading text-[52px] xl:text-[68px] font-bold leading-[1.1] text-white [text-shadow:0_3px_20px_rgba(0,0,0,0.85),0_1px_3px_rgba(0,0,0,0.95)]">
                    {slide.heading}
                  </h1>

                  {/* Desktop Subheading */}
                  <p
                    className={cn(
                      "mb-8 max-w-[520px] text-base xl:text-[17px] leading-[1.7] text-slate-100 font-medium [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]",
                      slide.alignment === "center" && "mx-auto",
                      slide.alignment === "right" && "ml-auto"
                    )}
                  >
                    {slide.subheading}
                  </p>

                  {/* Desktop Action Buttons */}
                  <div
                    className={cn(
                      "flex flex-wrap gap-4",
                      slide.alignment === "center" && "justify-center",
                      slide.alignment === "right" && "justify-end"
                    )}
                  >
                    <Button
                      href={buttonHref}
                      variant="gold"
                      className="px-7 py-4 text-[13px] font-bold tracking-wide shadow-[0_8px_24px_rgba(212,165,55,0.35)]"
                    >
                      {buttonLabel}
                    </Button>
                    <Button
                      href="/contact"
                      variant="outline-light"
                      className="px-7 py-4 text-[13px] font-bold tracking-wide bg-navy-950/40 border-white/40 text-white hover:bg-white hover:text-navy-950 backdrop-blur-md transition-all shadow-md"
                    >
                      BOOK SITE VISIT
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Quick Enquiry Card on Desktop */}
              <div className="shrink-0">
                <EnquiryForm types={propertyTypes} />
              </div>
            </div>
          </Container>

          {/* Desktop Scroll Down Indicator */}
          <a
            href="#collections"
            aria-label="Scroll to properties"
            className="absolute bottom-[110px] left-[60px] z-10 hidden animate-bounce-down lg:flex items-center justify-center h-10 w-10 rounded-full bg-navy-950/60 border border-white/20 backdrop-blur-md text-gold-400 hover:text-gold-300 transition-colors shadow-lg"
          >
            <ArrowDown size={18} strokeWidth={2.2} aria-hidden="true" />
          </a>

          {/* Desktop Slide Indicators (Interactive Glass Capsule) */}
          {slides.length > 1 ? (
            <div className="absolute inset-x-0 bottom-[145px] z-[12] flex justify-center">
              <div className="flex items-center gap-3 rounded-full bg-navy-950/65 border border-white/20 backdrop-blur-md px-4 py-2 shadow-xl">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="text-white/70 hover:text-gold-400 p-0.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => select(i)}
                      aria-label={`Show slide ${i + 1}: ${s.heading}`}
                      aria-current={i === index}
                      className="flex h-6 w-6 items-center justify-center cursor-pointer"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          i === index
                            ? "w-[28px] bg-gold-400 shadow-[0_0_10px_rgba(212,165,55,0.7)]"
                            : "w-2 bg-white/45 hover:bg-white/75"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="text-white/70 hover:text-gold-400 p-0.5 transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : null}

          {/* Desktop Search Bar (Floating at bottom on top of next section) */}
          <div className="hidden lg:block lg:absolute lg:inset-x-[60px] lg:-bottom-[58px] lg:z-30 max-w-[1280px] mx-auto">
            <SearchBar types={propertyTypes} idPrefix="desktop" />
          </div>
        </div>

        {/* ================= MOBILE VIEW (lg:hidden) ================= */}
        <div className="lg:hidden relative z-10 min-h-dvh flex flex-col justify-between pt-[calc(115px+env(safe-area-inset-top))] pb-[calc(26px+env(safe-area-inset-bottom))] px-5 xs:px-6">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full my-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45 }}
                className={cn(
                  "w-full",
                  slide.alignment === "center" && "text-center",
                  slide.alignment === "right" && "text-right",
                  (!slide.alignment || slide.alignment === "left") && "text-left"
                )}
              >
                {/* Mobile Eyebrow Pill */}
                <div
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/40 backdrop-blur-md mb-3.5 shadow-sm",
                    slide.alignment === "center" && "mx-auto",
                    slide.alignment === "right" && "ml-auto"
                  )}
                >
                  <Sparkles size={12} className="text-gold-400" />
                  <span className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-gold-300">
                    Signature Properties
                  </span>
                </div>

                {/* Mobile Title with High Legibility */}
                <h1 className="mb-3.5 font-heading text-[32px] xs:text-[38px] sm:text-[46px] font-bold leading-[1.12] tracking-tight text-white [text-shadow:0_3px_18px_rgba(0,0,0,0.9),0_1px_3px_rgba(0,0,0,0.95)]">
                  {slide.heading}
                </h1>

                {/* Mobile Subheading */}
                <p
                  className={cn(
                    "mb-6 text-[14.5px] xs:text-[15.5px] leading-[1.65] text-slate-100 font-medium [text-shadow:0_2px_8px_rgba(0,0,0,0.85)] max-w-[96%]",
                    slide.alignment === "center" && "mx-auto",
                    slide.alignment === "right" && "ml-auto"
                  )}
                >
                  {slide.subheading}
                </p>

                {/* Mobile Dual Action Buttons */}
                <div className="flex flex-col xs:flex-row gap-3 w-full mb-6">
                  <Button
                    href={buttonHref}
                    variant="gold"
                    className="w-full xs:flex-1 py-3.5 text-[13px] font-bold tracking-wide shadow-[0_4px_20px_rgba(212,165,55,0.35)] justify-center rounded-lg"
                  >
                    {buttonLabel}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setMobileEnquiryOpen(true)}
                    className="w-full xs:flex-1 py-3.5 px-4 rounded-lg bg-white/15 hover:bg-white/25 border border-white/35 backdrop-blur-md text-[13px] font-bold tracking-[0.3px] text-white transition-all justify-center cursor-pointer shadow-md active:scale-[0.98]"
                  >
                    QUICK ENQUIRY
                  </button>
                </div>

                {/* Mobile Trust & Feature Highlights */}
                <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-navy-950/65 border border-white/15 backdrop-blur-md text-center shadow-lg">
                  <div>
                    <div className="font-heading font-bold text-white text-xs xs:text-sm">Prime</div>
                    <div className="text-[9.5px] text-slate-300 uppercase tracking-wider font-medium">Locations</div>
                  </div>
                  <div className="border-x border-white/15">
                    <div className="font-heading font-bold text-gold-400 text-xs xs:text-sm">100%</div>
                    <div className="text-[9.5px] text-slate-300 uppercase tracking-wider font-medium">Vastu Verified</div>
                  </div>
                  <div>
                    <div className="font-heading font-bold text-white text-xs xs:text-sm">Ultra</div>
                    <div className="text-[9.5px] text-slate-300 uppercase tracking-wider font-medium">Luxury Living</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Navigation & Controls */}
          <div className="w-full flex items-center justify-between pt-4">
            {/* Slide Pagination Capsule with Tap Controls */}
            {slides.length > 1 ? (
              <div className="flex items-center gap-2 rounded-full bg-navy-950/75 border border-white/20 backdrop-blur-md px-3 py-1.5 shadow-xl">
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="p-1 text-white/70 hover:text-white cursor-pointer active:scale-90 transition-transform"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1.5 px-1">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => select(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className="cursor-pointer py-1"
                    >
                      <span
                        className={cn(
                          "block h-1.5 rounded-full transition-all duration-300",
                          i === index
                            ? "w-6 bg-gold-400 shadow-[0_0_6px_rgba(212,165,55,0.7)]"
                            : "w-1.5 bg-white/40"
                        )}
                      />
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="p-1 text-white/70 hover:text-white cursor-pointer active:scale-90 transition-transform"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : <div />}

            {/* Mobile Scroll Prompt */}
            <a
              href="#search-properties"
              aria-label="Scroll to search properties"
              className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-200/90 rounded-full bg-navy-950/60 border border-white/15 backdrop-blur-md px-3 py-1.5 hover:text-white transition-colors shadow-sm"
            >
              <span>Explore</span>
              <ArrowDown size={13} className="animate-bounce text-gold-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Search Bar - Positioned cleanly below hero without overlapping controls */}
      <div
        id="search-properties"
        className="block lg:hidden px-4 pt-6 pb-2 relative z-20 max-w-lg mx-auto scroll-mt-20"
      >
        <SearchBar types={propertyTypes} idPrefix="mobile" />
      </div>

      {/* Mobile Quick Enquiry Modal Drawer */}
      <AnimatePresence>
        {mobileEnquiryOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileEnquiryOpen(false)}
              className="absolute inset-0"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
                <div className="font-heading font-bold text-lg text-navy-900">
                  Quick Callback Request
                </div>
                <button
                  type="button"
                  onClick={() => setMobileEnquiryOpen(false)}
                  className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 hover:text-navy-900 cursor-pointer"
                  aria-label="Close form"
                >
                  <X size={20} />
                </button>
              </div>
              <EnquiryForm types={propertyTypes} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}