import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Edit2, 
  User, 
  Clock, 
  History,
  Shield,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock3,
  CalendarCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { getTaskById, type TaskItem } from "@/services/task.service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { usePermission } from "@/hooks/usePermission";

const PRIORITY_COLORS = {
  LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  URGENT: "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_ICONS = {
  PENDING: Clock,
  IN_PROGRESS: History,
  COMPLETED: CheckCircle2,
  ON_HOLD: AlertCircle,
};

export default function ViewTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [task, setTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      try {
        const res = await getTaskById(id);
        setTask(res.data);
      } catch (err) {
        toast.error("Initiative identity not found or synchronization failed");
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
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
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
               <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                     <Skeleton className="h-6 w-32 rounded-full" />
                     <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <div className="space-y-4">
                     <Skeleton className="h-4 w-40" />
                     <Skeleton className="h-32 w-full rounded-2xl" />
                  </div>
               </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
             <Card className="border-none shadow-2xl rounded-[32px] overflow-hidden">
                <CardContent className="p-8 space-y-10">
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                         <Skeleton className="h-12 w-12 rounded-[18px]" />
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <Skeleton className="h-12 w-12 rounded-[18px]" />
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                         </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-24 rounded-3xl" />
                      <Skeleton className="h-24 rounded-3xl" />
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!task) return null;

  const StatusIcon = STATUS_ICONS[task.status];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/tasks")}
            className="rounded-full hover:bg-muted/50 shrink-0 h-11 w-11"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <PageHeader 
              title="Industrial Observation" 
              subtitle={`Oversight of initiative: ${task.title}.`}
            />
          </div>
        </div>
        {hasPermission("TASK", "UPDATE") && (
          <Button 
            onClick={() => navigate(`/tasks/edit/${task._id}`)}
            className="h-10 gap-2 bg-foreground text-background font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 px-6 shadow-xl shadow-foreground/5 transition-all w-full md:w-auto"
          >
            <Edit2 className="h-3.5 w-3.5" /> Modify Registry
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40">
            <CardHeader className="p-8 pb-4">
               <div className="flex items-center justify-between mb-4">
                 <Badge className={cn("text-[10px] font-bold uppercase tracking-widest h-6 rounded-full px-3 border", PRIORITY_COLORS[task.priority])}>
                   {task.priority} Priority Status
                 </Badge>
                 <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border-primary/20 text-primary bg-primary/5 shadow-sm">
                   Ref: ADV-{task._id.slice(-6).toUpperCase()}
                 </Badge>
               </div>
               <CardTitle className="text-3xl font-black tracking-tight text-foreground">{task.title}</CardTitle>
               <CardDescription className="text-sm mt-3 leading-relaxed text-muted-foreground/80">
                 Platform registry initialization complete. Final data synchronization verified.
               </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                     <FileText className="h-4 w-4 text-primary" />
                     <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Comprehensive Description</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground p-6 rounded-3xl bg-muted/5 border border-border/10">
                     {task.description || "No industrial oversight documentation provided for this task."}
                  </p>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                     <History className="h-4 w-4 text-primary" />
                     <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Registry Audit Trail</span>
                  </div>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto px-1 custom-scrollbar">
                     {task.history.map((entry, i) => (
                       <div key={i} className="group relative pl-8 border-l border-dashed border-border/40 pb-8 last:pb-0">
                          <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-primary bg-background ring-4 ring-primary/5 shadow-sm" />
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center justify-between">
                               <span className="text-[10px] font-black uppercase text-foreground leading-none">{entry.action}</span>
                               <span className="text-[9px] font-bold text-muted-foreground/60">{format(new Date(entry.createdAt), "dd MMM yyyy · HH:mm")}</span>
                             </div>
                             <p className="text-xs text-muted-foreground leading-relaxed mt-1">{entry.details}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[32px] border border-border/40 overflow-hidden">
              <div className="h-24 w-full bg-gradient-to-br from-primary/30 to-primary/5 p-8 flex items-center justify-between">
                 <div className="h-12 w-12 rounded-2xl bg-background border border-border/40 flex items-center justify-center shadow-xl">
                    <StatusIcon className="h-6 w-6 text-primary shadow-sm" />
                 </div>
                 <Badge variant="outline" className="bg-background/80 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest px-3 border-border/40 text-foreground shadow-sm h-7">
                    {(task.status || "PENDING").replace('_', ' ')}
                 </Badge>
              </div>
              <CardContent className="p-8 space-y-10">
                 <div className="space-y-6">
                    <div className="space-y-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <User className="h-3 w-3" /> Assigned Personnel
                       </span>
                       {task.assignedTo && typeof task.assignedTo !== "string" ? (
                         <div className="flex items-center gap-4 group">
                           <Avatar className="h-12 w-12 border-4 border-background ring-2 ring-border/20 shadow-2xl rounded-[18px]">
                             <AvatarFallback className="bg-primary text-primary-foreground font-black text-sm">{(task.assignedTo as any).name.charAt(0)}</AvatarFallback>
                           </Avatar>
                           <div className="flex flex-col">
                             <span className="text-sm font-black text-foreground">{(task.assignedTo as any).name}</span>
                             <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">{((task.assignedTo as any).role || "MEMBER").replace('_', ' ')} Registry</span>
                           </div>
                         </div>
                       ) : (
                         <div className="flex items-center gap-3 h-12 text-muted-foreground/30 font-bold italic text-xs uppercase tracking-tight">
                            {typeof task.assignedTo === 'string' ? "Assigned Stakeholder (ID)" : "Unassigned Platform Entity"}
                         </div>
                       )}
                    </div>

                    <div className="space-y-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Shield className="h-3 w-3" /> Initialized By
                       </span>
                       <div className="flex items-center gap-4">
                         <Avatar className="h-12 w-12 border-4 border-background ring-2 ring-border/5 shadow-lg rounded-[18px]">
                           <AvatarFallback className="bg-muted text-muted-foreground font-black text-sm">{task.createdBy.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="flex flex-col">
                           <span className="text-sm font-black text-foreground">{task.createdBy.name}</span>
                           <span className="text-[10px] text-muted-foreground/50 tracking-tighter">On {format(new Date(task.createdAt), "dd MMM yyyy")}</span>
                         </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-6 border-t border-border/20">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 rounded-3xl bg-muted/5 border border-border/10 flex flex-col items-center text-center">
                          <CalendarCheck className="h-5 w-5 text-primary mb-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Industrial Deadline</span>
                          <span className="text-xs font-black uppercase text-foreground">{task.dueDate ? format(new Date(task.dueDate), "dd MMM yy") : "No Date"}</span>
                       </div>
                       <div className="p-5 rounded-3xl bg-muted/5 border border-border/10 flex flex-col items-center text-center">
                          <Clock3 className="h-5 w-5 text-primary mb-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Registry Age</span>
                          <span className="text-xs font-black uppercase text-foreground whitespace-nowrap">{Math.floor((Date.now() - new Date(task.createdAt).getTime())/(1000*60*60*24))} Days Active</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-none bg-muted/10 rounded-[32px] border border-border/20">
              <CardContent className="p-8 space-y-4 text-center">
                 <AlertCircle className="h-5 w-5 text-primary mx-auto opacity-50" />
                 <p className="text-[10px] text-muted-foreground leading-relaxed">
                    This registry is part of the multi-tenant Advocate SaaS workstation hierarchy. All modifications are synchronized across the industrial cloud.
                 </p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
