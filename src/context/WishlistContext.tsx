import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface WishlistItem {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  price: number;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const addToWishlist = useCallback((newItem: WishlistItem) => {
    setItems(prev => {
      if (prev.find(item => item.id === newItem.id)) {
        return prev;
      }
      return [...prev, newItem];
    });
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const isInWishlist = useCallback((id: number) => {
    return items.some(item => item.id === id);
  }, [items]);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
