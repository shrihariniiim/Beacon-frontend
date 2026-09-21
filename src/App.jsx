import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public & Discovery Pages
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ResourceDiscovery } from './pages/discovery/ResourceDiscovery';
import { ResourceDetail } from './pages/discovery/ResourceDetail';
import { EventDiscovery } from './pages/discovery/EventDiscovery';
import { EventDetail } from './pages/discovery/EventDetail';
import { FinancialAidDiscovery } from './pages/discovery/FinancialAidDiscovery';
import { FinancialAidDetail } from './pages/discovery/FinancialAidDetail';
import { AccessibilityStatement } from './pages/AccessibilityStatement';
import { SuccessStoriesPage } from './pages/successStories/SuccessStoriesPage';
import { SuccessStoryDetail } from './pages/successStories/SuccessStoryDetail';
import { NotFound } from './pages/NotFound';

// Parent Experience Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ChildProfilesPage } from './pages/parent/ChildProfilesPage';
import { BookmarksPage } from './pages/parent/BookmarksPage';

// Organization Experience Pages
import { OrgDashboard } from './pages/organization/OrgDashboard';
import { OrgVerification } from './pages/organization/OrgVerification';
import { OrgResources } from './pages/organization/OrgResources';
import { OrgEvents } from './pages/organization/OrgEvents';
import { OrgFinancialAid } from './pages/organization/OrgFinancialAid';

// Admin Console Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminVerifications } from './pages/admin/AdminVerifications';
import { AdminModeration } from './pages/admin/AdminModeration';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminUsers } from './pages/admin/AdminUsers';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="resources" element={<ResourceDiscovery />} />
              <Route path="resources/:id" element={<ResourceDetail />} />
              <Route path="events" element={<EventDiscovery />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="financial-aid" element={<FinancialAidDiscovery />} />
              <Route path="financial-aid/:id" element={<FinancialAidDetail />} />
              <Route path="success-stories" element={<SuccessStoriesPage />} />
              <Route path="success-stories/:id" element={<SuccessStoryDetail />} />
              <Route path="accessibility" element={<AccessibilityStatement />} />

              {/* Parent Routes */}
              <Route
                path="parent/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['PARENT', 'ADMIN']}>
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="parent/children"
                element={
                  <ProtectedRoute allowedRoles={['PARENT', 'ADMIN']}>
                    <ChildProfilesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="parent/bookmarks"
                element={
                  <ProtectedRoute allowedRoles={['PARENT', 'ADMIN']}>
                    <BookmarksPage />
                  </ProtectedRoute>
                }
              />

              {/* Organization Routes (NGO & Government) */}
              <Route
                path="organization/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'GOVERNMENT', 'ADMIN']}>
                    <OrgDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="organization/verification"
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'GOVERNMENT', 'ADMIN']}>
                    <OrgVerification />
                  </ProtectedRoute>
                }
              />
              <Route
                path="organization/resources"
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'GOVERNMENT', 'ADMIN']}>
                    <OrgResources />
                  </ProtectedRoute>
                }
              />
              <Route
                path="organization/events"
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'GOVERNMENT', 'ADMIN']}>
                    <OrgEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="organization/financial-aid"
                element={
                  <ProtectedRoute allowedRoles={['NGO', 'GOVERNMENT', 'ADMIN']}>
                    <OrgFinancialAid />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/verifications"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminVerifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/moderation"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminModeration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/audit-logs"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminAuditLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* 404 Catch All */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
