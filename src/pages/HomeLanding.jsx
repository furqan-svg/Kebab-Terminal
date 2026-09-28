import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeLanding() {
  const navigate = useNavigate();

  return (
    <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      <motion.div 
        initial={{ opacity: 0, s: 0.9 }}
        animate={{ opacity: 1, s: 1 }}
        className="glass-panel" 
        style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', border: '1px solid rgba(255,215,0,0.1)' }}
      >
        <div className="flex-center" style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
             <UtensilsCrossed size={80} style={{ color: 'var(--primary)' }} />
             <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', top: '-10px', left: '-10px', right: '-10px', bottom: '-10px', border: '1px dashed var(--primary)', borderRadius: '50%', opacity: 0.3 }}
             />
          </div>
        </div>

        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: 900 }}>Kebab Kafe</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>Futuristic Dining. Exceptional Flavors.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <button 
            onClick={() => navigate('/auth/customer')} 
            className="primary-button" 
            style={{ padding: '1.8rem', fontSize: '1.3rem', borderRadius: '1.5rem', justifyContent: 'space-between' }}
          >
            <div className="flex-center" style={{ gap: '1rem' }}>
                <ShoppingBag size={28} />
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800 }}>Order Now</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.8 }}>Self-Service & Delivery</div>
                </div>
            </div>
            <ArrowRight size={24} />
          </button>
          
          <button 
            onClick={() => navigate('/kiosk')} 
            className="glass-button" 
            style={{ padding: '1.4rem', borderRadius: '1.5rem', justifyContent: 'center', gap: '0.8rem', borderColor: 'rgba(249, 115, 22, 0.4)', background: 'rgba(249, 115, 22, 0.08)' }}
          >
            <UtensilsCrossed size={22} color="var(--primary)" />
            <span style={{ fontWeight: 700 }}>Self-Service Kiosk Mode</span>
          </button>

          <button 
            onClick={() => navigate('/auth/admin')} 
            className="glass-button" 
            style={{ padding: '1.4rem', borderRadius: '1.5rem', justifyContent: 'center', gap: '0.8rem' }}
          >
            <ShieldCheck size={22} color="var(--primary)" />
            <span>Staff Terminal & Kitchen KDS</span>
          </button>
        </div>

        <div style={{ marginTop: '3rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.2)' }}>
          © 2026 Kebab Kafe OS • Built for speed
        </div>
      </motion.div>
    </div>
  );
}
