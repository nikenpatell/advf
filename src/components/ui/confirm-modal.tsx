import { Loader2, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "destructive" | "primary";
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the data from our servers.",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
  variant = "destructive"
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-sm shadow-2xl rounded-2xl border border-border bg-card overflow-hidden">
        <CardHeader className="bg-muted/50 border-b border-border p-6 text-center">
            <div className={cn(
               "mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-all scale-100",
               variant === "destructive" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-primary/10 text-primary"
            )}>
               <Trash2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">{title}</CardTitle>
            <CardDescription className="text-sm mt-2 leading-relaxed">
              {description}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
           <div className="flex flex-col gap-2">
              <Button 
                onClick={onConfirm} 
                disabled={loading}
                className={cn(
                  "w-full h-11 rounded-full font-bold transition-all active:scale-95",
                  variant === "destructive" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : confirmText}
              </Button>
              <Button 
                variant="ghost" 
                onClick={onClose} 
                disabled={loading}
                className="w-full h-11 rounded-full font-bold text-muted-foreground hover:bg-muted"
              >
                {cancelText}
              </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
