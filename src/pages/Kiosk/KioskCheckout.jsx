import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, CreditCard, QrCode, Wallet, CheckCircle2, Receipt, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KioskCheckout() {
  const navigate = useNavigate();
  const { cart, placeOrder, activeUser } = useAppContext();
  const [step, setStep] = useState('review'); // review -> payment -> processing -> success
  const [paymentMethod, setPaymentMethod] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [orderToken, setOrderToken] = useState('');

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setStep('processing');
    setTimeout(() => {
      const token = placeOrder(paymentMethod, tableNumber || 'T-10');
      setOrderToken(token);
      setStep('success');
    }, 3000);
  };

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>Your cart is empty</h2>
        <button onClick={() => navigate('/kiosk')} className="primary-button">Back to Menu</button>
      </div>
    );
  }

  return (
    <div className="checkout-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/kiosk')} className="glass-button flex-center" style={{ gap: '0.5rem' }}>
          <ArrowLeft size={20} /> Back
        </button>
        <h2 className="text-gradient">Checkout</h2>
        <div style={{ width: '80px' }}></div>
      </header>

      <AnimatePresence mode="wait">
        {step === 'review' && (
          <motion.div 
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel"
            style={{ padding: '2rem' }}
          >
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Receipt size={24} color="var(--primary)" /> Order Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {cart.map(item => (
                <div key={item.id} className="flex-between" style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.name}
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex-between" style={{ marginTop: '1rem', fontSize: '1.4rem', fontWeight: 800 }}>
                <span>Total</span>
                <span className="text-gradient">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={24} color="var(--accent-green)" /> Table Assignment
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'Takeaway'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTableNumber(t)}
                  className={`glass-button ${tableNumber === t ? 'active' : ''}`}
                  style={{ background: tableNumber === t ? 'var(--primary)' : '', borderColor: tableNumber === t ? 'var(--primary)' : '' }}
                >
                  {t}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setStep('payment')} 
              className="primary-button" 
              style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem' }}
              disabled={!tableNumber}
            >
              Continue to Payment
            </button>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div 
            key="payment"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-panel"
            style={{ padding: '2rem' }}
          >
            <h3 style={{ marginBottom: '2rem' }}>Choose Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => setPaymentMethod('UPI')}
                className={`glass-button flex-between ${paymentMethod === 'UPI' ? 'active' : ''}`}
                style={{ padding: '1.5rem', background: paymentMethod === 'UPI' ? 'rgba(249, 115, 22, 0.1)' : '' }}
              >
                <div className="flex-center" style={{ gap: '1rem' }}>
                  <QrCode size={32} color="var(--primary)" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>UPI QR Scan</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GPay, PhonePe, Paytm</div>
                  </div>
                </div>
                {paymentMethod === 'UPI' && <CheckCircle2 color="var(--primary)" />}
              </button>

              <button 
                onClick={() => setPaymentMethod('Card')}
                className={`glass-button flex-between ${paymentMethod === 'Card' ? 'active' : ''}`}
                style={{ padding: '1.5rem', background: paymentMethod === 'Card' ? 'rgba(249, 115, 22, 0.1)' : '' }}
              >
                <div className="flex-center" style={{ gap: '1rem' }}>
                  <CreditCard size={32} color="var(--primary)" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>Card (Tap / Swipe)</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visa, Mastercard, RuPay</div>
                  </div>
                </div>
                {paymentMethod === 'Card' && <CheckCircle2 color="var(--primary)" />}
              </button>

              <button 
                onClick={() => setPaymentMethod('Wallet')}
                className={`glass-button flex-between ${paymentMethod === 'Wallet' ? 'active' : ''}`}
                style={{ padding: '1.5rem', background: paymentMethod === 'Wallet' ? 'rgba(249, 115, 22, 0.1)' : '' }}
              >
                <div className="flex-center" style={{ gap: '1rem' }}>
                  <Wallet size={32} color="var(--primary)" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600 }}>Kebab Wallet</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeUser ? `Balance: Full` : 'Login to use wallet'}</div>
                  </div>
                </div>
                {paymentMethod === 'Wallet' && <CheckCircle2 color="var(--primary)" />}
              </button>
            </div>

            <button 
              onClick={handleCheckout} 
              className="primary-button" 
              style={{ width: '100%', marginTop: '3rem', padding: '1.5rem', fontSize: '1.2rem' }}
              disabled={!paymentMethod}
            >
              Pay ${cartTotal.toFixed(2)}
            </button>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-center"
            style={{ minHeight: '400px', flexDirection: 'column', gap: '2rem' }}
          >
            <div style={{ position: 'relative' }}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={80} color="var(--primary)" />
              </motion.div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3>Processing Payment</h3>
              <p>Please do not close this screen...</p>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel"
            style={{ padding: '4rem 2rem', textAlign: 'center' }}
          >
            <CheckCircle2 size={80} color="var(--accent-green)" style={{ marginBottom: '1.5rem' }} />
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Order Confirmed!</h1>
            <p style={{ marginBottom: '2rem' }}>Thank you for your order. Your kitchen token is:</p>
            
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1rem', border: '1px dashed var(--border-glass)', marginBottom: '3rem' }}>
              <span style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '4px' }}>{orderToken}</span>
              <div style={{ marginTop: '1rem', color: 'var(--primary)', fontWeight: 600 }}>Collect your receipt below</div>
            </div>

            <button onClick={() => navigate('/')} className="primary-button" style={{ width: '100%' }}>Finish</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
