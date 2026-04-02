import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Loader2, ArrowRight, UserCircle2, Briefcase, ShieldCheck, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/utils/constants";
import { handleError } from "@/utils/errorHandler";
import { useOrgStore } from "@/store/useOrgStore";
import { login, getRolesByEmail } from "../services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { LoginPayload, UserRole } from "@/types/auth";

type Step = "EMAIL" | "ROLE" | "PASSWORD";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  
  const [step, setStep] = useState<Step>("EMAIL");
  const [loading, setLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const formik = useFormik<LoginPayload>({
    initialValues: { email: "", password: "", role: undefined },
    onSubmit: async (values) => {
      if (step === "EMAIL") {
        try {
          if (!values.email) return toast.error("Email is required");
          setLoading(true);
          const res = await getRolesByEmail({ email: values.email });
          setAvailableRoles(res.data.roles);
          
          if (res.data.roles.length > 1) {
            setStep("ROLE");
          } else {
            const role = res.data.roles[0];
            setSelectedRole(role);
            formik.setFieldValue("role", role);
            setStep("PASSWORD");
          }
        } catch (err) {
          handleError(err);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (step === "PASSWORD") {
        try {
          setLoading(true);
          // Explicitly pass role to ensure it's in the final payload
          const res = await login({ 
            email: values.email, 
            password: values.password, 
            role: selectedRole as UserRole 
          });
          toast.success(res.message);
          setAuth(res.data.user, res.data.token, res.data.refreshToken || "");
          
          useOrgStore.getState().clearOrgs();
          if (res.data.organizations) {
            useOrgStore.getState().setOrganizations(res.data.organizations);
          }

          if (!res.data.user.isVerified) {
            navigate(ROUTES.VERIFY_OTP, { state: { email: res.data.user.email }, replace: true });
          } else {
            navigate(from, { replace: true });
          }
        } catch (err) {
          handleError(err);
        } finally {
          setLoading(false);
        }
      }
    },
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    formik.setFieldValue("role", role);
    setStep("PASSWORD");
  };

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case "ORG_ADMIN": return { label: "Organization Admin", icon: ShieldCheck, desc: "Full control over firm settings and personnel." };
      case "TEAM_MEMBER": return { label: "Team Member", icon: Briefcase, desc: "Access assigned cases and workspace tasks." };
      case "CLIENT": return { label: "Client", icon: UserCircle2, desc: "Monitor your cases and communicate with your team." };
      default: return { label: role, icon: UserCircle2, desc: "Standard user access." };
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center mb-2">
         {step === "EMAIL" && <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>}
         {step === "ROLE" && <h1 className="text-2xl font-bold tracking-tight">Select your context</h1>}
         {step === "PASSWORD" && <h1 className="text-2xl font-bold tracking-tight">Finish secure login</h1>}
         <p className="text-xs text-muted-foreground">
            {step === "EMAIL" && "Sign in to access your dashboard"}
            {step === "ROLE" && "You have multiple identities with this email"}
            {step === "PASSWORD" && `Enter your password to access as ${selectedRole?.replace('_', ' ')}`}
         </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-4">
          
          {step === "EMAIL" && (
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Work Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={loading}
                className="h-11 rounded-full px-4"
                {...formik.getFieldProps("email")}
              />
              <Button disabled={loading || !formik.values.email} className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 font-bold mt-2 transition-all">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span className="mr-2">Continue</span> <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </div>
          )}

          {step === "ROLE" && (
            <div className="grid gap-3">
               {availableRoles.map((role) => {
                 const info = getRoleInfo(role);
                 return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      className="group flex items-start gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all text-left"
                    >
                      <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                         <info.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground">{info.label}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                         </div>
                         <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{info.desc}</p>
                      </div>
                    </button>
                 );
               })}
               <Button 
                 variant="ghost" 
                 type="button" 
                 className="mt-2 text-xs font-bold text-muted-foreground hover:text-foreground rounded-full"
                 onClick={() => setStep("EMAIL")}
               >
                 Use different email
               </Button>
            </div>
          )}

          {step === "PASSWORD" && (
            <div className="grid gap-4">
               <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="h-8 w-8 bg-background border border-border rounded-full flex items-center justify-center font-bold text-[10px]">
                     {selectedRole?.charAt(0)}
                  </div>
                  <div className="flex flex-col truncate">
                     <span className="text-[11px] font-bold text-foreground truncate">{formik.values.email}</span>
                     <span className="text-[9px] uppercase tracking-tighter text-muted-foreground font-bold">{selectedRole?.replace('_', ' ')}</span>
                  </div>
                  <button 
                    type="button" 
                    className="ml-auto text-[10px] font-bold text-primary hover:underline px-2"
                    onClick={() => setStep(availableRoles.length > 1 ? "ROLE" : "EMAIL")}
                  >
                    Change
                  </button>
               </div>

              <div className="grid gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    state={{ role: selectedRole, email: formik.values.email }}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  autoFocus
                  disabled={loading}
                  className="h-11 rounded-full px-4"
                  {...formik.getFieldProps("password")}
                />
              </div>
              <Button disabled={loading || !formik.values.password} className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 font-bold mt-2 transition-all">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In to Dashboard"}
              </Button>
            </div>
          )}

        </div>
      </form>

      {step === "EMAIL" && (
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.REGISTER} className="underline underline-offset-4 hover:text-primary font-bold">
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
