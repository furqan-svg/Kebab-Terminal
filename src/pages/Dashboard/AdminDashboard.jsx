import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Truck,
    Users,
    BarChart3,
    Settings as SettingsIcon,
    Search,
    Bell,
    ChevronRight,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Package,
    Clock,
    ExternalLink,
    DollarSign,
    Fuel,
    Utensils,
    PlusCircle,
    X,
    MapPin,
    Filter,
    CheckCircle2,
    LogOut,
    Sliders,
    Receipt,
    Eye,
    Store,
    Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

// --- Helper Functions for Stats ---
const calculateStats = (orders, expenses, period = 'day') => {
    const today = new Date().setHours(0, 0, 0, 0);
    const filterByPeriod = (item) => {
        const itemDate = new Date(item.timestamp || item.date).setHours(0, 0, 0, 0);
        if (period === 'day') return itemDate === today;
        if (period === 'week') return (today - itemDate) / (1000 * 60 * 60 * 24) <= 7;
        if (period === 'month') return (today - itemDate) / (1000 * 60 * 60 * 24) <= 30;
        return true; // Yearly/All
    };

    const periodOrders = orders.filter(filterByPeriod);
    const periodExpenses = expenses.filter(filterByPeriod);

    const revenue = periodOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const cost = periodExpenses.reduce((sum, e) => sum + (Number(e.cost) || 0), 0);

    return {
        revenue,
        expenses: cost,
        profit: revenue - cost,
        orderCount: periodOrders.length
    };
};

// --- Sub-components ---

const Overview = ({ searchQuery }) => {
    const { orders, expenses } = useAppContext();
    const [period, setPeriod] = useState('day');
    const stats = calculateStats(orders, expenses, period);

    const filteredOrders = searchQuery
        ? orders.filter(o =>
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : orders;

    const cards = [
        { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, trend: '+12%', color: 'var(--primary)' },
        { label: 'Total Expenses', value: `$${stats.expenses.toLocaleString()}`, trend: '-5%', color: 'var(--secondary)' },
        { label: 'Net Profit', value: `$${stats.profit.toLocaleString()}`, trend: '+8%', color: stats.profit >= 0 ? 'var(--accent-green)' : 'var(--secondary)' },
        { label: 'Total Orders', value: stats.orderCount, trend: '+3', color: '#8b5cf6' },
    ];

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Terminal Overview</h2>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time business performance snapshot</p>
                </div>
                <div className="glass-panel" style={{ display: 'flex', gap: '0.2rem', padding: '0.3rem', borderRadius: '0.8rem' }}>
                    {['day', 'week', 'month', 'year'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            style={{
                                padding: '0.4rem 1rem',
                                border: 'none',
                                borderRadius: '0.6rem',
                                background: period === p ? 'var(--primary)' : 'transparent',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {p.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {cards.map(c => (
                    <div key={c.label} className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${c.color}` }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>{c.value}</div>
                        <div className="flex-center" style={{ gap: '0.4rem', justifyContent: 'flex-start', marginTop: '0.6rem', fontSize: '0.75rem', color: c.trend.startsWith('+') ? 'var(--accent-green)' : 'var(--secondary)' }}>
                            {c.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {c.trend} vs last period
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Activity */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0 }}>Recent Orders</h3>
                        <Link to="/admin/dashboard/orders" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
                    </div>
                    <div>
                        {filteredOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No orders found</div>
                        ) : (
                            filteredOrders.slice(0, 5).map(o => (
                                <div key={o.id} className="flex-between" style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                                    <div className="flex-center" style={{ gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} className="flex-center">
                                            <Package size={20} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{o.id}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customer || 'Guest'} • {new Date(o.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 800 }}>${(Number(o.total) || 0).toFixed(2)}</div>
                                        <div style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                            color: o.status === 'completed' ? 'var(--accent-green)' : 'var(--primary)',
                                            textTransform: 'uppercase'
                                        }}>
                                            {o.status}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Top Menu Categories</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { label: 'Kebabs (Signature)', val: 75, color: 'var(--primary)' },
                            { label: 'Chicken Dishes', val: 45, color: '#f59e0b' },
                            { label: 'Vegetarian Specialties', val: 30, color: 'var(--accent-green)' },
                            { label: 'Beverages & Drinks', val: 25, color: '#3b82f6' }
                        ].map(cat => (
                            <div key={cat.label}>
                                <div className="flex-between" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                    <span>{cat.label}</span>
                                    <span style={{ fontWeight: 700 }}>{cat.val}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${cat.val}%`, height: '100%', background: cat.color, borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderManagement = ({ searchQuery }) => {
    const { orders, updateOrderStatus } = useAppContext();
    const [filter, setFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filtered = orders.filter(o => {
        const matchesFilter = filter === 'all' ? true : o.status === filter;
        const matchesSearch = searchQuery
            ? (o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (o.customer && o.customer.toLowerCase().includes(searchQuery.toLowerCase())))
            : true;
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Order Center</h2>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage live, preparing, and completed tickets</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="glass-panel flex-center" style={{ padding: '0.5rem 1rem', gap: '0.5rem' }}>
                        <Filter size={16} color="var(--primary)" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="all" style={{ background: '#0f172a' }}>All Orders ({orders.length})</option>
                            <option value="pending" style={{ background: '#0f172a' }}>Pending</option>
                            <option value="accepted" style={{ background: '#0f172a' }}>Accepted</option>
                            <option value="preparing" style={{ background: '#0f172a' }}>Preparing</option>
                            <option value="cooking" style={{ background: '#0f172a' }}>Cooking</option>
                            <option value="ready" style={{ background: '#0f172a' }}>Ready</option>
                            <option value="out_for_delivery" style={{ background: '#0f172a' }}>Out for Delivery</option>
                            <option value="completed" style={{ background: '#0f172a' }}>Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CUSTOMER</th>
                            <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>MODE / TABLE</th>
                            <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ITEMS</th>
                            <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL</th>
                            <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>STATUS</th>
                            <th style={{ padding: '1.2rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No orders match the current filter
                                </td>
                            </tr>
                        ) : (
                            filtered.map(o => (
                                <tr key={o.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                    <td style={{ padding: '1.2rem 1rem', fontWeight: 800, color: 'var(--primary)' }}>{o.id}</td>
                                    <td style={{ padding: '1.2rem 1rem', fontWeight: 600 }}>{o.customer || 'Guest'}</td>
                                    <td style={{ padding: '1.2rem 1rem', fontSize: '0.85rem' }}>
                                        <span style={{ padding: '0.2rem 0.6rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)' }}>
                                            {o.mode || 'Dine-in'} • {o.table || 'Counter'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem 1rem', fontSize: '0.85rem' }}>
                                        <button
                                            onClick={() => setSelectedOrder(o)}
                                            className="glass-button"
                                            style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', gap: '0.3rem', display: 'inline-flex', alignItems: 'center' }}
                                        >
                                            <Eye size={12} /> {o.items ? o.items.length : 0} items
                                        </button>
                                    </td>
                                    <td style={{ padding: '1.2rem 1rem', fontWeight: 800 }}>${(Number(o.total) || 0).toFixed(2)}</td>
                                    <td style={{ padding: '1.2rem 1rem' }}>
                                        <span style={{
                                            padding: '0.3rem 0.7rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700,
                                            background: o.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                                            color: o.status === 'completed' ? 'var(--accent-green)' : 'var(--primary)',
                                            border: `1px solid ${o.status === 'completed' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(249, 115, 22, 0.3)'}`
                                        }}>
                                            {o.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem 1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {o.status === 'pending' && (
                                                <button
                                                    onClick={() => updateOrderStatus(o.id, 'accepted')}
                                                    className="primary-button" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: 'var(--accent-green)' }}
                                                >
                                                    ACCEPT
                                                </button>
                                            )}
                                            {o.status === 'ready' && (
                                                <button
                                                    onClick={() => updateOrderStatus(o.id, 'out_for_delivery')}
                                                    className="primary-button" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                                                >
                                                    DISPATCH <Truck size={14} />
                                                </button>
                                            )}
                                            {o.status === 'out_for_delivery' && (
                                                <button
                                                    onClick={() => updateOrderStatus(o.id, 'completed')}
                                                    className="primary-button" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: 'var(--accent-green)' }}
                                                >
                                                    COMPLETE
                                                </button>
                                            )}
                                            {o.status === 'completed' && (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Archived</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <Receipt size={24} color="var(--primary)" />
                                    <h3 style={{ margin: 0 }}>Order {selectedOrder.id}</h3>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer</div>
                                    <div style={{ fontWeight: 700 }}>{selectedOrder.customer || 'Guest'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mode & Table</div>
                                    <div style={{ fontWeight: 700 }}>{selectedOrder.mode} ({selectedOrder.table})</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Method</div>
                                    <div style={{ fontWeight: 700 }}>{selectedOrder.paymentMethod || 'UPI'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Timestamp</div>
                                    <div style={{ fontWeight: 700 }}>{new Date(selectedOrder.timestamp).toLocaleTimeString()}</div>
                                </div>
                            </div>

                            <h4 style={{ marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Items Ordered</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="flex-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                                        <div>
                                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.quantity}x</span> {item.name}
                                        </div>
                                        <span style={{ fontWeight: 700 }}>${((Number(item.price) || 0) * (Number(item.quantity) || 1)).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-between" style={{ borderTop: '2px solid var(--border-glass)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Amount</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>${(Number(selectedOrder.total) || 0).toFixed(2)}</span>
                            </div>

                            <button onClick={() => setSelectedOrder(null)} className="primary-button" style={{ width: '100%' }}>Close</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ExpenseManagement = () => {
    const { expenses, addExpense } = useAppContext();
    const [filterCategory, setFilterCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({ category: 'Chicken', item: '', quantity: '', cost: '' });

    const categories = ['Chicken', 'Coal', 'Masalas', 'Vegetables', 'Dairy', 'Gas', 'Packaging', 'Maintenance', 'Others'];

    const filteredExpenses = filterCategory === 'All'
        ? expenses
        : expenses.filter(e => e.category === filterCategory);

    const totalSpent = filteredExpenses.reduce((sum, e) => sum + (Number(e.cost) || 0), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newItem.item || !newItem.cost) return;
        addExpense({
            category: newItem.category,
            item: newItem.item,
            quantity: newItem.quantity || '1 unit',
            cost: parseFloat(newItem.cost),
            timestamp: Date.now()
        });
        setNewItem({ category: 'Chicken', item: '', quantity: '', cost: '' });
        setShowModal(false);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Expense Log & Purchasing</h2>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Track raw ingredients, kitchen supplies, and utility costs</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowModal(true)} className="primary-button" style={{ fontSize: '0.85rem' }}>
                        <PlusCircle size={18} /> Add New Expense
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL FILTERED EXPENSES</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>${totalSpent.toLocaleString()}</div>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL LOGGED ENTRIES</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>{filteredExpenses.length}</div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Filter by Category:</span>
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {['All', ...categories].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className="glass-button"
                                style={{
                                    padding: '0.4rem 1rem',
                                    fontSize: '0.75rem',
                                    background: filterCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    borderColor: filterCategory === cat ? 'var(--primary)' : 'var(--border-glass)'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>DATE</th>
                                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CATEGORY</th>
                                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ITEM NAME</th>
                                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>QUANTITY</th>
                                <th style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>COST</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                        No expenses found for this category
                                    </td>
                                </tr>
                            ) : (
                                filteredExpenses.map(exp => (
                                    <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{new Date(exp.timestamp || exp.date).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ padding: '0.3rem 0.7rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 600 }}>{exp.category}</span>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{exp.item}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{exp.quantity}</td>
                                        <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--secondary)' }}>${(Number(exp.cost) || 0).toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, padding: '1rem' }}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
                            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: 0 }}>Log New Expense</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Expense Category</label>
                                    <select
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white' }}
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Item Name</label>
                                    <input type="text" placeholder="e.g. Fresh Broiler Chicken" required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white' }} value={newItem.item} onChange={(e) => setNewItem({ ...newItem, item: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Quantity</label>
                                        <input type="text" placeholder="e.g. 25kg" required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white' }} value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Total Cost ($)</label>
                                        <input type="number" step="0.01" placeholder="450" required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white' }} value={newItem.cost} onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })} />
                                    </div>
                                </div>
                                <button type="submit" className="primary-button" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>SAVE ENTRY</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Analytics = () => {
    const { orders, expenses } = useAppContext();
    const [period, setPeriod] = useState('day');
    const stats = calculateStats(orders, expenses, period);

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Profit & Loss Analytics</h2>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Financial margin and cashflow breakdown</p>
                </div>
                <div className="glass-panel" style={{ display: 'flex', gap: '0.2rem', padding: '0.3rem', borderRadius: '0.8rem' }}>
                    {['day', 'week', 'month', 'year'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            style={{ padding: '0.4rem 1rem', border: 'none', borderRadius: '0.6rem', background: period === p ? 'var(--primary)' : 'transparent', color: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                            {p.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '2rem' }}>Revenue vs Expenses ({period.toUpperCase()})</h3>
                    <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '0 2rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ width: '100%', height: `${Math.max(10, Math.min(100, (stats.revenue / (stats.revenue + stats.expenses || 1)) * 100))}%`, background: 'linear-gradient(to top, var(--primary), var(--secondary))', borderRadius: '1rem 1rem 0 0', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-30px', left: 0, right: 0, textAlign: 'center', fontWeight: 800 }}>${stats.revenue.toFixed(0)}</div>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>REVENUE</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ width: '100%', height: `${Math.max(10, Math.min(100, (stats.expenses / (stats.revenue + stats.expenses || 1)) * 100))}%`, background: 'rgba(255, 255, 255, 0.15)', borderRadius: '1rem 1rem 0 0', position: 'relative', border: '1px solid var(--border-glass)' }}>
                                <div style={{ position: 'absolute', top: '-30px', left: 0, right: 0, textAlign: 'center', fontWeight: 800 }}>${stats.expenses.toFixed(0)}</div>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>EXPENSES</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3>Financial Performance</h3>
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Net Margin Percentage</div>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: stats.profit >= 0 ? 'var(--accent-green)' : 'var(--secondary)' }}>
                            {stats.revenue > 0 ? ((stats.profit / stats.revenue) * 100).toFixed(1) : 0}%
                        </div>
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="flex-between">
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Gross Revenue</span>
                                <span style={{ fontWeight: 800 }}>${stats.revenue.toFixed(2)}</span>
                            </div>
                            <div className="flex-between">
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Cost of Operation</span>
                                <span style={{ fontWeight: 800 }}>${stats.expenses.toFixed(2)}</span>
                            </div>
                            <div className="flex-between" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Net Estimated Profit</span>
                                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: stats.profit >= 0 ? 'var(--accent-green)' : 'var(--secondary)' }}>${stats.profit.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsView = () => {
    const [storeName, setStoreName] = useState('Kebab Kafe Terminal');
    const [taxRate, setTaxRate] = useState('5');
    const [currency, setCurrency] = useState('USD ($)');
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '700px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Terminal Settings</h2>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure store preferences, taxes, and system triggers</p>
            </div>

            <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Store / Outlet Name</label>
                    <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.6rem', color: 'white', outline: 'none' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Sales Tax / VAT (%)</label>
                        <input
                            type="number"
                            value={taxRate}
                            onChange={(e) => setTaxRate(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.6rem', color: 'white', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Primary Currency</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.6rem', color: 'white', outline: 'none' }}
                        >
                            <option value="USD ($)" style={{ background: '#0f172a' }}>USD ($)</option>
                            <option value="INR (₹)" style={{ background: '#0f172a' }}>INR (₹)</option>
                            <option value="EUR (€)" style={{ background: '#0f172a' }}>EUR (€)</option>
                            <option value="GBP (£)" style={{ background: '#0f172a' }}>GBP (£)</option>
                        </select>
                    </div>
                </div>

                <div className="flex-between" style={{ padding: '1rem 0', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Volume2 size={20} color="var(--primary)" />
                        <div>
                            <div style={{ fontWeight: 600 }}>Audio Alerts for Incoming Orders</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Play sound chime when customer places a ticket</div>
                        </div>
                    </div>
                    <input
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={(e) => setSoundEnabled(e.target.checked)}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" className="primary-button" style={{ padding: '0.8rem 2rem' }}>
                        Save Preferences
                    </button>
                    {saved && (
                        <span style={{ color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckCircle2 size={16} /> Saved successfully!
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
};

// --- Main Layout ---

export default function AdminDashboard() {
    const location = useLocation();
    const { logout } = useAppContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const navItems = [
        { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Order Hub', path: '/admin/dashboard/orders', icon: ShoppingBag },
        { label: 'Expenses', path: '/admin/dashboard/expenses', icon: DollarSign },
        { label: 'Analytics', path: '/admin/dashboard/analytics', icon: BarChart3 },
        { label: 'Kitchen (KDS)', path: '/admin/kds', icon: Utensils, isExternal: true },
        { label: 'Settings', path: '/admin/dashboard/settings', icon: SettingsIcon },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#020617' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', borderRight: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', padding: '2.5rem 1.5rem', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3.5rem', paddingLeft: '0.5rem' }}>
                    <ShoppingBag color="var(--primary)" size={32} />
                    <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Kebab Terminal</h2>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin/dashboard/');
                            return (
                                <li key={item.path} style={{ marginBottom: '0.8rem' }}>
                                    <Link
                                        to={item.path}
                                        className={`flex-center`}
                                        style={{
                                            justifyContent: 'flex-start',
                                            gap: '1.2rem',
                                            padding: '1rem 1.5rem',
                                            borderRadius: '1rem',
                                            textDecoration: 'none',
                                            color: isActive ? 'white' : 'var(--text-muted)',
                                            background: isActive ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: isActive ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid transparent'
                                        }}
                                    >
                                        <item.icon size={20} color={isActive ? 'var(--primary)' : 'currentColor'} />
                                        <span style={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
                <header style={{ padding: '1.5rem 3rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
                    <div style={{ position: 'relative', width: '350px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search orders, customers, IDs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '2rem', padding: '0.8rem 1rem 0.8rem 3rem', color: 'white', outline: 'none', fontSize: '0.9rem' }}
                        />
                    </div>

                    <div className="flex-center" style={{ gap: '2rem' }}>
                        <button className="flex-center glass-button" style={{ padding: '0.8rem', background: 'transparent', borderRadius: '50%' }}>
                            <Bell size={22} color="var(--primary)" />
                        </button>
                        <div className="flex-center" style={{ gap: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 800 }}>Admin Master</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 600 }}>SYSTEM ADMIN</div>
                            </div>
                            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', fontWeight: 800 }} className="flex-center">YA</div>
                        </div>
                    </div>
                </header>

                <section style={{ padding: '3rem', flex: 1 }}>
                    <Routes>
                        <Route index element={<Overview searchQuery={searchQuery} />} />
                        <Route path="orders" element={<OrderManagement searchQuery={searchQuery} />} />
                        <Route path="expenses" element={<ExpenseManagement />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="settings" element={<SettingsView />} />
                        <Route path="*" element={<Overview searchQuery={searchQuery} />} />
                    </Routes>
                </section>
            </main>
        </div>
    );
}