import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Scale, 
  Users, 
  Calendar as CalendarIcon
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { getCaseById, createCase, updateCase } from "@/services/case.service";
import { getTeamMembers, type TeamMember } from "@/services/team.service";
import { getRegistry, type TypeRegistryItem } from "@/services/registry.service";
import { Checkbox } from "@/components/ui/checkbox";

export default function ManageCase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  // Lookup Data
  const [clients, setClients] = useState<TeamMember[]>([]);
  const [lawyers, setLawyers] = useState<TeamMember[]>([]);
  const [caseTypes, setCaseTypes] = useState<TypeRegistryItem[]>([]);
  const [caseStages, setCaseStages] = useState<TypeRegistryItem[]>([]);

  const [formData, setFormData] = useState({
    caseNumber: "",
    title: "",
    caseType: "",
    caseDate: "",
    courtName: "",
    stage: "",
    clientId: "",
    assignedMembers: [] as string[],
    nextHearingDate: "",
    status: "OPEN" as "OPEN" | "CLOSED" | "PENDING",
    changeNote: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, teamRes, typesRes, stagesRes] = await Promise.all([
          getTeamMembers("CLIENT"),
          getTeamMembers(),
          getRegistry("CASE_TYPE"),
          getRegistry("CASE_STAGE")
        ]);
        
        setClients(clientsRes.data);
        setLawyers(teamRes.data.filter(m => m.role !== "CLIENT" && m.status !== "INACTIVE" && (m.isVerified === true || m.status === "ACTIVE")));
        setCaseTypes(typesRes.data);
        setCaseStages(stagesRes.data);

        if (isEdit) {
          const caseRes = await getCaseById(id!);
          const c = caseRes.data;
          setFormData({
            caseNumber: c.caseNumber,
            title: c.title,
            caseType: c.caseType,
            caseDate: c.caseDate,
            courtName: c.courtName,
            stage: c.stage,
            clientId: c.clientId._id,
            assignedMembers: c.assignedMembers.map(m => m._id),
            nextHearingDate: c.nextHearingDate || "",
            status: c.status,
            changeNote: ""
          });
        }
      } catch (err) {
        toast.error("Initialization failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEdit) {
        const res = await updateCase(id!, formData);
        toast.success(res.message);
      } else {
        const res = await createCase(formData);
        toast.success(res.message);
      }
      navigate("/cases");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registry update failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleLawyer = (lawyerId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedMembers: prev.assignedMembers.includes(lawyerId)
        ? prev.assignedMembers.filter(i => i !== lawyerId)
        : [...prev.assignedMembers, lawyerId]
    }));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse pb-12">
        <div className="flex items-center gap-4">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 opacity-60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cases")} className="rounded-full hover:bg-muted/50 transition-colors h-11 w-11 shadow-none">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <PageHeader 
            title={isEdit ? "Edit Case" : "Add New Case"} 
            subtitle={isEdit ? `Updating details for Case #${formData.caseNumber}.` : "Add a new legal case to your workspace."}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40 overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-lg font-black flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" /> Case Details
               </CardTitle>
               <CardDescription className="text-xs uppercase font-bold tracking-widest text-muted-foreground/60">Basic Information</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Case Number</Label>
                  <Input 
                    placeholder="e.g. CAS-2024-001" 
                    value={formData.caseNumber} 
                    onChange={(e) => setFormData({...formData, caseNumber: e.target.value})} 
                    required
                    className="h-12 rounded-2xl bg-muted/10 border-border/40 focus:bg-background transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Case Title</Label>
                  <Input 
                    placeholder="e.g. John Doe vs State" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    required
                    className="h-12 rounded-2xl bg-muted/10 border-border/40 focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Case Category</Label>
                    <Select value={formData.caseType} onValueChange={(v) => setFormData({...formData, caseType: v})} required>
                       <SelectTrigger className="h-12 rounded-2xl bg-muted/10 border-border/40">
                          <SelectValue placeholder="Select Type" />
                       </SelectTrigger>
                       <SelectContent className="rounded-2xl border-border/40">
                          {caseTypes.map(t => (
                             <SelectItem key={t._id} value={t.title}>{t.title}</SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Case Stage</Label>
                    <Select value={formData.stage} onValueChange={(v) => setFormData({...formData, stage: v})} required>
                       <SelectTrigger className="h-12 rounded-2xl bg-muted/10 border-border/40">
                          <SelectValue placeholder="Select Stage" />
                       </SelectTrigger>
                       <SelectContent className="rounded-2xl border-border/40">
                          {caseStages.map(t => (
                             <SelectItem key={t._id} value={t.title}>{t.title}</SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Filing Date</Label>
                    <Popover>
                       <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full h-12 justify-start text-left font-normal rounded-2xl bg-muted/10 border-border/40", !formData.caseDate && "text-muted-foreground")}>
                             <CalendarIcon className="mr-2 h-4 w-4" />
                             {formData.caseDate ? format(new Date(formData.caseDate), "PPP") : <span>Pick Date</span>}
                          </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-border/40 shadow-2xl">
                          <Calendar mode="single" selected={formData.caseDate ? new Date(formData.caseDate) : undefined} onSelect={(d) => setFormData({...formData, caseDate: d?.toISOString() || ""})} initialFocus />
                       </PopoverContent>
                    </Popover>
                 </div>
              </div>

              <div className="space-y-2">
                 <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Court Name</Label>
                 <Input 
                   value={formData.courtName} 
                   onChange={(e) => setFormData({...formData, courtName: e.target.value})} 
                   required
                   className="h-12 rounded-2xl bg-muted/10 border-border/40 focus:bg-background transition-all"
                 />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40 overflow-hidden">
             <CardHeader className="p-8 pb-4">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                   <Users className="h-5 w-5 text-primary" /> Parties Involved
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-0 space-y-8">
                <div className="space-y-3">
                   <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Select Client</Label>
                   <Select value={formData.clientId} onValueChange={(v) => setFormData({...formData, clientId: v})} required>
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/10 border-border/40 px-6">
                         <SelectValue placeholder="Select Client..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/40">
                         {clients.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                </div>

                <div className="space-y-4">
                   <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Assigned Lawyers</Label>
                   <Card className="border-none bg-muted/10 rounded-[28px] overflow-hidden border border-border/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border/20">
                         {lawyers.map(m => (
                            <div key={m.id} className="flex items-center justify-between p-4 bg-background/40">
                               <span className="text-[13px] font-black">{m.name}</span>
                               <Checkbox 
                                 checked={formData.assignedMembers.includes(m.id)} 
                                 onCheckedChange={() => toggleLawyer(m.id)}
                                 className="rounded-[6px]"
                               />
                            </div>
                         ))}
                      </div>
                   </Card>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
           <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-lg font-black flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" /> Management
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80">Case Status</Label>
                       <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v as any})}>
                          <SelectTrigger className="h-12 rounded-2xl bg-muted/10 border-border/40">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border/40">
                             <SelectItem value="OPEN">Open</SelectItem>
                             <SelectItem value="PENDING">Pending</SelectItem>
                             <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 italic">Next Hearing Date</Label>
                       <Popover>
                          <PopoverTrigger asChild>
                             <Button variant="outline" className={cn("w-full h-12 justify-start text-left font-normal rounded-2xl bg-muted/10 border-border/40", !formData.nextHearingDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.nextHearingDate ? format(new Date(formData.nextHearingDate), "PPP") : <span>Select Date</span>}
                             </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-border/40 shadow-2xl">
                             <Calendar mode="single" selected={formData.nextHearingDate ? new Date(formData.nextHearingDate) : undefined} onSelect={(d) => setFormData({...formData, nextHearingDate: d?.toISOString() || ""})} initialFocus />
                          </PopoverContent>
                       </Popover>
                    </div>

                    {isEdit && (
                        <div className="space-y-2 pt-2 border-t border-border/10">
                           <Label className="text-[11px] font-black uppercase tracking-widest text-primary/80">Update Note</Label>
                           <Input 
                              placeholder="e.g. Stage update to evidence" 
                              value={formData.changeNote}
                              onChange={(e) => setFormData({...formData, changeNote: e.target.value})}
                              className="h-12 rounded-2xl bg-primary/5 border-primary/20 focus:bg-background transition-all"
                           />
                           <p className="text-[9px] text-muted-foreground/60 italic pl-1 font-bold">This will be saved to the case history.</p>
                        </div>
                    )}
                 </div>

                 <div className="pt-6 space-y-4">
                    <Button type="submit" disabled={saving} className="w-full h-14 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-2xl transition-all">
                       {saving ? "Saving..." : (isEdit ? "Save Changes" : "Save Case")}
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </form>
    </div>
  );
}
