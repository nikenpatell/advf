import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getRoles, deleteRole, type Role } from "@/services/role.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { usePermission } from "@/hooks/usePermission";

export default function ManageRoles() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const [deleting, setDeleting] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await getRoles();
      setRoles(res.data);
      if (res.data.length > 0 && !selectedRole) {
        setSelectedRole(res.data[0]);
      }
    } catch (err) {
      toast.error("Role registry synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async () => {
    if (!roleToDelete) return;
    try {
      setDeleting(true);
      await deleteRole(roleToDelete);
      toast.success("Role successfully dissolved.");
      setRoleToDelete(null);
      fetch();
    } catch (err) {
      toast.error("Role removal failed.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse pb-12">
        <Skeleton className="h-14 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1 space-y-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-2xl" />)}
           </div>
           <div className="lg:col-span-3">
              <Skeleton className="h-[500px] w-full rounded-[32px]" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between gap-6">
        <PageHeader 
          title="Manage Roles & Permissions" 
          subtitle="Configure granular access control and workstation-level privileges for organizational personnel."
        />
        {hasPermission("ROLE", "CREATE") && (
          <Button onClick={() => navigate("/roles/create")} className="h-11 gap-2 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all px-6 shadow-xl">
            <Plus className="h-4 w-4" /> Add New Role
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1 border-none shadow-2xl bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40 overflow-hidden h-fit">
           <div className="p-4 space-y-1">
              {roles.map(role => (
                 <button
                   key={role._id}
                   onClick={() => setSelectedRole(role)}
                   className={cn(
                     "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                     selectedRole?._id === role._id 
                       ? "bg-primary/10 text-primary" 
                       : "hover:bg-muted text-muted-foreground hover:text-foreground"
                   )}
                 >
                    <div className="flex items-center gap-3">
                       <ShieldCheck className={cn("h-4 w-4", selectedRole?._id === role._id ? "text-primary" : "text-muted-foreground")} />
                       <span className="text-sm font-black tracking-tight">{role.name}</span>
                    </div>
                    <ChevronRight className={cn("h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity", selectedRole?._id === role._id && "opacity-100")} />
                 </button>
              ))}
              {roles.length === 0 && (
                 <div className="py-10 text-center space-y-3 opacity-40">
                    <ShieldCheck className="h-10 w-10 mx-auto" />
                    <p className="text-[10px] uppercase font-black tracking-widest leading-relaxed">No custom roles established in the registry.</p>
                 </div>
              )}
           </div>
        </Card>

        <div className="lg:col-span-3">
           {selectedRole ? (
              <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-xl rounded-[40px] border border-border/40 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                 <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
                    <div>
                       <CardTitle className="text-2xl font-black text-foreground tracking-tight">Permissions - {selectedRole.name}</CardTitle>
                       <CardDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground/60 mt-1 italic">Registry privileges manifest</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                       {hasPermission("ROLE", "UPDATE") && (
                         <Button variant="ghost" size="icon" onClick={() => navigate(`/roles/edit/${selectedRole._id}`)} className="h-10 w-10 rounded-full hover:bg-primary/5 text-primary">
                            <Edit2 className="h-4 w-4" />
                         </Button>
                       )}
                       {hasPermission("ROLE", "DELETE") && (
                         <Button variant="ghost" size="icon" onClick={() => setRoleToDelete(selectedRole._id)} className="h-10 w-10 rounded-full hover:bg-destructive/5 text-destructive">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                       )}
                    </div>
                 </CardHeader>
                 <CardContent className="p-10 pt-0 space-y-8">
                    {selectedRole.permissions.map((perm, idx) => (
                       <div key={idx} className="space-y-4">
                          <div className="flex items-center gap-2 py-4 border-b border-border/20">
                             <h4 className="text-sm font-black uppercase tracking-widest text-foreground/80">{perm.feature}</h4>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                             {perm.actions.map(action => (
                                <div key={action} className="flex items-center gap-2 group">
                                   <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
                                      <CheckCircle2 className="h-3 w-3 text-primary" />
                                   </div>
                                   <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">{action}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    ))}
                 </CardContent>
              </Card>
           ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
                 <ShieldCheck className="h-20 w-20" />
                 <h2 className="text-xl font-black uppercase tracking-widest">Identify a role to inspect permissions</h2>
              </div>
           )}
        </div>
      </div>

      <ConfirmModal 
        open={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Dissolve Role Mapping?"
        description="This will permanently remove this role from the organizational registry. Personnel currently assigned this role will lose granular access privileges."
      />
    </div>
  );
}
