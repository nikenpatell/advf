import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Edit2, 
  Trash2, 
  History,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { getTasks, deleteTask, type TaskItem } from "@/services/task.service";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { usePermission } from "@/hooks/usePermission";

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  URGENT: "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_CONFIG: Record<string, { color: string, icon: any }> = {
  PENDING: { color: "bg-orange-500/10 text-orange-500", icon: Clock },
  IN_PROGRESS: { color: "bg-primary/10 text-primary", icon: History },
  COMPLETED: { color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
  ON_HOLD: { color: "bg-muted/20 text-muted-foreground", icon: AlertCircle },
};

import { DataTable, DataTableRow, DataTableCell } from "@/components/ui/data-table";

export default function Tasks() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TaskItem["status"] | "ALL">("ALL");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data);
    } catch (err: any) {
      toast.error("Cloud synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesTab = activeTab === "ALL" || t.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await deleteTask(deleteId);
      toast.success(res.message);
      setDeleteId(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Task decommissioning failed.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { header: "#", width: "60px", className: "text-center" },
    { header: "Task Name", width: "320px" },
    { header: "Status" },
    { header: "Priority" },
    { header: "Assigned To" },
    { header: "Due Date" },
    { header: "Management", className: "w-[140px] text-right" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Task Management" 
          subtitle="Industrial orchestration of workspace initiatives." 
        />
        {hasPermission("TASK", "CREATE") && (
          <Button onClick={() => navigate("/tasks/create")} className="h-10 gap-2 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest px-6 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <Plus className="h-4 w-4" />
            Create Task
          </Button>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search within task registry..." 
            className="pl-12 h-12 rounded-[20px] bg-background border-border/40 transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-auto">
          <Select 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as any)}
          >
            <SelectTrigger className="h-12 w-full md:w-[220px] rounded-[20px] bg-background border-border/40 shadow-sm font-black text-[11px] uppercase tracking-widest pl-5">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <SelectValue placeholder="Filter Registry" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-[24px] border-border/40 shadow-2xl p-2 bg-background/95 backdrop-blur-xl">
              <SelectItem value="ALL" className="rounded-xl text-[10px] font-black uppercase tracking-widest py-3 mb-1">All Initiatives</SelectItem>
              <SelectItem value="PENDING" className="rounded-xl text-[10px] font-black uppercase tracking-widest py-3 mb-1 text-orange-500">Pending Drafts</SelectItem>
              <SelectItem value="IN_PROGRESS" className="rounded-xl text-[10px] font-black uppercase tracking-widest py-3 mb-1 text-primary">In-Progress</SelectItem>
              <SelectItem value="COMPLETED" className="rounded-xl text-[10px] font-black uppercase tracking-widest py-3 text-green-500">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        loading={loading} 
        empty={filteredTasks.length === 0}
        emptyMessage="No matching workspace initiatives found."
      >
        {filteredTasks.map((task, index) => {
          const config = STATUS_CONFIG[task.status];
          const StatusIcon = config.icon;
          return (
            <DataTableRow key={task._id}>
              <DataTableCell isFirst className="text-center text-[11px] font-medium text-muted-foreground">{index + 1}</DataTableCell>
              <DataTableCell>
                <div className="flex flex-col gap-1 max-w-[280px]">
                  <span className="text-sm font-black text-foreground truncate">{task.title}</span>
                  <span className="text-[10px] text-muted-foreground/60 line-clamp-1">{task.description || "No registry overview provided."}</span>
                </div>
              </DataTableCell>
              <DataTableCell>
                  <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full outline outline-1 outline-border/10", config.color)}>
                    <StatusIcon className="h-3 w-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{task.status.replace('_', ' ')}</span>
                  </div>
              </DataTableCell>
              <DataTableCell>
                <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-2 h-5 border-none", PRIORITY_COLORS[task.priority])}>
                  {task.priority}
                </Badge>
              </DataTableCell>
              <DataTableCell>
                {task.assignedTo && typeof task.assignedTo !== "string" ? (
                  <div className="flex items-center gap-2.5 group/persona text-left justify-start">
                    <Avatar className="h-8 w-8 rounded-[10px] border-2 border-background shadow-sm ring-1 ring-border/20 transition-transform group-hover/persona:scale-105">
                      <AvatarFallback className="bg-primary text-primary-foreground font-black text-[10px]">{task.assignedTo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-foreground">{task.assignedTo.name}</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">{(task.assignedTo.role || "MEMBER").replace('_', ' ')}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground italic">
                    {typeof task.assignedTo === 'string' ? 'Assigned (ID)' : 'Unassigned Entity'}
                  </span>
                )}
              </DataTableCell>
              <DataTableCell>
                <div className="flex items-center gap-2 text-muted-foreground/80">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-tight">
                      {task.dueDate ? format(new Date(task.dueDate), "dd MMM yyyy") : "TBD"}
                    </span>
                </div>
              </DataTableCell>
              <DataTableCell isLast>
                <div className="flex items-center justify-end gap-1">
                  {hasPermission("TASK", "VIEW") && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background shadow-sm group-hover:scale-110 transition-all" onClick={() => navigate(`/tasks/view/${task._id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {hasPermission("TASK", "UPDATE") && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background shadow-sm group-hover:scale-110 transition-all" onClick={() => navigate(`/tasks/edit/${task._id}`)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  {hasPermission("TASK", "DELETE") && task.createdBy._id === user?.id && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-destructive hover:bg-background shadow-sm group-hover:scale-110 transition-all" onClick={() => setDeleteId(task._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </DataTableCell>
            </DataTableRow>
          );
        })}
      </DataTable>

      <ConfirmModal 
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
