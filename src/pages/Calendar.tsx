import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Gavel, 
  CheckSquare, 
  X,
  ExternalLink,
} from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  isToday,
  parseISO
} from "date-fns";
import { cn } from "@/lib/utils";
import { getCalendarEvents, type CalendarEvent } from "@/services/calendar.service";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { usePermission } from "@/hooks/usePermission";

export default function CalendarPage() {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getCalendarEvents();
        setEvents(res.data);
      } catch (err) {
        toast.error("Registry synchronization failed.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(e => {
        const dateMatch = isSameDay(parseISO(e.date), day);
        if (!dateMatch) return false;
        // Filter out event types the user doesn't have VIEW permission for
        if (e.type === "HEARING" && !hasPermission("CASE", "VIEW")) return false;
        if (e.type === "TASK" && !hasPermission("TASK", "VIEW")) return false;
        return true;
    });
  };

  const handleDayClick = (day: Date) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      setSelectedDay(day);
      setShowModal(true);
    }
  };

  if (loading) {
     return (
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse pb-12">
           <Skeleton className="h-14 w-64" />
           <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden">
              <Skeleton className="h-[600px] w-full" />
           </Card>
        </div>
     );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader 
          title="Industrial Calendar" 
          subtitle="Real-time orchestration of litigation hearings and initiative deadlines."
        />
        <div className="flex items-center gap-3 bg-muted/20 p-2 rounded-full border border-border/40 backdrop-blur-sm self-start">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-full hover:bg-background h-10 w-10 transition-all active:scale-95 shadow-sm">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm font-black uppercase tracking-widest px-4 min-w-[140px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-full hover:bg-background h-10 w-10 transition-all active:scale-95 shadow-sm">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl shadow-primary/5 bg-background/50 backdrop-blur-xl rounded-[40px] border border-border/40 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b border-border/40 bg-muted/10 backdrop-blur-md">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-4 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr">
            {daysInMonth.map((day, idx) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDay = isToday(day);

              return (
                <div 
                  key={idx} 
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "min-h-[120px] p-2 border-r border-b border-border/20 transition-all group relative cursor-pointer hover:bg-muted/5",
                    !isCurrentMonth && "bg-muted/5 opacity-30 pointer-events-none",
                    (idx + 1) % 7 === 0 && "border-r-0"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-[13px] font-bold h-7 w-7 flex items-center justify-center rounded-full transition-all",
                      isTodayDay ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {format(day, "d")}
                    </span>
                    {dayEvents.length > 0 && isCurrentMonth && (
                       <Badge variant="outline" className="text-[9px] font-black h-5 rounded-full border-primary/20 bg-primary/5 text-primary">
                          {dayEvents.length} {dayEvents.length === 1 ? "Event" : "Events"}
                       </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 overflow-hidden">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div 
                        key={event.id} 
                        className={cn(
                          "px-2 py-1 rounded-[8px] text-[9.5px] font-bold truncate transition-all shadow-sm flex items-center gap-1.5",
                          event.type === "HEARING" 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
                        )}
                      >
                        {event.type === "HEARING" ? <Gavel className="h-2.5 w-2.5" /> : <CheckSquare className="h-2.5 w-2.5" />}
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-muted-foreground italic pl-2 font-bold opacity-60">
                        + {dayEvents.length - 3} more records
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Industrial Event Details Modal */}
      {showModal && selectedDay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-border/40 shadow-2xl bg-card animate-in zoom-in-95 duration-300">
              <div className="bg-gradient-to-br from-muted/50 to-background p-8 border-b border-border/20 flex items-center justify-between">
                 <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">{format(selectedDay, "MMMM d, yyyy")}</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-1 italic">Event Orchestration for this day</p>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="rounded-full h-11 w-11 hover:bg-primary/5 transition-all">
                    <X className="h-5 w-5" />
                 </Button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                 {getEventsForDay(selectedDay).map((event) => (
                    <div key={event.id} className="group p-6 rounded-[24px] bg-muted/10 border border-border/20 hover:border-primary/30 transition-all hover:bg-muted/20">
                       <div className="flex items-start justify-between mb-4">
                          <div className={cn(
                             "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg",
                             event.type === "HEARING" ? "bg-primary text-primary-foreground" : "bg-orange-500 text-white"
                          )}>
                             {event.type === "HEARING" ? <Gavel className="h-5 w-5" /> : <CheckSquare className="h-5 w-5" />}
                          </div>
                          <Badge variant="outline" className={cn(
                             "text-[9px] font-black uppercase tracking-widest px-3 h-6 rounded-full border-none",
                             event.type === "HEARING" ? "bg-primary/10 text-primary" : "bg-orange-500/10 text-orange-600"
                          )}>
                             {event.type === "HEARING" ? <span className="flex items-center gap-1"><Gavel className="h-2.5 w-2.5" /> Hearing</span> : <span className="flex items-center gap-1"><CheckSquare className="h-2.5 w-2.5" /> Task</span>}
                          </Badge>
                       </div>
                       
                       <h4 className="text-lg font-black text-foreground tracking-tight leading-tight mb-2 group-hover:text-primary transition-colors">
                          {event.title}
                       </h4>
                       
                       {event.caseNumber && (
                          <div className="flex items-center gap-2 mb-3">
                             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Registry ID:</span>
                             <span className="text-[11px] font-bold text-primary italic">#{event.caseNumber}</span>
                          </div>
                       )}

                       <p className="text-[13px] text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4 mb-4">
                          {event.details || "No industrial specification provided for this entry."}
                       </p>

                       <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setShowModal(false);
                          navigate(event.type === "HEARING" ? `/cases/view/${event.id}` : `/tasks/view/${event.id}`);
                        }}
                        className="w-full rounded-2xl h-10 text-[10px] font-black uppercase tracking-widest gap-2 bg-transparent border-dashed group-hover:border-primary/40 group-hover:bg-primary/5 transition-all"
                       >
                          Open Workstation <ExternalLink className="h-3 w-3" />
                       </Button>
                    </div>
                 ))}
              </div>
              <div className="p-8 bg-muted/10 border-t border-border/10 flex justify-end">
                 <Button onClick={() => setShowModal(false)} className="rounded-full px-8 text-[10px] font-black uppercase tracking-widest h-11 bg-foreground text-background hover:scale-105 transition-all shadow-xl">
                    Close Manifest
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
