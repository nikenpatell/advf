import { useOrgStore, type Organization } from "@/store/useOrgStore";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronRight, LogOut, Plus, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/utils/constants";
import { createOrg, updateOrg, deleteOrg } from "@/services/org.service";

import { selectOrg } from "@/features/auth/services/auth.service";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Skeleton } from "@/components/ui/skeleton";

export default function SelectOrg() {
  const { organizations, setCurrentOrg } = useOrgStore();
  const { setAuth, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate initial check
    const timer = setTimeout(() => setFetching(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleSelect = async (org: Organization) => {
    try {
      setLoadingId(org.id);
      const res = await selectOrg({ orgId: org.id });
      if (user) {
        setAuth(user, res.data.token, localStorage.getItem('adv_refresh_token') || "");
      }
      setCurrentOrg({ ...org, role: res.data.role as any, permissions: res.data.permissions });
      navigate(ROUTES.DASHBOARD);
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to switch workspace");
    } finally {
      setLoadingId(null);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", name: "", address: "", email: "", contactNo: "" });

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleCreateOrgClick = () => {
    setFormData({ id: "", name: "", address: "", email: "", contactNo: "" });
    setModalOpen(true);
  };

  const handleEditOrgClick = (e: React.MouseEvent, org: Organization) => {
    e.stopPropagation();
    setFormData({ id: org.id, name: org.name, address: org.address || "", email: org.email || "", contactNo: org.contactNo || "" });
    setModalOpen(true);
  };

  const submitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return toast.error("Organization name is required");

    try {
      if (formData.id) {
        const res = await updateOrg(formData.id, formData);
        const updated = organizations.map(o => o.id === formData.id ? { ...o, ...res.data } : o);
        useOrgStore.getState().setOrganizations(updated);
        toast.success(res.message);
      } else {
        const res = await createOrg(formData);
        const newOrg = { id: res.data._id || res.data.id, name: res.data.name, address: res.data.address, email: res.data.email, contactNo: res.data.contactNo, role: "ORG_ADMIN" as const };
        useOrgStore.getState().setOrganizations([...organizations, newOrg]);
        toast.success(res.message);
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save workspace");
    }
  };

  const handleDeleteOrg = async (e: React.MouseEvent, org: Organization) => {
    e.stopPropagation();
    setDeleteId(org.id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await deleteOrg(deleteId);
      const remaining = organizations.filter(o => o.id !== deleteId);
      useOrgStore.getState().setOrganizations(remaining);
      toast.success(res.message);
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete workspace");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
           <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center rounded-lg mb-2">
              <Building2 className="h-6 w-6" />
           </div>
           <h1 className="text-2xl font-bold tracking-tight text-foreground">Select Workspace</h1>
           <p className="text-sm text-muted-foreground">Choose an organization to continue.</p>
        </div>

        <div className="grid gap-3">
          {fetching ? (
            [...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-none border border-border/40 animate-pulse">
                <CardContent className="p-4 flex items-center justify-between">
                   <div className="space-y-2">
                    <Skeleton className="h-4 w-40 rounded-sm" />
                    <Skeleton className="h-3 w-24 rounded-sm" />
                  </div>
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardContent>
              </Card>
            ))
          ) : organizations.length === 0 ? (
            <Card className="border-dashed shadow-none bg-muted/20">
              <CardContent className="pt-6 text-center space-y-2">
                <p className="text-sm font-bold text-foreground">No active workspaces found</p>
                <p className="text-[11px] text-muted-foreground px-4">
                  {user?.role === "ORG_ADMIN" 
                    ? "Create your first workspace to start managing your firm." 
                    : "You don't have any assigned workspaces. Please contact your administrator for access."}
                </p>
              </CardContent>
            </Card>
          ) : (
            organizations.map((org) => (
              <Card 
                key={org.id}
                className={cn(
                  "cursor-pointer hover:border-primary transition-all shadow-none group",
                  loadingId === org.id && "opacity-50 pointer-events-none"
                )}
                onClick={() => !loadingId && handleSelect(org)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                   <div className="space-y-1">
                    <p className="text-sm font-bold leading-none text-foreground">{org.name}</p>
                    <p className="text-[11px] text-muted-foreground uppercase font-medium tracking-tighter">Role: {org.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                     {org.role === "ORG_ADMIN" && (
                       <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={(e) => handleEditOrgClick(e, org)}>
                           <Edit2 className="h-3.5 w-3.5" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => handleDeleteOrg(e, org)}>
                           <Trash2 className="h-3.5 w-3.5" />
                         </Button>
                       </div>
                     )}
                     <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2 pt-4">
          {user?.role === "ORG_ADMIN" && (
            <Button variant="outline" className="w-full border-dashed h-11 bg-background text-xs font-bold" onClick={handleCreateOrgClick}>
              <Plus className="mr-2 h-4 w-4" /> New Workspace
            </Button>
          )}
          <Button variant="ghost" className="w-full h-11 text-muted-foreground hover:text-foreground font-bold" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl rounded-2xl border border-border bg-card">
            <CardHeader className="bg-muted/50 border-b border-border p-4">
              <CardTitle className="text-lg">{formData.id ? "Edit Workspace" : "New Workspace"}</CardTitle>
              <CardDescription>Setup your firm's details.</CardDescription>
            </CardHeader>
            <form onSubmit={submitModal}>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Firm Name</Label>
                  <Input 
                    id="org-name"
                    placeholder="e.g. Smith & Co. Advocates" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email">Email</Label>
                  <Input 
                    id="org-email"
                    type="email"
                    placeholder="contact@firm.com" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                    {formData.id ? "Save Changes" : "Create Firm"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}

      <ConfirmModal 
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
