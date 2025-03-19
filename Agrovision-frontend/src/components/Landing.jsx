import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section id="home" className="hero min-h-[70vh] bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Welcome to AgroVision</h1>
                        <p className="py-6">
                            Revolutionizing agriculture through innovative technology and data-driven solutions.
                        </p>
                        <div className="flex gap-4 justify-center">
                            {!user ? (
                                <Link to="/register" className="btn btn-primary">
                                    Get Started
                                </Link>
                            ) : (
                                <Link to="/dashboard" className="btn btn-primary">
                                    Go to Dashboard
                                </Link>
                            )}
                            <a href="#about" className="btn btn-ghost">
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-16 bg-base-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">About Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card bg-base-200">
                            <div className="card-body items-center text-center">
                                <h3 className="card-title">Our Mission</h3>
                                <p>To empower farmers with cutting-edge technology for better livestock management and increased productivity.</p>
                            </div>
                        </div>
                        <div className="card bg-base-200">
                            <div className="card-body items-center text-center">
                                <h3 className="card-title">Our Vision</h3>
                                <p>To become the leading agricultural technology platform, revolutionizing how farmers manage their operations.</p>
                            </div>
                        </div>
                        <div className="card bg-base-200">
                            <div className="card-body items-center text-center">
                                <h3 className="card-title">Our Values</h3>
                                <p>Innovation, Sustainability, and Farmer Success drive everything we do.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-base-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Why Choose AgroVision?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="card bg-base-100">
                            <div className="card-body">
                                <h3 className="card-title">Smart Tracking</h3>
                                <p>Real-time monitoring of your livestock's health and location.</p>
                            </div>
                        </div>
                        <div className="card bg-base-100">
                            <div className="card-body">
                                <h3 className="card-title">Data Analytics</h3>
                                <p>Advanced insights to optimize your farm's performance.</p>
                            </div>
                        </div>
                        <div className="card bg-base-100">
                            <div className="card-body">
                                <h3 className="card-title">Easy Management</h3>
                                <p>Streamlined interface for efficient farm operations.</p>
                            </div>
                        </div>
                        <div className="card bg-base-100">
                            <div className="card-body">
                                <h3 className="card-title">24/7 Support</h3>
                                <p>Round-the-clock assistance for your farming needs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA Section */}
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-6">Need Help?</h2>
                    <p className="mb-8 text-lg max-w-2xl mx-auto">
                        Have questions about our services or need support? Our team is here to help you!
                    </p>
                    <Link to="/contact" className="btn btn-primary btn-lg">
                        Contact Us
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer footer-center p-10 bg-base-200 text-base-content">
                <div>
                    <p className="font-bold">
                        AgroVision Ltd. <br/>
                        Providing reliable agri-tech solutions since 2024
                    </p>
                    <p>Copyright © 2024 - All rights reserved</p>
                </div>
                <div>
                    <div className="grid grid-flow-col gap-4">
                        <a href="#" className="link link-hover">Twitter</a>
                        <a href="#" className="link link-hover">Facebook</a>
                        <a href="#" className="link link-hover">LinkedIn</a>
                        <a href="#" className="link link-hover">Instagram</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing; 