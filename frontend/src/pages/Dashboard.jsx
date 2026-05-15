import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area 
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowUpRight } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-card p-6 flex items-center justify-between group hover:border-white/20 transition-all">
        <div>
            <p className="text-slate-400 text-sm mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`} style={{ backgroundColor: `${color}20`, color }}>
            <Icon size={24} />
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [txRes, alertRes] = await Promise.all([
                    api.get('/transactions/my'),
                    api.get('/transactions/alerts')
                ]);
                setTransactions(txRes.data);
                setAlerts(alertRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate Stats
    const stats = {
        totalSpent: transactions.reduce((acc, tx) => acc + (tx.status === 'APPROVED' ? tx.amount : 0), 0),
        safeCount: transactions.filter(tx => tx.status === 'APPROVED').length,
        flaggedCount: transactions.filter(tx => tx.status === 'FLAGGED').length,
        pendingCount: transactions.filter(tx => tx.status === 'PENDING').length
    };

    // Chart Data (Last 7 days)
    const chartData = transactions.slice(0, 10).reverse().map(tx => ({
        name: new Date(tx.timestamp).toLocaleDateString([], { weekday: 'short' }),
        amount: tx.amount
    }));

    if (loading) return (
        <div className="p-8 ml-64 flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="p-12 ml-72 min-h-screen">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 outfit">Welcome back, {user?.firstName}</h2>
                    <p className="text-slate-400">Your account is currently <span className="text-emerald-400 font-medium">Protected</span>.</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Live Monitor Active
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <StatCard title="Total Approved" value={`$${stats.totalSpent.toLocaleString()}`} icon={TrendingUp} color="#6366f1" />
                <StatCard title="Safe Transactions" value={stats.safeCount} icon={CheckCircle} color="#22c55e" />
                <StatCard title="Flagged Activities" value={stats.flaggedCount} icon={AlertTriangle} color="#ef4444" />
                <StatCard title="Pending Checks" value={stats.pendingCount} icon={Clock} color="#f59e0b" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-bold text-white outfit">Spending Trends</h4>
                        <button className="text-indigo-400 text-sm font-medium hover:underline flex items-center gap-1">
                            Full Analysis <ArrowUpRight size={14} />
                        </button>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'N/A', amount: 0 }]}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Alerts */}
                <div className="glass-card p-6">
                    <h4 className="text-lg font-bold text-white mb-6 outfit">Critical Alerts</h4>
                    <div className="space-y-4">
                        {alerts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle size={24} />
                                </div>
                                <p className="text-slate-500 text-sm">No recent threats found.</p>
                            </div>
                        ) : (
                            alerts.slice(0, 4).map(alert => (
                                <div key={alert.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 uppercase">
                                            {alert.reason.split(';')[0].replace('_', ' ')}
                                        </span>
                                        <span className="text-white font-bold text-sm">${alert.transaction.amount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate">{alert.transaction.merchant}</p>
                                    <p className="text-[10px] text-slate-500 mt-1">{new Date(alert.createdAt).toLocaleString()}</p>
                                </div>
                            ))
                        )}
                    </div>
                    {alerts.length > 4 && (
                        <button className="w-full mt-6 text-slate-400 hover:text-white text-sm font-medium transition-colors">
                            View All Alerts
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
