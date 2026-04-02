import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  Settings2,
  Star,
  Shield,
  Info
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { 
  getRegistry, 
  createType, 
  updateType, 
  type TypeRegistryItem 
} from "@/services/registry.service";

const CATEGORY_LABELS: Record<string, string> = {
  CASE_TYPE: "Case Category",
  CASE_STAGE: "Case Stage",
  PAYMENT_MODE: "Payment Mode",
  DOCUMENT_TYPE: "Document Asset",
  EXPENSE_CATEGORY: "Expense Type",
};

export default function ManageType() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = (searchParams.get("category") || "CASE_TYPE") as TypeRegistryItem["category"];
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    isLive: true, 
    isPrime: false 
  });

  useEffect(() => {
    if (isEdit) {
      const fetchItem = async () => {
        try {
          const res = await getRegistry(category);
          const item = res.data.find((i: TypeRegistryItem) => i._id === id);
          if (item) {
            setFormData({
              title: item.title,
              isLive: item.isLive,
              isPrime: item.isPrime
            });
          } else {
            toast.error("Registry entry not found");
            navigate("/type-management");
          }
        } catch (err) {
          toast.error("Failed to synchronize registry data");
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [id, isEdit, category, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Classification title is required.");

    try {
      setSaving(true);
      if (isEdit) {
        const res = await updateType(id!, { ...formData, category });
        toast.success(res.message);
      } else {
        const res = await createType({ ...formData, category });
        toast.success(res.message);
      }
      navigate(`/type-management?category=${category}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registry update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse pb-12">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
               <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <Skeleton className="h-20 rounded-3xl" />
                     <Skeleton className="h-20 rounded-3xl" />
                  </div>
               </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1 space-y-6">
             <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
                <CardContent className="p-8 space-y-6">
                   <Skeleton className="h-20 w-full rounded-2xl" />
                   <Skeleton className="h-14 w-full rounded-full" />
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(`/type-management?category=${category}`)}
          className="rounded-full hover:bg-muted/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <PageHeader 
            title={isEdit ? "Edit Registry Entry" : "Add New Classification"} 
            subtitle={`Configuring parameters for the ${CATEGORY_LABELS[category] || category} registry.`}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40 overflow-hidden">
            <CardHeader className="p-8 pb-4 bg-muted/20 border-b border-border/10">
               <div className="flex items-center gap-3 mb-1">
                  <div className="h-10 w-10 bg-background border border-border/50 rounded-2xl flex items-center justify-center text-primary shadow-sm">
                     <Settings2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold tracking-tight">Registry Configuration</CardTitle>
                    <CardDescription className="text-[11px] font-medium uppercase tracking-tighter text-muted-foreground">Industrial Orchestration</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="type-title" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Type Title / Designation</Label>
                <Input 
                  id="type-title"
                  placeholder={`e.g. Criminal, Civil, Fast Track...`} 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required
                  className="h-14 rounded-2xl bg-muted/10 border-border/40 text-base font-medium focus:bg-background transition-all"
                />
                <div className="flex items-start gap-2 pl-1 opacity-60">
                   <Info className="h-3 w-3 mt-0.5 text-primary" />
                   <p className="text-[10px] text-muted-foreground">The label that will be displayed in dropdowns and dashboards throughout the platform workstation.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/30">
                 <div className={cn("p-5 rounded-3xl border transition-all flex items-center justify-between group", formData.isLive ? "border-primary/20 bg-primary/5" : "border-border/40 bg-muted/5")}>
                    <div className="flex flex-col gap-0.5">
                       <span className={cn("text-xs font-black uppercase tracking-wide", formData.isLive ? "text-primary" : "text-foreground")}>Active Status</span>
                       <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Global Visibility</span>
                    </div>
                    <Switch checked={formData.isLive} onCheckedChange={(v: boolean) => setFormData({...formData, isLive: v})} />
                 </div>
                 <div className={cn("p-5 rounded-3xl border transition-all flex items-center justify-between group", formData.isPrime ? "border-primary/20 bg-primary/5" : "border-border/40 bg-muted/5")}>
                    <div className="flex flex-col gap-0.5">
                       <div className="flex items-center gap-1.5">
                          <Star className={cn("h-3 w-3", formData.isPrime ? "text-primary fill-primary" : "text-muted-foreground")} />
                          <span className={cn("text-xs font-black uppercase tracking-wide", formData.isPrime ? "text-primary" : "text-foreground")}>Primary Default</span>
                       </div>
                       <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none">System Prioritization</span>
                    </div>
                    <Switch checked={formData.isPrime} onCheckedChange={(v: boolean) => setFormData({...formData, isPrime: v})} />
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
           <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> State Actions
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div className="p-6 rounded-3xl bg-muted/10 border border-border/20 text-center space-y-3">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-relaxed">
                       Registry Context: {CATEGORY_LABELS[category] || category}
                    </p>
                    <p className="text-[9px] text-muted-foreground/60">
                       Changes will affects all active modules utilizing this classification.
                    </p>
                 </div>

                 <div className="pt-6 border-t border-border/20 flex flex-col gap-4">
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="w-full h-14 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
                      onClick={handleSubmit}
                    >
                      {saving ? (
                        <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="h-4 w-4" /> 
                          {isEdit ? "Update Registry" : "Save Entry"}
                        </span>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                      onClick={() => navigate(`/type-management?category=${category}`)}
                    >
                      Discard Changes
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-none bg-muted/10 rounded-[32px] border border-border/20">
              <CardContent className="p-6 space-y-4">
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-center">Governance Notice</span>
                 </div>
                 <p className="text-[10px] text-muted-foreground/60 leading-relaxed text-center">
                    This modification will be logged in the workstation audit trail. System-wide synchronization is initiated upon save.
                 </p>
              </CardContent>
           </Card>
        </div>
      </form>
    </div>
  );
}
