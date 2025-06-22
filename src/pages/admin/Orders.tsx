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
import { 
  Search, Filter, Eye, Download, Printer, Truck, Calendar,
  User, Mail, Phone, MapPin, CreditCard, Package, AlertTriangle,
  CheckCircle, XCircle, Clock, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';

interface OrderItem {
  id: string;
  productName: string;
  size: string;
  quantity: number;
  price: number;
  thumbnail: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface Payment {
  method: string;
  status: 'paid' | 'unpaid' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  orderDate: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  payment: Payment;
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  deliveryMethod: 'shipping' | 'pickup';
  shippingMethod: string;
  trackingNumber?: string;
  shippingProvider?: string;
  orderNotes?: string;
  customerMessage?: string;
  attachments?: any[];
  shippingLabels?: any[];
  isNew: boolean;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'PM1045',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      items: [
        {
          id: '1',
          productName: 'Performance T-Shirt',
          size: 'M',
          quantity: 2,
          price: 299,
          thumbnail: 'https://via.placeholder.com/100x100'
        },
        {
          id: '2',
          productName: 'Athletic Hoodie',
          size: 'L',
          quantity: 1,
          price: 399,
          thumbnail: 'https://via.placeholder.com/100x100'
        }
      ],
      orderDate: '2024-01-20',
      total: 997,
      subtotal: 997,
      shippingCost: 0,
      discount: 0,
      payment: {
        method: 'Credit Card',
        status: 'paid',
        transactionId: 'txn_123456789',
        amount: 997
      },
      fulfillmentStatus: 'pending',
      deliveryMethod: 'shipping',
      shippingMethod: 'Standard Shipping',
      isNew: true
    },
    {
      id: '2',
      orderNumber: 'PM1046',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 (555) 987-6543',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      },
      items: [
        {
          id: '3',
          productName: 'Athletic Leggings',
          size: 'S',
          quantity: 1,
          price: 199,
          thumbnail: 'https://via.placeholder.com/100x100'
        }
      ],
      orderDate: '2024-01-19',
      total: 199,
      subtotal: 199,
      shippingCost: 0,
      discount: 0,
      payment: {
        method: 'PayPal',
        status: 'paid',
        transactionId: 'txn_987654321',
        amount: 199
      },
      fulfillmentStatus: 'shipped',
      deliveryMethod: 'shipping',
      shippingMethod: 'Express Shipping',
      trackingNumber: '1Z999AA1234567890',
      shippingProvider: 'UPS',
      isNew: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  // Fulfillment summary
  const fulfillmentSummary = {
    totalOrders: orders.length,
    newOrders: orders.filter(o => o.isNew).length,
    pendingOrders: orders.filter(o => o.fulfillmentStatus === 'pending').length,
    shippedToday: orders.filter(o => 
      o.fulfillmentStatus === 'shipped' && o.orderDate === new Date().toISOString().split('T')[0]
    ).length,
    mostOrderedProduct: 'Performance T-Shirt' // This would be calculated from actual data
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.fulfillmentStatus === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment.status === paymentFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = order.orderDate === new Date().toISOString().split('T')[0];
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(order.orderDate) >= weekAgo;
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderNotes(order.orderNotes || '');
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = (orderId: string, status: Order['fulfillmentStatus']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, fulfillmentStatus: status } : order
    ));
    toast.success(`Order status updated to ${status}`);
  };

  const handleAddTracking = (orderId: string, trackingNumber: string, provider: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { 
        ...order, 
        trackingNumber, 
        shippingProvider: provider,
        fulfillmentStatus: 'shipped'
      } : order
    ));
    toast.success('Tracking number added and order marked as shipped');
  };

  const handleSaveNotes = () => {
    if (selectedOrder) {
      setOrders(prev => prev.map(order => 
        order.id === selectedOrder.id ? { ...order, orderNotes } : order
      ));
      toast.success('Order notes saved');
    }
  };

  const handleAttachmentUpload = (files: any[]) => {
    if (selectedOrder) {
      const currentAttachments = selectedOrder.attachments || [];
      const updatedAttachments = [...currentAttachments, ...files];
      
      setOrders(prev => prev.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, attachments: updatedAttachments }
          : order
      ));
      
      setSelectedOrder({ ...selectedOrder, attachments: updatedAttachments });
      toast.success('Documents uploaded successfully');
    }
  };

  const handleShippingLabelUpload = (files: any[]) => {
    if (selectedOrder) {
      const currentLabels = selectedOrder.shippingLabels || [];
      const updatedLabels = [...currentLabels, ...files];
      
      setOrders(prev => prev.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, shippingLabels: updatedLabels }
          : order
      ));
      
      setSelectedOrder({ ...selectedOrder, shippingLabels: updatedLabels });
      toast.success('Shipping labels uploaded successfully');
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders first');
      return;
    }

    switch (action) {
      case 'mark-shipped':
        setOrders(prev => prev.map(order => 
          selectedOrders.includes(order.id) ? { ...order, fulfillmentStatus: 'shipped' } : order
        ));
        toast.success('Orders marked as shipped');
        break;
      case 'export-csv':
        // Implement CSV export
        toast.success('Orders exported to CSV');
        break;
      case 'print-invoices':
        // Implement invoice printing
        toast.success('Invoices printed');
        break;
    }
    setSelectedOrders([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const paymentStyles = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={paymentStyles[status as keyof typeof paymentStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Fulfillment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{fulfillmentSummary.totalOrders}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{fulfillmentSummary.newOrders}</div>
                <div className="text-sm text-gray-500">New Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{fulfillmentSummary.pendingOrders}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{fulfillmentSummary.shippedToday}</div>
                <div className="text-sm text-gray-500">Shipped Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm font-bold">{fulfillmentSummary.mostOrderedProduct}</div>
                <div className="text-sm text-gray-500">Top Product</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-500">Manage customer orders and fulfillment</p>
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
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Fulfillment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedOrders.length} order(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleBulkAction('mark-shipped')}>
                  <Truck className="h-4 w-4 mr-2" />
                  Mark as Shipped
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('export-csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('print-invoices')}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Invoices
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedOrders.includes(order.id)}
                      onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">#{order.orderNumber}</div>
                    {order.isNew && (
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{order.orderDate}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.total} SEK</div>
                  </TableCell>
                  <TableCell>
                    {getPaymentBadge(order.payment.status)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.fulfillmentStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.deliveryMethod === 'shipping' ? 'Shipping' : 'Pickup'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Order details and fulfillment management
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Customer Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p>{selectedOrder.customer.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p>{selectedOrder.customer.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p>{selectedOrder.customer.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Shipping Address</Label>
                        <p>
                          {selectedOrder.customer.address.street}<br />
                          {selectedOrder.customer.address.city}, {selectedOrder.customer.address.state} {selectedOrder.customer.address.zipCode}<br />
                          {selectedOrder.customer.address.country}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 border rounded">
                          <img
                            src={item.thumbnail}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <p className="text-sm text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{item.price * item.quantity} SEK</p>
                            <p className="text-sm text-gray-500">{item.price} SEK each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order Summary */}
                    <div className="mt-6 border-t pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{selectedOrder.subtotal} SEK</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{selectedOrder.shippingCost} SEK</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-{selectedOrder.discount} SEK</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>{selectedOrder.total} SEK</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Payment Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Payment Method</Label>
                        <p>{selectedOrder.payment.method}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <div>{getPaymentBadge(selectedOrder.payment.status)}</div>
                      </div>
                      {selectedOrder.payment.transactionId && (
                        <div>
                          <Label className="text-sm font-medium">Transaction ID</Label>
                          <p className="text-sm font-mono">{selectedOrder.payment.transactionId}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium">Amount</Label>
                        <p>{selectedOrder.payment.amount} SEK</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Message */}
                {selectedOrder.customerMessage && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{selectedOrder.customerMessage}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="fulfillment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Fulfillment Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Update Status */}
                    <div className="space-y-2">
                      <Label>Update Order Status</Label>
                      <Select
                        value={selectedOrder.fulfillmentStatus}
                        onValueChange={(value) => handleUpdateStatus(selectedOrder.id, value as Order['fulfillmentStatus'])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tracking Information */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tracking Number</Label>
                          <Input
                            placeholder="Enter tracking number"
                            defaultValue={selectedOrder.trackingNumber}
                            onBlur={(e) => {
                              if (e.target.value && selectedOrder.trackingNumber !== e.target.value) {
                                handleAddTracking(selectedOrder.id, e.target.value, selectedOrder.shippingProvider || '');
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Shipping Provider</Label>
                          <Select
                            value={selectedOrder.shippingProvider || ''}
                            onValueChange={(value) => {
                              setOrders(prev => prev.map(order => 
                                order.id === selectedOrder.id ? { ...order, shippingProvider: value } : order
                              ));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UPS">UPS</SelectItem>
                              <SelectItem value="FedEx">FedEx</SelectItem>
                              <SelectItem value="DHL">DHL</SelectItem>
                              <SelectItem value="USPS">USPS</SelectItem>
                              <SelectItem value="PostNord">PostNord</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => {
                          if (selectedOrder.trackingNumber) {
                            handleUpdateStatus(selectedOrder.id, 'shipped');
                          } else {
                            toast.error('Please add a tracking number first');
                          }
                        }}
                        disabled={selectedOrder.fulfillmentStatus === 'shipped'}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Mark as Shipped
                      </Button>
                    </div>

                    {/* Shipping Information */}
                    <div className="space-y-2">
                      <Label>Shipping Method</Label>
                      <p className="text-sm text-gray-600">{selectedOrder.shippingMethod}</p>
                    </div>

                    {/* Shipping Labels Upload */}
                    <div className="space-y-2">
                      <Label>Shipping Labels & Documents</Label>
                      <FileUpload
                        accept="image/*,.pdf"
                        multiple={true}
                        maxFiles={5}
                        maxSize={10}
                        onFilesUploaded={handleShippingLabelUpload}
                        uploadText="Upload shipping labels, receipts, or packing slips"
                        supportedFormats="Images and PDF documents"
                        existingFiles={selectedOrder.shippingLabels || []}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                    <CardDescription>Private notes for internal use</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Add internal notes about this order..."
                        rows={6}
                      />
                    </div>
                    <Button onClick={handleSaveNotes}>
                      Save Notes
                    </Button>

                    {/* Order Attachments */}
                    <div className="space-y-2 mt-6">
                      <Label>Order Documents & Attachments</Label>
                      <FileUpload
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        multiple={true}
                        maxFiles={10}
                        maxSize={10}
                        onFilesUploaded={handleAttachmentUpload}
                        uploadText="Upload receipts, invoices, or other order-related documents"
                        supportedFormats="Images, PDFs, and documents"
                        existingFiles={selectedOrder.attachments || []}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders; 