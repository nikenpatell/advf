import { useState } from "react";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { registerSchema } from "@/utils/validation";
import { ROUTES } from "@/utils/constants";
import { handleError } from "@/utils/errorHandler";
import { register } from "../services/auth.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { RegisterPayload } from "@/types/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  type RegisterForm = RegisterPayload & { confirmPassword?: string };

  const formik = useFormik<RegisterForm>({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const { confirmPassword, ...payload } = values;
        const res = await register(payload);
        toast.success(res.message);
        navigate(ROUTES.VERIFY_OTP, { state: { email: values.email, role: "ORG_ADMIN" } });
      } catch (err: unknown) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="grid gap-6">
      <form onSubmit={formik.handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              type="text"
              autoComplete="name"
              disabled={loading}
              {...formik.getFieldProps("name")}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-[11px] font-medium text-destructive">{formik.errors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              type="email"
              autoComplete="email"
              disabled={loading}
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-[11px] font-medium text-destructive">{formik.errors.email}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <Label htmlFor="confirmPassword">Confirm</Label>
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
          </div>
          <Button disabled={loading} className="w-full bg-primary hover:bg-primary/90 font-bold h-10 mt-2">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="underline underline-offset-4 hover:text-primary font-bold">
          Log in
        </Link>
      </div>
    </div>
  );
}
