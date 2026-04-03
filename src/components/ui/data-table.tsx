import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DataTableProps {
  columns: {
    header: string
    className?: string
    width?: string
  }[]
  loading?: boolean
  loadingRows?: number
  empty?: boolean
  emptyMessage?: string
  children: React.ReactNode
  className?: string
}

export function DataTable({
  columns,
  loading,
  loadingRows = 6,
  empty,
  emptyMessage = "No records found in this context.",
  children,
  className,
}: DataTableProps) {
  return (
    <Card className={cn("border-none shadow-none bg-background/50 backdrop-blur-sm rounded-3xl border border-border/40 overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border/40">
              <TableRow className="hover:bg-transparent border-none h-14">
                {columns.map((column, index) => (
                  <TableHead 
                    key={index} 
                    style={{ width: column.width }}
                    className={cn(
                      "font-black text-[11px] uppercase tracking-widest text-foreground whitespace-nowrap", 
                      index === 0 && "pl-8",
                      index === columns.length - 1 && "pr-8 text-right",
                      column.className
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(loadingRows)].map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent border-b border-border/10 h-20">
                    {columns.map((_, j) => (
                      <TableCell 
                        key={j} 
                        className={cn(
                          "py-4", 
                          j === 0 && "pl-8",
                          j === columns.length - 1 && "pr-8 text-right"
                        )}
                      >
                        <div className={cn("flex items-center gap-3", j === columns.length - 1 && "justify-end")}>
                          {j === 0 && <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />}
                          <div className="flex flex-col gap-2 w-full">
                             <Skeleton className={cn("h-4 rounded-md", j === columns.length - 1 ? "ml-auto w-16" : "w-3/4")} />
                             {j === 0 && <Skeleton className="h-3 w-1/2 rounded-md opacity-50" />}
                          </div>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : empty ? (
                <TableRow className="hover:bg-transparent border-none">
                  <TableCell colSpan={columns.length} className="h-60 text-center">
                     <div className="flex flex-col items-center justify-center opacity-30 grayscale">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{emptyMessage}</span>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                children
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export function DataTableRow({ 
  children, 
  className, 
  onClick,
  ...props 
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <TableRow 
      className={cn(
        "group hover:bg-muted/30 transition-all border-b border-border/40 h-20", 
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </TableRow>
  )
}

export function DataTableCell({ 
  children, 
  className, 
  isFirst, 
  isLast,
  ...props 
}: React.TdHTMLAttributes<HTMLTableCellElement> & { isFirst?: boolean; isLast?: boolean }) {
  return (
    <TableCell 
      className={cn(
        "py-4", 
        isFirst && "pl-8",
        isLast && "pr-8 text-right",
        className
      )}
      {...props}
    >
      {children}
    </TableCell>
  )
}
