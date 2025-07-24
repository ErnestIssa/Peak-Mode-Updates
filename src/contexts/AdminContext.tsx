// Admin Context for React
// Provides admin configuration data throughout the application

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminConfig, defaultAdminConfig } from '@/lib/adminConfig';
import { adminService } from '@/lib/adminService';

interface AdminContextType {
  config: AdminConfig;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  updateConfig: (updates: Partial<AdminConfig>) => Promise<boolean>;
  updateContent: (section: string, data: any) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AdminConfig>(defaultAdminConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load admin configuration on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const adminConfig = await adminService.getAdminConfig();
      setConfig(adminConfig);
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
      const success = await adminService.updateAdminConfig(updates);
      if (success) {
        // Update local state
        setConfig(prev => ({ ...prev, ...updates }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update config:', err);
      return false;
    }
  };

  const updateContent = async (section: string, data: any): Promise<boolean> => {
    try {
      const success = await adminService.updateContent(section, data);
      if (success) {
        // Refresh config to get updated data
        await refreshConfig();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update content:', err);
      return false;
    }
  };

  const value: AdminContextType = {
    config,
    loading,
    error,
    refreshConfig,
    updateConfig,
    updateContent,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook to use admin context
export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Hook to access specific content sections
export const useAdminContent = (section: keyof AdminConfig['content']) => {
  const { config, updateContent } = useAdmin();
  
  const getContent = () => {
    return config.content[section];
  };

  const updateSection = async (data: any) => {
    return await updateContent(section, data);
  };

  return {
    content: getContent(),
    updateContent: updateSection,
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