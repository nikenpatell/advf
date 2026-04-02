import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Save, 
  CheckSquare, 
  Square,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createRole, updateRole, getRoles, type Permission } from "@/services/role.service";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const MODULES = [
  { module: "DASHBOARD", feature: "Dashboard", actions: ["VIEW"] },
  { module: "CASE", feature: "Case Management", actions: ["VIEW", "CREATE", "UPDATE", "DELETE"] },
  { module: "TASK", feature: "Task Management", actions: ["VIEW", "CREATE", "UPDATE", "DELETE"] },
  { module: "TEAM", feature: "Team Management", actions: ["VIEW", "CREATE", "UPDATE", "DELETE"] },
  { module: "CLIENT", feature: "Client Management", actions: ["VIEW", "CREATE", "UPDATE", "DELETE"] },
  { module: "ROLE", feature: "Access Control", actions: ["VIEW", "CREATE", "UPDATE", "DELETE"] },
  { module: "REGISTRY", feature: "Type Management", actions: ["VIEW", "CREATE", "UPDATE", "DELETE"] },
  { module: "CALENDAR", feature: "Calendar", actions: ["VIEW"] },
] as const;

export default function AddEditRole() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<Permission[]>(
    MODULES.map(m => ({ module: m.module, feature: m.feature, actions: ["VIEW"] }))
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [expanded, setExpanded] = useState<string[]>(MODULES.map(m => m.module));

  useEffect(() => {
    if (isEdit) {
      const fetch = async () => {
        try {
          const res = await getRoles();
          const target = res.data.find(r => r._id === id);
          if (target) {
            setName(target.name);
            setPermissions(target.permissions);
          }
        } catch (err) {
          toast.error("Failed to synchronize role parameters.");
        } finally {
          setFetching(false);
        }
      };
      fetch();
    }
  }, [id, isEdit]);

  const toggleAction = (module: string, action: string) => {
    setPermissions(prev => prev.map(p => {
      if (p.module === module) {
        const hasAction = p.actions.includes(action as any);
        return {
          ...p,
          actions: hasAction 
            ? p.actions.filter(a => a !== action) 
            : [...p.actions, action as any]
        };
      }
      return p;
    }));
  };

  const toggleModule = (module: string) => {
    setExpanded(prev => prev.includes(module) ? prev.filter(m => m !== module) : [...prev, module]);
  };

  const handleSubmit = async () => {
    if (!name) return toast.error("Identity identifier missing.");
    try {
      setLoading(true);
      if (isEdit) {
        await updateRole(id, { name, permissions });
        toast.success("Role parameters Modified.");
      } else {
        await createRole({ name, permissions });
        toast.success("New role initialized.");
      }
      navigate("/roles");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
     return <div className="p-8"><Skeleton className="h-[600px] w-full rounded-[40px]" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/roles")} className="rounded-full h-11 w-11 hover:bg-muted shadow-sm transition-all">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader 
          title={isEdit ? "Update Workstation Role" : "Add New Role"} 
          subtitle="Define name and workstation-level permission manifest for personnel."
        />
      </div>

      <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-xl rounded-[40px] border border-border/40 overflow-hidden text-card-foreground">
        <CardContent className="p-10 space-y-10">
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Identity Name</h3>
            <div className="relative group">
               <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <Input 
                 placeholder="e.g. Senior Associate Counselor" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="h-16 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:border-primary/40 focus:ring-primary/10 font-bold transition-all"
               />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Registry Permissions</h3>
            
            <div className="space-y-4">
              {MODULES.map((m) => (
                <div key={m.module} className="rounded-[24px] border border-border/20 overflow-hidden bg-muted/5">
                  <button 
                    onClick={() => toggleModule(m.module)}
                    className="w-full flex items-center justify-between p-6 hover:bg-muted/10 transition-colors"
                  >
                    <span className="text-sm font-black uppercase tracking-widest text-foreground/80">{m.feature}</span>
                    {expanded.includes(m.module) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  
                  {expanded.includes(m.module) && (
                    <div className="p-8 pt-0 grid grid-cols-2 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-300">
                      {m.actions.map(action => {
                        const isSelected = permissions.find(p => p.module === m.module)?.actions.includes(action as any);
                        return (
                          <div 
                            key={action} 
                            onClick={() => toggleAction(m.module, action)}
                            className={cn(
                              "flex items-center gap-3 cursor-pointer group p-3 rounded-xl transition-all border border-transparent",
                              isSelected ? "bg-primary/5 border-primary/20" : "hover:bg-muted/30"
                            )}
                          >
                             <div className={cn(
                                "flex items-center justify-center h-6 w-6 rounded-md transition-all",
                                isSelected ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" : "bg-muted text-muted-foreground"
                             )}>
                                {isSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 opacity-40 group-hover:opacity-100" />}
                             </div>
                             <span className={cn(
                               "text-[10px] font-black uppercase tracking-widest transition-colors",
                               isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                             )}>{action}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full h-16 rounded-[24px] bg-foreground text-background font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-2xl gap-3"
          >
            {loading ? "Synchronizing..." : (
               <>
                 <Save className="h-5 w-5" /> {isEdit ? "Update Parameters" : "Initialize Role"}
               </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
