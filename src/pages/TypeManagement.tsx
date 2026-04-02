import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Briefcase, 
  Layers, 
  Wallet, 
  FileText, 
  Receipt, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Star,
  Settings2,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { 
  getRegistry, 
  updateType, 
  deleteType, 
  type TypeRegistryItem 
} from "@/services/registry.service";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { DataTable, DataTableRow, DataTableCell } from "@/components/ui/data-table";
import { usePermission } from "@/hooks/usePermission";

const CATEGORIES = [
  { id: "CASE_TYPE", label: "Case Categories", icon: Briefcase, desc: "Managing judicial case classifications." },
  { id: "CASE_STAGE", label: "Case Stages", icon: Layers, desc: "Workflow stages for active litigation." },
  { id: "PAYMENT_MODE", label: "Payment Modes", icon: Wallet, desc: "Financial transaction methods." },
  { id: "DOCUMENT_TYPE", label: "Document Assets", icon: FileText, desc: "Legal asset and file classifications." },
  { id: "EXPENSE_CATEGORY", label: "Expense Types", icon: Receipt, desc: "Firm overhead and case fees categorization." },
] as const;

export default function TypeManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const selectedCategory = (searchParams.get("category") || "CASE_TYPE") as typeof CATEGORIES[number]["id"];
  
  const [items, setItems] = useState<TypeRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getRegistry(selectedCategory);
      setItems(res.data);
    } catch (err: any) {
      toast.error("Failed to synchronize registry categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory]);

  const filteredItems = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  const handleOpenCreate = () => {
    navigate(`/type-management/create?category=${selectedCategory}`);
  };

  const handleOpenEdit = (item: TypeRegistryItem) => {
    navigate(`/type-management/edit/${item._id}?category=${selectedCategory}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await deleteType(deleteId);
      toast.success(res.message);
      setDeleteId(null);
      fetchItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registry decommission failed.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (item: TypeRegistryItem, field: "isLive" | "isPrime") => {
     if (!hasPermission("REGISTRY", "UPDATE")) {
        return toast.error("Authorization failure: Registry update privileges required.");
     }
     try {
        const payload = { ...item, [field]: !item[field] };
        await updateType(item._id, payload);
        fetchItems(); // Refresh for consistent 'isPrime' uniquely per category
     } catch (err) {
        toast.error("Failed to update registry status.");
     }
  };

  const updateCategory = (id: string) => {
    setSearchParams({ category: id });
  };

  const columns = [
    { header: "#", width: "60px", className: "text-center" },
    { header: "Classification Title" },
    { header: "Registry Status", className: "text-center" },
    { header: "Live state", className: "text-center" },
    { header: "Prime", className: "text-center" },
    { header: "Management", className: "w-[120px] text-right" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Type Management" 
          subtitle="Industrial orchestration of system registry categories." 
        />
        {hasPermission("REGISTRY", "CREATE") && (
          <Button onClick={handleOpenCreate} className="h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 rounded-full shadow-lg shadow-primary/10">
            <Plus className="h-4 w-4" />
            Add New Type
          </Button>
        )}
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Sidebar - Categories */}
        <div className="col-span-12 md:col-span-3">
          <Card className="border-none shadow-none bg-background/50 backdrop-blur-md rounded-2xl overflow-hidden border border-border/40">
            <CardHeader className="p-4 bg-muted/30 border-b border-border/50">
               <div className="flex items-center gap-2 mb-1">
                  <div className="h-8 w-8 bg-background border border-border rounded-lg flex items-center justify-center text-primary">
                     <Settings2 className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground">Registry</span>
               </div>
               <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-tighter">System Categories</p>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
               {CATEGORIES.map((cat) => {
                 const isActive = selectedCategory === cat.id;
                 return (
                    <button
                      key={cat.id}
                      onClick={() => updateCategory(cat.id)}
                      className={cn(
                        "w-full group flex items-start gap-4 p-3 rounded-xl transition-all text-left",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <cat.icon className={cn("h-4 w-4 mt-0.5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                      <div className="flex flex-col gap-0.5">
                         <div className="flex items-center justify-between w-full pr-1">
                            <span className="text-[11px] font-bold uppercase tracking-wide">{cat.label.split(' ')[0]}</span>
                            <ChevronRight className={cn("h-3 w-3", isActive ? "text-primary-foreground/50" : "text-muted-foreground/0 group-hover:text-muted-foreground/30")} />
                         </div>
                         <p className={cn("text-[10px] line-clamp-1 opacity-70", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>{cat.desc}</p>
                      </div>
                    </button>
                 );
               })}
            </CardContent>
          </Card>
        </div>

        {/* Main Area - List */}
        <div className="col-span-12 md:col-span-9 space-y-4">
           {/* Search & Statistics Bar */}
           <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={`Search within ${selectedCategory.replace('_', ' ')}...`}
                  className="pl-10 h-11 rounded-2xl bg-background border-border/50 transition-all focus:ring-primary/10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 p-1 px-3 bg-muted/40 rounded-full border border-border/30 h-11 shrink-0">
                 <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{selectedCategory.replace('_', ' ')} Context</span>
              </div>
           </div>

           <DataTable 
             columns={columns} 
             loading={loading} 
             empty={filteredItems.length === 0}
             emptyMessage="No classifications found for this registry context."
           >
              {filteredItems.map((item, index) => (
                <DataTableRow key={item._id}>
                  <DataTableCell isFirst className="text-center text-[11px] font-medium text-muted-foreground">{index + 1}</DataTableCell>
                  <DataTableCell>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-foreground">{item.title}</span>
                       {item.isPrime && <span className="text-[9px] uppercase tracking-tighter text-primary font-bold">System Default</span>}
                    </div>
                  </DataTableCell>
                  <DataTableCell className="text-center">
                    <Badge 
                      variant={item.status === "ACTIVE" ? "success" : "secondary"} 
                      className="text-[9px] h-5 rounded-full font-bold px-2"
                    >
                      {item.status}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell className="text-center">
                     <Switch 
                        disabled={!hasPermission("REGISTRY", "UPDATE")}
                        checked={item.isLive} 
                        onCheckedChange={() => toggleStatus(item, "isLive")}
                        className="scale-75"
                     />
                  </DataTableCell>
                  <DataTableCell className="text-center">
                     <Button 
                        disabled={!hasPermission("REGISTRY", "UPDATE")}
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-8 w-8 rounded-full transition-all", item.isPrime ? "text-primary bg-primary/10 shadow-inner" : "text-muted-foreground/30 hover:text-primary")}
                        onClick={() => toggleStatus(item, "isPrime")}
                     >
                        <Star className={cn("h-4 w-4", item.isPrime && "fill-current")} />
                     </Button>
                  </DataTableCell>
                  <DataTableCell isLast>
                     <div className="flex items-center justify-end gap-1">
                        {hasPermission("REGISTRY", "UPDATE") && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-background border border-transparent hover:border-border transition-all"
                            onClick={() => handleOpenEdit(item)}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {hasPermission("REGISTRY", "DELETE") && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-transparent hover:border-destructive/20 transition-all"
                            onClick={() => setDeleteId(item._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                     </div>
                  </DataTableCell>
                </DataTableRow>
              ))}
           </DataTable>
        </div>
      </div>

      <ConfirmModal 
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
