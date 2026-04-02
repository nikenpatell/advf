import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrgStore } from "@/store/useOrgStore";
import { ROUTES } from "@/utils/constants";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthStore();
  const { currentOrg } = useOrgStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login, keeping the intended path in state
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const { user } = useAuthStore.getState();
  if (user && !user.isVerified && location.pathname !== ROUTES.VERIFY_OTP) {
    return <Navigate to={ROUTES.VERIFY_OTP} state={{ email: user.email }} replace />;
  }

  // Prevent users from accessing the app without selecting an organization (Exclude the selection page itself!)
  if (!currentOrg && location.pathname !== "/select-org") {
    return <Navigate to="/select-org" replace />;
  }

  return <Outlet />;
}
