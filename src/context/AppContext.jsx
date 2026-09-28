import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// --- Mock Data ---

const MOCK_MENU = [
  { id: 1, name: 'Classic Chicken Kebab', category: 'Kebabs', price: 15, prepTime: 10, isAvailable: true, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80', description: 'Juicy, flame-grilled chicken chunks marinated in our signature spice blend.' },
  { id: 2, name: 'Lamb Seekh Kebab', category: 'Kebabs', price: 18, prepTime: 12, isAvailable: true, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', description: 'Minced lamb with aromatic herbs and spices, cooked on skewers.' },
  { id: 3, name: 'Afghani Malai Tikka', category: 'Kebabs', price: 16, prepTime: 12, isAvailable: true, image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=400&q=80', description: 'Tender chicken cubes in a rich cream, cashew, and cheese marinade.' },
  { id: 4, name: 'Paneer Tikka Platter', category: 'Vegetarian', price: 12, prepTime: 8, isAvailable: true, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80', description: 'Cubes of cottage cheese, marinated in yogurt and spices, grilled to perfection.' },
  { id: 5, name: 'Spicy Peri-Peri Fries', category: 'Sides', price: 5, prepTime: 5, isAvailable: true, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=400&q=80', description: 'Crispy fries tossed in our secret spicy peri-peri masala.' },
  { id: 6, name: 'Garlic Butter Naan', category: 'Sides', price: 4, prepTime: 4, isAvailable: true, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=400&q=80', description: 'Clay oven baked bread brushed with roasted garlic and fresh butter.' },
  { id: 7, name: 'Mint Lemonade', category: 'Drinks', price: 4, prepTime: 2, isAvailable: true, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80', description: 'Refreshing cooler with fresh crushed mint and lemon.' },
  { id: 8, name: 'Royal Mango Lassi', category: 'Drinks', price: 5, prepTime: 3, isAvailable: true, image: 'https://images.unsplash.com/photo-1571006682878-a2741d428585?auto=format&fit=crop&w=400&q=80', description: 'Creamy yogurt beverage infused with Alphonso mango pulp and saffron.' }
];

const MOCK_TABLES_SEED = [
  { id: 'T-01', name: 'Table 1', capacity: 2, section: 'Main Hall', status: 'available', currentOrderId: null },
  { id: 'T-02', name: 'Table 2', capacity: 4, section: 'Main Hall', status: 'occupied', currentOrderId: 'ORD-10492', guests: 2, orderTime: '12 mins ago' },
  { id: 'T-03', name: 'Table 3', capacity: 4, section: 'Window View', status: 'available', currentOrderId: null },
  { id: 'T-04', name: 'Table 4', capacity: 6, section: 'Window View', status: 'reserved', currentOrderId: null, reservedFor: 'Dr. Malik (8:30 PM)' },
  { id: 'T-05', name: 'Table 5', capacity: 2, section: 'Outdoor Patio', status: 'available', currentOrderId: null },
  { id: 'T-06', name: 'VIP Booth', capacity: 8, section: 'VIP Lounge', status: 'available', currentOrderId: null },
];

const MOCK_EXPENSES_SEED = [
  { id: 'exp_1', timestamp: new Date().getTime(), category: 'Chicken', item: 'Fresh Broiler', quantity: '25kg', cost: 450 },
  { id: 'exp_2', timestamp: new Date().getTime(), category: 'Gas', item: 'LPG Cylinder', quantity: '2 units', cost: 120 },
  { id: 'exp_3', timestamp: new Date().getTime() - (86400000 * 1), category: 'Vegetables', item: 'Onions & Tomatoes', quantity: '15kg', cost: 85 },
  { id: 'exp_4', timestamp: new Date().getTime() - (86400000 * 2), category: 'Coal', item: 'Grade A Charcoal', quantity: '40kg', cost: 210 },
  { id: 'exp_5', timestamp: new Date().getTime() - (86400000 * 3), category: 'Masalas', item: 'Secret Spice Mix', quantity: '5kg', cost: 150 },
  { id: 'exp_6', timestamp: new Date().getTime() - (86400000 * 7), category: 'Chicken', item: 'Drumsticks', quantity: '10kg', cost: 180 },
];

const MOCK_SUBSCRIBERS = [
  { id: 'sub_1', name: 'Zaid Khan', email: 'zaid@kebab.com', remainingMeals: 14, favorites: [1, 2] },
  { id: 'sub_2', name: 'Sara Ali', email: 'sara@kebab.com', remainingMeals: 8, favorites: [3, 5] },
  { id: 'sub_3', name: 'Farhan Ahmed', email: 'farhan@kebab.com', remainingMeals: 21, favorites: [1, 4] }
];

const MOCK_SEED_ORDERS = [
  {
    id: 'ORD-10492',
    items: [
      { id: 1, name: 'Classic Chicken Kebab', price: 15, quantity: 2 },
      { id: 7, name: 'Mint Lemonade', price: 4, quantity: 2 }
    ],
    total: 38.00,
    table: 'T-02',
    mode: 'Dine-in',
    status: 'cooking',
    timestamp: Date.now() - 1000 * 60 * 12,
    paymentMethod: 'UPI',
    customer: 'Zaid Khan',
    customerEmail: 'zaid@kebab.com'
  },
  {
    id: 'ORD-10493',
    items: [
      { id: 2, name: 'Lamb Seekh Kebab', price: 18, quantity: 1 },
      { id: 5, name: 'Spicy Peri-Peri Fries', price: 5, quantity: 1 }
    ],
    total: 23.00,
    table: 'Takeaway',
    mode: 'Takeaway',
    status: 'pending',
    timestamp: Date.now() - 1000 * 60 * 4,
    paymentMethod: 'Card',
    customer: 'Sara Ali',
    customerEmail: 'sara@kebab.com'
  }
];

export const AppProvider = ({ children }) => {
  const [menu, setMenu] = useState(MOCK_MENU);
  const [tables, setTables] = useState(MOCK_TABLES_SEED);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(MOCK_SEED_ORDERS); 
  const [expenses, setExpenses] = useState(MOCK_EXPENSES_SEED);
  const [subscribers] = useState(MOCK_SUBSCRIBERS);
  const [user, setUser] = useState(null); // { name, email, role: 'customer' | 'admin' }
  const [activeUser, setActiveUser] = useState(null); // Retained for Facial Recognition mock

  // --- Authentication ---
  const login = (email, password, role) => {
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

  // --- Menu CRUD Management ---
  const addMenuItem = (item) => {
    const newId = menu.length > 0 ? Math.max(...menu.map(m => m.id)) + 1 : 1;
    const newItem = {
      ...item,
      id: newId,
      price: parseFloat(item.price) || 0,
      prepTime: parseInt(item.prepTime) || 10,
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      image: item.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80'
    };
    setMenu(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateMenuItem = (id, updatedFields) => {
    setMenu(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const deleteMenuItem = (id) => {
    setMenu(prev => prev.filter(item => item.id !== id));
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleItemAvailability = (id) => {
    setMenu(prev => prev.map(item => item.id === id ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  // --- Table Management ---
  const updateTableStatus = (tableId, newStatus, extraData = {}) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: newStatus, ...extraData } : t));
  };

  // --- Expenses ---
  const addExpense = (newExp) => {
    setExpenses(prev => [{ ...newExp, id: `exp_${Date.now()}` }, ...prev]);
  };

  // --- Orders ---
  const placeOrder = (paymentMethod, tableNumber, mode = 'Dine-in') => {
    if (cart.length === 0) return;
    
    const orderPrepTime = Math.max(...cart.map(item => item.prepTime || 10)) + 2;
    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;

    const newOrder = {
      id: orderId,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      table: tableNumber || 'Counter',
      mode,
      status: 'pending',
      timestamp: new Date().getTime(),
      estimatedPrepTime: orderPrepTime * 60 * 1000, 
      paymentMethod,
      customer: user ? user.name : (activeUser ? activeUser.name : 'Guest'),
      customerEmail: user ? user.email : (activeUser ? activeUser.email : null),
      isVIP: activeUser !== null
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Auto-update table status if Dine-in
    if (mode === 'Dine-in' && tableNumber && tableNumber !== 'Counter' && tableNumber !== 'Takeaway') {
      updateTableStatus(tableNumber, 'occupied', { currentOrderId: orderId, orderTime: 'Just now' });
    }

    setCart([]); 
    return orderId;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      const targetOrder = updated.find(o => o.id === orderId);
      
      // If completed or rejected, free the table if it was assigned
      if (targetOrder && (newStatus === 'completed' || newStatus === 'rejected') && targetOrder.table) {
        setTables(tbls => tbls.map(t => t.id === targetOrder.table ? { ...t, status: 'available', currentOrderId: null, guests: null, orderTime: null } : t));
      }

      return updated;
    });

    if (newStatus === 'pending') {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
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
      menu, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability,
      tables, updateTableStatus,
      cart, addToCart, removeFromCart, updateCartQuantity, placeOrder,
      orders, updateOrderStatus,
      expenses, addExpense,
      subscribers,
      activeUser, setActiveUser
    }}>
      {children}
    </AppContext.Provider>
  );
};
