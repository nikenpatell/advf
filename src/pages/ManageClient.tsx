import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Save, 
  UserPlus, 
  Globe, 
  Mail, 
  Phone, 
  Lock,
  ChevronRight,
  Briefcase
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { 
  getTeamMembers, 
  createTeamMember, 
  updateTeamMember 
} from "@/services/team.service";
import { useOrgStore } from "@/store/useOrgStore";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function ManageClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOrg } = useOrgStore();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    role: "CLIENT",
    status: "ACTIVE"
  });

  useEffect(() => {
    if (isEdit) {
      const fetchClient = async () => {
        try {
          const res = await getTeamMembers("CLIENT");
          const client = res.data.find((m: any) => m.id === id);
          if (client) {
            setFormData({
              name: client.name,
              email: client.email,
              password: "",
              contactNumber: client.contactNumber || "",
              role: "CLIENT",
              status: client.status || "ACTIVE"
            });
          } else {
            toast.error("Client identity not found in registry");
            navigate("/clients");
          }
        } catch (err) {
          toast.error("Cloud synchronization failed");
        } finally {
          setLoading(false);
        }
      };
      fetchClient();
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEdit) {
        const { name, contactNumber, role, status } = formData;
        const res = await updateTeamMember(id!, { name, contactNumber, role, status });
        toast.success(res.message);
      } else {
        if (!formData.name || !formData.email || !formData.password) {
           return toast.error("Essential registry fields are missing.");
        }
        const res = await createTeamMember(formData);
        toast.success(res.message);
      }
      navigate("/clients");
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
           <div className="md:col-span-1 space-y-6">
              <Skeleton className="h-[300px] w-full rounded-[32px]" />
              <Skeleton className="h-[150px] w-full rounded-[32px]" />
           </div>
           <div className="md:col-span-2 space-y-6">
              <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
                 <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <Skeleton className="h-12 rounded-2xl" />
                       <Skeleton className="h-12 rounded-2xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <Skeleton className="h-12 rounded-2xl" />
                       <Skeleton className="h-12 rounded-2xl" />
                    </div>
                    <Skeleton className="h-12 w-full rounded-2xl" />
                    <div className="flex justify-between items-center pt-8">
                       <Skeleton className="h-8 w-32 rounded-full" />
                       <Skeleton className="h-14 w-48 rounded-full" />
                    </div>
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
          onClick={() => navigate("/clients")}
          className="rounded-full hover:bg-muted/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <PageHeader 
            title={isEdit ? "Edit Client Registry" : "Onboard New Client"} 
            subtitle={isEdit ? `Modifying legal access for ${formData.name}.` : "Registering a new legal entity for workspace collaboration."}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Identity Cluster */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] overflow-hidden border border-border/40">
            <div className={cn("h-24 w-full bg-gradient-to-br from-primary/20 to-primary/5")} />
            <CardContent className="px-6 pb-8 -mt-12 text-center">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-[32px] bg-background border-4 border-background shadow-xl text-3xl font-black text-primary mb-4 uppercase">
                {formData.name.charAt(0) || <UserPlus className="h-10 w-10 opacity-20" />}
              </div>
              <h3 className="text-xl font-black tracking-tight text-foreground">{formData.name || "New Client"}</h3>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                 Workspace Stakeholder
              </p>
              
              <div className="mt-8 space-y-2">
                 <Badge variant="outline" className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border-none",
                    formData.status === "ACTIVE" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                 )}>
                    {formData.status} Identity
                 </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-muted/10 rounded-[32px] border border-border/20">
             <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                   <Briefcase className="h-4 w-4" />
                   <span className="text-[11px] font-bold uppercase tracking-widest">Client Governance</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed text-center">
                   Verified clients gain secure access to their specific litigation cases, invoices, and workspace updates in real-time.
                </p>
             </CardContent>
          </Card>
        </div>

        {/* Registry Form Card */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                 <Globe className="h-5 w-5 text-primary" /> Client Registry Identity
              </CardTitle>
              <CardDescription className="text-xs">Configure the stakeholder's digital access parameters.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Legal Name</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input 
                      placeholder="e.g. Acme Corp or Jane Smith" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      required
                      className="h-12 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Registry Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v) => setFormData({...formData, status: v})}
                  >
                    <SelectTrigger className="h-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/40">
                      <SelectItem value="ACTIVE">Active (Participating)</SelectItem>
                      <SelectItem value="INACTIVE">Inactive (Suspended)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Electronic Mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input 
                      type="email"
                      placeholder="client@mail.com" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      required
                      disabled={isEdit}
                      className="h-12 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Communication Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input 
                      placeholder="+1 (555) 000-0000" 
                      value={formData.contactNumber} 
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} 
                      className="h-12 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all"
                    />
                  </div>
                </div>
              </div>

              {!isEdit && (
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Client Access Key</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input 
                      type="password"
                      placeholder="Initialize secure client password..." 
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})} 
                      required
                      className="h-12 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row gap-4 items-center justify-between">
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="rounded-full text-xs font-black uppercase tracking-widest text-muted-foreground"
                  onClick={() => navigate("/clients")}
                >
                  Discard Changes
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="w-full md:w-auto h-14 px-12 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  {saving ? (
                    <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" /> 
                      {isEdit ? "Update Client" : "Finalize Registration"}
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
