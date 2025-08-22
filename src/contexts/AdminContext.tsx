// Admin Context for React
// Provides admin configuration data throughout the application

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminConfig, defaultAdminConfig } from '@/lib/adminConfig';

interface AdminContextType {
  config: AdminConfig;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  updateConfig: (updates: Partial<AdminConfig>) => Promise<boolean>;
  updateContent: (section: string, data: any) => Promise<boolean>;
  content: any; // For backward compatibility
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AdminConfig>(defaultAdminConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For local development, we'll use the default config
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For local development, use default config
      setConfig(defaultAdminConfig);
    } catch (err) {
      console.error('Failed to load admin config:', err);
      setError('Failed to load site configuration');
      // Fallback to default config
      setConfig(defaultAdminConfig);
    } finally {
      setLoading(false);
    }
  };

  const refreshConfig = async () => {
    await loadConfig();
  };

  const updateConfig = async (updates: Partial<AdminConfig>): Promise<boolean> => {
    try {
      // For local development, just update local state
      setConfig(prev => ({ ...prev, ...updates }));
      
      // Save to localStorage for persistence
      localStorage.setItem('adminConfig', JSON.stringify({ ...config, ...updates }));
      
      return true;
    } catch (err) {
      console.error('Failed to update config:', err);
      return false;
    }
  };

  const updateContent = async (section: string, data: any): Promise<boolean> => {
    try {
      // For local development, update the content section
      const updatedConfig = { ...config };
      
      if (section === 'newsletter') {
        updatedConfig.content.newsletter = { ...updatedConfig.content.newsletter, ...data };
      } else if (section === 'hero') {
        updatedConfig.content.hero = { ...updatedConfig.content.hero, ...data };
      } else if (section === 'about') {
        updatedConfig.content.about = { ...updatedConfig.content.about, ...data };
      }
      
      setConfig(updatedConfig);
      
      // Save to localStorage
      localStorage.setItem('adminConfig', JSON.stringify(updatedConfig));
      
      return true;
    } catch (err) {
      console.error('Failed to update content:', err);
      return false;
    }
  };

  // For backward compatibility with existing components
  const content = {
    newsletter: config.content.newsletter,
    hero: config.content.hero,
    about: config.content.about
  };

  const value: AdminContextType = {
    config,
    loading,
    error,
    refreshConfig,
    updateConfig,
    updateContent,
    content
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook to use admin context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Hook for backward compatibility
export const useAdminContent = (section: string) => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContent must be used within an AdminProvider');
  }
  
  return {
    content: context.content[section as keyof typeof context.content] || {},
    updateContent: (data: any) => context.updateContent(section, data)
  };
};

// Hook to access site settings
export const useSiteSettings = () => {
  const { config, updateConfig } = useAdmin();
  
  const updateSettings = async (settings: Partial<AdminConfig['siteSettings']>) => {
    return await updateConfig({ siteSettings: { ...config.siteSettings, ...settings } });
  };

  return {
    settings: config.siteSettings,
    updateSettings,
  };
};

// Hook to access product settings
export const useProductSettings = () => {
  const { config, updateConfig } = useAdmin();
  
  const updateProductSettings = async (settings: Partial<AdminConfig['products']>) => {
    return await updateConfig({ products: { ...config.products, ...settings } });
  };

  return {
    productSettings: config.products,
    updateProductSettings,
  };
};

// Hook to access marketing settings
export const useMarketingSettings = () => {
  const { config, updateConfig } = useAdmin();
  
  const updateMarketingSettings = async (settings: Partial<AdminConfig['marketing']>) => {
    return await updateConfig({ marketing: { ...config.marketing, ...settings } });
  };

  return {
    marketingSettings: config.marketing,
    updateMarketingSettings,
  };
};

// Hook to access user experience settings
export const useUserExperienceSettings = () => {
  const { config, updateConfig } = useAdmin();
  
  const updateUserExperienceSettings = async (settings: Partial<AdminConfig['userExperience']>) => {
    return await updateConfig({ userExperience: { ...config.userExperience, ...settings } });
  };

  return {
    userExperienceSettings: config.userExperience,
    updateUserExperienceSettings,
  };
}; 