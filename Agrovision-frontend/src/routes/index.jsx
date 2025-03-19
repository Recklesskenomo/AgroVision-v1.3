// src/routes/index.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import AnimalsPage from '../pages/AnimalsPage';
// Import other pages as you create them

const AppRoutes = () => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleOpenModal = () => {
        // This function will be passed down to the page component
        // We'll use React Router's context to pass it down
    };

    return (
        <Routes>
            <Route path="/" element={<MainLayout onOpen={handleOpenModal} onSearch={setSearchTerm} />}>
                <Route index element={<HomePage />} />
                {/* Add other routes here as needed */}
                <Route index element={<AnimalsPage />} />
                {/* <Route path="dashboard" element={<Dashboard />} /> */}
                {/* <Route path="reports" element={<Reports />} /> */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;