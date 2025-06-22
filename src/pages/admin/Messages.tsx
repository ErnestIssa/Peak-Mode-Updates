import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Download, 
  Reply, 
  Archive, 
  Mail, 
  Clock, 
  User, 
  MessageSquare,
  ShoppingCart,
  HelpCircle,
  Star,
  Send,
  Save,
  Eye,
  EyeOff,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

// Types
interface Message {
  id: string;
  senderName: string;
  email: string;
  subject: string;
  message: string;
  category: 'general' | 'product-help' | 'order-issue' | 'feedback' | 'returns';
  source: 'contact-form' | 'product-question' | 'order-inquiry';
  status: 'new' | 'read' | 'replied' | 'archived';
  dateReceived: string;
  orderNumber?: string;
  replies: Reply[];
  isPriority: boolean;
}

interface Reply {
  id: string;
  messageId: string;
  content: string;
  isFromAdmin: boolean;
  date: string;
  attachments?: string[];
}

interface Draft {
  id: string;
  messageId: string;
  content: string;
  subject: string;
  lastSaved: string;
}

const Messages = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderName: 'John Smith',
      email: 'john.smith@email.com',
      subject: 'Product Question - Wireless Headphones',
      message: 'Hi, I have a question about the wireless headphones. Do they support Bluetooth 5.0? Also, what\'s the battery life like? I\'m considering purchasing them for my daily commute.',
      category: 'product-help',
      source: 'product-question',
      status: 'new',
      dateReceived: '2024-01-15T10:30:00Z',
      replies: [],
      isPriority: true
    },
    {
      id: '2',
      senderName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      subject: 'Order #12345 - Delivery Issue',
      message: 'Hello, I placed an order last week (Order #12345) but it hasn\'t arrived yet. The tracking shows it was delivered but I haven\'t received it. Can you help me track this down?',
      category: 'order-issue',
      source: 'order-inquiry',
      status: 'read',
      dateReceived: '2024-01-14T15:45:00Z',
      orderNumber: '12345',
      replies: [
        {
          id: 'r1',
          messageId: '2',
          content: 'Hi Sarah, I\'ve looked into your order and I can see the issue. The package was delivered to the wrong address. I\'ve arranged for a replacement to be sent out immediately. You should receive it within 2-3 business days.',
          isFromAdmin: true,
          date: '2024-01-14T16:00:00Z'
        }
      ],
      isPriority: false
    },
    {
      id: '3',
      senderName: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      subject: 'General Inquiry',
      message: 'I\'m interested in your products and would like to know if you offer bulk discounts for corporate purchases. We\'re looking to order around 50 units.',
      category: 'general',
      source: 'contact-form',
      status: 'replied',
      dateReceived: '2024-01-13T09:15:00Z',
      replies: [
        {
          id: 'r2',
          messageId: '3',
          content: 'Hi Mike, thank you for your interest! Yes, we do offer corporate discounts for bulk orders. I\'ve attached our pricing sheet for orders of 50+ units. Please let me know if you need any additional information.',
          isFromAdmin: true,
          date: '2024-01-13T10:30:00Z'
        }
      ],
      isPriority: false
    },
    {
      id: '4',
      senderName: 'Emily Davis',
      email: 'emily.davis@email.com',
      subject: 'Return Request - Order #12350',
      message: 'I received my order but the product doesn\'t work as expected. I\'d like to return it for a refund. The order number is #12350.',
      category: 'returns',
      source: 'order-inquiry',
      status: 'new',
      dateReceived: '2024-01-15T11:20:00Z',
      orderNumber: '12350',
      replies: [],
      isPriority: false
    },
    {
      id: '5',
      senderName: 'David Brown',
      email: 'david.brown@email.com',
      subject: 'Feedback - Great Service!',
      message: 'Just wanted to say thank you for the excellent service. The product quality is amazing and delivery was super fast. Will definitely shop here again!',
      category: 'feedback',
      source: 'contact-form',
      status: 'read',
      dateReceived: '2024-01-12T14:30:00Z',
      replies: [],
      isPriority: false
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  // Helper functions
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'read': return 'bg-gray-500';
      case 'replied': return 'bg-green-500';
      case 'archived': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'product-help': return <HelpCircle className="w-4 h-4" />;
      case 'order-issue': return <ShoppingCart className="w-4 h-4" />;
      case 'feedback': return <Star className="w-4 h-4" />;
      case 'returns': return <Archive className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'contact-form': return <Mail className="w-4 h-4" />;
      case 'product-question': return <HelpCircle className="w-4 h-4" />;
      case 'order-inquiry': return <ShoppingCart className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter(message => {
      const matchesSearch = 
        message.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || message.category === categoryFilter;
      const matchesSource = sourceFilter === 'all' || message.source === sourceFilter;
      const matchesArchived = showArchived ? true : message.status !== 'archived';

      return matchesSearch && matchesStatus && matchesCategory && matchesSource && matchesArchived;
    });
  }, [messages, searchTerm, statusFilter, categoryFilter, sourceFilter, showArchived]);

  // Message actions
  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' as const } : msg
    ));
    toast.success('Message marked as read');
  };

  const markAsReplied = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'replied' as const } : msg
    ));
  };

  const archiveMessage = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, status: 'archived' as const } : msg
    ));
    toast.success('Message archived');
  };

  const updateCategory = (messageId: string, category: Message['category']) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, category } : msg
    ));
    toast.success('Category updated');
  };

  const sendReply = () => {
    if (!selectedMessage || !replyContent.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    const newReply: Reply = {
      id: generateId(),
      messageId: selectedMessage.id,
      content: replyContent,
      isFromAdmin: true,
      date: new Date().toISOString()
    };

    setMessages(messages.map(msg => 
      msg.id === selectedMessage.id 
        ? { 
            ...msg, 
            replies: [...msg.replies, newReply],
            status: 'replied' as const
          }
        : msg
    ));

    // Clear reply form
    setReplyContent('');
    setReplySubject('');
    
    // Remove draft
    setDrafts(drafts.filter(draft => draft.messageId !== selectedMessage.id));
    
    toast.success('Reply sent successfully');
  };

  const saveDraft = () => {
    if (!selectedMessage || !replyContent.trim()) {
      toast.error('Please enter content to save as draft');
      return;
    }

    const existingDraftIndex = drafts.findIndex(draft => draft.messageId === selectedMessage.id);
    const newDraft: Draft = {
      id: existingDraftIndex >= 0 ? drafts[existingDraftIndex].id : generateId(),
      messageId: selectedMessage.id,
      content: replyContent,
      subject: replySubject,
      lastSaved: new Date().toISOString()
    };

    if (existingDraftIndex >= 0) {
      setDrafts(drafts.map((draft, index) => 
        index === existingDraftIndex ? newDraft : draft
      ));
    } else {
      setDrafts([...drafts, newDraft]);
    }

    toast.success('Draft saved');
  };

  const loadDraft = (messageId: string) => {
    const draft = drafts.find(d => d.messageId === messageId);
    if (draft) {
      setReplyContent(draft.content);
      setReplySubject(draft.subject);
      toast.success('Draft loaded');
    }
  };

  const exportMessages = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Sender Name,Email,Subject,Category,Status,Date Received,Order Number\n"
      + filteredMessages.map(msg => 
          `"${msg.senderName}","${msg.email}","${msg.subject}","${msg.category}","${msg.status}","${formatDate(msg.dateReceived)}","${msg.orderNumber || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `messages_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Messages exported successfully');
  };

  const stats = useMemo(() => {
    const total = messages.length;
    const newCount = messages.filter(m => m.status === 'new').length;
    const repliedCount = messages.filter(m => m.status === 'replied').length;
    const archivedCount = messages.filter(m => m.status === 'archived').length;

    return { total, newCount, repliedCount, archivedCount };
  }, [messages]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportMessages}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600">{stats.newCount}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{stats.newCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Replied</p>
                <p className="text-2xl font-bold text-green-600">{stats.repliedCount}</p>
              </div>
              <Reply className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.archivedCount}</p>
              </div>
              <Archive className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inbox */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inbox</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowArchived(!showArchived)}
                >
                  {showArchived ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </CardTitle>
              
              {/* Search and Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="product-help">Product Help</SelectItem>
                      <SelectItem value="order-issue">Order Issue</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="returns">Returns</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="contact-form">Contact Form</SelectItem>
                      <SelectItem value="product-question">Product Question</SelectItem>
                      <SelectItem value="order-inquiry">Order Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No messages found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                          selectedMessage?.id === message.id 
                            ? 'bg-blue-50 border-blue-500' 
                            : 'border-transparent'
                        } ${message.status === 'new' ? 'bg-yellow-50' : ''}`}
                        onClick={() => {
                          setSelectedMessage(message);
                          markAsRead(message.id);
                          if (replyContent) {
                            saveDraft();
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm truncate">
                                {message.senderName}
                              </span>
                              {message.isPriority && (
                                <Badge variant="destructive" className="text-xs">Priority</Badge>
                              )}
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${getStatusColor(message.status)} text-white`}
                              >
                                {message.status}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {message.message.substring(0, 60)}...
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-400">
                                {formatDate(message.dateReceived)}
                              </span>
                              {getCategoryIcon(message.category)}
                              {getSourceIcon(message.source)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Viewer */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {selectedMessage.subject}
                      {selectedMessage.isPriority && (
                        <Badge variant="destructive">Priority</Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedMessage.senderName}
                      </span>
                      <span>{selectedMessage.email}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(selectedMessage.dateReceived)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      value={selectedMessage.category} 
                      onValueChange={(value) => updateCategory(selectedMessage.id, value as Message['category'])}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="product-help">Product Help</SelectItem>
                        <SelectItem value="order-issue">Order Issue</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="returns">Returns</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => archiveMessage(selectedMessage.id)}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Original Message */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Original Message</span>
                    {selectedMessage.orderNumber && (
                      <Badge variant="outline">Order #{selectedMessage.orderNumber}</Badge>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {/* Reply Thread */}
                {selectedMessage.replies.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Reply History</h3>
                    {selectedMessage.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-lg ${
                          reply.isFromAdmin ? 'bg-blue-50 ml-8' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {reply.isFromAdmin ? 'Admin Reply' : 'Customer'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(reply.date)}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Reply</h3>
                    <div className="flex gap-2">
                      {drafts.find(d => d.messageId === selectedMessage.id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => loadDraft(selectedMessage.id)}
                        >
                          Load Draft
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveDraft}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                    </div>
                  </div>
                  
                  <Input
                    placeholder="Subject (optional)"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                  />
                  
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setReplyContent('');
                        setReplySubject('');
                      }}
                    >
                      Clear
                    </Button>
                    <Button onClick={sendReply}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Message</h3>
                <p className="text-gray-500">
                  Choose a message from the inbox to view details and reply
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages; 