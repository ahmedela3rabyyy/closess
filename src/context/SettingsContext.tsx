import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { db } from '../lib/firebase';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc
} from 'firebase/firestore';

interface Settings {
  whatsappNumber: string;
  currency: string;
  storeName: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
  email: string;
  phone: string;
  address: string;
  adminPasscode: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  seoTitle: string;
  seoDescription: string;
  shippingThreshold: number;
  shippingCairo: number;
  shippingOutside: number;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  loading: boolean;
}

const defaultSettings: Settings = {
  whatsappNumber: '+201017326264',
  currency: 'EGP',
  storeName: 'NYX Studio',
  instagram: 'https://instagram.com/nyx',
  facebook: 'https://facebook.com/nyx',
  twitter: 'https://twitter.com/nyx',
  youtube: '',
  email: 'support@nyx.com',
  phone: '+20 101 732 6264',
  address: '123 Fashion Avenue, New York, NY 10001',
  adminPasscode: '1234',
  maintenanceMode: false,
  maintenanceMessage: 'We are currently upgrading our systems. Please check back shortly.',
  seoTitle: 'NYX | Architectural Minimalist Fashion',
  seoDescription: 'Premium knitwear designed for comfort and midnight luxury.',
  shippingThreshold: 2000,
  shippingCairo: 0,
  shippingOutside: 60
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'global');
    
    // SEEDING & LISTENING
    const initializeSettings = async () => {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.log("NYX CLOUD: Initializing Global Framework...");
        await setDoc(docRef, defaultSettings);
      }
    };

    initializeSettings().catch(console.error);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudSettings = docSnap.data() as Settings;
        setSettings(cloudSettings);
        
        // Apply SEO dynamic update
        document.title = cloudSettings.seoTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', cloudSettings.seoDescription);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const docRef = doc(db, 'settings', 'global');
    await setDoc(docRef, newSettings, { merge: true });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
