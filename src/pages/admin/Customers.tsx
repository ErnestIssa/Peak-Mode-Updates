import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Search, Filter, Eye, Edit, MessageSquare, Download, Gift, Users,
  User, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingBag, Tag,
  Crown, Award, BarChart3, TrendingUp, Plus, Send, FileText, Clock,
  Star, Heart, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

interface Subscription {
  type: 'newsletter' | 'welcome_offer' | 'sms_alerts';
  status: 'subscribed' | 'confirmed' | 'unsubscribed';
  source: string;
  date: string;
  welcomeOfferReceived: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinDate: string;
  accountType: 'guest' | 'registered';
  orderCount: number;
  totalSpent: number;
  tags: string[];
  shippingAddress?: Address;
  billingAddress?: Address;
  subscriptions: Subscription[];
  internalNotes?: string;
  lastLogin?: string;
  lastOrder?: string;
  favoriteProducts?: string[];
  cartAbandonment?: number;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2024-01-15',
      accountType: 'registered',
      orderCount: 5,
      totalSpent: 2495,
      tags: ['VIP', 'Frequent Buyer'],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      subscriptions: [
        {
          type: 'newsletter',
          status: 'subscribed',
          source: 'popup',
          date: '2024-01-15',
          welcomeOfferReceived: true
        },
        {
          type: 'sms_alerts',
          status: 'subscribed',
          source: 'checkout',
          date: '2024-01-20',
          welcomeOfferReceived: false
        }
      ],
      internalNotes: 'High-value customer, responds well to VIP offers',
      lastLogin: '2024-01-25',
      lastOrder: '2024-01-20',
      favoriteProducts: ['Performance T-Shirt', 'Athletic Hoodie']
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike@example.com',
      joinDate: '2024-01-10',
      accountType: 'guest',
      orderCount: 2,
      totalSpent: 598,
      tags: ['Wholesale'],
      subscriptions: [
        {
          type: 'newsletter',
          status: 'subscribed',
          source: 'landing_page',
          date: '2024-01-10',
          welcomeOfferReceived: true
        }
      ],
      internalNotes: 'Wholesale inquiry, interested in bulk orders',
      lastOrder: '2024-01-18'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 (555) 987-6543',
      joinDate: '2024-01-05',
      accountType: 'registered',
      orderCount: 1,
      totalSpent: 299,
      tags: ['New Customer'],
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      subscriptions: [
        {
          type: 'newsletter',
          status: 'confirmed',
          source: 'popup',
          date: '2024-01-05',
          welcomeOfferReceived: false
        }
      ],
      lastLogin: '2024-01-22',
      lastOrder: '2024-01-22'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [subscriberFilter, setSubscriberFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [messageText, setMessageText] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  // Available tags
  const availableTags = [
    'VIP', 'Wholesale', 'Frequent Buyer', 'Influencer', 'Tester', 
    'New Customer', 'Flagged for Support', 'Pre-launch', 'High Value'
  ];

  // Mock orders for customer details
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'PM1045',
      date: '2024-01-20',
      total: 997,
      status: 'Delivered',
      items: 3
    },
    {
      id: '2',
      orderNumber: 'PM1040',
      date: '2024-01-15',
      total: 598,
      status: 'Delivered',
      items: 2
    }
  ];

  // Analytics
  const analytics = {
    totalCustomers: customers.length,
    registeredCustomers: customers.filter(c => c.accountType === 'registered').length,
    guestCustomers: customers.filter(c => c.accountType === 'guest').length,
    newsletterSubscribers: customers.filter(c => 
      c.subscriptions.some(s => s.type === 'newsletter' && s.status === 'subscribed')
    ).length,
    vipCustomers: customers.filter(c => c.tags.includes('VIP')).length,
    averageOrderValue: customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.reduce((acc, c) => acc + c.orderCount, 0)
  };

  // Filtered customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesOrder = orderFilter === 'all' || 
      (orderFilter === 'one-time' && customer.orderCount === 1) ||
      (orderFilter === 'repeat' && customer.orderCount > 1);
    
    const matchesSubscriber = subscriberFilter === 'all' || 
      customer.subscriptions.some(s => s.type === subscriberFilter as any);
    
    let matchesDate = true;
    if (dateFilter === 'new') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(customer.joinDate) >= weekAgo;
    }
    
    const matchesTag = tagFilter === 'all' || customer.tags.includes(tagFilter);
    
    return matchesSearch && matchesOrder && matchesSubscriber && matchesDate && matchesTag;
  });

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setInternalNotes(customer.internalNotes || '');
    setShowCustomerDetails(true);
  };

  const handleSaveNotes = () => {
    if (selectedCustomer) {
      setCustomers(prev => prev.map(customer => 
        customer.id === selectedCustomer.id ? { ...customer, internalNotes } : customer
      ));
      toast.success('Internal notes saved');
    }
  };

  const handleAddTag = (customerId: string, tag: string) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, tags: [...customer.tags, tag] } : customer
    ));
    toast.success(`Tag "${tag}" added to customer`);
  };

  const handleRemoveTag = (customerId: string, tag: string) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, tags: customer.tags.filter(t => t !== tag) } : customer
    ));
    toast.success(`Tag "${tag}" removed from customer`);
  };

  const handleSendMessage = () => {
    if (selectedCustomer && messageText.trim()) {
      toast.success(`Message sent to ${selectedCustomer.name}`);
      setMessageText('');
      setShowMessageDialog(false);
    }
  };

  const handleCreateDiscount = () => {
    if (selectedCustomer && discountCode.trim()) {
      toast.success(`Discount code "${discountCode}" created for ${selectedCustomer.name}`);
      setDiscountCode('');
      setShowDiscountDialog(false);
    }
  };

  const handleBulkMessage = () => {
    if (selectedCustomers.length === 0) {
      toast.error('Please select customers first');
      return;
    }
    toast.success(`Message sent to ${selectedCustomers.length} customers`);
    setSelectedCustomers([]);
  };

  const handleExportCSV = () => {
    toast.success('Customer list exported to CSV');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const getAccountTypeBadge = (type: string) => {
    return (
      <Badge className={type === 'registered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getTagBadge = (tag: string) => {
    const tagStyles = {
      'VIP': 'bg-purple-100 text-purple-800',
      'Wholesale': 'bg-blue-100 text-blue-800',
      'Frequent Buyer': 'bg-green-100 text-green-800',
      'Influencer': 'bg-pink-100 text-pink-800',
      'New Customer': 'bg-yellow-100 text-yellow-800',
      'Flagged for Support': 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={tagStyles[tag as keyof typeof tagStyles] || 'bg-gray-100 text-gray-800'}>
        {tag}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
                <div className="text-sm text-gray-500">Total Customers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.registeredCustomers}</div>
                <div className="text-sm text-gray-500">Registered</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.newsletterSubscribers}</div>
                <div className="text-sm text-gray-500">Newsletter</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.vipCustomers}</div>
                <div className="text-sm text-gray-500">VIP Customers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.averageOrderValue.toFixed(0)}</div>
                <div className="text-sm text-gray-500">Avg Order Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-500">Manage customer accounts and engagement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setShowMessageDialog(true)} disabled={selectedCustomers.length === 0}>
            <Send className="h-4 w-4 mr-2" />
            Bulk Message
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={orderFilter} onValueChange={setOrderFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Order Volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="repeat">Repeat</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subscriberFilter} onValueChange={setSubscriberFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Subscriber" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="welcome_offer">Welcome Offer</SelectItem>
                <SelectItem value="sms_alerts">SMS Alerts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Join Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="new">New (7 days)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {availableTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Subscriptions</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getAccountTypeBadge(customer.accountType)}
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{customer.orderCount}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{customer.totalSpent} SEK</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{customer.joinDate}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.subscriptions.map(sub => (
                        <Badge key={sub.type} variant="outline" className="text-xs">
                          {sub.type === 'newsletter' ? 'Newsletter' : 
                           sub.type === 'welcome_offer' ? 'Welcome' : 'SMS'}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowMessageDialog(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDetails} onOpenChange={setShowCustomerDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Profile - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Detailed customer information and management
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p>{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p>{selectedCustomer.email}</p>
                      </div>
                      {selectedCustomer.phone && (
                        <div>
                          <Label className="text-sm font-medium">Phone</Label>
                          <p>{selectedCustomer.phone}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium">Account Type</Label>
                        <div>{getAccountTypeBadge(selectedCustomer.accountType)}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Join Date</Label>
                        <p>{selectedCustomer.joinDate}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Login</Label>
                        <p>{selectedCustomer.lastLogin || 'Never'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Addresses */}
                {(selectedCustomer.shippingAddress || selectedCustomer.billingAddress) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Addresses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedCustomer.shippingAddress && (
                        <div>
                          <Label className="text-sm font-medium">Shipping Address</Label>
                          <p className="text-sm">
                            {selectedCustomer.shippingAddress.street}<br />
                            {selectedCustomer.shippingAddress.city}, {selectedCustomer.shippingAddress.state} {selectedCustomer.shippingAddress.zipCode}<br />
                            {selectedCustomer.shippingAddress.country}
                          </p>
                        </div>
                      )}
                      {selectedCustomer.billingAddress && (
                        <div>
                          <Label className="text-sm font-medium">Billing Address</Label>
                          <p className="text-sm">
                            {selectedCustomer.billingAddress.street}<br />
                            {selectedCustomer.billingAddress.city}, {selectedCustomer.billingAddress.state} {selectedCustomer.billingAddress.zipCode}<br />
                            {selectedCustomer.billingAddress.country}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags & Segmentation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.tags.map(tag => (
                        <div key={tag} className="flex items-center gap-1">
                          {getTagBadge(tag)}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveTag(selectedCustomer.id, tag)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Add Tag</Label>
                      <Select onValueChange={(value) => handleAddTag(selectedCustomer.id, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTags.filter(tag => !selectedCustomer.tags.includes(tag)).map(tag => (
                            <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded">
                          <div>
                            <h4 className="font-medium">#{order.orderNumber}</h4>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{order.total} SEK</p>
                            <p className="text-sm text-gray-500">{order.items} items</p>
                          </div>
                          <div>
                            <Badge className="bg-green-100 text-green-800">{order.status}</Badge>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="engagement" className="space-y-6">
                {/* Subscriptions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subscriptions & Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCustomer.subscriptions.map((sub) => (
                        <div key={sub.type} className="flex items-center justify-between p-4 border rounded">
                          <div>
                            <h4 className="font-medium">
                              {sub.type === 'newsletter' ? 'Newsletter' : 
                               sub.type === 'welcome_offer' ? 'Welcome Offer' : 'SMS Alerts'}
                            </h4>
                            <p className="text-sm text-gray-500">Source: {sub.source}</p>
                            <p className="text-sm text-gray-500">Joined: {sub.date}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={
                              sub.status === 'subscribed' ? 'bg-green-100 text-green-800' :
                              sub.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                            </Badge>
                            {sub.welcomeOfferReceived && (
                              <p className="text-xs text-green-600 mt-1">Welcome offer sent</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Behavior Insights */}
                {selectedCustomer.favoriteProducts && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Behavior Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Favorite Products</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedCustomer.favoriteProducts.map(product => (
                            <Badge key={product} variant="outline">{product}</Badge>
                          ))}
                        </div>
                      </div>
                      {selectedCustomer.cartAbandonment && (
                        <div>
                          <Label className="text-sm font-medium">Cart Abandonment Rate</Label>
                          <p className="text-2xl font-bold text-red-600">{selectedCustomer.cartAbandonment}%</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Internal Notes</CardTitle>
                    <CardDescription>Private notes for internal use</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={internalNotes}
                        onChange={(e) => setInternalNotes(e.target.value)}
                        placeholder="Add internal notes about this customer..."
                        rows={6}
                      />
                    </div>
                    <Button onClick={handleSaveNotes}>
                      Save Notes
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Button onClick={() => setShowMessageDialog(true)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" onClick={() => setShowDiscountDialog(true)}>
                        <Gift className="h-4 w-4 mr-2" />
                        Create Discount
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer ? `Send Message to ${selectedCustomer.name}` : 'Send Bulk Message'}
            </DialogTitle>
            <DialogDescription>
              Send a personalized message to {selectedCustomer ? 'this customer' : 'selected customers'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write your message..."
                rows={6}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Discount Dialog */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Discount for {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Generate a personalized discount code for this customer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Discount Code</Label>
              <Input
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter discount code..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDiscountDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDiscount}>
                <Gift className="h-4 w-4 mr-2" />
                Create Discount
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers; 