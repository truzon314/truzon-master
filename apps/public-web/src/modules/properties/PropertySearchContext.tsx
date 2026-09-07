"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Property, PropertyFilters } from "@/modules/properties/types";

const DEFAULT_FILTERS: PropertyFilters = {
  location: "all",
  propertyType: "all",
  budget: "all",
  beds: "all",
  area: "",
};

// The unfiltered "Signature Collections" view is meant to be a curated
// highlight, not the full catalog — capped at 3 regardless of how many
// properties are flagged `is_signature` (a full row on the 3-column grid,
// with "View All Projects" right there for anyone who wants the rest).
const DEFAULT_SIGNATURE_COUNT = 3;

interface PropertySearchContextValue {
  draft: PropertyFilters;
  setDraftField: (field: keyof PropertyFilters, value: string) => void;
  runSearch: () => void;
  resetSearch: () => void;
  searchActive: boolean;
  results: Property[];
  resultLabel: string;
}

const PropertySearchContext = createContext<PropertySearchContextValue | null>(null);

function matchesFilters(property: Property, filters: PropertyFilters) {
  // Case-insensitive location match
  if (
    filters.location !== "all" &&
    property.city.trim().toLowerCase() !== filters.location.trim().toLowerCase()
  ) {
    return false;
  }

  // Case-insensitive property type match
  if (
    filters.propertyType !== "all" &&
    property.type.trim().toLowerCase() !== filters.propertyType.trim().toLowerCase()
  ) {
    return false;
  }

  // Budget bracket match
  if (filters.budget !== "all" && property.budgetBracket !== filters.budget) {
    return false;
  }

  // Bedroom options match
  if (filters.beds !== "all") {
    const opts = property.bedsOptions ?? [];
    if (filters.beds === "5+") {
      const has5Plus = opts.some((b) => b === "5+" || parseInt(b, 10) >= 5);
      if (!has5Plus) return false;
    } else {
      if (!opts.includes(filters.beds)) return false;
    }
  }

  // Area (sq.ft) match - clean commas/spaces e.g. "2,000" -> 2000
  if (filters.area && filters.area.trim() !== "") {
    const cleanNum = filters.area.replace(/[^0-9.]/g, "");
    const minArea = parseFloat(cleanNum);
    if (!Number.isNaN(minArea) && property.areaSqft < minArea) {
      return false;
    }
  }

  return true;
}

/**
 * Shared filter state for the hero search bar and the Signature Collections
 * grid below it.
 */
export function PropertySearchProvider({
  properties,
  children,
}: {
  properties: Property[];
  children: ReactNode;
}) {
  const [draft, setDraft] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);
  const [searchActive, setSearchActive] = useState(false);

  const setDraftField = (field: keyof PropertyFilters, value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const runSearch = () => {
    setFilters(draft);
    setSearchActive(true);

    if (typeof window !== "undefined") {
      // Small timeout to allow state to settle, then smoothly scroll to results
      setTimeout(() => {
        const el = document.getElementById("collections");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  };

  const resetSearch = () => {
    setDraft(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setSearchActive(false);
  };

  const results = useMemo(() => {
    if (searchActive) {
      return properties.filter((p) => matchesFilters(p, filters));
    }
    // Default signature highlight
    return properties.slice(0, DEFAULT_SIGNATURE_COUNT);
  }, [searchActive, properties, filters]);

  const resultLabel = searchActive
    ? `${results.length} ${results.length === 1 ? "Match" : "Matches"} Found`
    : "Signature Collections";

  const value: PropertySearchContextValue = {
    draft,
    setDraftField,
    runSearch,
    resetSearch,
    searchActive,
    results,
    resultLabel,
  };

  return <PropertySearchContext.Provider value={value}>{children}</PropertySearchContext.Provider>;
}

export function usePropertySearch() {
  const ctx = useContext(PropertySearchContext);
  if (!ctx) throw new Error("usePropertySearch must be used within a PropertySearchProvider");
  return ctx;
}
