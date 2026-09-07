"use client";

import { Search, RotateCcw } from "lucide-react";
import { usePropertySearch } from "@/modules/properties/PropertySearchContext";
import { PROPERTY_TYPE_OPTIONS } from "@/modules/properties/constants/hero-slides";

const fieldClasses =
  "w-full border-0 border-b-[1.5px] border-border bg-transparent px-1 py-2 sm:py-2.5 text-sm text-navy-900 outline-none focus:border-gold-400 cursor-pointer transition-colors";
const labelClasses = "text-[11px] font-bold tracking-[0.4px] text-text-muted uppercase";

interface SearchBarProps {
  types?: string[];
  idPrefix?: string;
}

export function SearchBar({ types, idPrefix = "search" }: SearchBarProps) {
  const { draft, setDraftField, runSearch, resetSearch, searchActive } = usePropertySearch();
  const propertyTypes = types && types.length > 0 ? types : PROPERTY_TYPE_OPTIONS;

  const hasDraftValues =
    draft.location !== "all" ||
    draft.propertyType !== "all" ||
    draft.budget !== "all" ||
    draft.beds !== "all" ||
    draft.area.trim() !== "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        runSearch();
      }}
      aria-label="Search properties"
      className="flex flex-wrap items-end gap-4 sm:gap-[18px] rounded-2xl bg-white p-5 sm:px-8 sm:py-6 shadow-[0_16px_45px_rgba(10,18,36,0.18)] border border-slate-200/80"
    >
      {/* Location */}
      <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-location`} className={labelClasses}>
          Location
        </label>
        <select
          id={`${idPrefix}-location`}
          value={draft.location}
          onChange={(e) => setDraftField("location", e.target.value)}
          className={fieldClasses}
        >
          <option value="all">All Locations</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Bangalore">Bangalore</option>
        </select>
      </div>

      {/* Property Type */}
      <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-type`} className={labelClasses}>
          Property Type
        </label>
        <select
          id={`${idPrefix}-type`}
          value={draft.propertyType}
          onChange={(e) => setDraftField("propertyType", e.target.value)}
          className={fieldClasses}
        >
          <option value="all">All Types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Budget Range */}
      <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-budget`} className={labelClasses}>
          Budget Range
        </label>
        <select
          id={`${idPrefix}-budget`}
          value={draft.budget}
          onChange={(e) => setDraftField("budget", e.target.value)}
          className={fieldClasses}
        >
          <option value="all">Any Budget</option>
          <option value="under2">Under ₹2 Cr</option>
          <option value="2to5">₹2 Cr - ₹5 Cr</option>
          <option value="5to10">₹5 Cr - ₹10 Cr</option>
          <option value="10plus">₹10 Cr+</option>
        </select>
      </div>

      {/* Area */}
      <div className="flex min-w-[120px] flex-1 flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-area`} className={labelClasses}>
          Area (Sq.Ft)
        </label>
        <input
          id={`${idPrefix}-area`}
          type="text"
          inputMode="numeric"
          value={draft.area}
          onChange={(e) => setDraftField("area", e.target.value)}
          placeholder="Min sq.ft"
          className={fieldClasses}
        />
      </div>

      {/* Bedrooms */}
      <div className="flex min-w-[120px] flex-1 flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-beds`} className={labelClasses}>
          Bedrooms
        </label>
        <select
          id={`${idPrefix}-beds`}
          value={draft.beds}
          onChange={(e) => setDraftField("beds", e.target.value)}
          className={fieldClasses}
        >
          <option value="all">Any Bedrooms</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
          <option value="5+">5+ BHK</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full sm:w-auto items-center gap-2 pt-2 sm:pt-0">
        <button
          type="submit"
          className="flex w-full sm:w-auto items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-navy-900 px-6 py-3.5 text-[13px] font-bold tracking-[0.3px] text-white transition-all hover:bg-navy-800 hover:shadow-md cursor-pointer active:scale-[0.98]"
        >
          <Search size={15} />
          <span>Search Properties</span>
        </button>

        {(hasDraftValues || searchActive) && (
          <button
            type="button"
            onClick={resetSearch}
            title="Reset filters"
            aria-label="Reset filters"
            className="flex items-center justify-center h-[46px] w-[46px] rounded-lg border border-border text-navy-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>
        )}
      </div>
    </form>
  );
}
