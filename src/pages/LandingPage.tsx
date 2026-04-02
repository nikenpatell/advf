import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Gavel, 
  Users2, 
  Briefcase, 
  CheckSquare, 
  Layers,
  Search,
  ArrowRight,
  Monitor,
  Database,
  Lock,
  Globe
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const MODULES = [
    { 
      title: "Litigation Portfolio", 
      desc: "Manage high-stakes cases with our industrial-grade registry. Tracks hearings, history, and assignments.",
      icon: Gavel,
      badge: "Industrial"
    },
    { 
      title: "Tactical Initiatives", 
      desc: "Orchestrate workspace tasks with precision. Priority weightings, real-time status, and personnel mapping.",
      icon: CheckSquare,
      badge: "Strategic"
    },
    { 
      title: "Stakeholder Registry", 
      desc: "Comprehensive entity portfolio for clients. Communication logs, engagement history, and profile health.",
      icon: Briefcase,
      badge: "Entity"
    },
    { 
      title: "Personnel Manifest", 
      desc: "Centralized team management. Control onboarding, verification states, and multi-tenant assignments.",
      icon: Users2,
      badge: "Resource"
    },
    { 
      title: "Access Manifest", 
      desc: "Granular Role-Based Access Control (RBAC). Configure workstation privileges and delegatory manifests.",
      icon: ShieldCheck,
      badge: "Secure"
    },
    { 
      title: "Registry Hierarchy", 
      desc: "Define custom case types, stages, and document assets. Tune the industrial cloud to your firm's DNA.",
      icon: Layers,
      badge: "Base"
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground bg-white">
      {/* Navbar Overlay */}
      <header className="fixed top-0 w-full z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-black flex items-center justify-center rounded-xl shadow-2xl">
               <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Advocate<span className="text-muted-foreground/30 ml-1">SaaS</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")} className="font-black text-[10px] uppercase tracking-widest hover:bg-black/5 rounded-full px-6 transition-all">Sign In</Button>
            <Button onClick={() => navigate("/register")} className="bg-black text-white hover:bg-black/90 font-black text-[10px] uppercase tracking-widest rounded-full px-8 shadow-2xl shadow-black/20 hover:scale-105 transition-all">Get Access</Button>
          </div>
        </div>
      </header>

      <main>
        {/* Typographic Hero Section */}
        <section className="pt-48 pb-32 px-6 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="space-y-6">
               <Badge variant="outline" className="text-[10px] h-7 px-4 rounded-full border-black/10 font-black uppercase tracking-[0.2em] bg-black/5 shadow-inner">Multi-Tenant Workstation v2.0</Badge>
               <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] text-black">
                 The Industrial<br />
                 <span className="text-black/20">Legal Core.</span>
               </h1>
               <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-black/60 leading-relaxed italic">
                 An industrial-grade SaaS architecture for elite legal firms. Orchestrate litigation portfolio, personnel manifest, and granular access manifested in a single unified workstation.
               </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
               <Button size="lg" onClick={() => navigate("/login")} className="h-14 px-10 bg-black text-white hover:bg-black/90 font-black text-xs uppercase tracking-widest rounded-full shadow-2xl shadow-black/20 group">
                 Initialize Free Trial 
                 <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
               </Button>
               <Button size="lg" variant="outline" className="h-14 px-10 border-black/10 hover:bg-black/5 font-black text-xs uppercase tracking-widest rounded-full transition-all">
                 System Overview
               </Button>
            </div>
            
            {/* Visual Hierarchy Placeholder */}
            <div className="mt-24 relative p-4 rounded-[40px] bg-black/5 border border-black/5 shadow-2xl animate-in zoom-in-95 duration-700">
               <div className="rounded-[32px] overflow-hidden bg-white border border-black/10 shadow-inner h-[400px] flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-8 p-12 opacity-10 blur-sm">
                     {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-40 w-64 bg-black rounded-3xl" />
                     ))}
                  </div>
                  <div className="absolute flex flex-col items-center gap-4 scale-125">
                     <Monitor className="h-16 w-16 text-black opacity-20" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Workspace Preview Mockup</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Strategy Section */}
        <section className="py-24 bg-black text-white">
           <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div className="space-y-8">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none italic uppercase">
                       Granular Authority<br />
                       <span className="text-white/30">Total Oversight.</span>
                    </h2>
                    <p className="text-lg text-white/60 leading-relaxed font-black uppercase tracking-tight opacity-80">
                       Our permission engine is built on elite RBAC protocols, ensuring personnel identity is verified and workstation access is strictly manifested.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                       {[
                         { icon: Globe, label: "Multi-Tenant" },
                         { icon: Lock, label: "RBAC Guarded" },
                         { icon: Database, label: "Cloud Sync" },
                         { icon: Search, label: "Audit Logged" }
                       ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                             <item.icon className="h-5 w-5 text-white/40" />
                             <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                          </div>
                       ))}
                    </div>
                 </div>
                 <div className="flex justify-center">
                    <div className="h-80 w-80 rounded-full border border-white/10 flex items-center justify-center relative scale-125 md:scale-150">
                       <div className="absolute inset-0 border border-white/5 rounded-full animate-ping opacity-20" />
                       <ShieldCheck className="h-32 w-32 text-white/10" />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Modules Grid */}
        <section className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">Unified Components</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black">Industrial Module Registry.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MODULES.map((module, i) => (
                <Card key={i} className="group border-none shadow-none hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 rounded-[32px] overflow-hidden border border-black/5 bg-neutral-50 px-8 py-10 flex flex-col justify-between">
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                       <div className="h-16 w-16 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl transition-all group-hover:scale-110 group-hover:rotate-3">
                        <module.icon className="h-8 w-8" />
                       </div>
                       <Badge variant="outline" className="text-[9px] h-6 px-3 rounded-full border-black/10 font-bold uppercase">{module.badge}</Badge>
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-xl font-black tracking-tight text-black uppercase italic">{module.title}</h3>
                       <p className="text-sm font-medium text-black/50 leading-relaxed">
                        {module.desc}
                       </p>
                    </div>
                  </div>
                  <div className="mt-10 pt-6 border-t border-black/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[10px] font-black uppercase tracking-widest">Explore Operations</span>
                     <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-32 bg-neutral-50 border-y border-black/5">
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-4 text-center md:text-left">
                 <h3 className="text-3xl font-black text-black">Industrial Performance.</h3>
                 <p className="text-black/40 font-bold uppercase text-[11px] tracking-widest">Trusted by elite firms globally.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-20 grayscale">
                 {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <ShieldCheck className="h-6 w-6" />
                       <span className="text-sm font-black uppercase">PARTNER_{i+1}</span>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-black/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
             <div className="flex items-center gap-2">
               <div className="h-8 w-8 bg-black flex items-center justify-center rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-white" />
               </div>
               <span className="text-lg font-black tracking-tighter uppercase">Advocate<span className="text-muted-foreground/30 ml-1">SaaS</span></span>
             </div>
             <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em]">All Rights Reserved · © 2026</p>
          </div>
          
          <div className="flex gap-12">
            {[
              { label: "Product", links: ["Features", "Security", "Industrial Cloud"] },
              { label: "Company", links: ["About", "Authority", "Contact"] },
              { label: "Legal", links: ["Manifest", "Privacy", "Terms"] }
            ].map((col, i) => (
              <div key={i} className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-black">{col.label}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j} className="text-[11px] font-bold text-black/40 hover:text-black transition-colors uppercase cursor-pointer">{link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div>
             <Button onClick={() => navigate("/login")} className="bg-black text-white rounded-full h-12 px-8 text-[10px] uppercase font-black tracking-widest">Initialize Trial</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
