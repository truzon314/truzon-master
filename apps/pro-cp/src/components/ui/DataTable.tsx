'use client';

import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { Button } from './Button';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages?: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };
  selection?: {
    selectedKeys: string[];
    onSelectionChange: (keys: string[]) => void;
  };
  actions?: {
    label: string;
    onClick: (row: T) => void;
    variant?: 'primary' | 'gold' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    condition?: (row: T) => boolean;
  }[];
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  loading,
  emptyMessage = 'No records found',
  pagination,
  selection,
  actions,
  className,
}: DataTableProps<T>) {
  const [internalSortBy, setInternalSortBy] = useState<string | undefined>(sortBy);
  const [internalSortOrder, setInternalSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    const isAsc = internalSortBy === key && internalSortOrder === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setInternalSortBy(key);
    setInternalSortOrder(newOrder);
    if (onSort) onSort(key, newOrder);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selection) return;
    if (checked) {
      selection.onSelectionChange(data.map(keyExtractor));
    } else {
      selection.onSelectionChange([]);
    }
  };

  const handleSelectRow = (key: string, checked: boolean) => {
    if (!selection) return;
    const newKeys = checked
      ? [...selection.selectedKeys, key]
      : selection.selectedKeys.filter((k) => k !== key);
    selection.onSelectionChange(newKeys);
  };

  if (loading) {
    return (
      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="animate-pulse h-4 bg-slate-200 rounded w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5">
                    <div className="animate-pulse h-4 bg-slate-100 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={clsx('border border-slate-200/90 rounded-xl overflow-hidden bg-white shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/90 border-b border-slate-200">
            <tr>
              {selection && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selection.selectedKeys.length === data.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-[#0f1c3a] focus:ring-[#0f1c3a]"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={clsx(
                    'px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none hover:text-slate-900',
                    col.headerClassName
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && internalSortBy === col.key && (
                      internalSortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selection ? 1 : 0) + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-slate-400 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const key = keyExtractor(row);
                const isSelected = selection?.selectedKeys.includes(key);

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={clsx(
                      'transition-colors hover:bg-slate-50/80',
                      onRowClick && 'cursor-pointer',
                      isSelected && 'bg-blue-50/40'
                    )}
                  >
                    {selection && (
                      <td className="w-10 px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(key, e.target.checked)}
                          className="rounded border-slate-300 text-[#0f1c3a] focus:ring-[#0f1c3a]"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      let cellContent: React.ReactNode = null;
                      const rawVal = typeof col.accessor === 'string'
                        ? (row as any)[col.accessor]
                        : (row as any)[col.key];

                      if (col.render) {
                        cellContent = col.render(rawVal, row);
                      } else if (typeof col.accessor === 'function') {
                        cellContent = col.accessor(row);
                      } else {
                        cellContent = rawVal;
                      }

                      return (
                        <td key={col.key} className={clsx('px-4 py-3.5 text-slate-700 whitespace-nowrap', col.className)}>
                          {cellContent}
                        </td>
                      );
                    })}
                    {actions && actions.length > 0 && (
                      <td className="px-4 py-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {actions.map((act, aIdx) => {
                            if (act.condition && !act.condition(row)) return null;
                            return (
                              <Button
                                key={aIdx}
                                size="sm"
                                variant={act.variant || 'outline'}
                                onClick={() => act.onClick(row)}
                              >
                                {act.label}
                              </Button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-4 py-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800">{Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)}</strong> to{' '}
            <strong className="text-slate-800">{Math.min(pagination.page * pagination.pageSize, pagination.total)}</strong> of{' '}
            <strong className="text-slate-800">{pagination.total}</strong> results
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(1)}
              className="px-2"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="px-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="px-3 py-1 text-slate-700 font-medium">
              Page {pagination.page} of {pagination.totalPages || Math.ceil(pagination.total / pagination.pageSize) || 1}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page >= (pagination.totalPages || Math.ceil(pagination.total / pagination.pageSize) || 1)}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="px-2"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page >= (pagination.totalPages || Math.ceil(pagination.total / pagination.pageSize) || 1)}
              onClick={() => pagination.onPageChange(pagination.totalPages || Math.ceil(pagination.total / pagination.pageSize) || 1)}
              className="px-2"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
