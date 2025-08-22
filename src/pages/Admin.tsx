import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Trash2, 
  Edit, 
  Plus, 
  Package, 
  ShoppingCart, 
  Users, 
  Mail, 
  MessageSquare,
  Eye,
  EyeOff
} from 'lucide-react';
import { productService, orderService, contactService, newsletterService } from '@/lib/peakModeService';



const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State for data
  const [products, setProducts] = useState<any[]>([]); // Changed to any[] as LocalProduct is removed
  const [orders, setOrders] = useState<any[]>([]); // Changed to any[] as LocalOrder is removed
  const [customers, setCustomers] = useState<any[]>([]); // Changed to any[] as LocalCustomer is removed
  const [subscribers, setSubscribers] = useState<any[]>([]); // Changed to any[] as LocalNewsletterSubscriber is removed
  const [contactMessages, setContactMessages] = useState<any[]>([]); // Changed to any[] as LocalContactMessage is removed

  // Load data when logged in
  useEffect(() => {
    // Load data from peakModeService (with backend fallback)
    const loadData = async () => {
      try {
        const [productsData, ordersData, customersData, subscribersData, messagesData] = await Promise.all([
          productService.getAllProducts(),
          orderService.getOrders(),
          Promise.resolve([]), // customers not implemented yet
          newsletterService.getSubscribers(),
          contactService.getMessages()
        ]);
        
        setProducts(productsData);
        setOrders(ordersData);
        setCustomers(customersData);
        setSubscribers(subscribersData);
        setContactMessages(messagesData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple local authentication
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials. Use admin/admin123');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        // Reload products
        const updatedProducts = await productService.getAllProducts();
        setProducts(updatedProducts);
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await orderService.updateOrderStatus(id, status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled');
      // Reload orders
      const updatedOrders = await orderService.getOrders();
      setOrders(updatedOrders);
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: string) => {
    try {
      await contactService.updateStatus(id, status as 'new' | 'read' | 'replied');
      // Reload messages
      const updatedMessages = await contactService.getMessages();
      setContactMessages(updatedMessages);
      alert('Message status updated successfully!');
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Failed to update message status');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Peak Mode Admin
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to access the admin panel
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Label htmlFor="username" className="sr-only">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Peak Mode Admin</h1>
              <p className="text-sm text-gray-700">Welcome, Admin</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <EyeOff className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-semibold text-gray-900">{customers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-2xl font-semibold text-gray-900">{contactMessages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your product catalog</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm text-gray-500">{product.description.substring(0, 100)}...</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">${product.price}</span>
                        <Badge variant={product.inStock ? "default" : "secondary"}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer.firstName} {order.customer.lastName}</p>
                        <p className="text-sm text-gray-600">{order.customer.email}</p>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">${order.total}</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage admin users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{customer.firstName} {customer.lastName}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-600">{customer.city}, {customer.country}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={customer.newsletterSubscribed ? "default" : "secondary"}>
                          {customer.newsletterSubscribed ? "Newsletter" : "No Newsletter"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
                <CardDescription>Manage newsletter subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{subscriber.email}</h3>
                        <p className="text-sm text-gray-600">Subscribed: {new Date(subscriber.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={subscriber.subscribed ? "default" : "secondary"}>
                          {subscriber.subscribed ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Messages</CardTitle>
                <CardDescription>View and manage customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactMessages.map((message) => (
                    <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{message.subject}</h3>
                        <p className="text-sm text-gray-600">From: {message.name} ({message.email})</p>
                        <p className="text-sm text-gray-600">{message.message.substring(0, 100)}...</p>
                        <p className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <select
                          value={message.status}
                          onChange={(e) => handleUpdateMessageStatus(message.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin; 