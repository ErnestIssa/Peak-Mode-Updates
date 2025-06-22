import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../services/api';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types matching the admin settings
interface BusinessInfo {
  storeName: string;
  businessAddress: string;
  contactEmail: string;
  phoneNumber: string;
  logo: string;
  favicon: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    twitter: string;
  };
}

interface WebsiteConfig {
  homepageLayout: 'hero' | 'grid' | 'minimal';
  heroSection: {
    title: string;
    subtitle: string;
    image: string;
  };
  announcementBar: {
    enabled: boolean;
    message: string;
  };
  maintenanceMode: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  position: 'top' | 'middle' | 'bottom';
}

interface Announcement {
  id: string;
  message: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

interface SiteConfig {
  businessInfo: BusinessInfo;
  websiteConfig: WebsiteConfig;
  banners: Banner[];
  announcements: Announcement[];
  isLoading: boolean;
}

interface SiteConfigContextType extends SiteConfig {
  refreshConfig: () => Promise<void>;
}

const defaultBusinessInfo: BusinessInfo = {
  storeName: 'Peak Mode',
  businessAddress: '123 Business Street, Stockholm, Sweden',
  contactEmail: 'contact@peakmode.com',
  phoneNumber: '+46 123 456 789',
  logo: '',
  favicon: '',
  socialMedia: {
    facebook: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    twitter: ''
  }
};

const defaultWebsiteConfig: WebsiteConfig = {
  homepageLayout: 'hero',
  heroSection: {
    title: 'Welcome to Peak Mode',
    subtitle: 'Discover Premium Athletic Wear',
    image: ''
  },
  announcementBar: {
    enabled: false,
    message: ''
  },
  maintenanceMode: false,
  seo: {
    title: 'Peak Mode - Premium Athletic Wear',
    description: 'Discover premium athletic wear designed for performance and style.',
    keywords: 'athletic wear, sportswear, fitness, premium clothing'
  }
};

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

interface SiteConfigProviderProps {
  children: ReactNode;
}

export const SiteConfigProvider: React.FC<SiteConfigProviderProps> = ({ children }) => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(defaultBusinessInfo);
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>(defaultWebsiteConfig);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSiteConfig = async () => {
    try {
      setIsLoading(true);
      
      // Fetch settings from backend using the API service
      const [settingsResponse, marketingResponse] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/settings/public`),
        fetch(`${API_BASE_URL}/marketing/public`)
      ]);

      // Handle settings
      if (settingsResponse.status === 'fulfilled' && settingsResponse.value.ok) {
        const settingsData = await settingsResponse.value.json();
        if (settingsData.success) {
          setBusinessInfo(settingsData.businessInfo || defaultBusinessInfo);
          setWebsiteConfig(settingsData.websiteConfig || defaultWebsiteConfig);
        }
      }

      // Handle marketing data
      if (marketingResponse.status === 'fulfilled' && marketingResponse.value.ok) {
        const marketingData = await marketingResponse.value.json();
        if (marketingData.success) {
          setBanners(marketingData.banners?.filter((b: Banner) => b.isActive) || []);
          setAnnouncements(marketingData.announcements?.filter((a: Announcement) => a.isActive) || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch site configuration:', error);
      // Use defaults on error
    } finally {
      setIsLoading(false);
    }
  };

  const refreshConfig = async () => {
    await fetchSiteConfig();
  };

  useEffect(() => {
    fetchSiteConfig();
  }, []);

  const value: SiteConfigContextType = {
    businessInfo,
    websiteConfig,
    banners,
    announcements,
    isLoading,
    refreshConfig
  };

  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = (): SiteConfigContextType => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};

export default SiteConfigContext; 