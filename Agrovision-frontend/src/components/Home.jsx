import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Agrovision</h1>
                <div className="flex gap-4 justify-center">
                    <Link to="/login" className="btn btn-primary">
                        Login
                    </Link>
                    <Link to="/register" className="btn btn-secondary">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home; 