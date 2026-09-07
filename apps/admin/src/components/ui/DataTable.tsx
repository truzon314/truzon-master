'use client';

import { forwardRef, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Button } from './Button';

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
    onPageSizeChange: (pageSize: number) => void;
  };
  selection?: {
    selectedKeys: string[];
    onSelectionChange: (keys: string[]) => void;
  };
  actions?: {
    label: string;
    onClick: (row: T) => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
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
  emptyMessage = 'No data available',
  pagination,
  selection,
  actions,
  className,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; order: 'asc' | 'desc' } | null>(
    sortBy ? { key: sortBy, order: sortOrder || 'asc' } : null
  );

  const handleSort = (key: string) => {
    if (!onSort) return;
    const order = sortConfig?.key === key && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, order });
    onSort(key, order);
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left">
                  <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {selection && (
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selection.selectedKeys.length === data.length && data.length > 0}
                  ref={(el) => { if (el) el.indeterminate = selection.selectedKeys.length > 0 && selection.selectedKeys.length < data.length; }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider',
                  col.sortable && 'cursor-pointer hover:bg-gray-100 select-none',
                  col.headerClassName
                )}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{ width: col.className?.includes('w-') ? undefined : undefined }}
              >
                <div className="flex items-center gap-1">
                  <span>{col.header}</span>
                  {col.sortable && sortConfig?.key === col.key && (
                    <span>{sortConfig.order === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row) => {
            const rowKey = keyExtractor(row);
            const isSelected = selection?.selectedKeys.includes(rowKey);

            return (
              <tr
                key={rowKey}
                className={clsx(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-gray-50',
                  isSelected && 'bg-primary-50'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selection && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx('px-4 py-3 text-sm text-gray-900', col.className)}
                  >
                    {col.render
                      ? col.render(
                          col.accessor
                            ? col.accessor instanceof Function
                              ? col.accessor(row)
                              : row[col.accessor as keyof T]
                            : undefined,
                          row
                        )
                      : col.accessor instanceof Function
                      ? col.accessor(row)
                      : col.accessor
                      ? String(row[col.accessor as keyof T] ?? '')
                      : null}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {actions
                        .filter((action) => !action.condition || action.condition(row))
                        .map((action, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant={action.variant || 'ghost'}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pagination.pageSize}
              onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= (pagination.totalPages || Math.ceil(pagination.total / pagination.pageSize))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;