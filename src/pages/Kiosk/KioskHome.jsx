import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ShoppingCart, User, Search, Utensils, X, Plus, Minus, CheckCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KioskHome() {
  const { menu, addToCart, cart, updateCartQuantity, removeFromCart, activeUser, setActiveUser, subscribers } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFaceScan, setShowFaceScan] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, recognized

  const categories = ['All', ...new Set(menu.map(item => item.category))];
  const filteredMenu = selectedCategory === 'All' ? menu : menu.filter(item => item.category === selectedCategory);
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Simulated Facial Recognition Scan
  const triggerFaceScan = () => {
    setShowFaceScan(true);
    setScanStatus('scanning');
    
    setTimeout(() => {
      // Pick a random subscriber to "recognize"
      const recognizedUser = subscribers[Math.floor(Math.random() * subscribers.length)];
      setActiveUser(recognizedUser);
      setScanStatus('recognized');
      
      setTimeout(() => {
        setShowFaceScan(false);
      }, 2000);
    }, 2500);
  };

  return (
    <div className="kiosk-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* HEADER */}
      <header className="flex-between glass-panel" style={{ margin: '1rem', padding: '1rem 2rem', borderRadius: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Utensils size={32} color="var(--primary)" />
          <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.8rem' }}>Kebab Kafe</h1>
        </div>

        <div className="flex-center" style={{ gap: '1.5rem' }}>
          {activeUser ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="flex-center" 
              style={{ gap: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--accent-green)' }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-green)', color: 'white' }} className="flex-center">
                {activeUser.name[0]}
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{activeUser.name} <span style={{ color: 'var(--accent-green)', fontSize: '0.7rem' }}>VIP</span></div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{activeUser.remainingMeals} Meals LH</div>
              </div>
            </motion.div>
          ) : (
            <button onClick={triggerFaceScan} className="glass-button flex-center" style={{ gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
              <Camera size={20} color="var(--primary)" />
              <span>Face Scan Login</span>
            </button>
          )}

          <button onClick={() => setIsCartOpen(true)} className="glass-button flex-center" style={{ gap: '0.5rem', position: 'relative', background: cart.length > 0 ? 'rgba(249, 115, 22, 0.1)' : '' }}>
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', fontSize: '12px' }} className="flex-center">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* CATEGORY NAV */}
      <div className="category-nav" style={{ display: 'flex', gap: '1rem', padding: '0 1rem 1rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`glass-button ${selectedCategory === cat ? 'active' : ''}`}
            style={{ 
              whiteSpace: 'nowrap',
              background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-glass)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '0 1rem 2rem' }}>
        <div className="menu-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredMenu.map(item => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id} 
              className="glass-panel" 
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ position: 'relative' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                {activeUser?.favorites?.includes(item.id) && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(225, 29, 72, 0.8)', padding: '4px 8px', borderRadius: '1rem', fontSize: '0.7rem', color: 'white' }}>
                    Favorite
                  </div>
                )}
              </div>
              <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{item.name}</h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.2rem', color: 'var(--text-muted)' }}>{item.description}</p>
                <div className="flex-between" style={{ marginTop: 'auto' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>${item.price}</span>
                  <button 
                    onClick={() => {
                      addToCart(item);
                      setIsCartOpen(true);
                    }}
                    className="primary-button"
                    style={{ padding: '0.5rem 1rem', borderRadius: '0.8rem' }}
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* CART SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, backdropFilter: 'blur(4px)' }}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', 
                background: 'var(--bg-dark)', borderLeft: '1px solid var(--border-glass)',
                zIndex: 101, display: 'flex', flexDirection: 'column',
                boxShadow: '-10px 0 50px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)' }}>
                <h2 style={{ margin: 0 }}>Your Order</h2>
                <button onClick={() => setIsCartOpen(false)} className="glass-button" style={{ padding: '0.5rem' }}><X size={24} /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                {cart.length === 0 ? (
                  <div className="flex-center" style={{ height: '100%', flexDirection: 'column', color: 'var(--text-muted)' }}>
                    <ShoppingCart size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                    <p>Empty Cart</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map(item => (
                      <div key={item.id} className="glass-panel" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)' }}>
                        <div className="flex-between">
                          <h4 style={{ margin: 0 }}>{item.name}</h4>
                          <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex-between" style={{ marginTop: '0.8rem' }}>
                          <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}>Remove</button>
                          <div className="flex-center" style={{ gap: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '0.2rem 0.5rem' }}>
                            <button onClick={() => updateCartQuantity(item.id, -1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
                            <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, 1)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ padding: '2rem', borderTop: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Total Amount</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
                {activeUser && (
                  <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.8rem', border: '1px solid var(--accent-green)', fontSize: '0.85rem' }}>
                    <div className="flex-center" style={{ gap: '0.5rem', color: 'var(--accent-green)' }}>
                      <CheckCircle size={16} />
                      <span>VIP Discount applied automatically</span>
                    </div>
                  </div>
                )}
                <button 
                  disabled={cart.length === 0}
                  style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', opacity: cart.length === 0 ? 0.5 : 1 }}
                  className="primary-button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/kiosk/checkout');
                  }}
                >
                  Confirm & Pay
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FACE SCAN MODAL */}
      <AnimatePresence>
        {showFaceScan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
              <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto 2rem', border: '2px solid var(--primary)', borderRadius: '50%', overflow: 'hidden' }}>
                <Camera size={64} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.2 }} />
                
                {/* Scanning sweep effect */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary)', zIndex: 5 }}
                />

                {scanStatus === 'recognized' && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                  >
                    <CheckCircle size={80} color="var(--accent-green)" />
                  </motion.div>
                )}
              </div>
              
              <h2 className={scanStatus === 'recognized' ? 'text-gradient' : ''}>
                {scanStatus === 'scanning' ? 'Scanning Face...' : `Recognized: ${activeUser?.name}`}
              </h2>
              <p>{scanStatus === 'scanning' ? 'Please look at the camera for VIP access' : 'Loading your favorites...'}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
