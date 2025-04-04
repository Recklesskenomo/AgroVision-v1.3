import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin, isManager, ROLES } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Don't show login/register buttons on login or register pages
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    // Get role-specific display name
    const getRoleDisplayName = (role) => {
        const roleMap = {
            [ROLES.ADMIN]: 'Administrator',
            [ROLES.MANAGER]: 'Farm Manager',
            [ROLES.FIELD_WORKER]: 'Field Worker',
            [ROLES.DATA_ANALYST]: 'Data Analyst',
            [ROLES.USER]: 'User'
        };
        return roleMap[role] || 'User';
    };

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        {user && <li><Link to="/dashboard">Dashboard</Link></li>}
                        {user && <li><Link to="/dashboard/animals">Animals</Link></li>}
                        
                        {/* Admin-only links (mobile) */}
                        {isAdmin() && (
                            <li>
                                <span className="font-bold text-sm opacity-70 px-4 py-2">Admin</span>
                                <ul className="p-2">
                                    <li><Link to="/admin/users">User Management</Link></li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost normal-case text-xl">
                    AgroVision
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    {user && (
                        <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
                    )}
                    {user && (
                        <li><Link to="/dashboard/animals" className={location.pathname === '/dashboard/animals' ? 'active' : ''}>Animals</Link></li>
                    )}
                    
                    {/* Admin-only links (desktop) */}
                    {isAdmin() && (
                        <li>
                            <details>
                                <summary>Admin</summary>
                                <ul className="p-2 bg-base-100 z-10">
                                    <li><Link to="/admin/users">User Management</Link></li>
                                </ul>
                            </details>
                        </li>
                    )}
                </ul>
            </div>

            <div className="navbar-end">
                {!user ? (
                    !isAuthPage && (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn btn-primary">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-secondary">
                                Register
                            </Link>
                        </div>
                    )
                ) : (
                    <div className="flex gap-2 items-center">
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost">
                                <div className="flex flex-col items-end">
                                    <span className="mr-2">{user.username}</span>
                                    <span className="text-xs opacity-70">{getRoleDisplayName(user.role)}</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                <li><Link to="/profile">Profile</Link></li>
                                <li><Link to="/settings">Settings</Link></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;