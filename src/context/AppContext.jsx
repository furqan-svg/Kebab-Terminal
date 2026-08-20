import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// --- Mock Data ---

const MOCK_MENU = [
  { id: 1, name: 'Classic Chicken Kebab', category: 'Kebabs', price: 15, prepTime: 10, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80', description: 'Juicy, flame-grilled chicken chunks marinated in our signature spice blend.' },
  { id: 2, name: 'Lamb Seekh Kebab', category: 'Kebabs', price: 18, prepTime: 12, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', description: 'Minced lamb with aromatic herbs and spices, cooked on skewers.' },
  { id: 3, name: 'Paneer Tikka', category: 'Vegetarian', price: 12, prepTime: 8, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80', description: 'Cubes of cottage cheese, marinated in yogurt and spices, grilled to perfection.' },
  { id: 4, name: 'Spicy Fries', category: 'Sides', price: 5, prepTime: 5, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80', description: 'Crispy fries tossed in our secret spicy masala.' },
  { id: 5, name: 'Mint Lemonade', category: 'Drinks', price: 4, prepTime: 2, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', description: 'Refreshing cooler with fresh mint and lemon.' }
];

const MOCK_EXPENSES_SEED = [
  { id: 'exp_1', timestamp: new Date().getTime(), category: 'Chicken', item: 'Fresh Broiler', quantity: '25kg', cost: 450 },
  { id: 'exp_2', timestamp: new Date().getTime(), category: 'Gas', item: 'LPG Cylinder', quantity: '2 units', cost: 120 },
  { id: 'exp_3', timestamp: new Date().getTime() - (86400000 * 1), category: 'Vegetables', item: 'Onions & Tomatoes', quantity: '15kg', cost: 85 },
  { id: 'exp_4', timestamp: new Date().getTime() - (86400000 * 2), category: 'Coal', item: 'Grade A Charcoal', quantity: '40kg', cost: 210 },
  { id: 'exp_5', timestamp: new Date().getTime() - (86400000 * 3), category: 'Masalas', item: 'Secret Spice Mix', quantity: '5kg', cost: 150 },
  { id: 'exp_6', timestamp: new Date().getTime() - (86400000 * 7), category: 'Chicken', item: 'Drumsticks', quantity: '10kg', cost: 180 },
];

export const AppProvider = ({ children }) => {
  const [menu] = useState(MOCK_MENU);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [expenses, setExpenses] = useState(MOCK_EXPENSES_SEED);
  const [user, setUser] = useState(null); // { name, email, role: 'customer' | 'admin' }
  const [activeUser, setActiveUser] = useState(null); // Retained for Facial Recognition mock

  // --- Authentication ---
  const login = (email, password, role) => {
    // Simulated auth
    const name = role === 'admin' ? 'Admin Master' : email.split('@')[0];
    const userData = { email, name, role };
    setUser(userData);
    if (role === 'customer') setActiveUser(userData);
    return true;
  };

  const signup = (name, email, password) => {
    const userData = { name, email, role: 'customer' };
    setUser(userData);
    setActiveUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
    setActiveUser(null);
  };

  // --- Expenses ---
  const addExpense = (newExp) => {
    setExpenses(prev => [{ ...newExp, id: `exp_${Date.now()}` }, ...prev]);
  };

  // --- Orders ---
  const placeOrder = (paymentMethod, tableNumber, mode = 'Dine-in') => {
    if (cart.length === 0) return;
    
    const orderPrepTime = Math.max(...cart.map(item => item.prepTime)) + 2;

    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      table: tableNumber || 'T-X',
      mode,
      status: 'pending', // pending -> accepted -> preparing -> cooking -> ready -> out_for_delivery -> completed
      timestamp: new Date().getTime(),
      estimatedPrepTime: orderPrepTime * 60 * 1000, 
      paymentMethod,
      customer: user ? user.name : 'Guest',
      customerEmail: user ? user.email : null,
      isVIP: activeUser !== null
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]); 
    return newOrder.id;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    // Simulated Sound Trigger would go here
    if (newStatus === 'pending') {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {}); // Browsers might block auto-play
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQ = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQ };
      }
      return i;
    }));
  };

  return (
    <AppContext.Provider value={{
      user, login, signup, logout,
      menu, cart, addToCart, removeFromCart, updateCartQuantity, placeOrder,
      orders, updateOrderStatus,
      expenses, addExpense,
      activeUser, setActiveUser
    }}>
      {children}
    </AppContext.Provider>
  );
};
