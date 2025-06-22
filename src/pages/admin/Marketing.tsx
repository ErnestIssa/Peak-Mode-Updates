import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';

// Types
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

interface Countdown {
  id: string;
  title: string;
  targetDate: string;
  targetTime: string;
  message: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
}

interface EmailPopup {
  id: string;
  title: string;
  message: string;
  offerText: string;
  triggerType: 'immediate' | 'scroll' | 'time' | 'exit';
  triggerValue: number;
  isActive: boolean;
  thankYouMessage: string;
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

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isActive: boolean;
  category: 'news' | 'update' | 'announcement';
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribedAt: string;
  source: string;
  isActive: boolean;
}

const Marketing = () => {
  // State for all sections
  const [banners, setBanners] = useState<Banner[]>([]);
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [emailPopups, setEmailPopups] = useState<EmailPopup[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // Form states
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({});
  const [countdownForm, setCountdownForm] = useState<Partial<Countdown>>({});
  const [popupForm, setPopupForm] = useState<Partial<EmailPopup>>({});
  const [announcementForm, setAnnouncementForm] = useState<Partial<Announcement>>({});
  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({});

  // Dialog states
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [countdownDialogOpen, setCountdownDialogOpen] = useState(false);
  const [popupDialogOpen, setPopupDialogOpen] = useState(false);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);

  // Helper functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Banner functions
  const addBanner = () => {
    if (!bannerForm.title || !bannerForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newBanner: Banner = {
      id: generateId(),
      title: bannerForm.title!,
      description: bannerForm.description!,
      imageUrl: bannerForm.imageUrl || '',
      ctaText: bannerForm.ctaText || 'Learn More',
      ctaLink: bannerForm.ctaLink || '#',
      isActive: bannerForm.isActive || false,
      startDate: bannerForm.startDate || '',
      endDate: bannerForm.endDate || '',
      position: bannerForm.position || 'top',
    };
    setBanners([...banners, newBanner]);
    setBannerForm({});
    setBannerDialogOpen(false);
    toast.success('Banner added successfully');
  };

  const handleBannerImageUpload = (files: any[]) => {
    if (files.length > 0) {
      setBannerForm({...bannerForm, imageUrl: files[0].url});
    }
  };

  const removeBanner = (id: string) => {
    setBanners(banners.filter(banner => banner.id !== id));
    toast.success('Banner removed');
  };

  // Countdown functions
  const addCountdown = () => {
    if (!countdownForm.title || !countdownForm.targetDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newCountdown: Countdown = {
      id: generateId(),
      title: countdownForm.title!,
      targetDate: countdownForm.targetDate!,
      targetTime: countdownForm.targetTime || '00:00',
      message: countdownForm.message || '',
      isActive: countdownForm.isActive || false,
      backgroundColor: countdownForm.backgroundColor || '#000000',
      textColor: countdownForm.textColor || '#ffffff',
    };
    setCountdowns([...countdowns, newCountdown]);
    setCountdownForm({});
    setCountdownDialogOpen(false);
    toast.success('Countdown added successfully');
  };

  const removeCountdown = (id: string) => {
    setCountdowns(countdowns.filter(countdown => countdown.id !== id));
    toast.success('Countdown removed');
  };

  // Email Popup functions
  const addEmailPopup = () => {
    if (!popupForm.title || !popupForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newPopup: EmailPopup = {
      id: generateId(),
      title: popupForm.title!,
      message: popupForm.message!,
      offerText: popupForm.offerText || '',
      triggerType: popupForm.triggerType || 'immediate',
      triggerValue: popupForm.triggerValue || 0,
      isActive: popupForm.isActive || false,
      thankYouMessage: popupForm.thankYouMessage || 'Thank you for subscribing!',
    };
    setEmailPopups([...emailPopups, newPopup]);
    setPopupForm({});
    setPopupDialogOpen(false);
    toast.success('Email popup added successfully');
  };

  const removeEmailPopup = (id: string) => {
    setEmailPopups(emailPopups.filter(popup => popup.id !== id));
    toast.success('Email popup removed');
  };

  // Announcement functions
  const addAnnouncement = () => {
    if (!announcementForm.message) {
      toast.error('Please enter a message');
      return;
    }
    const newAnnouncement: Announcement = {
      id: generateId(),
      message: announcementForm.message!,
      backgroundColor: announcementForm.backgroundColor || '#000000',
      textColor: announcementForm.textColor || '#ffffff',
      isActive: announcementForm.isActive || false,
      startDate: announcementForm.startDate || '',
      endDate: announcementForm.endDate || '',
    };
    setAnnouncements([...announcements, newAnnouncement]);
    setAnnouncementForm({});
    setAnnouncementDialogOpen(false);
    toast.success('Announcement added successfully');
  };

  const removeAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    toast.success('Announcement removed');
  };

  // News functions
  const addNewsItem = () => {
    if (!newsForm.title || !newsForm.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    const newNewsItem: NewsItem = {
      id: generateId(),
      title: newsForm.title!,
      content: newsForm.content!,
      date: newsForm.date || new Date().toISOString().split('T')[0],
      isActive: newsForm.isActive || false,
      category: newsForm.category || 'news',
    };
    setNewsItems([...newsItems, newNewsItem]);
    setNewsForm({});
    setNewsDialogOpen(false);
    toast.success('News item added successfully');
  };

  const removeNewsItem = (id: string) => {
    setNewsItems(newsItems.filter(item => item.id !== id));
    toast.success('News item removed');
  };

  // Export subscribers
  const exportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Name,Subscribed At,Source,Status\n"
      + subscribers.map(sub => 
          `${sub.email},${sub.name},${sub.subscribedAt},${sub.source},${sub.isActive ? 'Active' : 'Inactive'}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Subscribers exported successfully');
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Marketing Management</h1>
      
      {/* Homepage Banners / Promotions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Homepage Banners / Promotions</span>
            <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Banner</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pr-2">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={bannerForm.title || ''}
                      onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                      placeholder="Banner title"
                    />
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <Textarea
                      value={bannerForm.description || ''}
                      onChange={(e) => setBannerForm({...bannerForm, description: e.target.value})}
                      placeholder="Banner description"
                    />
                  </div>
                  <div>
                    <Label>Banner Image</Label>
                    <FileUpload
                      accept="image/*"
                      multiple={false}
                      maxFiles={1}
                      maxSize={5}
                      onFilesUploaded={handleBannerImageUpload}
                      uploadText="Upload banner image"
                      supportedFormats="Images only"
                      existingFiles={bannerForm.imageUrl ? [{
                        filename: 'banner-image',
                        originalname: 'Banner Image',
                        url: bannerForm.imageUrl,
                        size: 0,
                        mimetype: 'image/jpeg'
                      }] : []}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>CTA Text</Label>
                      <Input
                        value={bannerForm.ctaText || ''}
                        onChange={(e) => setBannerForm({...bannerForm, ctaText: e.target.value})}
                        placeholder="Learn More"
                      />
                    </div>
                    <div>
                      <Label>CTA Link</Label>
                      <Input
                        value={bannerForm.ctaLink || ''}
                        onChange={(e) => setBannerForm({...bannerForm, ctaLink: e.target.value})}
                        placeholder="/products"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Position</Label>
                      <Select value={bannerForm.position} onValueChange={(value) => setBannerForm({...bannerForm, position: value as any})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={bannerForm.startDate || ''}
                        onChange={(e) => setBannerForm({...bannerForm, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={bannerForm.endDate || ''}
                        onChange={(e) => setBannerForm({...bannerForm, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={bannerForm.isActive || false}
                      onCheckedChange={(checked) => setBannerForm({...bannerForm, isActive: checked})}
                    />
                    <Label>Active</Label>
                  </div>
                  <Button onClick={addBanner} className="w-full">Add Banner</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <p className="text-gray-500">No banners added yet.</p>
          ) : (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{banner.title}</h3>
                    <p className="text-sm text-gray-600">{banner.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={banner.isActive ? "default" : "secondary"}>
                        {banner.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{banner.position}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeBanner(banner.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Countdown Timers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Countdown Timers</span>
            <Dialog open={countdownDialogOpen} onOpenChange={setCountdownDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Countdown
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Countdown</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={countdownForm.title || ''}
                      onChange={(e) => setCountdownForm({...countdownForm, title: e.target.value})}
                      placeholder="Sale ends in..."
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Input
                      value={countdownForm.message || ''}
                      onChange={(e) => setCountdownForm({...countdownForm, message: e.target.value})}
                      placeholder="Don't miss out!"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Target Date *</Label>
                      <Input
                        type="date"
                        value={countdownForm.targetDate || ''}
                        onChange={(e) => setCountdownForm({...countdownForm, targetDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Target Time</Label>
                      <Input
                        type="time"
                        value={countdownForm.targetTime || ''}
                        onChange={(e) => setCountdownForm({...countdownForm, targetTime: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={countdownForm.backgroundColor || '#000000'}
                        onChange={(e) => setCountdownForm({...countdownForm, backgroundColor: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={countdownForm.textColor || '#ffffff'}
                        onChange={(e) => setCountdownForm({...countdownForm, textColor: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={countdownForm.isActive || false}
                      onCheckedChange={(checked) => setCountdownForm({...countdownForm, isActive: checked})}
                    />
                    <Label>Active</Label>
                  </div>
                  <Button onClick={addCountdown} className="w-full">Add Countdown</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {countdowns.length === 0 ? (
            <p className="text-gray-500">No countdowns added yet.</p>
          ) : (
            <div className="space-y-4">
              {countdowns.map((countdown) => (
                <div key={countdown.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{countdown.title}</h3>
                    <p className="text-sm text-gray-600">{countdown.message}</p>
                    <p className="text-sm text-gray-500">
                      Ends: {countdown.targetDate} at {countdown.targetTime}
                    </p>
                    <Badge variant={countdown.isActive ? "default" : "secondary"} className="mt-2">
                      {countdown.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCountdown(countdown.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Pop-Up / Welcome Offer Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Email Pop-Up / Welcome Offer Manager</span>
            <Dialog open={popupDialogOpen} onOpenChange={setPopupDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Popup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Email Popup</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={popupForm.title || ''}
                      onChange={(e) => setPopupForm({...popupForm, title: e.target.value})}
                      placeholder="Get 10% off!"
                    />
                  </div>
                  <div>
                    <Label>Message *</Label>
                    <Textarea
                      value={popupForm.message || ''}
                      onChange={(e) => setPopupForm({...popupForm, message: e.target.value})}
                      placeholder="Subscribe to our newsletter and get exclusive offers!"
                    />
                  </div>
                  <div>
                    <Label>Offer Text</Label>
                    <Input
                      value={popupForm.offerText || ''}
                      onChange={(e) => setPopupForm({...popupForm, offerText: e.target.value})}
                      placeholder="Use code: WELCOME10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Trigger Type</Label>
                      <Select value={popupForm.triggerType} onValueChange={(value) => setPopupForm({...popupForm, triggerType: value as any})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="scroll">On Scroll</SelectItem>
                          <SelectItem value="time">After Time</SelectItem>
                          <SelectItem value="exit">On Exit Intent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Trigger Value (seconds/%)</Label>
                      <Input
                        type="number"
                        value={popupForm.triggerValue || ''}
                        onChange={(e) => setPopupForm({...popupForm, triggerValue: parseInt(e.target.value)})}
                        placeholder="30"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Thank You Message</Label>
                    <Input
                      value={popupForm.thankYouMessage || ''}
                      onChange={(e) => setPopupForm({...popupForm, thankYouMessage: e.target.value})}
                      placeholder="Thank you for subscribing!"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={popupForm.isActive || false}
                      onCheckedChange={(checked) => setPopupForm({...popupForm, isActive: checked})}
                    />
                    <Label>Active</Label>
                  </div>
                  <Button onClick={addEmailPopup} className="w-full">Add Popup</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {emailPopups.length === 0 ? (
            <p className="text-gray-500">No email popups added yet.</p>
          ) : (
            <div className="space-y-4">
              {emailPopups.map((popup) => (
                <div key={popup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{popup.title}</h3>
                    <p className="text-sm text-gray-600">{popup.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={popup.isActive ? "default" : "secondary"}>
                        {popup.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{popup.triggerType}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEmailPopup(popup.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Announcements Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Custom Announcements Bar</span>
            <Dialog open={announcementDialogOpen} onOpenChange={setAnnouncementDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Message *</Label>
                    <Input
                      value={announcementForm.message || ''}
                      onChange={(e) => setAnnouncementForm({...announcementForm, message: e.target.value})}
                      placeholder="Free shipping on orders over $50!"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={announcementForm.backgroundColor || '#000000'}
                        onChange={(e) => setAnnouncementForm({...announcementForm, backgroundColor: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Text Color</Label>
                      <Input
                        type="color"
                        value={announcementForm.textColor || '#ffffff'}
                        onChange={(e) => setAnnouncementForm({...announcementForm, textColor: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={announcementForm.startDate || ''}
                        onChange={(e) => setAnnouncementForm({...announcementForm, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={announcementForm.endDate || ''}
                        onChange={(e) => setAnnouncementForm({...announcementForm, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={announcementForm.isActive || false}
                      onCheckedChange={(checked) => setAnnouncementForm({...announcementForm, isActive: checked})}
                    />
                    <Label>Active</Label>
                  </div>
                  <Button onClick={addAnnouncement} className="w-full">Add Announcement</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements added yet.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{announcement.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={announcement.isActive ? "default" : "secondary"}>
                        {announcement.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="w-4 h-4 rounded border" style={{backgroundColor: announcement.backgroundColor}}></div>
                      <div className="w-4 h-4 rounded border" style={{backgroundColor: announcement.textColor}}></div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAnnouncement(announcement.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* News & Updates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>News & Updates</span>
            <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add News
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add News Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title *</Label>
                    <Input
                      value={newsForm.title || ''}
                      onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                      placeholder="News title"
                    />
                  </div>
                  <div>
                    <Label>Content *</Label>
                    <Textarea
                      value={newsForm.content || ''}
                      onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                      placeholder="News content"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={newsForm.date || ''}
                        onChange={(e) => setNewsForm({...newsForm, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={newsForm.category} onValueChange={(value) => setNewsForm({...newsForm, category: value as any})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newsForm.isActive || false}
                      onCheckedChange={(checked) => setNewsForm({...newsForm, isActive: checked})}
                    />
                    <Label>Active</Label>
                  </div>
                  <Button onClick={addNewsItem} className="w-full">Add News Item</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {newsItems.length === 0 ? (
            <p className="text-gray-500">No news items added yet.</p>
          ) : (
            <div className="space-y-4">
              {newsItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeNewsItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Subscribers List</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={exportSubscribers}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total subscribers: {subscribers.length}
              </p>
              <div className="flex gap-2">
                <Input placeholder="Search subscribers..." className="w-64" />
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {subscribers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No subscribers yet.</p>
              <p className="text-sm text-gray-400">Subscribers will appear here when they sign up through your email popups or forms.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {subscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{subscriber.email}</p>
                    <p className="text-sm text-gray-600">{subscriber.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                        {subscriber.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-gray-500">Source: {subscriber.source}</span>
                      <span className="text-xs text-gray-500">{subscriber.subscribedAt}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Marketing; 