import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db, auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only listen for orders if an admin is logged in
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
        const unsubscribeOrders = onSnapshot(q, (snapshot) => {
          const ordersData = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          })) as Order[];
          setOrders(ordersData);
          setLoading(false);
        }, (error) => {
          console.error("Firestore Listen Error:", error);
          setLoading(false);
        });

        return () => unsubscribeOrders();
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    const orderId = `NYX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'pending',
      date: new Date().toISOString(),
    };
    
    await setDoc(doc(db, 'orders', orderId), newOrder);
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
  };

  const deleteOrder = async (id: string) => {
    const docRef = doc(db, 'orders', id);
    await deleteDoc(docRef);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
