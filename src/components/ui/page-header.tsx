import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("space-y-1 py-1", className)} {...props}>
      <h1 className="text-2xl font-bold tracking-tight text-black">{title}</h1>
      {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
    </div>
  )
}
