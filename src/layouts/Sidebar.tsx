import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useOrgStore } from "@/store/useOrgStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/utils/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard,
  Briefcase,
  Users2,
  Building2,
  FileText,
  Calendar,
  CheckSquare,
  ShieldCheck,
  FileCheck,
  MessageSquare,
  Settings,
  Search,
  HelpCircle,
  MoreVertical,
  LogOut,
  Layers,
  Repeat
} from "lucide-react";

const NAV_CONFIG = {
  SUPER_ADMIN: [
    { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "Organizations", href: ROUTES.ORGANIZATIONS, icon: Building2 },
    { label: "System Users", href: ROUTES.SYSTEM_USERS, icon: ShieldCheck },
  ],
  ORG_ADMIN: [
    { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "Cases", href: ROUTES.CASES, icon: FileText },
    { label: "Clients", href: ROUTES.CLIENTS, icon: Briefcase },
    { label: "Team", href: ROUTES.MY_TEAM, icon: Users2 },
    { label: "Roles", href: "/roles", icon: ShieldCheck },
    { label: "Calendar", href: ROUTES.CALENDAR, icon: Calendar },
    { label: "Tasks", href: ROUTES.TASKS, icon: CheckSquare },
    { label: "Types", href: ROUTES.TYPE_MANAGEMENT, icon: Layers },
  ],
  TEAM_MEMBER: [
    { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: "Cases", href: ROUTES.CASES, icon: FileText },
    { label: "Clients", href: ROUTES.CLIENTS, icon: Briefcase },
    { label: "Team", href: ROUTES.MY_TEAM, icon: Users2 },
    { label: "Roles", href: "/roles", icon: ShieldCheck },
    { label: "Tasks", href: ROUTES.TASKS, icon: CheckSquare },
    { label: "Calendar", href: ROUTES.CALENDAR, icon: Calendar },
    { label: "Types", href: ROUTES.TYPE_MANAGEMENT, icon: Layers },
  ],
  CLIENT: [
    { label: "My Cases", href: ROUTES.MY_CASES, icon: FileCheck },
    { label: "Messages", href: ROUTES.MESSAGES, icon: MessageSquare },
  ],
};

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { currentOrg } = useOrgStore();
  const { user } = useAuthStore();

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/20 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-background md:static md:translate-x-0",
          !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center px-4 border-b border-border/40">
          <div className="flex items-center justify-between w-full gap-2 overflow-hidden">
            <div className="flex items-center gap-2.5 overflow-hidden">
               <div className="h-8 w-8 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <ShieldCheck className="h-4 w-4" />
               </div>
               <div className="flex flex-col truncate">
                  <span className="text-[13px] font-black tracking-tight text-foreground truncate leading-none mb-1">{currentOrg?.name || "Workspace"}</span>
                  <span className="text-[9px] font-black uppercase text-primary tracking-widest leading-none opacity-80 italic">{currentOrg?.role?.replace('_', ' ')}</span>
               </div>
            </div>
            <NavLink to="/select-org" className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all group shrink-0" title="Switch Workspace">
               <Repeat className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-700" />
            </NavLink>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          <div className="px-2 mb-2">
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">General</span>
          </div>
          {(NAV_CONFIG[currentOrg?.role as keyof typeof NAV_CONFIG] || []).filter(item => {
             // 1. Super Admin or Org Admin bypass
             if (!currentOrg || currentOrg.role === "ORG_ADMIN") return true;

             // 2. Map Sidebar Labels to module keys
             const mapping: Record<string, string> = {
                "Dashboard": "DASHBOARD",
                "Cases": "CASE",
                "Clients": "CLIENT",
                "Team": "TEAM",
                "Roles": "ROLE",
                "Calendar": "CALENDAR",
                "Tasks": "TASK",
                "Types": "REGISTRY"
             };

             const moduleKey = mapping[item.label];
             if (!moduleKey) return true; // allow non-mapped items by default

             // 3. Verify 'VIEW' permission
             const perm = currentOrg.permissions?.find(p => p.module === moduleKey);
             return perm?.actions.includes("VIEW" as any);
          }).map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-2 border-t border-border mt-auto">
           <div className="space-y-1 mb-4">
              <NavLink to={ROUTES.SETTINGS} className="flex items-center gap-2.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <Settings className="h-4 w-4" /> Settings
              </NavLink>
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <HelpCircle className="h-4 w-4" /> Get Help
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <Search className="h-4 w-4" /> Search
              </button>
              <button 
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all"
                onClick={() => { useAuthStore.getState().logout(); window.location.href = ROUTES.LOGIN; }}
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
           </div>
           
           <div className="flex items-center justify-between p-2 rounded-[16px] bg-muted/40 hover:bg-accent cursor-pointer group transition-all">
              <div className="flex items-center gap-3 truncate">
                 <Avatar className="h-8 w-8 rounded-full border border-border/40">
                    <AvatarImage src="" />
                    <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-[10px] font-black">
                       {user?.name?.charAt(0) || "S"}
                    </AvatarFallback>
                 </Avatar>
                 <div className="flex flex-col truncate">
                    <span className="text-[12px] font-black truncate leading-none text-foreground">{user?.name || "User"}</span>
                    <span className="text-[9px] text-muted-foreground mt-1 truncate opacity-60 italic">{user?.email || "mail@adv.com"}</span>
                 </div>
              </div>
              <MoreVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-40" />
           </div>
        </div>
      </aside>
    </>
  );
}
