import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Component for conditional rendering based on user roles
 * 
 * @param {Object} props - Component props
 * @param {string|string[]} props.allowedRoles - Role(s) that can access this component
 * @param {boolean} props.inverted - If true, component will render when user does NOT have the role
 * @param {React.ReactNode} props.children - Child components to render
 * @param {React.ReactNode} props.fallback - Optional fallback component to render when access is denied
 * @returns {React.ReactNode}
 */
export const RoleBasedAccess = ({ 
    allowedRoles, 
    inverted = false, 
    children, 
    fallback = null 
}) => {
    const { user, hasAnyRole } = useAuth();

    // If no user is authenticated, don't render anything
    if (!user) return fallback;

    // Convert single role to array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Check if user has any of the allowed roles
    const hasAccess = hasAnyRole(roles);
    
    // Render based on access and inverted flag
    const shouldRender = inverted ? !hasAccess : hasAccess;
    
    return shouldRender ? children : fallback;
};

/**
 * Component for conditional rendering based on user departments
 * 
 * @param {Object} props - Component props
 * @param {number|number[]} props.allowedDepartments - Department ID(s) that can access this component
 * @param {boolean} props.inverted - If true, component will render when user does NOT belong to the department
 * @param {React.ReactNode} props.children - Child components to render
 * @param {React.ReactNode} props.fallback - Optional fallback component to render when access is denied
 * @returns {React.ReactNode}
 */
export const DepartmentBasedAccess = ({ 
    allowedDepartments, 
    inverted = false, 
    children, 
    fallback = null 
}) => {
    const { user, inAnyDepartment } = useAuth();

    // If no user is authenticated, don't render anything
    if (!user) return fallback;

    // Convert single department to array
    const departments = Array.isArray(allowedDepartments) ? allowedDepartments : [allowedDepartments];
    
    // Check if user belongs to any of the allowed departments
    const hasAccess = inAnyDepartment(departments);
    
    // Render based on access and inverted flag
    const shouldRender = inverted ? !hasAccess : hasAccess;
    
    return shouldRender ? children : fallback;
};

/**
 * Component for rendering content only accessible to administrators
 */
export const AdminOnly = ({ children, fallback = null }) => {
    const { ROLES } = useAuth();
    return (
        <RoleBasedAccess allowedRoles={ROLES.ADMIN} fallback={fallback}>
            {children}
        </RoleBasedAccess>
    );
};

/**
 * Component for rendering content only accessible to managers
 */
export const ManagerOnly = ({ children, fallback = null }) => {
    const { ROLES } = useAuth();
    return (
        <RoleBasedAccess allowedRoles={[ROLES.MANAGER, ROLES.DEPARTMENT_MANAGER]} fallback={fallback}>
            {children}
        </RoleBasedAccess>
    );
};

/**
 * Component for rendering content only accessible to department managers
 */
export const DepartmentManagerOnly = ({ children, fallback = null }) => {
    const { ROLES } = useAuth();
    return (
        <RoleBasedAccess allowedRoles={ROLES.DEPARTMENT_MANAGER} fallback={fallback}>
            {children}
        </RoleBasedAccess>
    );
};

/**
 * Component for rendering content only accessible to field workers
 */
export const FieldWorkerOnly = ({ children, fallback = null }) => {
    const { ROLES } = useAuth();
    return (
        <RoleBasedAccess allowedRoles={ROLES.FIELD_WORKER} fallback={fallback}>
            {children}
        </RoleBasedAccess>
    );
};

/**
 * Component for rendering content only accessible to data analysts
 */
export const DataAnalystOnly = ({ children, fallback = null }) => {
    const { ROLES } = useAuth();
    return (
        <RoleBasedAccess allowedRoles={ROLES.DATA_ANALYST} fallback={fallback}>
            {children}
        </RoleBasedAccess>
    );
};

/**
 * Component for rendering content only accessible to consultants
 */
export const ConsultantOnly = ({ children, fallback = null }) => {
    const { ROLES } = useAuth();
    return (
        <RoleBasedAccess allowedRoles={ROLES.CONSULTANT} fallback={fallback}>
            {children}
        </RoleBasedAccess>
    );
};

/**
 * Component for rendering content only accessible to internal users
 */
export const InternalOnly = ({ children, fallback = null }) => {
    const { USER_TYPES } = useAuth();
    const { user } = useAuth();
    
    if (!user || user.user_type !== USER_TYPES.INTERNAL) {
        return fallback;
    }
    
    return children;
};

/**
 * Component for rendering content only accessible to external users
 */
export const ExternalOnly = ({ children, fallback = null }) => {
    const { USER_TYPES } = useAuth();
    const { user } = useAuth();
    
    if (!user || user.user_type !== USER_TYPES.EXTERNAL) {
        return fallback;
    }
    
    return children;
};

/**
 * Component for rendering content accessible to multiple roles
 */
export const MultiRoleAccess = ({ roles, children, fallback = null }) => {
    return (
        <RoleBasedAccess allowedRoles={roles} fallback={fallback}>
            {children}
        </RoleBasedAccess>
    );
};

/**
 * Component for rendering content accessible to users from specific departments
 */
export const DepartmentAccess = ({ departments, children, fallback = null }) => {
    return (
        <DepartmentBasedAccess allowedDepartments={departments} fallback={fallback}>
            {children}
        </DepartmentBasedAccess>
    );
}; 