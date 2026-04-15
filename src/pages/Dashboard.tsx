import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText
} from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { getCases } from "@/services/case.service";
import { getTasks } from "@/services/task.service";
import { getTeamMembers } from "@/services/team.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    caseCount: 0,
    clientCount: 0,
    taskCount: 1,
    teamSize: 0,
    recentCases: [] as any[],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [casesRes, tasksRes, clientsRes, teamRes] = await Promise.all([
          getCases(),
          getTasks(),
          getTeamMembers("CLIENT"),
          getTeamMembers()
        ]);

        setData({
          caseCount: casesRes.data.length,
          taskCount: tasksRes.data.filter(t => t.status !== "COMPLETED").length,
          clientCount: clientsRes.data.length,
          teamSize: teamRes.data.filter(m => m.role !== "CLIENT").length,
          recentCases: casesRes.data.slice(0, 5),
        });
      } catch (err) {
        console.error("Dashboard load failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  
  const STATS = [
    { label: "Total Cases", value: data.caseCount.toString(), change: "+2.1%", trend: "up", description: "Active cases", permission: { module: "CASE", action: "VIEW" } },
    { label: "Clients", value: data.clientCount.toString(), change: "+5%", trend: "up", description: "Total registered clients", permission: { module: "CLIENT", action: "VIEW" } },
    { label: "Active Tasks", value: data.taskCount.toString(), change: "-10%", trend: "down", description: "In-progress tasks", permission: { module: "TASK", action: "VIEW" } },
    { label: "Team Members", value: data.teamSize.toString(), change: "+0%", trend: "up", description: "Total members", permission: { module: "TEAM", action: "VIEW" } },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-2xl border border-border/40">
               <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
               <CardContent><Skeleton className="h-10 w-16" /><Skeleton className="h-3 w-32 mt-2" /></CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-[32px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          hasPermission(stat.permission.module as any, stat.permission.action as any) ? (
            <Card key={i} className="rounded-2xl shadow-none border border-border/40 bg-background/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</CardTitle>
                <Badge variant={stat.trend === "up" ? "outline" : "secondary"} className="text-[10px] h-5 px-2 border-primary/20 text-primary">
                  {stat.trend === "up" ? <ArrowUpRight className="h-2.5 w-2.5 mr-1" /> : <ArrowDownRight className="h-2.5 w-2.5 mr-1" />}
                  {stat.change}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tight text-foreground">{stat.value}</div>
                <CardDescription className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-tight opacity-60">{stat.description}</span>
                </CardDescription>
              </CardContent>
            </Card>
          ) : (
            <Card key={i} className="rounded-2xl shadow-none border border-dashed border-border/40 bg-muted/5 flex items-center justify-center p-6 opacity-40">
               <div className="flex flex-col items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Restricted</span>
               </div>
            </Card>
          )
        ))}
      </div>

      <Card className="rounded-[32px] shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl border border-border/40 overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:p-8 gap-4">
          <div>
            <CardTitle className="text-xl font-black text-foreground tracking-tight">Recent Activity</CardTitle>
            <CardDescription className="text-xs uppercase font-bold tracking-widest opacity-60">Latest industrial litigation records</CardDescription>
          </div>
          <div className="flex bg-muted/40 p-1 rounded-full border border-border/20">
             <Button variant="ghost" size="sm" className="h-8 text-[10px] bg-background shadow-sm font-black uppercase tracking-widest rounded-full px-4 text-primary">Live Insights</Button>
             <Button variant="ghost" size="sm" className="h-8 text-[10px] text-muted-foreground uppercase font-black tracking-widest px-4">Historical Data</Button>
          </div>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center border-t border-border/20 p-0 relative bg-muted/5">
           {/* Chart Mockup */}
           <div className="w-full h-full bg-gradient-to-b from-primary/5 to-transparent flex flex-col items-center justify-center overflow-hidden">
              <div className="flex items-end gap-1.5 w-full max-w-xl h-32 mb-4 px-8 overflow-hidden opacity-30 hover:opacity-100 transition-opacity">
                 {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 45, 60, 95, 70, 50, 80, 110, 65].map((h, i) => (
                    <div key={i} className="w-full bg-primary h-full rounded-t-lg transition-all hover:scale-110" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
              <div className="absolute bottom-6 flex items-center gap-2 px-6 py-2 bg-background border border-border/40 rounded-full shadow-2xl animate-bounce">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Registry Connectivity Optimized</span>
              </div>
           </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div className="flex items-center bg-muted/40 p-1 rounded-full gap-1 border border-border/20 w-fit">
             <Button variant="ghost" size="sm" className="h-8 text-[10px] bg-background shadow-sm font-black uppercase tracking-widest rounded-full px-4">Active Files</Button>
             <Button variant="ghost" size="sm" className="h-8 text-[10px] text-muted-foreground font-black uppercase tracking-widest rounded-full px-4">Archive Registry</Button>
           </div>
           
           <div className="flex items-center gap-2">
              {hasPermission("CASE", "CREATE") && (
                <Button onClick={() => navigate("/cases/create")} className="h-10 gap-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/10 px-6 transition-transform hover:scale-105">
                   <Plus className="h-3.5 w-3.5" /> Register Case
                </Button>
              )}
           </div>
        </div>

        <Card className="rounded-[32px] shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl border border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
              <TableRow className="border-border/20 hover:bg-transparent">
                <TableHead className="w-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">#</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Case Title</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stage</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Next Hearing</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Counsel</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentCases.map((c, i) => (
                <TableRow key={c._id} className="border-border/20 group hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => navigate(`/cases/view/${c._id}`)}>
                  <TableCell className="text-center font-black text-xs text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-black text-sm tracking-tight text-foreground p-4">
                     <div className="flex flex-col">
                        <span>{c.title}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest opacity-60">CAS-{c.caseNumber}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline" className="rounded-lg font-black text-[9px] uppercase tracking-widest h-6 border-primary/20 text-primary bg-primary/5 px-2">{c.stage || "N/A"}</Badge>
                  </TableCell>
                  <TableCell>
                     {c.nextHearingDate ? (
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-emerald-600 uppercase">{format(new Date(c.nextHearingDate), "dd MMM yyyy")}</span>
                           <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight">{format(new Date(c.nextHearingDate), "EEEE")}</span>
                        </div>
                     ) : (
                        <span className="text-[10px] font-black text-muted-foreground/40 italic uppercase tracking-widest">No Date Set</span>
                     )}
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        {c.status === "CLOSED" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Clock className="h-3.5 w-3.5 text-orange-500" />}
                        <span className={`text-[11px] font-black uppercase tracking-tighter ${c.status === "CLOSED" ? "text-emerald-600" : "text-muted-foreground"}`}>{c.status}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-col">
                        <span className="text-xs font-black text-foreground/80">{c.assignedMembers?.[0]?.name || "Unassigned"}</span>
                        {c.assignedMembers?.length > 1 && (
                           <span className="text-[9px] text-muted-foreground font-bold italic">+{c.assignedMembers.length - 1} more counsel</span>
                        )}
                     </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary text-primary hover:text-white">
                       <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.recentCases.length === 0 && (
                <TableRow>
                   <TableCell colSpan={7} className="h-48 text-center bg-muted/5">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
                         <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center">
                            <FileText className="h-8 w-8" />
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest">Registry Portfolio Empty</span>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
