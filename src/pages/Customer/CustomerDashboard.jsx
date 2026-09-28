import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  History, 
  Package, 
  User, 
  Search, 
  Plus, 
  Minus, 
  X, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight,
  LogOut,
  Utensils
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const { menu, cart, addToCart, removeFromCart, updateCartQuantity, placeOrder, orders, user, logout } = useAppContext();
  const [activeTab, setActiveTab] = useState('menu'); // menu, track, history
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderMode, setOrderMode] = useState('Dine-in');
  const [showPaymentMock, setShowPaymentMock] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success
  const navigate = useNavigate();

  const categories = ['All', ...new Set(menu.map(item => item.category))];
  const filteredMenu = menu.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = searchQuery 
      ? (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCat && matchesSearch;
  });
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const myOrders = orders.filter(o => o.customerEmail === user?.email);
  const activeOrder = myOrders.find(o => o.status !== 'completed');

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          addToCart(item);
        }
      });
      setIsCartOpen(true);
      setActiveTab('menu');
    }
  };

  const handlePlaceOrder = () => {
    setShowPaymentMock(true);
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        placeOrder('UPI', 'T-Mobile', orderMode);
        setShowPaymentMock(false);
        setPaymentStatus('idle');
        setIsCartOpen(false);
        setActiveTab('track');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="customer-portal" style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '80px' }}>
      {/* TOP NAV */}
      <header style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-glass)' }}>
        <div className="flex-between">
          <div>
            <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>Welcome, {user?.name.split(' ')[0]}</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>What's on your mind today?</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}><LogOut size={20} /></button>
        </div>
      </header>

      {/* CONTENT BASED ON TAB */}
      <main style={{ padding: '1rem' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'menu' && (
            <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* MODE SELECTION */}
              <div className="glass-panel" style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                {['Dine-in', 'Takeaway', 'Delivery'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setOrderMode(m)}
                    style={{ flex: 1, padding: '0.6rem', border: 'none', borderRadius: '0.6rem', background: orderMode === m ? 'var(--primary)' : 'transparent', color: 'white', fontWeight: 600, fontSize: '0.8rem', transition: '0.3s' }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* SEARCH & FILTERS */}
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search delicious kebabs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '1rem', color: 'white', outline: 'none' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`glass-button ${selectedCategory === cat ? 'active' : ''}`}
                    style={{ whiteSpace: 'nowrap', padding: '0.5rem 1.2rem', background: selectedCategory === cat ? 'var(--primary)' : '' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* MENU GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {filteredMenu.map(item => (
                  <div key={item.id} className="glass-panel" style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '1.2rem' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', borderRadius: '1rem', objectFit: 'cover' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: '0 0 0.4rem 0' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'auto' }}>{item.description.substring(0, 50)}...</p>
                      <div className="flex-between">
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>${item.price}</span>
                        <button onClick={() => addToCart(item)} className="primary-button" style={{ padding: '0.4rem 1rem', borderRadius: '0.8rem', fontSize: '0.8rem' }}><Plus size={16} /> Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'track' && (
            <motion.div key="track" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {!activeOrder ? (
                <div className="flex-center" style={{ height: '60vh', flexDirection: 'column', textAlign: 'center' }}>
                  <Package size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <h3>No active orders</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Hungry? Place an order to see it here!</p>
                  <button onClick={() => setActiveTab('menu')} className="primary-button" style={{ marginTop: '1rem' }}>Browse Menu</button>
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                  <div className="flex-between" style={{ marginBottom: '2rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bill Number</div>
                      <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>{activeOrder.id}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Purchase</div>
                      <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>${activeOrder.total.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', marginBottom: '2rem', borderRadius: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>ORDER SUMMARY</div>
                    {activeOrder.items.map((item, idx) => (
                      <div key={idx} className="flex-between" style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex-center" style={{ gap: '0.5rem', background: 'rgba(249, 115, 22, 0.1)', padding: '0.75rem 1rem', borderRadius: '1rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '2rem' }}>
                    <Clock size={16} /> Est. {activeOrder.status === 'pending' ? '25' : '15'} mins remaining
                  </div>

                  {/* STEP TRACKER */}
                  <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                    {[
                      { label: 'Pending', status: 'pending', color: 'var(--text-muted)' },
                      { label: 'Accepted', status: 'accepted', color: 'var(--primary)' },
                      { label: 'Cooking', status: 'cooking', color: 'var(--primary)' },
                      { label: 'Ready / Delivery', status: 'ready', color: 'var(--accent-green)' },
                      { label: 'Completed', status: 'completed', color: 'var(--accent-green)' }
                    ].map((step, idx) => {
                      const isActive = activeOrder.status === step.status;
                      const isPast = ['pending', 'accepted', 'cooking', 'ready', 'completed'].indexOf(activeOrder.status) >= idx;
                      return (
                        <div key={idx} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div style={{ 
                            width: '16px', height: '16px', borderRadius: '50%', 
                            background: isPast ? step.color : 'rgba(255,255,255,0.1)', 
                            border: isActive ? '4px solid rgba(255,255,255,0.3)' : 'none',
                            zIndex: 2, position: 'relative', left: '-2.4rem'
                          }}></div>
                          <div style={{ opacity: isPast ? 1 : 0.4 }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{step.label}</div>
                            {isActive && <div style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>Currently in this stage</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Previous Orders</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myOrders.filter(o => o.status === 'completed').map(o => (
                  <div key={o.id} className="glass-panel" style={{ padding: '1.2rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                      <span style={{ fontWeight: 800 }}>{o.id}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      {o.items.map((item, i) => (
                        <div key={i} style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.quantity}x {item.name}</div>
                      ))}
                    </div>
                    <div className="flex-between">
                      <span style={{ fontWeight: 700 }}>${(Number(o.total) || 0).toFixed(2)}</span>
                      <button onClick={() => handleReorder(o)} className="glass-button" style={{ color: 'var(--primary)', borderColor: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}>Reorder</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* BOTTOM NAV */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 }}>
        <button onClick={() => setActiveTab('menu')} style={{ background: 'transparent', border: 'none', color: activeTab === 'menu' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
          <ShoppingBag size={24} />
          <span style={{ fontSize: '0.7rem' }}>Menu</span>
        </button>
        <button onClick={() => setActiveTab('track')} style={{ background: 'transparent', border: 'none', color: activeTab === 'track' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
          <Clock size={24} />
          <span style={{ fontSize: '0.7rem' }}>Tracking</span>
        </button>
        <button onClick={() => setActiveTab('history')} style={{ background: 'transparent', border: 'none', color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
          <History size={24} />
          <span style={{ fontSize: '0.7rem' }}>History</span>
        </button>
      </nav>

      {/* FLOATING CART BUTTON */}
      {cart.length > 0 && activeTab === 'menu' && (
        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="primary-button" 
          style={{ position: 'fixed', bottom: '90px', right: '1.5rem', padding: '1rem 1.5rem', borderRadius: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 101 }}
        >
          <ShoppingBag size={20} /> View Cart ({cart.length}) • ${cartTotal.toFixed(2)}
        </motion.button>
      )}

      {/* CART OVERLAY */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200 }} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg-dark)', borderTop: '1px solid var(--border-glass)', borderRadius: '2rem 2rem 0 0', padding: '2rem', zIndex: 201, maxHeight: '80vh', overflowY: 'auto' }}>
              <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3>Review Items</h3>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}><X size={24} /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {cart.map(item => (
                  <div key={item.id} className="flex-between">
                    <div>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${item.price} each</div>
                    </div>
                    <div className="flex-center" style={{ gap: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.8rem', padding: '0.4rem 0.8rem' }}>
                        <button onClick={() => updateCartQuantity(item.id, -1)} style={{ background: 'transparent', border: 'none', color: 'white' }}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, 1)} style={{ background: 'transparent', border: 'none', color: 'white' }}><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Total Amount</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={handlePlaceOrder} className="primary-button" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}>Place Order</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentMock && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 300, flexDirection: 'column', gap: '2rem' }}>
            {paymentStatus === 'processing' ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '60px', height: '60px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%' }} />
                <h3>Processing Payment...</h3>
              </>
            ) : (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={80} color="var(--accent-green)" /></motion.div>
                <h3>Payment Successful!</h3>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
