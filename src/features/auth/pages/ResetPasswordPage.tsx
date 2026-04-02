import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

import { resetPasswordSchema } from "@/utils/validation";
import { ROUTES } from "@/utils/constants";
import { handleError } from "@/utils/errorHandler";
import { resetPassword } from "../services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ResetPasswordPayload } from "@/types/auth";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || "";

  type ResetForm = ResetPasswordPayload & { confirmPassword?: string };

  const formik = useFormik<ResetForm>({
    initialValues: { token, password: "", confirmPassword: "" },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (!values.token) {
          toast.error("Invalid session. Please start over.");
          return navigate(ROUTES.FORGOT_PASSWORD);
        }
        const { confirmPassword, ...payload } = values;
        const res = await resetPassword(payload);
        toast.success(res.message);
        navigate(ROUTES.LOGIN, { replace: true });
      } catch (err: unknown) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
  });

  if (!token) {
    return (
      <div className="grid gap-6 text-center">
        <div className="flex flex-col space-y-2">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold tracking-tight">Invalid Session</h1>
          <p className="text-sm text-zinc-500">
            The password reset token is missing or expired.
          </p>
        </div>
        <Button onClick={() => navigate(ROUTES.LOGIN)}>
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col space-y-2 text-center items-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">New Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              disabled={loading}
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-[11px] font-medium text-destructive">{formik.errors.password}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              disabled={loading}
              {...formik.getFieldProps("confirmPassword")}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-[11px] font-medium text-destructive">{formik.errors.confirmPassword}</p>
            )}
          </div>
          <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90 font-bold h-10 mt-2">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
