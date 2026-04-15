import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { 
  FiPlus, 
  FiTrash2, 
  FiSmartphone, 
  FiWifi, 
  FiRefreshCw, 
  FiActivity,
  FiX,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { whatsappAPI, type WhatsAppSession } from "@/services/whatsapp.service";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const BACKEND_URL = "http://localhost:5000"; // Should be from config

export default function WhatsAppHub() {
  const [sessions, setSessions] = useState<WhatsAppSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await whatsappAPI.getAllSessions();
      setSessions(res.data);
    } catch (err) {
      toast.error("Failed to load WhatsApp accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    const socket = io(BACKEND_URL);
    
    socket.on("whatsapp_session_update", (updatedSession: WhatsAppSession) => {
      setSessions(prev => {
        const index = prev.findIndex(s => s.sessionId === updatedSession.sessionId);
        if (index !== -1) {
          const newSessions = [...prev];
          newSessions[index] = updatedSession;
          return newSessions;
        }
        return [...prev, updatedSession];
      });
      
      if (updatedSession.status === "CONNECTED") {
        toast.success(`Account '${updatedSession.name}' is now active.`);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) return toast.error("Session name is required.");
    try {
      setCreating(true);
      const res = await whatsappAPI.createSession(newSessionName);
      toast.success(res.message);
      setModalOpen(false);
      setNewSessionName("");
      fetchSessions();
    } catch (err) {
      toast.error("Failed to create session.");
    } finally {
      setCreating(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      await whatsappAPI.disconnectSession(id);
      toast.success("Successfully logged out.");
    } catch (err) {
      toast.error("Failed to logout.");
    }
  };

  const handleResume = async (id: string) => {
    try {
      await whatsappAPI.resumeSession(id);
      toast.success("Reconnect request sent.");
    } catch (err) {
      toast.error("Failed to reconnect.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await whatsappAPI.deleteSession(id);
      toast.success("Session deleted successfully.");
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      toast.error("Failed to delete session.");
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-10">
        <div className="space-y-2">
           <PageHeader 
             title="WhatsApp Hub" 
             subtitle="Real-time multi-account management and session control." 
           />
        </div>
        <Button 
          onClick={() => setModalOpen(true)}
          className="h-14 gap-3 bg-zinc-900 text-white hover:bg-zinc-800 font-bold text-sm rounded-2xl px-8 transition-all hover:shadow-2xl hover:shadow-zinc-200 active:scale-95"
        >
          <FiPlus className="h-5 w-5" /> Add Account
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 gap-6">
           <div className="relative">
             <div className="h-16 w-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
             <FiRefreshCw className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-emerald-500" />
           </div>
           <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Syncing Sessions...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session) => (
            <Card key={session._id} className="border border-zinc-100 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none bg-white dark:bg-zinc-900/50 rounded-[32px] overflow-hidden group transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:hover:shadow-none hover:-translate-y-1">
              <CardHeader className="p-8 pb-4">
                <div className="flex items-center justify-between mb-6">
                   <div className="h-14 w-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/20 transition-colors duration-500">
                      <FiSmartphone className="h-7 w-7 text-zinc-400 dark:text-zinc-500 group-hover:text-emerald-500 transition-colors duration-500" />
                   </div>
                   <Badge 
                     variant="outline"
                     className={cn(
                       "h-7 rounded-full px-4 font-bold text-[10px] uppercase tracking-wider border-0",
                       session.status === "CONNECTED" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : 
                       session.status === "QR_GENERATED" ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 animate-pulse" :
                       "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                     )}
                   >
                     <div className={cn(
                       "mr-1.5 h-1.5 w-1.5 rounded-full",
                       session.status === "CONNECTED" ? "bg-emerald-500" : "bg-current"
                     )} />
                     {session.status.replace("_", " ")}
                   </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{session.name}</CardTitle>
                <CardDescription className="text-xs font-bold tracking-widest text-zinc-400 dark:text-zinc-500 mt-1 uppercase">ID: {session.sessionId}</CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-4 space-y-8">
                {session.status === "QR_GENERATED" && session.qrCode && (
                  <div className="relative group/qr border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[24px] p-4 bg-zinc-50/50 dark:bg-zinc-900/40">
                     <img src={session.qrCode} alt="WhatsApp QR" className="w-full h-auto rounded-xl shadow-sm bg-white p-2" />
                     <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-[2px] opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-all duration-300 rounded-[24px]">
                        <span className="text-zinc-900 dark:text-zinc-100 text-xs font-bold uppercase tracking-widest px-4 text-center">Scan with WhatsApp</span>
                     </div>
                  </div>
                )}

                {session.status === "CONNECTED" && (
                   <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20">
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Service Active</span>
                         <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60 font-semibold">Ready for link requests</span>
                      </div>
                      <FiWifi className="ml-auto h-5 w-5 text-emerald-500 animate-pulse" />
                   </div>
                )}

                {session.status === "DISCONNECTED" && (
                   <div className="flex items-center gap-4 p-5 rounded-2xl bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20">
                      <FiAlertCircle className="h-5 w-5 text-red-500" />
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-red-700 dark:text-red-400">Disconnected</span>
                         <span className="text-[10px] text-red-600/70 dark:text-red-400/60 font-semibold">Session has ended</span>
                      </div>
                   </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  {session.status === "DISCONNECTED" || session.status === "QR_GENERATED" ? (
                    <Button 
                      variant="outline" 
                      onClick={() => handleResume(session._id)}
                      className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-xs gap-2 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-900 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all"
                    >
                      <FiRefreshCw className="h-3.5 w-3.5" /> Connect
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => handleDisconnect(session._id)}
                      className="h-12 rounded-xl border-zinc-200 dark:border-zinc-800 font-bold text-xs gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                    >
                      <FiX className="h-3.5 w-3.5" /> Stop
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => handleDelete(session._id)}
                    className="h-12 rounded-xl font-bold text-xs gap-2 text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {sessions.length === 0 && (
            <div className="col-span-full h-[400px] border-2 border-dashed border-zinc-200/50 dark:border-zinc-800 rounded-[40px] flex flex-col items-center justify-center gap-6 bg-zinc-50/50 dark:bg-zinc-900/30">
               <div className="h-24 w-24 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl dark:shadow-none border border-zinc-100 dark:border-zinc-800 flex items-center justify-center relative rotate-3">
                  <FiSmartphone className="h-10 w-10 text-emerald-500" />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white dark:bg-zinc-950 shadow-lg border border-zinc-50 dark:border-zinc-800 flex items-center justify-center">
                     <FiPlus className="h-4 w-4 text-emerald-600" />
                  </div>
               </div>
               <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">No Active Accounts</h3>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">Click below to add your first WhatsApp account and start managing your sessions.</p>
               </div>
               <Button onClick={() => setModalOpen(true)} className="h-14 rounded-2xl px-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold text-sm transition-all">
                 Add First Account
               </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-[32px] border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white/95 backdrop-blur-xl p-0 overflow-hidden outline-none">
          <div className="relative p-8 pt-10">
            <DialogHeader className="space-y-4">
              <div className="h-16 w-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center transition-transform hover:rotate-6 duration-300">
                <FiActivity className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-bold tracking-tight text-zinc-900">Add WhatsApp</DialogTitle>
                <DialogDescription className="text-sm font-medium text-zinc-500">
                  Setup a new account connection to start messaging.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="mt-8 space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="sessionName" className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">
                  Account Name
                </Label>
                <Input
                  id="sessionName"
                  placeholder="e.g. Support Team or Work Phone"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  className="h-14 rounded-2xl bg-zinc-50 border-zinc-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all text-zinc-900 placeholder:text-zinc-400 px-5 shadow-sm"
                />
                <p className="text-[11px] text-zinc-400 font-medium px-1 italic">
                  Give this account a recognizable name.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <Button 
                onClick={handleCreateSession} 
                disabled={creating || !newSessionName}
                className="w-full h-14 bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-zinc-200 active:scale-[0.98] disabled:opacity-50"
              >
                {creating ? (
                  <div className="flex items-center gap-2">
                    <FiRefreshCw className="h-4 w-4 animate-spin" />
                    Connecting...
                  </div>
                ) : "Add Account"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setModalOpen(false)}
                className="w-full h-12 rounded-2xl font-bold text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
