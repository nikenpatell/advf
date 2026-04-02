import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useOrgStore } from "@/store/useOrgStore";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Mail,
  Menu,
  Search,
  Bell,
  Moon, 
  Sun, 
  Monitor,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { useThemeStore } from "@/store/useThemeStore";

export default function Header() {
  const { logout } = useAuthStore();
  const { setSidebarOpen } = useUIStore();
  const { currentOrg } = useOrgStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-4 flex-1">
        <Button 
           variant="ghost" 
           size="icon" 
           onClick={() => setSidebarOpen(true)} 
           className="md:hidden h-8 w-8"
        >
          <Menu className="h-4 w-4 text-foreground" />
        </Button>

        <div className="hidden md:flex items-center relative w-full max-w-sm ml-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search documentation..." 
            className="w-full h-8 pl-9 pr-4 bg-muted border-none rounded-full text-[13px] text-foreground focus:outline-none transition-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 mr-2">
           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={toggleTheme} title={`Current: ${theme}`}>
             {theme === "light" && <Sun className="h-4 w-4" />}
             {theme === "dark" && <Moon className="h-4 w-4" />}
             {theme === "system" && <Monitor className="h-4 w-4" />}
           </Button>
           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
             <Mail className="h-4 w-4" />
           </Button>
           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
             <Bell className="h-4 w-4" />
           </Button>
        </div>

        <Button 
          variant="default" 
          size="sm" 
          className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-3 hidden xs:flex"
        >
          <Plus className="h-3.5 w-3.5 stroke-[3px]" />
          Quick Create
        </Button>

        <div className="flex items-center gap-1 px-2 border-l border-border ml-2">
           <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter hidden lg:block mr-2">
              {currentOrg?.name || "Acme Inc."}
           </span>
           <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout} title="Sign Out">
             <LogOut className="h-4 w-4" />
           </Button>
        </div>
      </div>
    </header>
  );
}
