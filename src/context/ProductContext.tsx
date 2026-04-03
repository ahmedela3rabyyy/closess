import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Product, products as initialProducts } from '../data/products';
import { db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  getDocs,
  writeBatch,
  runTransaction
} from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProductById: (id: number) => Product | undefined;
  decrementStock: (id: number, size: string, quantity: number) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SEEDING LOGIC: Seed initial products if collection is empty
    const seedData = async () => {
      const q = query(collection(db, 'products'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log("NYX CLOUD: Seeding Initial Ecosystem Assets...");
        const batch = writeBatch(db);
        initialProducts.forEach((p) => {
          const docRef = doc(collection(db, 'products'), p.id.toString());
          batch.set(docRef, p);
        });
        await batch.commit();
      }
    };

    seedData().catch(console.error);

    // REAL-TIME LISTENER
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: parseInt(doc.id)
      })) as Product[];
      setProducts(productsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    await addDoc(collection(db, 'products'), { ...product, id: newId });
  };

  const updateProduct = async (id: number, updatedFields: Partial<Product>) => {
    const docRef = doc(db, 'products', id.toString());
    await updateDoc(docRef, updatedFields);
  };

  const deleteProduct = async (id: number) => {
    const docRef = doc(db, 'products', id.toString());
    await deleteDoc(docRef);
  };

  const getProductById = (id: number) => {
    return products.find(p => p.id === id);
  };

  const decrementStock = async (id: number, size: string, quantity: number) => {
    const docRef = doc(db, 'products', id.toString());
    
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef);
        if (!sfDoc.exists()) throw new Error("Document does not exist!");

        const productData = sfDoc.data() as Product;
        const currentSizeStock = productData.sizeStock[size] || 0;
        const newSizeStock = {
          ...productData.sizeStock,
          [size]: Math.max(0, currentSizeStock - quantity)
        };
        
        const totalRemaining = Object.values(newSizeStock).reduce((a, b) => a + (b as number), 0);
        
        transaction.update(docRef, {
          sizeStock: newSizeStock,
          soldOut: totalRemaining <= 0
        });
      });
    } catch (e) {
      console.error("NYX CRITICAL: Stock Transaction Failure", e);
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      getProductById,
      decrementStock,
      loading
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
