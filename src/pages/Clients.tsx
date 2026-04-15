import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { useOrgStore } from "@/store/useOrgStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Edit2, Plus, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { getTeamMembers, deleteTeamMember, type TeamMember } from "@/services/team.service";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { DataTable, DataTableRow, DataTableCell } from "@/components/ui/data-table";
import { usePermission } from "@/hooks/usePermission";

export default function Clients() {
  const navigate = useNavigate();
  const { currentOrg } = useOrgStore();
  const { hasPermission } = usePermission();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getTeamMembers("CLIENT");
      setMembers(res.data);
    } catch (err: any) {
      toast.error("Failed to load clients");
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
    { header: "Client Name", width: "320px" },
    { header: "Contact Info" },
    { header: "Client Role" },
    { header: "Status" },
    { header: "Added On" },
    { header: "Management", className: "w-[140px] text-right" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Clients"
          subtitle={`Manage clients for ${currentOrg?.name || 'Workspace'}.`}
        />
        {hasPermission("CLIENT", "CREATE") && (
           <Button onClick={() => navigate("/clients/create")} className="h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full px-6 shadow-lg shadow-primary/10">
             <Plus className="h-4 w-4" />
             Add Client
           </Button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        loading={loading} 
        empty={members.length === 0}
        emptyMessage="No clients found in this workspace."
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
                   <span className="text-sm font-black text-foreground">{member.name}</span>
                   <span className="text-[9px] uppercase text-primary font-bold tracking-widest">{member.role}</span>
                </div>
              </div>
            </DataTableCell>
            <DataTableCell>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Mail className="h-3 w-3 opacity-50" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Phone className="h-3 w-3 opacity-50" />
                  {member.contactNumber || "Not added"}
                </div>
              </div>
            </DataTableCell>
            <DataTableCell>
              {member.clientRole ? (
                <Badge className="text-[10px] uppercase font-bold tracking-tighter px-3 h-6 rounded-full bg-primary/10 text-primary border-none">
                  {member.clientRole}
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground italic font-medium">No Role Assigned</span>
              )}
            </DataTableCell>
            <DataTableCell>
              {member.isVerified ? (
                <Badge className="text-[10px] uppercase font-bold tracking-tighter px-3 h-6 rounded-full bg-green-500/10 text-green-500 border-none">Verified</Badge>
              ) : (
                <Badge className="text-[10px] uppercase font-bold tracking-tighter px-3 h-6 rounded-full bg-orange-500/10 text-orange-500 border-none">Pending OTP</Badge>
              )}
            </DataTableCell>
            <DataTableCell className="text-xs text-foreground/70 font-bold">
              {new Date(member.joinedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </DataTableCell>
            <DataTableCell isLast>
              <div className="flex items-center justify-end gap-1">
                {hasPermission("CLIENT", "VIEW") && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background" onClick={() => navigate(`/clients/view/${member.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {hasPermission("CLIENT", "UPDATE") && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background" onClick={() => navigate(`/clients/edit/${member.id}`)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                {hasPermission("CLIENT", "DELETE") && (
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
