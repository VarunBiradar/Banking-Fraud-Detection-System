import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CreditCard, ShieldAlert, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/transactions', icon: CreditCard, label: 'Transactions' },
        { path: '/alerts', icon: ShieldAlert, label: 'Fraud Alerts' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    return (
        <aside className="w-72 h-screen bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col p-8 fixed z-50">
            <div className="flex items-center gap-4 mb-14">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <ShieldAlert className="text-white" size={28} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white outfit">SafeBank</h1>
            </div>

            <nav className="flex-1 space-y-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                                isActive 
                                ? 'bg-white/10 text-white shadow-xl shadow-black/20 border border-white/10' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button 
                onClick={logout}
                className="mt-auto flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors group"
            >
                <div className="p-2 rounded-lg group-hover:bg-red-500/10 transition-colors">
                    <LogOut size={20} />
                </div>
                <span className="font-medium">Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
