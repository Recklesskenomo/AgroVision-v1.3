import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

// Define roles that match backend roles
export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    FIELD_WORKER: 'field_worker',
    DATA_ANALYST: 'data_analyst',
    USER: 'user',
    CONSULTANT: 'consultant', // External consultant (vets/agronomists)
    DEPARTMENT_MANAGER: 'department_manager' // Department manager
};

// Define user types
export const USER_TYPES = {
    INTERNAL: 'internal', // Regular employee
    EXTERNAL: 'external', // External consultant
    ADMIN: 'admin' // Administrator
};

// Define departments
export const DEPARTMENTS = {
    // Administration
    ADMINISTRATION: 'administration',
    LOGISTICS: 'logistics',
    SALES: 'sales',
    MAINTENANCE: 'maintenance',
    HR: 'hr',
    
    // Animals
    ANIMALS: 'animals',
    
    // Feed
    FEED: 'feed'
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await authService.register(username, email, password);
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Check if user has a specific role
    const hasRole = (role) => {
        if (!user) return false;
        return user.role === role;
    };
    
    // Check if user has any of the specified roles
    const hasAnyRole = (roles) => {
        if (!user) return false;
        return roles.includes(user.role);
    };
    
    // Check if user belongs to a specific department
    const inDepartment = (departmentId) => {
        if (!user) return false;
        return user.department_id === departmentId;
    };
    
    // Check if user belongs to any of the specified departments
    const inAnyDepartment = (departmentIds) => {
        if (!user || !user.department_id) return false;
        return departmentIds.includes(user.department_id);
    };
    
    // Check if user is an admin
    const isAdmin = () => {
        return hasRole(ROLES.ADMIN);
    };
    
    // Check if user is a manager
    const isManager = () => {
        return hasRole(ROLES.MANAGER) || hasRole(ROLES.DEPARTMENT_MANAGER);
    };
    
    // Check if user is a consultant
    const isConsultant = () => {
        return hasRole(ROLES.CONSULTANT);
    };
    
    // Check if user is an external user
    const isExternal = () => {
        if (!user) return false;
        return user.user_type === USER_TYPES.EXTERNAL;
    };

    // Don't render children until authentication is initialized
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            logout, 
            loading,
            hasRole,
            hasAnyRole,
            inDepartment,
            inAnyDepartment,
            isAdmin,
            isManager,
            isConsultant,
            isExternal,
            ROLES,
            USER_TYPES,
            DEPARTMENTS
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 