// src/layouts/FooterLayout.jsx
import React from 'react';
import Footer from '../component/Footer/Footer';
import Navbar from '../component/Navbar/Navbar';
import './FooterLayout.css';

export default function FooterLayout({ children }) {
  return (
    <div className="footer-layout">
      <Navbar />
      <main className="footer-page-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}