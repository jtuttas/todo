import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import TeamTasksPage from './pages/TeamTasksPage';
import NewTaskPage from './pages/NewTaskPage';
import ProjectsPage from './pages/ProjectsPage';
import PrioritiesPage from './pages/PrioritiesPage';
import UsersPage from './pages/admin/UsersPage';
import NewUserPage from './pages/admin/NewUserPage';
import EditUserPage from './pages/admin/EditUserPage';

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/todo">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="tasks/:id" element={<TaskDetailPage />} />
            <Route path="tasks/new" element={<ProtectedRoute roles={['Abteilungsleiter','Administrator']}><NewTaskPage /></ProtectedRoute>} />
            <Route path="team/tasks" element={<ProtectedRoute roles={['Abteilungsleiter','Administrator']}><TeamTasksPage /></ProtectedRoute>} />
            <Route path="projects" element={<ProtectedRoute roles={['Abteilungsleiter','Administrator']}><ProjectsPage /></ProtectedRoute>} />
            <Route path="priorities" element={<ProtectedRoute roles={['Abteilungsleiter','Administrator']}><PrioritiesPage /></ProtectedRoute>} />
            <Route path="admin/users" element={<ProtectedRoute roles={['Administrator']}><UsersPage /></ProtectedRoute>} />
            <Route path="admin/users/new" element={<ProtectedRoute roles={['Administrator']}><NewUserPage /></ProtectedRoute>} />
            <Route path="admin/users/:id/edit" element={<ProtectedRoute roles={['Administrator']}><EditUserPage /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
