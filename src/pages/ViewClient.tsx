import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Edit2, 
  Globe, 
  Mail, 
  Phone, 
  Clock,
  Calendar,
  Briefcase,
  ShieldCheck,
  History,
  Scale,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { getTeamMembers, type TeamMember } from "@/services/team.service";
import { usePermission } from "@/hooks/usePermission";

export default function ViewClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [client, setClient] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await getTeamMembers("CLIENT");
        const found = res.data.find((m: any) => m.id === id);
        if (found) {
          setClient(found);
        } else {
          toast.error("Client identity not found");
          navigate("/clients");
        }
      } catch (err) {
        toast.error("Cloud synchronization failed");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse pb-12">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1 space-y-6">
              <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
                 <CardContent className="p-8 flex flex-col items-center space-y-6">
                    <Skeleton className="h-32 w-32 rounded-[48px]" />
                    <Skeleton className="h-8 w-48" />
                    <div className="flex gap-2">
                       <Skeleton className="h-6 w-20 rounded-full" />
                       <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full">
                       <Skeleton className="h-20 rounded-3xl" />
                       <Skeleton className="h-20 rounded-3xl" />
                    </div>
                 </CardContent>
              </Card>
           </div>
           <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-[300px] w-full rounded-[32px]" />
              <div className="grid grid-cols-2 gap-6">
                 <Skeleton className="h-32 rounded-[32px]" />
                 <Skeleton className="h-32 rounded-[32px]" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
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
            title="Client Portfolio" 
            subtitle={`Industrial oversight of stakeholder identity: ${client.name}.`}
          />
        </div>
        {hasPermission("CLIENT", "UPDATE") && (
          <Button 
            onClick={() => navigate(`/clients/edit/${client.id}`)}
            className="h-10 gap-2 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all px-6 shadow-xl shadow-foreground/5"
          >
            <Edit2 className="h-3.5 w-3.5" /> Edit Stakeholder
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card Cluster */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] overflow-hidden border border-border/40">
             <div className={cn("h-32 w-full bg-gradient-to-br from-primary/30 to-primary/5")} />
             <CardContent className="px-6 pb-10 -mt-16 text-center">
                <Avatar className="h-32 w-32 mx-auto border-8 border-background ring-2 ring-border/20 shadow-2xl rounded-[48px] bg-background">
                   <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black text-4xl font-black">
                      {client.name.charAt(0)}
                   </AvatarFallback>
                </Avatar>
                <div className="mt-6 flex flex-col items-center">
                   <h2 className="text-2xl font-black tracking-tight text-foreground">{client.name}</h2>
                   <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-primary/20 text-primary bg-primary/5">
                        {client.role}
                      </Badge>
                      <Badge variant={client.isVerified ? "success" : "warning"} className="text-[10px] h-6 px-3 rounded-full">
                        {client.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                      {client.clientRole && client.clientRole !== "none" && (
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border-purple-500/20 text-purple-500 bg-purple-500/5 flex items-center gap-1">
                          <Users className="h-2.5 w-2.5" />{client.clientRole}
                        </Badge>
                      )}
                   </div>
                   <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                      <div className="p-4 rounded-3xl bg-muted/20 border border-border/10 text-center">
                         <Globe className="h-4 w-4 text-primary mx-auto mb-2" />
                         <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Entity State</span>
                         <span className="text-xs font-black uppercase text-foreground">{client.status || "ACTIVE"}</span>
                      </div>
                      <div className="p-4 rounded-3xl bg-muted/20 border border-border/10 text-center">
                         <Calendar className="h-4 w-4 text-primary mx-auto mb-2" />
                         <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Registered</span>
                         <span className="text-xs font-black uppercase text-foreground">{client.joinedAt ? new Date(client.joinedAt).getFullYear() : "N/A"}</span>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-muted/10 rounded-[32px] border border-border/20">
             <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                   <Briefcase className="h-4 w-4" />
                   <span className="text-[11px] font-bold uppercase tracking-widest">Stakeholder Registry</span>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 group">
                      <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-background border border-border/20 group-hover:border-primary/40 transition-colors shadow-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Registry Email</span>
                        <span className="text-sm font-bold text-foreground truncate">{client.email}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-background border border-border/20 group-hover:border-primary/40 transition-colors shadow-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contact Registry</span>
                        <span className="text-sm font-bold text-foreground">{client.contactNumber || "Undefined"}</span>
                      </div>
                   </div>
                   {client.clientRole && client.clientRole !== "none" && (
                     <div className="flex items-center gap-4 group">
                        <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-background border border-border/20 group-hover:border-purple-500/40 transition-colors shadow-sm">
                          <Users className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Client Role</span>
                          <span className="text-sm font-bold text-foreground uppercase">{client.clientRole}</span>
                        </div>
                     </div>
                   )}
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Oversight View */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" /> Engagement Timeline
                 </CardTitle>
                 <CardDescription className="text-xs">History of stakeholder registration and industrial verification.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                 <div className="relative pl-8 border-l border-dashed border-border/60 space-y-10 py-2">
                    <div className="relative">
                       <div className="absolute -left-10 top-0 h-4 w-4 rounded-full border-2 border-primary bg-background ring-4 ring-primary/5 shadow-sm" />
                       <div className="flex flex-col">
                          <div className="flex items-center gap-4 mb-1">
                             <span className="text-xs font-black uppercase text-foreground">Registry Verification</span>
                             <Badge variant="outline" className="text-[8px] h-4 border-primary/20 bg-primary/5 text-primary">System Stamp</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                             Stakeholder identity verified via Multi-Tenant OAuth protocols.
                          </p>
                          <span className="text-[9px] font-bold text-muted-foreground opacity-50 mt-2 flex items-center gap-1 uppercase tracking-tighter">
                             <Clock className="h-3 w-3" /> {new Date(client.joinedAt).toLocaleString()}
                          </span>
                       </div>
                    </div>

                    <div className="relative opacity-50">
                       <div className="absolute -left-10 top-0 h-4 w-4 rounded-full border-2 border-border/60 bg-background shadow-xs" />
                       <div className="flex flex-col">
                          <span className="text-xs font-black uppercase text-foreground mb-1">Legal Entity Initialization</span>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                             Registry initialized within the Advocate SaaS workspace environment for legal orchestration.
                          </p>
                          <span className="text-[9px] font-bold text-muted-foreground opacity-50 mt-2 uppercase tracking-tighter">
                             Registry ID: ADV-{client.id.slice(-6).toUpperCase()}
                          </span>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-none bg-muted/10 rounded-[32px] border border-border/20">
                 <CardContent className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                       <Scale className="h-5 w-5 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Case Involvement</span>
                    </div>
                    <div className="flex items-end gap-2">
                       <span className="text-3xl font-black text-foreground">Active</span>
                       <span className="text-xs text-primary font-bold mb-1 flex items-center gap-1">Connected</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Stakeholder is currently associated with active workspace litigation cases.</p>
                 </CardContent>
              </Card>
              <Card className="border-none shadow-none bg-muted/10 rounded-[32px] border border-border/20">
                 <CardContent className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                       <ShieldCheck className="h-5 w-5 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry Integrity</span>
                    </div>
                    <div className="flex items-end gap-2">
                       <span className="text-3xl font-black text-foreground">Healthy</span>
                       <span className="text-xs text-green-500 font-bold mb-1 flex items-center gap-1">Protocol Verified</span>
                    </div>
                    <p className="text-xs text-muted-foreground">All industrial keys and stakeholder metadata are fully synchronized and secure.</p>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
