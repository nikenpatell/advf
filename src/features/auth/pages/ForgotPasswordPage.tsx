import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";
import toast from "react-hot-toast";

import { forgotPasswordSchema } from "@/utils/validation";
import { ROUTES } from "@/utils/constants";
import { handleError } from "@/utils/errorHandler";
import { forgotPassword } from "../services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ForgotPasswordPayload } from "@/types/auth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const initialEmail = location.state?.email || "";
  const role = location.state?.role || null;

  const formik = useFormik<ForgotPasswordPayload>({
    initialValues: { email: initialEmail, role: role },
    enableReinitialize: true,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await forgotPassword(values);
        toast.success(res.message);
        setSuccess(true);
        // Delay to show success state before OTP
        setTimeout(() => {
           navigate(ROUTES.VERIFY_RESET_OTP, { state: { email: values.email, role: values.role } });
        }, 1500);
      } catch (err: unknown) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
  });

  if (success) {
     return (
        <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
           <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
              <MailCheck className="h-10 w-10 text-primary" />
           </div>
           <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
           <p className="text-sm text-muted-foreground text-center max-w-[280px]">
              We've sent a secure recovery link for your <b>{role?.replace('_', ' ')}</b> account to <b>{formik.values.email}</b>.
           </p>
           <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mt-4" />
        </div>
     );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center items-center">
         <h1 className="text-2xl font-bold tracking-tight">Recover Securely</h1>
         <p className="text-[11px] text-muted-foreground max-w-[280px]">
            {role 
               ? `Resetting credentials for your ${role.replace('_', ' ')} workspace context.` 
               : "Enter your email to receive recovery instructions."}
         </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-bold text-[11px] uppercase tracking-wider text-muted-foreground">Verification Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              type="email"
              autoComplete="email"
              disabled={loading}
              className="h-11 rounded-full px-4"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-[11px] font-medium text-destructive">{formik.errors.email}</p>
            )}
          </div>
          <Button disabled={loading || !formik.values.email} className="w-full h-11 rounded-full bg-primary hover:bg-primary/90 font-bold mt-2 transition-all">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Secure Recovery"
            )}
          </Button>
        </div>
      </form>
      <div className="text-center text-sm">
        <Link to={ROUTES.LOGIN} className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-1 transition-transform" />
          Return to login
        </Link>
      </div>
    </div>
  );
}
