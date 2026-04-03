import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (id: number, size?: string) => void;
  updateQuantity: (id: number, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load from localStorage on initialization
    try {
      const saved = localStorage.getItem('nyx_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage on changes
  useEffect(() => {
    localStorage.setItem('nyx_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((newItem: Omit<CartItem, 'quantity'>, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === newItem.id && item.size === newItem.size);
      if (existingItem) {
        return prev.map(item =>
          (item.id === newItem.id && item.size === newItem.size)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...newItem, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: number, size?: string) => {
    setItems(prev => prev.filter(item => !(item.id === id && item.size === size)));
  }, []);

  const updateQuantity = useCallback((id: number, size: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        (item.id === id && item.size === size) ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
