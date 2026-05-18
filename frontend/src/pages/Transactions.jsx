import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Search, Filter, MoreVertical, 
    CheckCircle2, AlertOctagon, Clock, ExternalLink, X
} from 'lucide-react';
import api from '../api/axios';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTx, setNewTx] = useState({
        amount: '',
        merchant: '',
        location: '',
        category: 'Shopping'
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions/my');
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTransaction = async (e) => {
        e.preventDefault();
        try {
            await api.post('/transactions', {
                ...newTx,
                amount: parseFloat(newTx.amount)
            });
            setIsModalOpen(false);
            setNewTx({ amount: '', merchant: '', location: '', category: 'Shopping' });
            fetchTransactions();
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-emerald-400 bg-emerald-400/10';
            case 'FLAGGED': return 'text-red-400 bg-red-400/10';
            case 'PENDING': return 'text-amber-400 bg-amber-400/10';
            default: return 'text-slate-400 bg-slate-400/10';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 size={16} />;
            case 'FLAGGED': return <AlertOctagon size={16} />;
            case 'PENDING': return <Clock size={16} />;
            default: return null;
        }
    };

    return (
        <div className="p-12 ml-72 min-h-screen">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2 outfit">Transactions</h2>
                    <p className="text-slate-400">View and manage your financial activity.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    New Transaction
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by merchant, location..." 
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2.5 rounded-xl border border-white/10 transition-all">
                            <Filter size={18} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/2">
                                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Date & Time</th>
                                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Merchant</th>
                                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Location</th>
                                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Amount</th>
                                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Status</th>
                                <th className="px-6 py-4 text-slate-400 font-medium text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-6"><div className="h-4 bg-white/5 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/2 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">
                                            {new Date(tx.timestamp).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium">{tx.merchant}</div>
                                        <div className="text-xs text-slate-500">{tx.category}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{tx.location}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-bold">${tx.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                                            {getStatusIcon(tx.status)}
                                            {tx.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-500 hover:text-white transition-colors">
                                            <ExternalLink size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Transaction Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md glass-card p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white outfit">New Transaction</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTransaction} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Merchant Name</label>
                                    <input 
                                        required
                                        type="text"
                                        placeholder="e.g. Apple Store, Starbucks"
                                        value={newTx.merchant}
                                        onChange={(e) => setNewTx({...newTx, merchant: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Amount ($)</label>
                                        <input 
                                            required
                                            type="number"
                                            placeholder="0.00"
                                            value={newTx.amount}
                                            onChange={(e) => setNewTx({...newTx, amount: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Category</label>
                                        <select 
                                            value={newTx.category}
                                            onChange={(e) => setNewTx({...newTx, category: e.target.value})}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                                        >
                                            <option value="Shopping">Shopping</option>
                                            <option value="Food">Food</option>
                                            <option value="Travel">Travel</option>
                                            <option value="Health">Health</option>
                                            <option value="Utilities">Utilities</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Location</label>
                                    <input 
                                        required
                                        type="text"
                                        placeholder="e.g. New York, USA"
                                        value={newTx.location}
                                        onChange={(e) => setNewTx({...newTx, location: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                                >
                                    Confirm Transaction
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Transactions;
