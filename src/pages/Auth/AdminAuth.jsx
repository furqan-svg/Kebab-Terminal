import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Simulate Admin Credential Check
    if (login(email, password, 'admin')) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', padding: '1rem', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '400px', padding: '3rem', borderTop: '4px solid var(--primary)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <ShieldCheck size={50} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Terminal Access</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Admin Email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white', outline: 'none' }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Security Key" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: '0.5rem', color: 'white', outline: 'none' }} 
            />
          </div>

          <button type="submit" className="primary-button" style={{ width: '100%', padding: '1.2rem', borderRadius: '0.5rem' }}>
            Access Dashboard <ChevronRight size={20} />
          </button>
        </form>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-glass)', textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            ← Back to Public Site
          </button>
        </div>
      </motion.div>
    </div>
  );
}
