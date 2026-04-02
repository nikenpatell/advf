import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  User, 
  Eye, 
  Edit2, 
  Trash2,
  Filter,
  Clock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getCases, deleteCase } from "@/services/case.service";
import { CaseItem } from "@/types/case";
import toast from "react-hot-toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { format } from "date-fns";
import { useOrgStore } from "@/store/useOrgStore";
import { cn } from "@/lib/utils";
import { DataTable, DataTableRow, DataTableCell } from "@/components/ui/data-table";
import { usePermission } from "@/hooks/usePermission";

const STAGE_COLORS: Record<string, string> = {
  "FILED": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "HEARING": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "EVIDENCE": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "JUDGEMENT": "bg-green-500/10 text-green-500 border-green-500/20",
  "CLOSED": "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function Cases() {
  const navigate = useNavigate();
  const { currentOrg } = useOrgStore();
  const { hasPermission } = usePermission();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await getCases();
      setCases(res.data);
    } catch (err) {
      toast.error("Registry synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await deleteCase(deleteId);
      toast.success(res.message);
      setDeleteId(null);
      fetchCases();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Purge execution failed.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCases = cases.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.clientId.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { header: "#", width: "60px", className: "text-center" },
    { header: "Litigation Identity", width: "340px" },
    { header: "Client Stakeholder" },
    { header: "Jurisdiction" },
    { header: "Lifecycle Stage" },
    { header: "Next Event" },
    { header: "Management", className: "w-[160px] text-right" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader 
          title="Litigation Portfolio" 
          subtitle={`Industrial oversight of active legal cases for ${currentOrg?.name || 'Workspace'}.`}
        />
        {hasPermission("CASE", "CREATE") && (
          <Button onClick={() => navigate("/cases/create")} className="h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-black text-xs uppercase tracking-widest rounded-full px-6 shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]">
            <Plus className="h-4 w-4" />
            Initialize Case
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by Title, Number or Client Identity..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background transition-all"
          />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-2xl border-border/40 gap-2 font-bold text-xs uppercase tracking-widest bg-muted/10">
          <Filter className="h-4 w-4" /> Filter Portfolio
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        loading={loading} 
        empty={filteredCases.length === 0}
        emptyMessage="Registry Empty. Your Litigation workstation is currently clear of any active records."
      >
        {filteredCases.map((c, index) => (
          <DataTableRow key={c._id}>
            <DataTableCell isFirst className="text-center text-[11px] font-medium text-muted-foreground">{index + 1}</DataTableCell>
            <DataTableCell>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-2xl text-[14px] font-black shadow-sm group-hover:scale-105 transition-transform">
                  {c.title.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-black text-foreground group-hover:translate-x-1 transition-transform cursor-pointer flex items-center gap-2" onClick={() => navigate(`/cases/view/${c._id}`)}>
                    {c.title}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-70">
                    #{c.caseNumber} • {c.caseType}
                  </span>
                </div>
              </div>
            </DataTableCell>
            <DataTableCell>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted/50 border border-border/40 flex items-center justify-center">
                   <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex flex-col">
                   <span className="text-[13px] font-black text-foreground/90">{c.clientId.name}</span>
                   <span className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground opacity-50">Client Identity</span>
                </div>
              </div>
            </DataTableCell>
            <DataTableCell>
               <div className="space-y-1 text-left">
                  <span className="text-[13px] font-bold text-foreground/80 flex items-center gap-2 italic tracking-tight">{c.courtName}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 block">Judicial Registry</span>
               </div>
            </DataTableCell>
            <DataTableCell>
              <Badge variant="outline" className={cn(
                "text-[9px] font-black uppercase tracking-widest px-4 h-7 rounded-full border-0 shadow-sm",
                STAGE_COLORS[c.stage.toUpperCase()] || "bg-muted text-muted-foreground"
              )}>
                {c.stage.replace('_', ' ')}
              </Badge>
            </DataTableCell>
            <DataTableCell>
              {c.nextHearingDate ? (
                <div className="flex flex-col gap-1 text-left">
                   <div className="flex items-center gap-2 whitespace-nowrap">
                     <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                     <span className="text-[13px] font-black text-foreground">{format(new Date(c.nextHearingDate), "MMM d, yyyy")}</span>
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 pl-3.5 italic">Scheduled Call</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 opacity-30grayscale text-left">
                   <Clock className="h-3 w-3 text-muted-foreground" />
                   <span className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-[0.15em]">Pending Log</span>
                </div>
              )}
            </DataTableCell>
            <DataTableCell isLast>
              <div className="flex items-center justify-end gap-1.5 transition-all">
                {hasPermission("CASE", "VIEW") && (
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-xl shadow-primary/5" onClick={() => navigate(`/cases/view/${c._id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {hasPermission("CASE", "UPDATE") && (
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/40 hover:bg-foreground hover:text-background hover:border-foreground transition-all shadow-xl shadow-black/5" onClick={() => navigate(`/cases/edit/${c._id}`)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                {hasPermission("CASE", "DELETE") && (
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-border/40 hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all shadow-xl shadow-destructive/5" onClick={() => setDeleteId(c._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </DataTableCell>
          </DataTableRow>
        ))}
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
