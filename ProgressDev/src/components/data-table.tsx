"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumnId?: string;
  filterPlaceholder?: string;
  meta?: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumnId,
  filterPlaceholder = "Search...",
  meta,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    meta,
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      {filterColumnId && (
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row items-center justify-between  bg-accent">
          <div className="relative w-full sm:max-w-sm">
            <Input
              placeholder={filterPlaceholder}
              value={
                (table.getColumn(filterColumnId)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(filterColumnId)
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm bg-white border-[#c5c6cd]"
            />
          </div>
          <span className="text-xs text-[#75777d] font-medium uppercase tracking-wider">
            Displaying {table.getFilteredRowModel().rows.length} users
          </span>
        </div>
      )}

      {/* Table grid */}
      <div className="overflow-x-auto h-full">
        <Table className="w-full text-left h-full border-collapse">
          <TableHeader className="bg-[#f0f4f8] h-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-6 py-4 text-[10px] font-bold text-foreground uppercase tracking-[0.15em] border-b border-[#c5c6cd]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-[#c5c6cd]">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-accent transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center py-8"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination component */}
      <div className="px-6 py-4 bg-sidebar text-foreground border-t border-border flex items-center justify-between">
        <div className="text-xs text-[#75777d]">
          Showing page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </div>
        <Pagination className="w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (table.getCanPreviousPage()) table.previousPage();
                }}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={table.getState().pagination.pageIndex === i}
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(i);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (table.getCanNextPage()) table.nextPage();
                }}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
