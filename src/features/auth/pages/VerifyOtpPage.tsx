import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

import { verifyOtpSchema } from "@/utils/validation";
import { ROUTES } from "@/utils/constants";
import { handleError } from "@/utils/errorHandler";
import { verifyOtp } from "../services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/types/auth";

interface VerifyOtpPayload {
  email: string;
  otp: string;
  role?: UserRole;
}

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthStore();

  const passedEmail = location.state?.email || "";
  const passedRole = (location.state?.role as UserRole) || undefined;

  const formik = useFormik<VerifyOtpPayload>({
    initialValues: { email: passedEmail, otp: "", role: passedRole },
    validationSchema: verifyOtpSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await verifyOtp(values);
        toast.success(res.message);
        
        if (user && user.email === values.email) {
          setUser({ ...user, isVerified: true });
          navigate(ROUTES.DASHBOARD, { replace: true });
        } else {
          toast.success("Identity verified! Please sign in.");
          navigate(ROUTES.LOGIN, { replace: true });
        }
      } catch (err: unknown) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    formik.setFieldValue("otp", val, true);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Verify OTP</h1>
        <p className="text-sm text-muted-foreground">
          Enter the code sent to {passedEmail || "your email"}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled={true}
              {...formik.getFieldProps("email")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="otp">6-Digit Code</Label>
            <Input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="000000"
              className="text-center font-mono tracking-widest text-lg h-12"
              {...formik.getFieldProps("otp")}
              onChange={handleOtpChange}
            />
            {formik.touched.otp && formik.errors.otp && (
              <p className="text-[11px] font-medium text-destructive">{formik.errors.otp}</p>
            )}
          </div>
          <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90 font-bold h-10 mt-2">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Verify Code"
            )}
          </Button>
        </div>
      </form>
      <div className="text-center">
        <button 
          type="button" 
          onClick={() => { toast.success("Code resent!"); }}
          className="text-xs font-bold uppercase tracking-widest hover:text-primary text-muted-foreground transition-colors"
        >
          Resend Code
        </button>
      </div>
    </div>
  );
}
