import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Edit2, 
  User, 
  Users, 
  Clock, 
  Gavel, 
  Plus,
  History,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Scale,
  Lightbulb
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { getCaseById, addHearing } from "@/services/case.service";
import { getRegistry, type TypeRegistryItem } from "@/services/registry.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CaseItem } from "@/types/case";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { usePermission } from "@/hooks/usePermission";

export default function ViewCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [caseData, setCaseData] = useState<CaseItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Hearing Form State
  const [caseStages, setCaseStages] = useState<TypeRegistryItem[]>([]);
  const [addingHearing, setAddingHearing] = useState(false);
  const [hearingForm, setHearingForm] = useState({ 
    hearingDate: "", 
    notes: "", 
    stage: "", 
    orders: "", 
    nextHearingDate: "" 
  });
  const [savingHearing, setSavingHearing] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [res, stagesRes] = await Promise.all([
           getCaseById(id!),
           getRegistry("CASE_STAGE")
        ]);
        setCaseData(res.data);
        setCaseStages(stagesRes.data);
      } catch (err) {
        toast.error("Failed to load case details.");
        navigate("/cases");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleAddHearing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hearingForm.hearingDate) return toast.error("Date required for orchestration.");
    try {
      setSavingHearing(true);
      await addHearing(id!, hearingForm);
      toast.success("Hearing update saved successfully.");
      setAddingHearing(false);
      setHearingForm({ hearingDate: "", notes: "", stage: "", orders: "", nextHearingDate: "" });
      // Refresh
      const res = await getCaseById(id!);
      setCaseData(res.data);
    } catch (err) {
      toast.error("Failed to add hearing.");
    } finally {
      setSavingHearing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse pb-12">
        <div className="flex items-center gap-4">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 opacity-60" />
          </div>
          <Skeleton className="h-11 w-40 rounded-full shadow-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[40px] border border-border/40 overflow-hidden">
                 <div className="h-40 bg-muted/20" />
                 <CardContent className="p-10 space-y-12">
                    <div className="grid grid-cols-4 gap-8">
                       {[...Array(4)].map((_, i) => (
                          <div key={i} className="space-y-2">
                             <Skeleton className="h-3 w-16" />
                             <Skeleton className="h-5 w-24" />
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    );
  }

  if (!caseData) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" onClick={() => navigate("/cases")} className="rounded-full hover:bg-muted/50 h-11 w-11 shrink-0 shadow-none transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <PageHeader 
              title="Case Details" 
              subtitle={`Viewing details for Case #${caseData.caseNumber} • ${caseData.title}.`}
            />
          </div>
        </div>
        {hasPermission("CASE", "UPDATE") && (
          <Button onClick={() => navigate(`/cases/edit/${caseData._id}`)} className="h-11 gap-2 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all w-full md:w-auto px-6 shadow-xl">
            <Edit2 className="h-3.5 w-3.5" /> Edit Case
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[40px] border border-border/40 overflow-hidden">
             <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 border-b border-border/20 flex flex-col justify-center px-10">
                <Badge variant="outline" className="w-fit text-[10px] font-black uppercase tracking-widest px-4 h-7 rounded-full bg-background border-primary/20 text-primary mb-3">
                   {caseData.caseType}
                </Badge>
                <h1 className="text-3xl font-black text-foreground tracking-tight">{caseData.title}</h1>
             </div>
             <CardContent className="p-10 space-y-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                   <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block pl-0.5">Stage</span>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-primary" />
                         <span className="text-sm font-black uppercase text-foreground">{caseData.stage.replace('_', ' ')}</span>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block pl-0.5">Court</span>
                      <span className="text-sm font-black text-foreground">{caseData.courtName}</span>
                   </div>
                   <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block pl-0.5">Status</span>
                      <span className="text-sm font-black text-primary uppercase">{caseData.status}</span>
                   </div>
                   <div className="space-y-2 text-right">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block pr-0.5">Filing Date</span>
                      <span className="text-sm font-black text-foreground">{format(new Date(caseData.caseDate), "MMM yyyy")}</span>
                   </div>
                </div>

                <div className="space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <History className="h-5 w-5 text-primary" />
                         <h2 className="text-lg font-black tracking-tight">History & Activities</h2>
                      </div>
                      {hasPermission("CASE", "UPDATE") && (
                        <Button variant="ghost" onClick={() => setAddingHearing(!addingHearing)} className="rounded-full gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all">
                           {addingHearing ? "Cancel" : <><Plus className="h-3 w-3" /> Update Hearing</>}
                        </Button>
                      )}
                   </div>

                   {addingHearing && (
                       <Card className="border-none bg-muted/20 rounded-[32px] overflow-hidden animate-in zoom-in-95 duration-300">
                          <form onSubmit={handleAddHearing} className="p-8 space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                   <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Hearing Date</Label>
                                   <Popover>
                                      <PopoverTrigger asChild>
                                         <Button variant="outline" className={cn("w-full h-12 justify-start text-left font-normal rounded-2xl bg-background border-border/40", !hearingForm.hearingDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {hearingForm.hearingDate ? format(new Date(hearingForm.hearingDate), "PPP") : <span>Select Date</span>}
                                         </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-border/40 shadow-2xl">
                                         <Calendar mode="single" selected={hearingForm.hearingDate ? new Date(hearingForm.hearingDate) : undefined} onSelect={(d) => setHearingForm({...hearingForm, hearingDate: d?.toISOString() || ""})} initialFocus />
                                      </PopoverContent>
                                   </Popover>
                                </div>
                                <div className="space-y-2">
                                   <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">New Case Stage</Label>
                                   <Select value={hearingForm.stage} onValueChange={(v) => setHearingForm({...hearingForm, stage: v})}>
                                      <SelectTrigger className="h-12 rounded-2xl bg-background border-border/40">
                                         <SelectValue placeholder="Update Stage..." />
                                      </SelectTrigger>
                                      <SelectContent className="rounded-2xl border-border/40">
                                         {caseStages.map(s => (
                                            <SelectItem key={s._id} value={s.title}>{s.title}</SelectItem>
                                         ))}
                                      </SelectContent>
                                   </Select>
                                </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                   <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Court Orders</Label>
                                   <Input 
                                     placeholder="e.g. Next date given, Stay order, etc." 
                                     value={hearingForm.orders}
                                     onChange={(e) => setHearingForm({...hearingForm, orders: e.target.value})}
                                     className="h-12 rounded-2xl bg-background border-border/40 px-4"
                                   />
                                </div>
                                <div className="space-y-2">
                                   <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Next Hearing Date</Label>
                                   <Popover>
                                      <PopoverTrigger asChild>
                                         <Button variant="outline" className={cn("w-full h-12 justify-start text-left font-normal rounded-2xl bg-background border-border/40", !hearingForm.nextHearingDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {hearingForm.nextHearingDate ? format(new Date(hearingForm.nextHearingDate), "PPP") : <span>Select Next Date</span>}
                                         </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-border/40 shadow-2xl">
                                         <Calendar mode="single" selected={hearingForm.nextHearingDate ? new Date(hearingForm.nextHearingDate) : undefined} onSelect={(d) => setHearingForm({...hearingForm, nextHearingDate: d?.toISOString() || ""})} initialFocus />
                                      </PopoverContent>
                                   </Popover>
                                </div>
                             </div>

                             <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Notes / Summary</Label>
                                <Input 
                                  placeholder="Summary of today's progress..." 
                                  value={hearingForm.notes}
                                  onChange={(e) => setHearingForm({...hearingForm, notes: e.target.value})}
                                  className="h-12 rounded-2xl bg-background border-border/40 px-4"
                                />
                             </div>

                             <Button type="submit" disabled={savingHearing} className="h-14 w-full rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:scale-[1.01]">
                                {savingHearing ? <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : "Save Hearing Details"}
                             </Button>
                          </form>
                       </Card>
                   )}

                   <div className="relative pl-8 border-l border-dashed border-border/60 space-y-12 py-4 ml-4">
                      {([...(caseData.hearings || []).map(h => ({ ...h, type: 'HEARING' as const })), ...(caseData.history || []).map(h => ({ ...h, type: 'ACTION' as const }))]
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .length === 0) ? (
                         <div className="flex flex-col items-center justify-center py-10 opacity-30 italic">
                            <Clock className="h-8 w-8 mb-3" />
                            <p className="text-xs font-bold uppercase tracking-widest text-center">No activity found.</p>
                         </div>
                      ) : (
                        ([...(caseData.hearings || []).map(h => ({ ...h, type: 'HEARING' as const, date: h.createdAt })), ...(caseData.history || []).map(h => ({ ...h, type: 'ACTION' as const, date: h.createdAt }))]
                         .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                         .map((entry, idx) => {
                           const isHearing = entry.type === 'HEARING';
                           const performedBy = isHearing ? (entry as any).createdBy : (entry as any).performedBy;
                           
                           return (
                            <div key={(entry as any)._id} className="relative group">
                               <div className={cn(
                                  "absolute -left-[42px] top-0 h-6 w-6 rounded-full border-2 bg-background flex items-center justify-center shadow-sm transition-all",
                                  idx === 0 ? "border-primary scale-110" : "border-border opacity-60"
                               )}>
                                  {isHearing ? <Gavel className={cn("h-3 w-3", idx === 0 ? "text-primary" : "text-muted-foreground")} /> : <Clock className={cn("h-3 w-3", idx === 0 ? "text-primary" : "text-muted-foreground")} />}
                               </div>
                               <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-4">
                                     <span className={cn(
                                        "text-xs font-black uppercase tracking-tight",
                                        idx === 0 ? "text-foreground" : "text-muted-foreground opacity-60"
                                     )}>
                                        {format(new Date(entry.date), "MMMM d, yyyy")}
                                     </span>
                                     <span className="text-[9px] opacity-30 font-bold uppercase">{format(new Date(entry.date), "HH:mm")}</span>
                                     {idx === 0 && <Badge variant="secondary" className="text-[8px] h-4 bg-primary/10 text-primary border-none font-black uppercase">Recent</Badge>}
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h4 className="text-[14px] font-black text-foreground/90 uppercase tracking-tight flex items-center gap-2">
                                      {isHearing ? <><Scale className="h-3.5 w-3.5 text-primary" /> Hearing Updated</> : (entry as any).action?.split("_").join(" ")}
                                      {isHearing && (entry as any).stage && (
                                        <Badge variant="outline" className="text-[9px] h-5 border-primary/20 bg-primary/5 text-primary">Stage: {(entry as any).stage}</Badge>
                                      )}
                                    </h4>
                                    
                                    {isHearing && (entry as any).orders && (
                                      <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-2">
                                         <span className="text-[9px] font-black uppercase text-primary/60 block mb-1">Court Orders</span>
                                         <p className="text-[12px] font-bold text-foreground leading-relaxed">{(entry as any).orders}</p>
                                      </div>
                                    )}

                                    <p className="text-[11px] text-muted-foreground/80 leading-relaxed max-w-xl">
                                       {isHearing ? (entry as any).notes : (entry as any).details || "System update."}
                                    </p>

                                    {isHearing && (entry as any).nextHearingDate && (
                                      <div className="flex items-center gap-2 mt-2 py-1.5 px-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg w-fit">
                                         <CalendarIcon className="h-3 w-3 text-emerald-600" />
                                         <span className="text-[10px] font-black text-emerald-700 uppercase">Next Hearing: {format(new Date((entry as any).nextHearingDate), "dd MMM yyyy")}</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-4 mt-1">
                                     <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-black">{performedBy?.name?.charAt(0)}</div>
                                        <span className="text-[9px] font-black uppercase tracking-widest">{performedBy?.name}</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                           );
                         }))
                      )}
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
           <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-lg font-black flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" /> Client Details
                 </CardTitle>
                 <CardDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground/60">Contact Information</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                 <div className="flex flex-col items-center text-center p-6 bg-muted/10 rounded-3xl border border-border/10">
                    <div className="h-20 w-20 bg-primary/10 text-primary flex items-center justify-center rounded-2xl font-black text-2xl mb-4">
                       {caseData.clientId.name.charAt(0)}
                    </div>
                    <span className="text-xl font-black text-foreground leading-none">{caseData.clientId.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2 italic">Client</span>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={() => hasPermission("CLIENT", "VIEW") && navigate(`/clients/view/${caseData.clientId._id}`)}>
                       <div className="h-10 w-10 bg-background border border-border/40 rounded-xl flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                       </div>
                       <div className="flex flex-col overflow-hidden">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Email</span>
                          <span className="text-sm font-bold text-foreground truncate">{caseData.clientId.email}</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                       <div className="h-10 w-10 bg-background border border-border/40 rounded-xl flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Phone</span>
                          <span className="text-sm font-bold text-foreground">{caseData.clientId.contactNumber || "N/A"}</span>
                       </div>
                    </div>
                 </div>
                 {hasPermission("CLIENT", "VIEW") && (
                   <Button variant="outline" onClick={() => navigate(`/clients/view/${caseData.clientId._id}`)} className="w-full rounded-2xl border-dashed h-12 text-[10px] font-black uppercase tracking-widest bg-transparent">
                      View Client Profile
                   </Button>
                 )}
              </CardContent>
           </Card>

           <Card className="border-none shadow-2xl shadow-primary/5 bg-primary/5 rounded-[32px] border border-primary/10 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-sm font-black flex items-center gap-2 text-primary">
                    <Lightbulb className="h-4 w-4" /> Insight
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                 <p className="text-[11px] font-bold text-foreground/80 leading-relaxed uppercase tracking-tight">
                    Each update builds a chronological history, allowing you to track the evolution of the case over time.
                 </p>
                 <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                    A well-organized case detail page displays common information at the top, ensuring all developments are documented and easily retrievable.
                 </p>
              </CardContent>
           </Card>

           <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-sm font-black flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Assigned Lawyers
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                 {caseData.assignedMembers.map(m => (
                    <div key={m._id} className="flex items-center gap-3 p-3 bg-muted/10 rounded-2xl border border-border/5">
                       <div className="h-8 w-8 bg-background border border-border/40 rounded-full flex items-center justify-center font-black text-[10px] text-primary">
                          {m.name.charAt(0)}
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[13px] font-black text-foreground">{m.name}</span>
                          <span className="text-[9px] uppercase font-bold tracking-tighter text-muted-foreground opacity-60">{m.role.replace('_', ' ')}</span>
                       </div>
                    </div>
                 ))}
                 {caseData.assignedMembers.length === 0 && (
                    <p className="text-[10px] text-muted-foreground italic text-center py-4">No lawyers assigned to this case.</p>
                 )}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
