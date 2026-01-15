import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import '../App.css';

export function Layout() {
    return (
        <div className="layout-grid">
            <aside className="sidebar-panel glass">
                <Sidebar />
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
