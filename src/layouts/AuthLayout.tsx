import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/utils/constants";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout() {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-1 items-center justify-center bg-background selection:bg-primary selection:text-primary-foreground">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center items-center">
          <Link to="/" className="flex flex-col items-center gap-2">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
               <ShieldCheck className="h-6 w-6 shrink-0" />
             </div>
             <h1 className="text-2xl font-semibold tracking-tight text-foreground">Advocate.App</h1>
          </Link>
          <p className="text-sm text-muted-foreground pt-1">
            Access your secure legal workspace.
          </p>
        </div>

        <div className="p-1">
           <Outlet />
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link
            to="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
