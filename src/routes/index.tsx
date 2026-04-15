import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Loader } from "@/components/ui/loader";
import { ROUTES } from "@/utils/constants";

// Layouts & Routing Rules
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const VerifyOtpPage = lazy(() => import("@/features/auth/pages/VerifyOtpPage"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
const VerifyResetOtpPage = lazy(() => import("@/features/auth/pages/VerifyResetOtpPage"));
const ResetPasswordPage = lazy(() => import("@/features/auth/pages/ResetPasswordPage"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const SelectOrg = lazy(() => import("@/pages/SelectOrg"));
const Clients = lazy(() => import("@/pages/Clients"));
const ManageClient = lazy(() => import("@/pages/ManageClient"));
const ViewClient = lazy(() => import("@/pages/ViewClient"));
const MyTeam = lazy(() => import("@/pages/MyTeam"));
const ManageTeamMember = lazy(() => import("@/pages/ManageTeamMember"));
const ViewTeamMember = lazy(() => import("@/pages/ViewTeamMember"));
const TypeManagement = lazy(() => import("@/pages/TypeManagement"));
const ManageType = lazy(() => import("@/pages/ManageType"));
const Tasks = lazy(() => import("@/pages/Tasks"));
const ManageTask = lazy(() => import("@/pages/ManageTask"));
const ViewTaskDetail = lazy(() => import("@/pages/ViewTaskDetail"));

const Cases = lazy(() => import("@/pages/Cases"));
const ManageCase = lazy(() => import("@/pages/ManageCase"));
const ViewCase = lazy(() => import("@/pages/ViewCase"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const ManageRoles = lazy(() => import("@/pages/ManageRoles"));
const AddEditRole = lazy(() => import("@/pages/AddEditRole"));

const ComingSoon = lazy(() => import("@/pages/ComingSoon"));
const WhatsAppHub = lazy(() => import("@/pages/WhatsAppHub"));

// Generic fallback loader for suspensions
const PageLoader = () => <Loader fullPage size="lg" />;

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* High-Fidelity Gateway */}
            <Route path="/" element={<LandingPage />} />

            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ROUTES.VERIFY_RESET_OTP} element={<VerifyResetOtpPage />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/select-org" element={<SelectOrg />} />
              <Route element={<DashboardLayout />}>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                
                {/* Client Registry Workstation */}
                <Route path={ROUTES.CLIENTS} element={<Clients />} />
                <Route path="/clients/create" element={<ManageClient />} />
                <Route path="/clients/edit/:id" element={<ManageClient />} />
                <Route path="/clients/view/:id" element={<ViewClient />} />

                {/* Team Personnel Workstation */}
                <Route path={ROUTES.MY_TEAM} element={<MyTeam />} />
                <Route path="/my-team/create" element={<ManageTeamMember />} />
                <Route path="/my-team/edit/:id" element={<ManageTeamMember />} />
                <Route path="/my-team/view/:id" element={<ViewTeamMember />} />

                <Route path={ROUTES.TYPE_MANAGEMENT} element={<TypeManagement />} />
                <Route path="/type-management/create" element={<ManageType />} />
                <Route path="/type-management/edit/:id" element={<ManageType />} />

                {/* All remaining routes for multi-role support */}
                <Route path={ROUTES.ORGANIZATIONS} element={<ComingSoon />} />
                <Route path={ROUTES.SYSTEM_USERS} element={<ComingSoon />} />
                
                {/* Litigation Portfolio Workstation */}
                <Route path={ROUTES.CASES} element={<Cases />} />
                <Route path="/cases/create" element={<ManageCase />} />
                <Route path="/cases/edit/:id" element={<ManageCase />} />
                <Route path="/cases/view/:id" element={<ViewCase />} />

                <Route path={ROUTES.CALENDAR} element={<Calendar />} />
                
                <Route path="/roles" element={<ManageRoles />} />
                <Route path="/roles/create" element={<AddEditRole />} />
                <Route path="/roles/edit/:id" element={<AddEditRole />} />
                {/* Tasks & Initiatives Workstation */}
                <Route path={ROUTES.TASKS} element={<Tasks />} />
                <Route path="/tasks/create" element={<ManageTask />} />
                <Route path="/tasks/edit/:id" element={<ManageTask />} />
                <Route path="/tasks/view/:id" element={<ViewTaskDetail />} />
                <Route path={ROUTES.FINANCE} element={<ComingSoon />} />
                <Route path={ROUTES.INVOICES} element={<ComingSoon />} />
                <Route path={ROUTES.REPORTS} element={<ComingSoon />} />
                <Route path={ROUTES.MY_CASES} element={<ComingSoon />} />
                <Route path={ROUTES.DOCUMENTS} element={<ComingSoon />} />
                <Route path={ROUTES.BILLING} element={<ComingSoon />} />
                <Route path={ROUTES.MESSAGES} element={<ComingSoon />} />
                <Route path={ROUTES.SETTINGS} element={<ComingSoon />} />
                <Route path="/whatsapp-hub" element={<WhatsAppHub />} />

                {/* Catch-all Auth Routes inside app -> Redirect Home */}
                <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              </Route>
            </Route>
            
            {/* Final Catch-all for landing or unregistered routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
