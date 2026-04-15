import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useOrgStore } from "@/store/useOrgStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Menu, Search, Bell, Moon, Sun, Monitor, LogOut, 
  UserCircle2, ShieldCheck, FileText, CheckSquare, Loader2, RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

import { useDebounce } from "@/hooks/useDebounce";
import { globalSearch, SearchResults } from "@/services/search.service";
import { getRolesByEmail, login } from "@/features/auth/services/auth.service";
import type { UserRole } from "@/types/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Header() {
  const { user, setAuth, logout } = useAuthStore();
  const { setSidebarOpen } = useUIStore();
  const { currentOrg, setOrganizations, clearOrgs } = useOrgStore();
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

  // --- Global Search Logic ---
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults(null);
        return;
      }
      try {
        setIsSearching(true);
        const res = await globalSearch(debouncedSearch);
        setSearchResults(res);
        setSearchOpen(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchSearch();
  }, [debouncedSearch]);

  const handleSearchSelect = (type: string, id: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    if (type === "case") navigate(`/cases/view/${id}`);
    if (type === "task") navigate(`/tasks/view/${id}`);
    if (type === "client") navigate(`/clients/view/${id}`);
  };

  // --- Switch Identity / Role Logic ---
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [selectedRoleToSwitch, setSelectedRoleToSwitch] = useState<UserRole | null>(null);
  const [switchPassword, setSwitchPassword] = useState("");
  const [switching, setSwitching] = useState(false);

  const initSwitchIdentity = async () => {
    if (!user?.email) return;
    try {
      const res = await getRolesByEmail({ email: user.email });
      const roles = res.data.roles.filter(r => r !== user.role);
      
      if (roles.length === 0) {
        toast("No other identities linked to this email.", { icon: "ℹ️" });
        return;
      }
      setAvailableRoles(roles);
      setSwitchModalOpen(true);
      setSelectedRoleToSwitch(roles[0]);
    } catch (err: any) {
      toast.error("Failed to query alternative identities.");
    }
  };

  const handleSwitchIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleToSwitch || !switchPassword || !user?.email) return;

    try {
      setSwitching(true);
      const res = await login({
        email: user.email,
        password: switchPassword,
        role: selectedRoleToSwitch
      });

      setAuth(res.data.user, res.data.token, res.data.refreshToken || "");
      clearOrgs();
      if (res.data.organizations) {
        setOrganizations(res.data.organizations);
      }
      
      toast.success(`Identity transitioned to ${selectedRoleToSwitch}.`);
      setSwitchModalOpen(false);
      setSwitchPassword("");
      navigate("/select-org"); // Force selection of org under new identity
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credential for target identity.");
    } finally {
      setSwitching(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-4 flex-1">
        <Button 
           variant="ghost" 
           size="icon" 
           onClick={() => setSidebarOpen(true)} 
           className="md:hidden h-8 w-8"
        >
          <Menu className="h-4 w-4 text-foreground" />
        </Button>

        <div className="flex items-center relative flex-1 max-w-[140px] sm:max-w-xs md:max-w-sm ml-1 md:ml-2">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchResults) setSearchOpen(true); }}
                  placeholder="Global registry search..." 
                  className="w-full h-9 pl-9 pr-8 bg-muted/60 border border-border/40 hover:border-border rounded-full text-[13px] font-bold text-foreground focus:outline-none focus:bg-background focus:ring-1 focus:ring-primary transition-all"
                />
                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin text-muted-foreground" />}
              </div>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[90vw] max-w-[450px] md:w-[450px] p-0 rounded-2xl shadow-2xl border-border/60 md:ml-6 mt-1 bg-background/95 backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95" 
              align="start" 
              sideOffset={10}
            >
              <div className="max-h-[60vh] overflow-y-auto w-full p-2 space-y-4">
                {searchResults?.cases && searchResults.cases.length > 0 && (
                  <div className="space-y-1.5">
                     <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <FileText className="h-3 w-3" /> Litigation Portfolio
                     </div>
                     {searchResults.cases.map(c => (
                        <div key={c._id} onClick={() => handleSearchSelect("case", c._id)} className="flex flex-col px-3 py-2 hover:bg-muted rounded-xl cursor-pointer transition-colors group">
                           <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{c.title}</span>
                           <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">{c.caseNumber} • {c.status}</span>
                        </div>
                     ))}
                  </div>
                )}
                {searchResults?.tasks && searchResults.tasks.length > 0 && (
                  <div className="space-y-1.5">
                     <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <CheckSquare className="h-3 w-3" /> Initiatives
                     </div>
                     {searchResults.tasks.map(t => (
                        <div key={t._id} onClick={() => handleSearchSelect("task", t._id)} className="flex items-center justify-between px-3 py-2 hover:bg-muted rounded-xl cursor-pointer transition-colors group">
                           <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{t.title}</span>
                           <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">{t.status}</span>
                        </div>
                     ))}
                  </div>
                )}
                {searchResults?.clients && searchResults.clients.length > 0 && (
                  <div className="space-y-1.5">
                     <div className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <UserCircle2 className="h-3 w-3" /> Entities
                     </div>
                     {searchResults.clients.map(cl => (
                        <div key={cl._id} onClick={() => handleSearchSelect("client", cl._id)} className="flex flex-col px-3 py-2 hover:bg-muted rounded-xl cursor-pointer transition-colors group">
                           <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{cl.name}</span>
                           <span className="text-[10px] text-muted-foreground italic">{cl.email}</span>
                        </div>
                     ))}
                  </div>
                )}
                {(!searchResults || (searchResults.cases.length === 0 && searchResults.tasks.length === 0 && searchResults.clients.length === 0)) && (
                   <div className="py-8 text-center flex flex-col items-center opacity-50">
                      <Search className="h-8 w-8 mb-2 opacity-50" />
                      <p className="text-xs font-bold uppercase tracking-widest">No registry matches</p>
                   </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <div className="hidden sm:flex items-center gap-1 md:mr-2">
           <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full" onClick={toggleTheme} title={`Current: ${theme}`}>
             {theme === "light" && <Sun className="h-4 w-4" />}
             {theme === "dark" && <Moon className="h-4 w-4" />}
             {theme === "system" && <Monitor className="h-4 w-4" />}
           </Button>
           <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full hidden md:flex">
             <Bell className="h-4 w-4" />
           </Button>
        </div>

        <Button 
          variant="default" 
          size="sm" 
          className="h-9 gap-2 bg-foreground text-background hover:scale-105 transition-transform font-black text-[10px] uppercase tracking-widest px-4 hidden sm:flex rounded-full shadow-lg"
          onClick={initSwitchIdentity}
        >
          <RefreshCw className="h-3.5 w-3.5 stroke-[3px]" />
          <span className="hidden lg:inline">Switch Identity</span>
        </Button>

        <div className="flex items-center gap-1 px-3 border-l border-border/40 ml-1">
           <div className="flex flex-col mr-3 items-end hidden md:flex lg:flex">
             <span className="text-[12px] font-black text-foreground leading-none max-w-[100px] truncate">{currentOrg?.name || "Workspace Null"}</span>
             <span className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 italic">{user?.role?.replace("_", " ")}</span>
           </div>
           
           <Popover>
              <PopoverTrigger asChild>
                 <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full bg-muted/50 border border-border/40 hover:bg-muted text-foreground">
                    <UserCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                 </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1 rounded-2xl shadow-xl border-border/60 sm:mr-4 mt-2 bg-background/95 backdrop-blur-xl" align="end">
                 <div className="px-3 py-3 border-b border-border/40 mb-1">
                    <p className="text-sm font-black text-foreground truncate">{user?.name}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground truncate tracking-widest mt-1">{user?.email}</p>
                 </div>
                 <div className="flex flex-col gap-0.5 p-1">
                    <Button variant="ghost" onClick={initSwitchIdentity} className="w-full justify-start text-xs font-bold rounded-xl h-9 hover:bg-primary/10 hover:text-primary">
                       <RefreshCw className="h-3.5 w-3.5 mr-2" /> Switch Role Auth
                    </Button>
                    <Button variant="ghost" onClick={() => navigate("/select-org")} className="w-full justify-start text-xs font-bold rounded-xl h-9">
                       <ShieldCheck className="h-3.5 w-3.5 mr-2" /> Change Organization
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-xs font-bold rounded-xl h-9 text-destructive hover:bg-destructive/10 hover:text-destructive">
                       <LogOut className="h-3.5 w-3.5 mr-2" /> Disconnect Session
                    </Button>
                 </div>
              </PopoverContent>
           </Popover>
        </div>
      </div>

      {switchModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-sm shadow-2xl rounded-3xl border border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 p-6">
              <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-4 border border-primary/20">
                 <RefreshCw className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-black">Identity Shift</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest">
                Authenticate required target role.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSwitchIdentity}>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Identity Profile</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {availableRoles.map(r => (
                      <div 
                         key={r}
                         onClick={() => setSelectedRoleToSwitch(r)}
                         className={`p-3 rounded-2xl cursor-pointer border-2 transition-all flex items-center gap-3 ${selectedRoleToSwitch === r ? 'border-primary bg-primary/5' : 'border-border/40 bg-muted/20 hover:border-primary/50'}`}
                      >
                         <ShieldCheck className={`h-4 w-4 ${selectedRoleToSwitch === r ? 'text-primary' : 'text-muted-foreground'}`} />
                         <span className={`text-xs font-black uppercase tracking-widest ${selectedRoleToSwitch === r ? 'text-primary' : 'text-foreground'}`}>{r.replace("_", " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Access Key [Password]</Label>
                  <Input 
                    type="password"
                    value={switchPassword}
                    onChange={(e) => setSwitchPassword(e.target.value)}
                    placeholder="Enter password for target profile..." 
                    className="h-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background font-bold text-sm px-4"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setSwitchModalOpen(false)} className="h-12 flex-1 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-muted">Cancel</Button>
                  <Button type="submit" disabled={switching || !switchPassword} className="h-12 flex-1 rounded-2xl bg-foreground text-background text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                    {switching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authenticate"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      )}
    </header>
  );
}
