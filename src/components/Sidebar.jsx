import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, Monitor, Maximize, Smartphone, LayoutDashboard, UserCircle, MessageSquare } from 'lucide-react';


export function Sidebar() {
    return (
        <div className="sidebar-content">
            <div className="sidebar-header">
                <div className="logo-badge">
                    <Sparkles size={20} color="var(--accent-secondary)" />
                    <span className="brand-name">Aether<span className="brand-highlight">Studio</span></span>
                </div>
            </div>

            <div className="sidebar-section">
                <nav className="nav-menu">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        end
                    >
                        <Sparkles size={18} />
                        <span>Studio</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/chat"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <MessageSquare size={18} />
                        <span>Chat</span>
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <UserCircle size={18} />
                        <span>Profile</span>
                    </NavLink>
                </nav>
            </div>
        </div>
    );
}
