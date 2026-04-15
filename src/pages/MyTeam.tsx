import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { useOrgStore } from "@/store/useOrgStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, UserCheck, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { getTeamMembers, deleteTeamMember, type TeamMember } from "@/services/team.service";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useAuthStore } from "@/store/useAuthStore";
import { DataTable, DataTableRow, DataTableCell } from "@/components/ui/data-table";
import { usePermission } from "@/hooks/usePermission";

export default function MyTeam() {
  const navigate = useNavigate();
  const { currentOrg } = useOrgStore();
  const { hasPermission } = usePermission();
  const user = useAuthStore((s) => s.user);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getTeamMembers();
      setMembers(res.data.filter(m => m.role !== "CLIENT"));
    } catch (err: any) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
       setDeleting(true);
       const res = await deleteTeamMember(deleteId);
       toast.success(res.message);
       setDeleteId(null);
       fetchMembers();
    } catch (err: any) {
       toast.error(err.response?.data?.message || "Delete failed");
    } finally {
       setDeleting(false);
    }
  };

  const columns = [
    { header: "#", width: "60px", className: "text-center" },
    { header: "Member Name", width: "300px" },
    { header: "System Role" },
    { header: "Assigned Role" },
    { header: "Status" },
    { header: "Joined On" },
    { header: "Management", className: "w-[140px] text-right" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="My Team"
          subtitle={`Managing team members for ${currentOrg?.name || 'Workspace'}.`}
        />
        {hasPermission("TEAM", "CREATE") && (
           <Button onClick={() => navigate("/my-team/create")} className="h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 rounded-full shadow-lg shadow-primary/10">
             <Plus className="h-4 w-4" />
             Create Member
           </Button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        loading={loading} 
        empty={members.length === 0}
        emptyMessage="No team members registered in this workspace."
      >
        {members.map((member, index) => (
          <DataTableRow key={member.id}>
            <DataTableCell isFirst className="text-center text-[11px] font-medium text-muted-foreground">{index + 1}</DataTableCell>
            <DataTableCell>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-2xl text-[14px] font-black shadow-sm group-hover:scale-105 transition-transform">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                     <span className="text-sm font-black text-foreground">{member.name}</span>
                     {member.id === user?.id && (
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">You</span>
                     )}
                  </div>
                  <span className="text-[11px] text-muted-foreground truncate max-w-[180px] font-medium">{member.email}</span>
                </div>
              </div>
            </DataTableCell>
            <DataTableCell>
               <div className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-primary opacity-70" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-foreground">{member.role.replace('_', ' ')}</span>
               </div>
            </DataTableCell>
            <DataTableCell>
               {member.customRoleName ? (
                 <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter px-3 h-6 rounded-full border-primary/20 bg-primary/5 text-primary">
                   {member.customRoleName}
                 </Badge>
               ) : (
                 <span className="text-[10px] text-muted-foreground/40 italic font-bold uppercase tracking-widest">General Access</span>
               )}
            </DataTableCell>
            <DataTableCell>
              {member.isVerified ? (
                <Badge variant="success" className="text-[10px] uppercase font-bold tracking-tighter px-3 h-6 rounded-full bg-green-500/10 text-green-500 border-none">Verified</Badge>
              ) : (
                <Badge variant="warning" className="text-[10px] uppercase font-bold tracking-tighter px-3 h-6 rounded-full bg-orange-500/10 text-orange-500 border-none">OTP Pending</Badge>
              )}
            </DataTableCell>
            <DataTableCell className="text-[11px] text-muted-foreground font-black uppercase tracking-tight">
               {new Date(member.joinedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short'
              })}
            </DataTableCell>
            <DataTableCell isLast>
              <div className="flex items-center justify-end gap-1">
                {hasPermission("TEAM", "VIEW") && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background" onClick={() => navigate(`/my-team/view/${member.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {hasPermission("TEAM", "UPDATE") && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background" onClick={() => navigate(`/my-team/edit/${member.id}`)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                {hasPermission("TEAM", "DELETE") && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-destructive hover:bg-destructive/5" onClick={() => setDeleteId(member.id)}>
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
