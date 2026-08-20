import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Truck, 
  Users, 
  BarChart3, 
  Settings, 
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
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

// --- Helper Functions for Stats ---
const calculateStats = (orders, expenses, period = 'day') => {
    const today = new Date().setHours(0,0,0,0);
    const filterByPeriod = (item) => {
        const itemDate = new Date(item.timestamp || item.date).setHours(0,0,0,0);
        if (period === 'day') return itemDate === today;
        if (period === 'week') return (today - itemDate) / (1000 * 60 * 60 * 24) <= 7;
        if (period === 'month') return (today - itemDate) / (1000 * 60 * 60 * 24) <= 30;
        return true; // Yearly/All
    };

    const periodOrders = orders.filter(filterByPeriod);
    const periodExpenses = expenses.filter(filterByPeriod);

    const revenue = periodOrders.reduce((sum, o) => sum + o.total, 0);
    const cost = periodExpenses.reduce((sum, e) => sum + e.cost, 0);
    
    return {
        revenue,
        expenses: cost,
        profit: revenue - cost,
        orderCount: periodOrders.length
    };
};

// --- Sub-components ---

const Overview = () => {
  const { orders, expenses } = useAppContext();
  const [period, setPeriod] = useState('day');
  const stats = calculateStats(orders, expenses, period);

  const cards = [
    { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, trend: '+12%', color: 'var(--primary)' },
    { label: 'Total Expenses', value: `$${stats.expenses.toLocaleString()}`, trend: '-5%', color: 'var(--secondary)' },
    { label: 'Net Profit', value: `$${stats.profit.toLocaleString()}`, trend: '+8%', color: stats.profit >= 0 ? 'var(--accent-green)' : 'var(--secondary)' },
    { label: 'Total Orders', value: stats.orderCount, trend: '+3', color: '#8b5cf6' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Terminal Overview</h2>
        <div className="glass-panel" style={{ display: 'flex', gap: '0.2rem', padding: '0.3rem', borderRadius: '0.8rem' }}>
            {['day', 'week', 'month', 'year'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPeriod(p)}
                  style={{ padding: '0.4rem 1rem', border: 'none', borderRadius: '0.6rem', background: period === p ? 'var(--primary)' : 'transparent', color: 'white', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                >
                    {p.toUpperCase()}
                </button>
            ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {cards.map(c => (
          <div key={c.label} className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${c.color}` }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{c.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>{c.value}</div>
            <div className="flex-center" style={{ gap: '0.4rem', justifyContent: 'flex-start', marginTop: '0.5rem', fontSize: '0.7rem', color: c.trend.startsWith('+') ? 'var(--accent-green)' : 'var(--secondary)' }}>
                {c.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {c.trend} vs last period
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3>Recent Activity</h3>
          <div style={{ marginTop: '1.5rem' }}>
             {orders.slice(0, 5).map(o => (
                <div key={o.id} className="flex-between" style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-glass)' }}>
                    <div className="flex-center" style={{ gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} className="flex-center">
                            <Package size={20} color="var(--primary)" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>{o.id}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{o.customer} • {new Date(o.timestamp).toLocaleTimeString()}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>${o.total.toFixed(2)}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--accent-green)' }}>{o.status.toUpperCase()}</div>
                    </div>
                </div>
             ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3>Top Categories</h3>
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                    { label: 'Kebabs', val: 75, color: 'var(--primary)' },
                    { label: 'Chicken Dishes', val: 45, color: '#f59e0b' },
                    { label: 'Vegetarian', val: 30, color: 'var(--accent-green)' },
                    { label: 'Drinks', val: 25, color: '#3b82f6' }
                ].map(cat => (
                    <div key={cat.label}>
                        <div className="flex-between" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                            <span>{cat.label}</span>
                            <span style={{ fontWeight: 600 }}>{cat.val}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                            <div style={{ width: `${cat.val}%`, height: '100%', background: cat.color, borderRadius: '3px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const OrderManagement = () => {
    const { orders, updateOrderStatus } = useAppContext();
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h3>Order Center</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass-panel flex-center" style={{ padding: '0.4rem 1rem', gap: '0.5rem' }}>
                        <Filter size={16} />
                        <select 
                          value={filter} 
                          onChange={(e) => setFilter(e.target.value)}
                          style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.8rem', outline: 'none' }}
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="ready">Ready</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CUSTOMER</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ITEMS</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>TOTAL</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>STATUS</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(o => (
                            <tr key={o.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <td style={{ padding: '1.2rem', fontWeight: 700 }}>{o.id}</td>
                                <td style={{ padding: '1.2rem' }}>{o.customer}</td>
                                <td style={{ padding: '1.2rem', fontSize: '0.8rem' }}>{o.items.length} items</td>
                                <td style={{ padding: '1.2rem' }}>${o.total.toFixed(2)}</td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ 
                                        padding: '0.3rem 0.6rem', borderRadius: '1rem', fontSize: '0.7rem', fontWeight: 600,
                                        background: o.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                                        color: o.status === 'completed' ? 'var(--accent-green)' : 'var(--primary)'
                                    }}>
                                        {o.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    {o.status === 'ready' && (
                                        <button 
                                          onClick={() => updateOrderStatus(o.id, 'out_for_delivery')}
                                          className="glass-button" style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem' }}
                                        >
                                            DISPATCH <Truck size={14} />
                                        </button>
                                    )}
                                    {o.status === 'out_for_delivery' && (
                                        <button 
                                          onClick={() => updateOrderStatus(o.id, 'completed')}
                                          className="glass-button" style={{ fontSize: '0.7rem', padding: '0.4rem 0.8rem', borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}
                                        >
                                            DELIVERED <CheckCircle2 size={14} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ExpenseManagement = () => {
    const { expenses, addExpense } = useAppContext();
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({ category: 'Chicken', item: '', quantity: '', cost: '' });

    const categories = ['Gas', 'Coal', 'Chicken', 'Vegetables', 'Masalas', 'Other'];

    const handleSubmit = (e) => {
        e.preventDefault();
        addExpense({ ...newItem, cost: parseFloat(newItem.cost), timestamp: new Date().getTime() });
        setNewItem({ category: 'Chicken', item: '', quantity: '', cost: '' });
        setShowModal(false);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h3>Operating Expenses</h3>
                <button onClick={() => setShowModal(true)} className="primary-button" style={{ gap: '0.5rem' }}>
                    <Plus size={20} /> Log Expense
                </button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>DATE</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CATEGORY</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ITEM</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>QTY</th>
                            <th style={{ padding: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>COST</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(exp => (
                            <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <td style={{ padding: '1.2rem' }}>{new Date(exp.timestamp || exp.date).toLocaleDateString()}</td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{ padding: '0.3rem 0.6rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem' }}>{exp.category}</span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>{exp.item}</td>
                                <td style={{ padding: '1.2rem' }}>{exp.quantity}</td>
                                <td style={{ padding: '1.2rem', fontWeight: 700, color: 'var(--secondary)' }}>${exp.cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500 }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                                <h3>Log New Expense</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Category</label>
                                    <select 
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white' }}
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <input type="text" placeholder="Item Name (e.g. Broiler Chicken)" required style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white' }} value={newItem.item} onChange={(e) => setNewItem({...newItem, item: e.target.value})} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input type="text" placeholder="Qty (e.g. 5kg)" required style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white' }} value={newItem.quantity} onChange={(e) => setNewItem({...newItem, quantity: e.target.value})} />
                                    <input type="number" placeholder="Cost $" required style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white' }} value={newItem.cost} onChange={(e) => setNewItem({...newItem, cost: e.target.value})} />
                                </div>
                                <button type="submit" className="primary-button" style={{ width: '100%', marginTop: '1rem' }}>SAVE ENTRY</button>
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
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h2>Profit & Loss Terminal</h2>
                <div className="glass-panel" style={{ display: 'flex', gap: '0.2rem', padding: '0.3rem', borderRadius: '0.8rem' }}>
                    {['day', 'week', 'month', 'year'].map(p => (
                        <button 
                          key={p} 
                          onClick={() => setPeriod(p)}
                          style={{ padding: '0.4rem 1rem', border: 'none', borderRadius: '0.6rem', background: period === p ? 'var(--primary)' : 'transparent', color: 'white', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                            {p.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '2rem' }}>Revenue vs Expenses ({period})</h3>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '0 2rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '100%', height: `${Math.min(100, (stats.revenue / (stats.revenue + stats.expenses || 1)) * 100)}%`, background: 'linear-gradient(to top, var(--primary), var(--secondary))', borderRadius: '1rem 1rem 0 0', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '-30px', left: 0, right: 0, textAlign: 'center', fontWeight: 800 }}>${stats.revenue}</div>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>REVENUE</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '100%', height: `${Math.min(100, (stats.expenses / (stats.revenue + stats.expenses || 1)) * 100)}%`, background: 'rgba(255, 255, 255, 0.1)', borderRadius: '1rem 1rem 0 0', position: 'relative', border: '1px solid var(--border-glass)' }}>
                                <div style={{ position: 'absolute', top: '-30px', left: 0, right: 0, textAlign: 'center', fontWeight: 800 }}>${stats.expenses}</div>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>EXPENSES</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3>Financial Summary</h3>
                    <div style={{ marginTop: '2.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>NET MARGIN</div>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: stats.profit >= 0 ? 'var(--accent-green)' : 'var(--secondary)' }}>
                            {stats.revenue > 0 ? ((stats.profit / stats.revenue) * 100).toFixed(1) : 0}%
                        </div>
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="flex-between">
                                <span style={{ fontSize: '0.9rem' }}>Gross Revenue</span>
                                <span style={{ fontWeight: 700 }}>${stats.revenue}</span>
                            </div>
                            <div className="flex-between">
                                <span style={{ fontSize: '0.9rem' }}>Total Cost</span>
                                <span style={{ fontWeight: 700 }}>${stats.expenses}</span>
                            </div>
                            <div className="flex-between" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '1rem', fontWeight: 800 }}>Net Profit</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: stats.profit >= 0 ? 'var(--accent-green)' : 'var(--secondary)' }}>${stats.profit}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Layout ---

export default function AdminDashboard() {
  const location = useLocation();
  const { logout } = useAppContext();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Order Hub', path: '/admin/dashboard/orders', icon: ShoppingBag },
    { label: 'Expenses', path: '/admin/dashboard/expenses', icon: DollarSign },
    { label: 'Analytics', path: '/admin/dashboard/analytics', icon: BarChart3 },
    { label: 'Kitchen (KDS)', path: '/admin/kds', icon: Utensils, isExternal: true },
    { label: 'Settings', path: '/admin/dashboard/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020617' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', borderRight: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem', paddingLeft: '1rem' }}>
          <ShoppingBag color="var(--primary)" size={32} />
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900 }}>Kebab Terminal</h2>
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
                      background: isActive ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: isActive ? '1px solid rgba(249, 115, 22, 0.2)' : '1px solid transparent'
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
        <header style={{ padding: '1.5rem 3rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.5)', backdropFilter: 'blur(10px)' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search orders, transactions, users..." 
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
               <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }} className="flex-center">YA</div>
             </div>
          </div>
        </header>

        <section style={{ padding: '3rem', flex: 1 }}>
          <Routes>
            <Route index element={<Overview />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="expenses" element={<ExpenseManagement />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="*" element={<Overview />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}
