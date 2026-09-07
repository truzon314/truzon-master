"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PropertyCard } from "@/modules/properties/PropertyCard";
import { usePropertySearch } from "@/modules/properties/PropertySearchContext";

export function SignatureCollections() {
  const { results, resultLabel, searchActive, resetSearch } = usePropertySearch();

  return (
    <section id="collections" className="relative z-10 pb-24 pt-6 sm:pt-8 lg:pt-[140px] scroll-mt-24">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="inline-block border-b-[3px] border-gold-400 pb-3 font-heading text-[28px] font-bold text-navy-900 sm:text-[34px]">
              {resultLabel}
            </h2>
            {searchActive && (
              <button
                type="button"
                onClick={resetSearch}
                className="mb-2 flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-gold-700 underline cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-gold-500 transition-colors"
          >
            <span>View All Projects</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="rounded-xl bg-surface-subtle p-10 sm:p-14 text-center text-[15px] text-text-body border border-border">
            <p className="mb-4 text-navy-900 font-medium">
              No properties match those filters right now.
            </p>
            <p className="mb-6 text-sm text-text-muted max-w-md mx-auto">
              Try adjusting your location, budget, or property type filters, or speak with our property consultants.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetSearch}
                className="rounded-md bg-gold-400 px-5 py-2.5 text-xs font-bold text-navy-900 hover:bg-gold-500 transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
              <Link
                href="/contact"
                className="rounded-md border border-border bg-white px-5 py-2.5 text-xs font-semibold text-navy-900 hover:bg-slate-50 transition-colors"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {searchActive && results.length > 0 && results.length < 3 ? (
          <p className="mt-6 text-sm text-text-muted">
            Showing every project that matches your filters right now — check back soon as we add more.
          </p>
        ) : null}
      </Container>
    </section>
  );
}
