// src/components/Footer.js
import React from 'react';
import {Link} from 'react-router-dom'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Invest from './Invest';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
                {/* Logo */}
                <div className="mb-4 md:mb-0">
                    <h1 className="text-2xl font-semibold">YourLogo</h1>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col md:flex-row gap-4">
                    <a href="/" className="hover:underline">Home</a>
                    <a href="/about" className="hover:underline"></a>
                    <Link to="/propose"> Create a Proposal</Link>
                    <Link to="/invest"> Invest</Link>
                </div>

                {/* Social Media Icons */}
                <div className="flex gap-4 mt-4 md:mt-0">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <FaFacebook size={24} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FaLinkedin size={24} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <FaInstagram size={24} />
                    </a>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center py-4 border-t border-gray-700">
                <p className="text-sm">&copy; {new Date().getFullYear()}  All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
