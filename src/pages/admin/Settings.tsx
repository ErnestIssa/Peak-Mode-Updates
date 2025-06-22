import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Settings as SettingsIcon,
  Building2,
  Mail,
  Truck,
  CreditCard,
  Users,
  Globe,
  Link,
  Download,
  Upload,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  Shield,
  Database,
  Palette,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';

// Types
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

interface EmailSettings {
  adminEmail: string;
  notifications: {
    orders: boolean;
    contactForm: boolean;
    subscribers: boolean;
    sounds: boolean;
    popups: boolean;
  };
  templates: {
    orderConfirmation: string;
    shippingUpdate: string;
    welcomeEmail: string;
    abandonedCart: string;
  };
}

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rate: number;
  freeShippingThreshold: number;
  deliveryEstimate: string;
}

interface PaymentSettings {
  providers: {
    stripe: boolean;
    paypal: boolean;
    klarna: boolean;
  };
  currencies: string[];
  vatEnabled: boolean;
  vatRate: number;
  testMode: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'fulfillment';
  permissions: string[];
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

interface Integration {
  id: string;
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}

const Settings = () => {
  // State for all settings
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    storeName: 'Peak Mode Store',
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
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    adminEmail: 'admin@peakmode.com',
    notifications: {
      orders: true,
      contactForm: true,
      subscribers: true,
      sounds: true,
      popups: true
    },
    templates: {
      orderConfirmation: 'Thank you for your order! Your order #{orderNumber} has been confirmed.',
      shippingUpdate: 'Your order #{orderNumber} has been shipped and is on its way!',
      welcomeEmail: 'Welcome to Peak Mode! Thank you for joining our community.',
      abandonedCart: 'You left something in your cart! Complete your purchase now.'
    }
  });

  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
    {
      id: '1',
      name: 'Sweden',
      countries: ['SE'],
      rate: 0,
      freeShippingThreshold: 0,
      deliveryEstimate: '1-2 business days'
    },
    {
      id: '2',
      name: 'EU',
      countries: ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'DK', 'FI', 'NO'],
      rate: 15,
      freeShippingThreshold: 100,
      deliveryEstimate: '3-5 business days'
    },
    {
      id: '3',
      name: 'International',
      countries: ['US', 'CA', 'GB', 'AU', 'JP'],
      rate: 25,
      freeShippingThreshold: 200,
      deliveryEstimate: '7-14 business days'
    }
  ]);

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    providers: {
      stripe: true,
      paypal: false,
      klarna: true
    },
    currencies: ['SEK', 'EUR', 'USD'],
    vatEnabled: true,
    vatRate: 25,
    testMode: false
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@peakmode.com',
      role: 'admin',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Editor User',
      email: 'editor@peakmode.com',
      role: 'editor',
      permissions: ['products', 'marketing', 'customers']
    }
  ]);

  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>({
    homepageLayout: 'hero',
    heroSection: {
      title: 'Welcome to Peak Mode',
      subtitle: 'Discover amazing products for your lifestyle',
      image: ''
    },
    announcementBar: {
      enabled: true,
      message: 'Free shipping on orders over 500 SEK!'
    },
    maintenanceMode: false,
    seo: {
      title: 'Peak Mode - Premium Lifestyle Products',
      description: 'Discover high-quality products for your lifestyle at Peak Mode',
      keywords: 'lifestyle, products, premium, quality'
    }
  });

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Google Analytics',
      enabled: false,
      config: { trackingId: '' }
    },
    {
      id: '2',
      name: 'Meta Pixel',
      enabled: false,
      config: { pixelId: '' }
    },
    {
      id: '3',
      name: 'Mailchimp',
      enabled: false,
      config: { apiKey: '', listId: '' }
    }
  ]);

  // Helper functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const saveSettings = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  const handleFileUpload = (file: File, type: 'logo' | 'favicon') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'logo') {
        setBusinessInfo({ ...businessInfo, logo: e.target?.result as string });
      } else {
        setBusinessInfo({ ...businessInfo, favicon: e.target?.result as string });
      }
      toast.success(`${type} uploaded successfully`);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (files: any[]) => {
    if (files.length > 0) {
      setBusinessInfo({ ...businessInfo, logo: files[0].url });
      toast.success('Logo uploaded successfully');
    }
  };

  const handleFaviconUpload = (files: any[]) => {
    if (files.length > 0) {
      setBusinessInfo({ ...businessInfo, favicon: files[0].url });
      toast.success('Favicon uploaded successfully');
    }
  };

  const handleHeroImageUpload = (files: any[]) => {
    if (files.length > 0) {
      setWebsiteConfig({
        ...websiteConfig,
        heroSection: { ...websiteConfig.heroSection, image: files[0].url }
      });
      toast.success('Hero image uploaded successfully');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={() => saveSettings('All')}>
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="website" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Website
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        {/* Business Information */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Store Name</Label>
                  <Input
                    value={businessInfo.storeName}
                    onChange={(e) => setBusinessInfo({...businessInfo, storeName: e.target.value})}
                    placeholder="Your Store Name"
                  />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    value={businessInfo.contactEmail}
                    onChange={(e) => setBusinessInfo({...businessInfo, contactEmail: e.target.value})}
                    placeholder="contact@yourstore.com"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={businessInfo.phoneNumber}
                    onChange={(e) => setBusinessInfo({...businessInfo, phoneNumber: e.target.value})}
                    placeholder="+46 123 456 789"
                  />
                </div>
                <div>
                  <Label>Business Address</Label>
                  <Textarea
                    value={businessInfo.businessAddress}
                    onChange={(e) => setBusinessInfo({...businessInfo, businessAddress: e.target.value})}
                    placeholder="Full business address"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Logo Upload</Label>
                  <FileUpload
                    accept="image/*"
                    multiple={false}
                    maxFiles={1}
                    maxSize={5}
                    onFilesUploaded={handleLogoUpload}
                    uploadText="Upload store logo"
                    supportedFormats="Images only"
                    existingFiles={businessInfo.logo ? [{
                      filename: 'logo',
                      originalname: 'Store Logo',
                      url: businessInfo.logo,
                      size: 0,
                      mimetype: 'image/png'
                    }] : []}
                  />
                </div>
                <div>
                  <Label>Favicon Upload</Label>
                  <FileUpload
                    accept="image/*"
                    multiple={false}
                    maxFiles={1}
                    maxSize={1}
                    onFilesUploaded={handleFaviconUpload}
                    uploadText="Upload favicon (32x32 px)"
                    supportedFormats="Images only"
                    existingFiles={businessInfo.favicon ? [{
                      filename: 'favicon',
                      originalname: 'Favicon',
                      url: businessInfo.favicon,
                      size: 0,
                      mimetype: 'image/png'
                    }] : []}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-lg font-medium">Social Media Links</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      value={businessInfo.socialMedia.facebook}
                      onChange={(e) => setBusinessInfo({
                        ...businessInfo, 
                        socialMedia: {...businessInfo.socialMedia, facebook: e.target.value}
                      })}
                      placeholder="https://facebook.com/yourstore"
                    />
                  </div>
                  <div>
                    <Label>Instagram</Label>
                    <Input
                      value={businessInfo.socialMedia.instagram}
                      onChange={(e) => setBusinessInfo({
                        ...businessInfo, 
                        socialMedia: {...businessInfo.socialMedia, instagram: e.target.value}
                      })}
                      placeholder="https://instagram.com/yourstore"
                    />
                  </div>
                  <div>
                    <Label>TikTok</Label>
                    <Input
                      value={businessInfo.socialMedia.tiktok}
                      onChange={(e) => setBusinessInfo({
                        ...businessInfo, 
                        socialMedia: {...businessInfo.socialMedia, tiktok: e.target.value}
                      })}
                      placeholder="https://tiktok.com/@yourstore"
                    />
                  </div>
                  <div>
                    <Label>YouTube</Label>
                    <Input
                      value={businessInfo.socialMedia.youtube}
                      onChange={(e) => setBusinessInfo({
                        ...businessInfo, 
                        socialMedia: {...businessInfo.socialMedia, youtube: e.target.value}
                      })}
                      placeholder="https://youtube.com/yourstore"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => saveSettings('Business')} className="w-full">
                Save Business Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email & Notifications */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Admin Email</Label>
                <Input
                  value={emailSettings.adminEmail}
                  onChange={(e) => setEmailSettings({...emailSettings, adminEmail: e.target.value})}
                  placeholder="admin@yourstore.com"
                />
              </div>

              <Separator />

              <div>
                <Label className="text-lg font-medium">Notification Preferences</Label>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Order Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email when new orders are placed</p>
                    </div>
                    <Switch
                      checked={emailSettings.notifications.orders}
                      onCheckedChange={(checked) => setEmailSettings({
                        ...emailSettings,
                        notifications: {...emailSettings.notifications, orders: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Contact Form Messages</Label>
                      <p className="text-sm text-gray-500">Receive email when contact form is submitted</p>
                    </div>
                    <Switch
                      checked={emailSettings.notifications.contactForm}
                      onCheckedChange={(checked) => setEmailSettings({
                        ...emailSettings,
                        notifications: {...emailSettings.notifications, contactForm: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Subscriber Alerts</Label>
                      <p className="text-sm text-gray-500">Receive email when new subscribers sign up</p>
                    </div>
                    <Switch
                      checked={emailSettings.notifications.subscribers}
                      onCheckedChange={(checked) => setEmailSettings({
                        ...emailSettings,
                        notifications: {...emailSettings.notifications, subscribers: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dashboard Sounds</Label>
                      <p className="text-sm text-gray-500">Play notification sounds in dashboard</p>
                    </div>
                    <Switch
                      checked={emailSettings.notifications.sounds}
                      onCheckedChange={(checked) => setEmailSettings({
                        ...emailSettings,
                        notifications: {...emailSettings.notifications, sounds: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dashboard Pop-ups</Label>
                      <p className="text-sm text-gray-500">Show notification pop-ups in dashboard</p>
                    </div>
                    <Switch
                      checked={emailSettings.notifications.popups}
                      onCheckedChange={(checked) => setEmailSettings({
                        ...emailSettings,
                        notifications: {...emailSettings.notifications, popups: checked}
                      })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-lg font-medium">Email Templates</Label>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Order Confirmation</Label>
                    <Textarea
                      value={emailSettings.templates.orderConfirmation}
                      onChange={(e) => setEmailSettings({
                        ...emailSettings,
                        templates: {...emailSettings.templates, orderConfirmation: e.target.value}
                      })}
                      placeholder="Order confirmation email template"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Shipping Update</Label>
                    <Textarea
                      value={emailSettings.templates.shippingUpdate}
                      onChange={(e) => setEmailSettings({
                        ...emailSettings,
                        templates: {...emailSettings.templates, shippingUpdate: e.target.value}
                      })}
                      placeholder="Shipping update email template"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Welcome Email</Label>
                    <Textarea
                      value={emailSettings.templates.welcomeEmail}
                      onChange={(e) => setEmailSettings({
                        ...emailSettings,
                        templates: {...emailSettings.templates, welcomeEmail: e.target.value}
                      })}
                      placeholder="Welcome email template"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Abandoned Cart Reminder</Label>
                    <Textarea
                      value={emailSettings.templates.abandonedCart}
                      onChange={(e) => setEmailSettings({
                        ...emailSettings,
                        templates: {...emailSettings.templates, abandonedCart: e.target.value}
                      })}
                      placeholder="Abandoned cart reminder template"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => saveSettings('Email')} className="w-full">
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping & Delivery */}
        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping & Delivery Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-lg font-medium">Shipping Zones</Label>
                  <p className="text-sm text-gray-500">Configure shipping rates and delivery estimates</p>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Zone
                </Button>
              </div>

              <div className="space-y-4">
                {shippingZones.map((zone) => (
                  <div key={zone.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{zone.name}</h3>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Shipping Rate (SEK)</Label>
                        <Input
                          type="number"
                          value={zone.rate}
                          onChange={(e) => {
                            setShippingZones(shippingZones.map(z => 
                              z.id === zone.id ? {...z, rate: parseFloat(e.target.value)} : z
                            ));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Free Shipping Threshold (SEK)</Label>
                        <Input
                          type="number"
                          value={zone.freeShippingThreshold}
                          onChange={(e) => {
                            setShippingZones(shippingZones.map(z => 
                              z.id === zone.id ? {...z, freeShippingThreshold: parseFloat(e.target.value)} : z
                            ));
                          }}
                        />
                      </div>
                      <div>
                        <Label>Delivery Estimate</Label>
                        <Input
                          value={zone.deliveryEstimate}
                          onChange={(e) => {
                            setShippingZones(shippingZones.map(z => 
                              z.id === zone.id ? {...z, deliveryEstimate: e.target.value} : z
                            ));
                          }}
                          placeholder="1-3 business days"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={() => saveSettings('Shipping')} className="w-full">
                Save Shipping Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-lg font-medium">Payment Providers</Label>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Stripe</Label>
                      <p className="text-sm text-gray-500">Credit card payments</p>
                    </div>
                    <Switch
                      checked={paymentSettings.providers.stripe}
                      onCheckedChange={(checked) => setPaymentSettings({
                        ...paymentSettings,
                        providers: {...paymentSettings.providers, stripe: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>PayPal</Label>
                      <p className="text-sm text-gray-500">PayPal payments</p>
                    </div>
                    <Switch
                      checked={paymentSettings.providers.paypal}
                      onCheckedChange={(checked) => setPaymentSettings({
                        ...paymentSettings,
                        providers: {...paymentSettings.providers, paypal: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Klarna</Label>
                      <p className="text-sm text-gray-500">Buy now, pay later</p>
                    </div>
                    <Switch
                      checked={paymentSettings.providers.klarna}
                      onCheckedChange={(checked) => setPaymentSettings({
                        ...paymentSettings,
                        providers: {...paymentSettings.providers, klarna: checked}
                      })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Accepted Currencies</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currencies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEK">SEK (Swedish Krona)</SelectItem>
                      <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      <SelectItem value="USD">USD (US Dollar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>VAT Rate (%)</Label>
                  <Input
                    type="number"
                    value={paymentSettings.vatRate}
                    onChange={(e) => setPaymentSettings({
                      ...paymentSettings,
                      vatRate: parseFloat(e.target.value)
                    })}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Test Mode</Label>
                  <p className="text-sm text-gray-500">Enable sandbox mode for testing payments</p>
                </div>
                <Switch
                  checked={paymentSettings.testMode}
                  onCheckedChange={(checked) => setPaymentSettings({
                    ...paymentSettings,
                    testMode: checked
                  })}
                />
              </div>

              <Button onClick={() => saveSettings('Payment')} className="w-full">
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Roles & Access */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Admin Roles & Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-lg font-medium">Dashboard Users</Label>
                  <p className="text-sm text-gray-500">Manage admin access and permissions</p>
                </div>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className="space-y-4">
                {adminUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['orders', 'products', 'marketing', 'customers'].map((permission) => (
                        <div key={permission} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={user.permissions.includes('all') || user.permissions.includes(permission)}
                            disabled={user.permissions.includes('all')}
                          />
                          <Label className="text-sm capitalize">{permission}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={() => saveSettings('Roles')} className="w-full">
                Save Role Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Website Configuration */}
        <TabsContent value="website" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Website Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Homepage Layout</Label>
                <Select
                  value={websiteConfig.homepageLayout}
                  onValueChange={(value) => setWebsiteConfig({
                    ...websiteConfig,
                    homepageLayout: value as 'hero' | 'grid' | 'minimal'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="grid">Product Grid</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label className="text-lg font-medium">Hero Section</Label>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={websiteConfig.heroSection.title}
                      onChange={(e) => setWebsiteConfig({
                        ...websiteConfig,
                        heroSection: {...websiteConfig.heroSection, title: e.target.value}
                      })}
                      placeholder="Welcome to our store"
                    />
                  </div>
                  <div>
                    <Label>Subtitle</Label>
                    <Input
                      value={websiteConfig.heroSection.subtitle}
                      onChange={(e) => setWebsiteConfig({
                        ...websiteConfig,
                        heroSection: {...websiteConfig.heroSection, subtitle: e.target.value}
                      })}
                      placeholder="Discover amazing products"
                    />
                  </div>
                  <div>
                    <Label>Hero Image</Label>
                    <FileUpload
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      maxSize={10}
                      onFilesUploaded={handleHeroImageUpload}
                      uploadText="Upload hero section image"
                      supportedFormats="Images only"
                      existingFiles={websiteConfig.heroSection.image ? [{
                        filename: 'hero-image',
                        originalname: 'Hero Image',
                        url: websiteConfig.heroSection.image,
                        size: 0,
                        mimetype: 'image/jpeg'
                      }] : []}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-lg font-medium">Announcement Bar</Label>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Announcement Bar</Label>
                      <p className="text-sm text-gray-500">Show announcement at the top of the site</p>
                    </div>
                    <Switch
                      checked={websiteConfig.announcementBar.enabled}
                      onCheckedChange={(checked) => setWebsiteConfig({
                        ...websiteConfig,
                        announcementBar: {...websiteConfig.announcementBar, enabled: checked}
                      })}
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Input
                      value={websiteConfig.announcementBar.message}
                      onChange={(e) => setWebsiteConfig({
                        ...websiteConfig,
                        announcementBar: {...websiteConfig.announcementBar, message: e.target.value}
                      })}
                      placeholder="Free shipping on orders over 500 SEK!"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-lg font-medium">SEO Settings</Label>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Page Title</Label>
                    <Input
                      value={websiteConfig.seo.title}
                      onChange={(e) => setWebsiteConfig({
                        ...websiteConfig,
                        seo: {...websiteConfig.seo, title: e.target.value}
                      })}
                      placeholder="Your Store - Premium Products"
                    />
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={websiteConfig.seo.description}
                      onChange={(e) => setWebsiteConfig({
                        ...websiteConfig,
                        seo: {...websiteConfig.seo, description: e.target.value}
                      })}
                      placeholder="Description for search engines"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Keywords</Label>
                    <Input
                      value={websiteConfig.seo.keywords}
                      onChange={(e) => setWebsiteConfig({
                        ...websiteConfig,
                        seo: {...websiteConfig.seo, keywords: e.target.value}
                      })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Show "Coming Soon" page to visitors</p>
                </div>
                <Switch
                  checked={websiteConfig.maintenanceMode}
                  onCheckedChange={(checked) => setWebsiteConfig({
                    ...websiteConfig,
                    maintenanceMode: checked
                  })}
                />
              </div>

              <Button onClick={() => saveSettings('Website')} className="w-full">
                Save Website Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Integrations & External Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-gray-500">
                          {integration.name === 'Google Analytics' && 'Track website analytics'}
                          {integration.name === 'Meta Pixel' && 'Facebook advertising tracking'}
                          {integration.name === 'Mailchimp' && 'Email marketing automation'}
                        </p>
                      </div>
                      <Switch
                        checked={integration.enabled}
                        onCheckedChange={(checked) => {
                          setIntegrations(integrations.map(i => 
                            i.id === integration.id ? {...i, enabled: checked} : i
                          ));
                        }}
                      />
                    </div>
                    {integration.enabled && (
                      <div className="space-y-2">
                        {integration.name === 'Google Analytics' && (
                          <div>
                            <Label>Tracking ID</Label>
                            <Input
                              value={integration.config.trackingId}
                              onChange={(e) => {
                                setIntegrations(integrations.map(i => 
                                  i.id === integration.id 
                                    ? {...i, config: {...i.config, trackingId: e.target.value}}
                                    : i
                                ));
                              }}
                              placeholder="G-XXXXXXXXXX"
                            />
                          </div>
                        )}
                        {integration.name === 'Meta Pixel' && (
                          <div>
                            <Label>Pixel ID</Label>
                            <Input
                              value={integration.config.pixelId}
                              onChange={(e) => {
                                setIntegrations(integrations.map(i => 
                                  i.id === integration.id 
                                    ? {...i, config: {...i.config, pixelId: e.target.value}}
                                    : i
                                ));
                              }}
                              placeholder="123456789012345"
                            />
                          </div>
                        )}
                        {integration.name === 'Mailchimp' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>API Key</Label>
                              <Input
                                value={integration.config.apiKey}
                                onChange={(e) => {
                                  setIntegrations(integrations.map(i => 
                                    i.id === integration.id 
                                      ? {...i, config: {...i.config, apiKey: e.target.value}}
                                      : i
                                  ));
                                }}
                                placeholder="Your Mailchimp API key"
                              />
                            </div>
                            <div>
                              <Label>List ID</Label>
                              <Input
                                value={integration.config.listId}
                                onChange={(e) => {
                                  setIntegrations(integrations.map(i => 
                                    i.id === integration.id 
                                      ? {...i, config: {...i.config, listId: e.target.value}}
                                      : i
                                  ));
                                }}
                                placeholder="Your Mailchimp list ID"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <Label className="text-lg font-medium">Custom Code</Label>
                <p className="text-sm text-gray-500 mb-4">Add custom JavaScript or CSS for future scripts</p>
                <Textarea
                  placeholder="// Add your custom code here..."
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Button onClick={() => saveSettings('Integrations')} className="w-full">
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Reset */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Backup & Reset Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Backup Site Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Create a backup of all your site content and settings
                    </p>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Create Backup
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Customer Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">
                      Export customer information and order history
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg text-red-800">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600 mb-4">
                    These actions cannot be undone. Please be careful.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-red-800">Reset Design to Default</Label>
                        <p className="text-sm text-red-600">Reset all design customizations</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Reset Design
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reset Design to Default</DialogTitle>
                          </DialogHeader>
                          <p className="text-gray-600">
                            Are you sure you want to reset all design customizations? This action cannot be undone.
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive">Reset Design</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings; 