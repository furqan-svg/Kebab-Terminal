import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Clock, CheckCircle, AlertTriangle, Play, CheckCircle2, Flame, IceCream, Utensils, TrendingUp, XCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderCard = ({ order, onUpdateStatus }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(Math.floor((new Date().getTime() - order.timestamp) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [order.timestamp]);

  const getStatusColor = () => {
    switch(order.status) {
      case 'pending': return '#ef4444';
      case 'accepted': return '#f59e0b';
      case 'preparing': return '#3b82f6';
      case 'cooking': return '#8b5cf6';
      case 'ready': return '#10b981';
      default: return 'var(--text-muted)';
    }
  };

  const statusFlow = ['pending', 'accepted', 'preparing', 'cooking', 'ready', 'completed'];
  const nextStatus = statusFlow[statusFlow.indexOf(order.status) + 1];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel"
      style={{ borderLeft: `6px solid ${getStatusColor()}`, overflow: 'hidden' }}
    >
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <h4 style={{ margin: 0 }}>{order.id}</h4>
            <span style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{order.mode}</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{order.customer} • {order.table}</span>
        </div>
        <div className="flex-center" style={{ gap: '0.4rem', color: getStatusColor(), fontWeight: 700 }}>
          <Clock size={16} />
          <span>{Math.floor(secondsElapsed / 60)}m {secondsElapsed % 60}s</span>
        </div>
      </div>
      
      <div style={{ padding: '1.2rem' }}>
        <ul style={{ listStyle: 'none', marginBottom: '1.5rem', padding: 0 }}>
          {order.items.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
              <div style={{ width: '24px', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', textAlign: 'center', lineHeight: '24px', fontSize: '0.8rem' }}>{item.quantity}</div>
              <span style={{ fontWeight: 600 }}>{item.name}</span>
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {order.status === 'pending' ? (
            <>
              <button 
                onClick={() => onUpdateStatus(order.id, 'accepted')}
                className="primary-button" 
                style={{ flex: 2, padding: '0.6rem', fontSize: '0.8rem', background: 'var(--accent-green)' }}
              >
                ACCEPT
              </button>
              <button 
                onClick={() => onUpdateStatus(order.id, 'rejected')}
                style={{ flex: 1, padding: '0.6rem', borderRadius: '0.8rem', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
              >
                <XCircle size={18} />
              </button>
            </>
          ) : (
            nextStatus && (
              <button 
                onClick={() => onUpdateStatus(order.id, nextStatus)}
                className="primary-button" 
                style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem' }}
              >
                MOVE TO {nextStatus.toUpperCase()} <ChevronRight size={16} />
              </button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function KDSDashboard() {
  const { orders, updateOrderStatus } = useAppContext();
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'rejected');

  return (
    <div className="kds-layout" style={{ display: 'flex', height: '100vh', background: '#020617' }}>
      {/* Sidebar Stats */}
      <aside style={{ width: '280px', borderRight: '1px solid var(--border-glass)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="flex-center" style={{ gap: '1rem', justifyContent: 'flex-start' }}>
            <Flame color="var(--primary)" size={32} />
            <h2 style={{ margin: 0 }}>Kitchen OS</h2>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ACTIVE ORDERS</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{activeOrders.length}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AVG COOK TIME</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>14m</div>
        </div>

        <div style={{ marginTop: 'auto' }}>
            <div className="flex-center" style={{ gap: '0.5rem', color: 'var(--accent-green)', justifyContent: 'flex-start', fontSize: '0.8rem' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--accent-green)', borderRadius: '50%' }}></div>
                KITCHEN CONNECTED
            </div>
        </div>
      </aside>

      {/* Main Grid */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', alignContent: 'start' }}>
          <AnimatePresence>
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
