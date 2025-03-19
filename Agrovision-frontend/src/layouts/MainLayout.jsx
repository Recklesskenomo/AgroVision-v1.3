import React from 'react';
import {Outlet} from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

const MainLayout = ({ onOpen, onSearch }) => {
    return (
        <>
            <NavBar onOpen={onOpen} onSearch={onSearch} />
            <main>
                <Outlet context={{ onOpen }} />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;