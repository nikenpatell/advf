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
  MoreHorizontal, 
  Columns,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck
} from "lucide-react";
import { usePermission } from "@/hooks/usePermission";

export default function Dashboard() {
  const { hasPermission } = usePermission();
  
  const STATS = [
    { label: "Case Load", value: "124", change: "+5.2%", trend: "up", description: "Active litigations", permission: { module: "CASE", action: "VIEW" } },
    { label: "Stakeholders", value: "842", change: "+12%", trend: "up", description: "Registered entity count", permission: { module: "CLIENT", action: "VIEW" } },
    { label: "Active Tasks", value: "45", change: "-20%", trend: "down", description: "Initiatives in-progress", permission: { module: "TASK", action: "VIEW" } },
    { label: "Team Velocity", value: "94%", change: "+2.5%", trend: "up", description: "Resource utilization", permission: { module: "TEAM", action: "VIEW" } },
  ];

  const DOCUMENTS = [
    { name: "Legal Brief #401", type: "Draft", status: "In Process", target: 18, limit: 5, reviewer: "Eddie Lake" },
    { name: "Evidence Log", type: "Exhibit", status: "Done", target: 29, reviewer: "Eddie Lake" },
    { name: "Firm Policy", type: "Internal", status: "Done", target: 10, limit: 13, reviewer: "Eddie Lake" },
    { name: "Settlement Agreement", type: "Final", status: "Done", target: 27, limit: 23, reviewer: "Jamik Tashpulatov" },
    { name: "Trial Transcript", type: "Archive", status: "In Process", target: 2, limit: 16, reviewer: "Jamik Tashpulatov" },
  ];

  return (
    <div className="space-y-6">
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
        <CardHeader className="flex flex-row items-center justify-between p-8">
          <div>
            <CardTitle className="text-xl font-black text-foreground tracking-tight">Industrial Activity Stream</CardTitle>
            <CardDescription className="text-xs uppercase font-bold tracking-widest opacity-60">Real-time workstation orchestration overview</CardDescription>
          </div>
          <div className="flex bg-muted/40 p-1 rounded-full border border-border/20">
             <Button variant="ghost" size="sm" className="h-8 text-[10px] bg-background shadow-sm font-black uppercase tracking-widest rounded-full px-4">Registry events</Button>
             <Button variant="ghost" size="sm" className="h-8 text-[10px] text-muted-foreground uppercase font-black tracking-widest px-4">System logs</Button>
          </div>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center border-t border-border/20 p-0 relative">
           {/* Chart Mockup */}
           <div className="w-full h-full bg-gradient-to-b from-muted/10 to-transparent flex flex-col items-center justify-center">
              <div className="flex items-end gap-1.5 w-full max-w-xl h-32 mb-4 px-8 overflow-hidden opacity-40 hover:opacity-100 transition-opacity">
                 {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 45, 60, 95, 70, 50, 80, 110, 65].map((h, i) => (
                    <div key={i} className="w-full bg-primary h-full rounded-t-lg transition-all hover:scale-110" style={{ height: `${h}%` }}></div>
                 ))}
              </div>
              <div className="absolute bottom-6 flex items-center gap-2 px-4 py-1.5 bg-background border border-border rounded-full shadow-xl animate-bounce">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Cloud Sync Active</span>
              </div>
           </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center bg-muted/40 p-1 rounded-full gap-1 border border-border/20">
             <Button variant="ghost" size="sm" className="h-8 text-[10px] bg-background shadow-sm font-black uppercase tracking-widest rounded-full px-4">Active Files</Button>
             <Button variant="ghost" size="sm" className="h-8 text-[10px] text-muted-foreground font-black uppercase tracking-widest rounded-full px-4">Past Registry</Button>
           </div>
           
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-10 gap-2 border-border/40 text-[10px] font-black uppercase tracking-widest rounded-2xl bg-background/50 hover:bg-background">
                 <Columns className="h-3.5 w-3.5" /> Registry Meta
              </Button>
              {hasPermission("CASE", "CREATE") && (
                <Button size="sm" className="h-10 gap-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/10 px-6">
                   <Plus className="h-3.5 w-3.5" /> Initialize Case
                </Button>
              )}
           </div>
        </div>

        <Card className="rounded-[32px] shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl border border-border/40 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/20 hover:bg-transparent">
                <TableHead className="w-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity Mapping</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Class</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registry State</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Objective</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Personnel</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOCUMENTS.map((doc, i) => (
                <TableRow key={i} className="border-border/20 group hover:bg-primary/5 transition-colors">
                  <TableCell className="text-center font-black text-xs text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-black text-sm tracking-tight text-foreground">{doc.name}</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="rounded-lg font-black text-[10px] uppercase tracking-tighter h-6 border-primary/20 text-primary bg-primary/5">{doc.type}</Badge>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        {doc.status === "Done" ? <CheckCircle2 className="h-4 w-4 text-emerald-500 scale-110" /> : <Clock className="h-4 w-4 text-orange-500 animate-spin-slow" />}
                        <span className={`text-[12px] font-black uppercase tracking-tighter ${doc.status === "Done" ? "text-emerald-600" : "text-muted-foreground"}`}>{doc.status}</span>
                     </div>
                  </TableCell>
                  <TableCell className="font-black text-xs text-foreground/80">{doc.target}k points</TableCell>
                  <TableCell className="font-black text-xs text-foreground/80">{doc.reviewer}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary text-primary hover:text-white">
                       <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
