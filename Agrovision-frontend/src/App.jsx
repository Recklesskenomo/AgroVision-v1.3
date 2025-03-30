// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard';
import AnimalsPage from './pages/AnimalsPage';
import UserManagement from './pages/UserManagement';
import ManagerOperations from './pages/ManagerOperations';
import FieldWorkerTasks from './pages/FieldWorkerTasks';
import DataAnalytics from './pages/DataAnalytics';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Admin Route component (accessible only by admins)
const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (!isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Manager Route component (accessible only by managers)
const ManagerRoute = ({ children }) => {
    const { user, loading, hasRole, ROLES } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (!hasRole(ROLES.MANAGER)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Field Worker Route component
const FieldWorkerRoute = ({ children }) => {
    const { user, loading, hasRole, ROLES } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (!hasRole(ROLES.FIELD_WORKER)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Data Analyst Route component
const DataAnalystRoute = ({ children }) => {
    const { user, loading, hasRole, ROLES } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (!hasRole(ROLES.DATA_ANALYST)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Public Route component (accessible only when not logged in)
const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route 
                            path="/login" 
                            element={
                                <PublicOnlyRoute>
                                    <Login />
                                </PublicOnlyRoute>
                            } 
                        />
                        <Route 
                            path="/register" 
                            element={
                                <PublicOnlyRoute>
                                    <Register />
                                </PublicOnlyRoute>
                            } 
                        />
                        <Route 
                            path="/contact" 
                            element={
                                <Contact />
                            } 
                        />
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/dashboard/animals" 
                            element={
                                <ProtectedRoute>
                                    <AnimalsPage />
                                </ProtectedRoute>
                            } 
                        />
                        {/* Admin routes */}
                        <Route 
                            path="/admin/users" 
                            element={
                                <AdminRoute>
                                    <UserManagement />
                                </AdminRoute>
                            } 
                        />
                        {/* Manager routes */}
                        <Route 
                            path="/manager/operations" 
                            element={
                                <ManagerRoute>
                                    <ManagerOperations />
                                </ManagerRoute>
                            } 
                        />
                        {/* Field Worker routes */}
                        <Route 
                            path="/field-worker/tasks" 
                            element={
                                <FieldWorkerRoute>
                                    <FieldWorkerTasks />
                                </FieldWorkerRoute>
                            } 
                        />
                        {/* Data Analyst routes */}
                        <Route 
                            path="/data-analyst/analytics" 
                            element={
                                <DataAnalystRoute>
                                    <DataAnalytics />
                                </DataAnalystRoute>
                            } 
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}

export default App;