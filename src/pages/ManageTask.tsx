import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Save, 
  FileText,
  Calendar as CalendarIcon,
  Shield,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { createTask, updateTask, getTaskById } from "@/services/task.service";
import { getTeamMembers, type TeamMember } from "@/services/team.service";
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
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    status: "PENDING" as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD",
    dueDate: "",
    assignedTo: ""
  });

  useEffect(() => {
    const init = async () => {
      try {
        const teamRes = await getTeamMembers();
        setTeam(teamRes.data.filter((m: any) => m.role !== "CLIENT"));

        if (isEdit) {
          const taskRes = await getTaskById(id!);
          const task = taskRes.data;
          
          if (task) {
            setFormData({
              title: task.title,
              description: task.description || "",
              priority: task.priority,
              status: task.status,
              dueDate: task.dueDate || "",
              assignedTo: (task.assignedTo as any)?._id || ""
            });
          } else {
            toast.error("Task not found in workstation registry.");
            navigate("/tasks");
          }
        }
      } catch (err) {
        toast.error(isEdit ? "Failed to retrieve task registry." : "Industrial synchronization error.");
        if (isEdit) navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEdit) {
        const res = await updateTask(id!, formData);
        toast.success(res.message);
      } else {
        const res = await createTask(formData);
        toast.success(res.message);
      }
      navigate("/tasks");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registry update error.");
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
               <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-12 w-full rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-32" />
                     <Skeleton className="h-[150px] w-full rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-12 w-full rounded-2xl" />
                     </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-12 w-full rounded-2xl" />
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1 space-y-6">
             <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
                <CardContent className="p-8 space-y-6">
                   <Skeleton className="h-12 w-full rounded-2xl" />
                   <Skeleton className="h-12 w-full rounded-2xl" />
                   <Skeleton className="h-14 w-full rounded-full mt-6" />
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
          onClick={() => navigate("/tasks")}
          className="rounded-full hover:bg-muted/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <PageHeader 
            title={isEdit ? "Edit Workspace Initiative" : "Initialize New Task"} 
            subtitle={isEdit ? `Modifying parameters for: ${formData.title}` : "Establishing a new legal objective for the workstation."}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                 <FileText className="h-5 w-5 text-primary" /> Initiative Registry
              </CardTitle>
              <CardDescription className="text-xs">Define the core parameters and legal scope of this task.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Initiative Title</Label>
                <Input 
                  placeholder="e.g. Constitutional Review or Client Consultation..." 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  required
                  className="h-12 rounded-2xl bg-muted/10 border-border/40 focus:bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Legal Description (Overview)</Label>
                <textarea 
                  className="flex min-h-[150px] w-full rounded-2xl border border-border/40 bg-muted/5 px-4 py-3 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background"
                  placeholder="Provide industrial oversight for this task objective..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Deadline Orchestration</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal rounded-2xl bg-muted/10 border-border/40",
                          !formData.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : <span>Pick a deadline</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-[24px] border-border/40 shadow-2xl" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                        onSelect={(date) => setFormData({...formData, dueDate: date ? date.toISOString() : ""})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Assigned Personnel</Label>
                  <Select 
                    value={formData.assignedTo || "UNASSIGNED"} 
                    onValueChange={(v) => setFormData({...formData, assignedTo: v === "UNASSIGNED" ? "" : v})}
                  >
                    <SelectTrigger className="h-12 rounded-2xl bg-muted/10 border-border/40 focus:ring-1 focus:ring-primary appearance-none transition-all">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/40">
                      <SelectItem value="UNASSIGNED" className="font-bold text-muted-foreground" aria-label="Unassigned">Unassigned Stakeholder</SelectItem>
                      {team.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name} ({m.role.replace('_', ' ')})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
           <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> State & Priority
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Priority Weight</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(v) => setFormData({...formData, priority: v as any})}
                      >
                        <SelectTrigger className="h-12 rounded-2xl bg-muted/10 border-border/40 focus:ring-1 focus:ring-primary appearance-none transition-all">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/40">
                          <SelectItem value="LOW">Low Priority</SelectItem>
                          <SelectItem value="MEDIUM">Medium Weight</SelectItem>
                          <SelectItem value="HIGH">High Priority</SelectItem>
                          <SelectItem value="URGENT" className="font-bold text-destructive">Urgent (Immediate)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground pl-1">Workstation State</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(v) => setFormData({...formData, status: v as any})}
                      >
                        <SelectTrigger className="h-12 rounded-2xl bg-muted/10 border-border/40 focus:ring-1 focus:ring-primary appearance-none transition-all">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/40">
                          <SelectItem value="PENDING">Pending (Drafts)</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress (Active)</SelectItem>
                          <SelectItem value="COMPLETED">Completed (Archived)</SelectItem>
                          <SelectItem value="ON_HOLD">On Hold (Paused)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-border/20 flex flex-col gap-4">
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="w-full h-14 rounded-full bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                      {saving ? (
                        <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save className="h-4 w-4" /> 
                          {isEdit ? "Update Registry" : "Initialize Task"}
                        </span>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="w-full rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                      onClick={() => navigate("/tasks")}
                    >
                      Discard Changes
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-none bg-muted/10 rounded-[32px] border border-border/20">
              <CardContent className="p-6 space-y-4">
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-center">Governance Notice</span>
                 </div>
                 <p className="text-[10px] text-muted-foreground/60 leading-relaxed text-center">
                    Registry changes are audited in real-time. Only authorized personnel can modify critical task priorities.
                 </p>
              </CardContent>
           </Card>
        </div>
      </form>
    </div>
  );
}
