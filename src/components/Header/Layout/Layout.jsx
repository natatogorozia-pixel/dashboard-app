import React from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout-container">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
      <footer className="footer">
        <p>&copy; 2026 LogiExpress Panel. ყველა უფლება დაცულია.</p>
      </footer>
    </div>
  );
}