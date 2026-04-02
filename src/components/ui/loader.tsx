import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export function Loader({
  size = "md",
  fullPage = false,
  label,
  className,
}: LoaderProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader2 className={cn("animate-spin text-primary", sizeMap["lg"])} />
        {label && <p className="mt-3 text-xs font-bold uppercase tracking-tighter text-muted-foreground">{label}</p>}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-10 gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} />
      {label && <p className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">{label}</p>}
    </div>
  );
}
