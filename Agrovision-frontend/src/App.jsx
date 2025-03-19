// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';
import Dashboard from './components/Dashboard'; // We'll create this
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
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}

export default App;