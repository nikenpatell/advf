import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Save, 
  UserPlus, 
  Mail, 
  Phone, 
  Lock,
  UserCheck,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { 
  getTeamMembers, 
  createTeamMember, 
  updateTeamMember 
} from "@/services/team.service";
import { getRoles, type Role as OrgRole } from "@/services/role.service";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function ManageTeamMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    role: "TEAM_MEMBER",
    status: "ACTIVE",
    customRoleId: ""
  });
  const [orgRoles, setOrgRoles] = useState<OrgRole[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [teamRes, rolesRes] = await Promise.all([
           getTeamMembers(),
           getRoles()
        ]);
        setOrgRoles(rolesRes.data);
        
        if (isEdit) {
          const member = teamRes.data.find((m: any) => m.id === id);
          if (member) {
            setFormData({
              name: member.name,
              email: member.email,
              password: "",
              contactNumber: member.contactNumber || "",
              role: member.role,
              status: member.status || "ACTIVE",
              customRoleId: member.customRoleId || ""
            });
          } else {
            toast.error("Member not found");
            navigate("/my-team");
          }
        }
      } catch (err) {
        toast.error("Cloud synchronization failed");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEdit) {
        const res = await updateTeamMember(id!, formData);
        toast.success(res.message);
      } else {
        if (!formData.name || !formData.email || !formData.password) {
           return toast.error("Essential registry fields are missing.");
        }
        const res = await createTeamMember(formData);
        toast.success(res.message);
      }
      navigate("/my-team");
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
           <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-[40px]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/my-team")} className="rounded-full hover:bg-muted font-bold">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader 
          title={isEdit ? "Edit Personnel" : "Onboard Personnel"} 
          subtitle={isEdit ? `Modifying workstation access for ${formData.name}.` : "Adding new talent to the organizational registry."}
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-xl rounded-[32px] overflow-hidden border border-border/40">
              <div className="h-24 w-full bg-gradient-to-br from-primary/20 to-primary/5" />
              <CardContent className="px-6 pb-8 -mt-12 text-center">
                 <div className="inline-flex h-24 w-24 items-center justify-center rounded-[32px] bg-background border-4 border-background shadow-xl text-3xl font-black text-primary mb-4">
                    {formData.name.charAt(0) || <UserPlus className="h-10 w-10 opacity-20" />}
                 </div>
                 <h3 className="text-xl font-black tracking-tight text-foreground">{formData.name || "New Personnel"}</h3>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                    {formData.customRoleId ? orgRoles.find(r => r._id === formData.customRoleId)?.name : "General Team Member"}
                 </p>
                 <div className="mt-6">
                    <Badge variant="outline" className={cn(
                       "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border-none",
                       formData.status === "ACTIVE" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                    )}>
                       {formData.status} Identity
                    </Badge>
                 </div>
              </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <Card className="border-none shadow-2xl bg-background/50 backdrop-blur-xl rounded-[40px] border border-border/40 overflow-hidden">
              <CardHeader className="p-10 pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-widest text-foreground/80">
                    <UserCheck className="h-5 w-5 text-primary" /> Registry Specification
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-10 pt-0 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Full Identity Name</Label>
                       <div className="relative group">
                          <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Alexander Pierce"
                            className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all font-bold"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Identity Status</Label>
                       <Select 
                         value={formData.status} 
                         onValueChange={(v) => setFormData({...formData, status: v})}
                       >
                         <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all font-bold">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="rounded-2xl border-border/40">
                           <SelectItem value="ACTIVE">Active (Participating)</SelectItem>
                           <SelectItem value="INACTIVE">Inactive (Suspended)</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Organizational Assignment (Optional Custom Role)</Label>
                    <Select 
                      value={formData.customRoleId} 
                      onValueChange={(v) => setFormData({...formData, customRoleId: v})}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all font-bold">
                        <div className="flex items-center gap-2">
                           <ShieldCheck className="h-4 w-4 text-primary" />
                           <SelectValue placeholder="Unified Registry Role" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/40">
                        <SelectItem value="DEFAULT">General Team Member (Baseline Access)</SelectItem>
                        {orgRoles.map(r => (
                           <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Electronic Mail</Label>
                       <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            disabled={isEdit}
                            placeholder="staff@advocate.com"
                            className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all font-bold disabled:opacity-50"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Communication Number</Label>
                       <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input 
                            value={formData.contactNumber}
                            onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                            placeholder="+1 (555) 000-0000"
                            className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all font-bold"
                          />
                       </div>
                    </div>
                 </div>

                 {!isEdit && (
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Registry Access Key (Password)</Label>
                       <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input 
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Initialize secure password..."
                            className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all font-bold"
                          />
                       </div>
                    </div>
                 )}

                 <div className="pt-10 flex items-center justify-between border-t border-border/20">
                    <Button variant="ghost" type="button" onClick={() => navigate("/my-team")} className="rounded-full px-8 text-[10px] font-black uppercase tracking-widest h-12">
                       Discard Changes
                    </Button>
                    <Button 
                      disabled={saving}
                      type="submit"
                      className="h-14 px-10 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl gap-2"
                    >
                       {saving ? "Synchronizing..." : <><Save className="h-4 w-4" /> {isEdit ? "Update Personnel" : "Finalize Onboarding"}</>}
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </form>
    </div>
  );
}
