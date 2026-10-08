import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/components/app-provider";
import { Toaster } from "@/components/ui/sonner";

import { Landing } from "@/pages/Landing";
import { ResetPassword } from "@/pages/ResetPassword";
import { NotFound } from "@/pages/NotFound";
import { LoginPage } from "@/components/login-page";
import { OverviewPage } from "@/components/overview-page";
import { ManagementPage } from "@/components/management-page";
import { InvoicesPage } from "@/components/invoices-page";
import { SitesView, AssignSites, ProfilePage } from "@/components/simple-page";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Login routes */}
            <Route path="/login/super-admin" element={<LoginPage role="super_admin" />} />
            <Route path="/login/site-admin" element={<LoginPage role="site_admin" />} />
            <Route path="/login/site-user" element={<LoginPage role="site_user" />} />

            {/* Super Admin workspace */}
            <Route path="/super-admin" element={<OverviewPage role="super_admin" />} />
            <Route path="/super-admin/admins" element={<ManagementPage role="super_admin" collection="admins" />} />
            <Route path="/super-admin/states" element={<ManagementPage role="super_admin" collection="states" />} />
            <Route path="/super-admin/locations" element={<ManagementPage role="super_admin" collection="locations" />} />
            <Route path="/super-admin/sites" element={<ManagementPage role="super_admin" collection="sites" />} />
            <Route path="/super-admin/users" element={<ManagementPage role="super_admin" collection="users" />} />
            <Route path="/super-admin/assign-sites" element={<AssignSites />} />
            <Route path="/super-admin/invoices" element={<InvoicesPage role="super_admin" />} />

            {/* Site Admin workspace */}
            <Route path="/site-admin" element={<OverviewPage role="site_admin" />} />
            <Route path="/site-admin/sites" element={<SitesView role="site_admin" />} />
            <Route path="/site-admin/users" element={<ManagementPage role="site_admin" collection="users" />} />
            <Route path="/site-admin/invoices" element={<InvoicesPage role="site_admin" />} />

            {/* Site User workspace */}
            <Route path="/site-user" element={<OverviewPage role="site_user" />} />
            <Route path="/site-user/sites" element={<SitesView role="site_user" />} />
            <Route path="/site-user/invoices" element={<InvoicesPage role="site_user" />} />
            <Route path="/site-user/profile" element={<ProfilePage />} />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster richColors />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
