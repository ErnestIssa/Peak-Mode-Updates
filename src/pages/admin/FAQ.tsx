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
  Search, Filter, Eye, Edit, Trash2, Plus, EyeOff, GripVertical,
  FileText, Tag, Calendar, CheckCircle, XCircle, ArrowUp, ArrowDown,
  Settings, FolderOpen, SortAsc, SortDesc
} from 'lucide-react';
import { toast } from 'sonner';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isVisible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within Sweden. Express shipping is available for next-day delivery in most areas. International shipping times vary by location.',
      category: 'Shipping & Delivery',
      isVisible: true,
      order: 1,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all unused items in original packaging. Returns are free for customers in Sweden. International returns may incur shipping costs.',
      category: 'Returns & Exchanges',
      isVisible: true,
      order: 1,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    },
    {
      id: '3',
      question: 'How do I find my correct size?',
      answer: 'We provide detailed size charts for each product. Measure your chest, waist, and hips, then compare with our size guide. If you\'re between sizes, we recommend sizing up.',
      category: 'Sizing Guide',
      isVisible: true,
      order: 1,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-12'
    },
    {
      id: '4',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can check shipping options during checkout.',
      category: 'Shipping & Delivery',
      isVisible: true,
      order: 2,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-18'
    },
    {
      id: '5',
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order in your account dashboard.',
      category: 'Orders & Payment',
      isVisible: false,
      order: 1,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-22'
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Shipping & Delivery', order: 1, isActive: true },
    { id: '2', name: 'Returns & Exchanges', order: 2, isActive: true },
    { id: '3', name: 'Sizing Guide', order: 3, isActive: true },
    { id: '4', name: 'Orders & Payment', order: 4, isActive: true },
    { id: '5', name: 'Product Care', order: 5, isActive: true }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [showFAQDialog, setShowFAQDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // New FAQ form state
  const [newFAQ, setNewFAQ] = useState({
    question: '',
    answer: '',
    category: '',
    isVisible: true,
    order: 1
  });

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    order: 1,
    isActive: true
  });

  // Analytics
  const analytics = {
    totalFAQs: faqs.length,
    visibleFAQs: faqs.filter(f => f.isVisible).length,
    hiddenFAQs: faqs.filter(f => !f.isVisible).length,
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.isActive).length
  };

  // Filtered and sorted FAQs
  const filteredFAQs = faqs
    .filter(faq => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
      const matchesVisibility = visibilityFilter === 'all' || 
        (visibilityFilter === 'visible' && faq.isVisible) ||
        (visibilityFilter === 'hidden' && !faq.isVisible);
      
      return matchesSearch && matchesCategory && matchesVisibility;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'question':
          comparison = a.question.localeCompare(b.question);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'order':
        default:
          comparison = a.order - b.order;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleAddFAQ = () => {
    if (!newFAQ.question.trim() || !newFAQ.answer.trim() || !newFAQ.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const faq: FAQ = {
      id: Date.now().toString(),
      question: newFAQ.question,
      answer: newFAQ.answer,
      category: newFAQ.category,
      isVisible: newFAQ.isVisible,
      order: newFAQ.order,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setFaqs(prev => [...prev, faq]);
    setShowFAQDialog(false);
    setNewFAQ({
      question: '',
      answer: '',
      category: '',
      isVisible: true,
      order: 1
    });
    toast.success('FAQ added successfully');
  };

  const handleEditFAQ = () => {
    if (!selectedFAQ || !newFAQ.question.trim() || !newFAQ.answer.trim() || !newFAQ.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    setFaqs(prev => prev.map(faq => 
      faq.id === selectedFAQ.id ? {
        ...faq,
        question: newFAQ.question,
        answer: newFAQ.answer,
        category: newFAQ.category,
        isVisible: newFAQ.isVisible,
        order: newFAQ.order,
        updatedAt: new Date().toISOString().split('T')[0]
      } : faq
    ));
    setShowFAQDialog(false);
    setSelectedFAQ(null);
    setIsEditing(false);
    setNewFAQ({
      question: '',
      answer: '',
      category: '',
      isVisible: true,
      order: 1
    });
    toast.success('FAQ updated successfully');
  };

  const handleDeleteFAQ = (faqId: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== faqId));
    toast.success('FAQ deleted successfully');
  };

  const handleToggleVisibility = (faqId: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === faqId ? { ...faq, isVisible: !faq.isVisible } : faq
    ));
    toast.success('FAQ visibility updated');
  };

  const handleMoveFAQ = (faqId: string, direction: 'up' | 'down') => {
    setFaqs(prev => {
      const currentIndex = prev.findIndex(faq => faq.id === faqId);
      if (currentIndex === -1) return prev;
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const newFaqs = [...prev];
      [newFaqs[currentIndex], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[currentIndex]];
      // Update order numbers
      return newFaqs.map((faq, index) => ({ ...faq, order: index + 1 }));
    });
    toast.success(`FAQ moved ${direction}`);
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      order: newCategory.order,
      isActive: newCategory.isActive
    };
    setCategories(prev => [...prev, category]);
    setShowCategoryDialog(false);
    setNewCategory({
      name: '',
      order: 1,
      isActive: true
    });
    toast.success('Category added successfully');
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && faqs.some(f => f.category === category.name)) {
      toast.error('Cannot delete category with existing FAQs');
      return;
    }
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    toast.success('Category deleted successfully');
  };

  const openEditFAQDialog = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setNewFAQ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isVisible: faq.isVisible,
      order: faq.order
    });
    setIsEditing(true);
    setShowFAQDialog(true);
  };

  const getVisibilityBadge = (isVisible: boolean) => {
    return (
      <Badge className={isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
        {isVisible ? 'Visible' : 'Hidden'}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryStyles = {
      'Shipping & Delivery': 'bg-blue-100 text-blue-800',
      'Returns & Exchanges': 'bg-green-100 text-green-800',
      'Sizing Guide': 'bg-purple-100 text-purple-800',
      'Orders & Payment': 'bg-orange-100 text-orange-800',
      'Product Care': 'bg-pink-100 text-pink-800'
    };

    return (
      <Badge className={categoryStyles[category as keyof typeof categoryStyles] || 'bg-gray-100 text-gray-800'}>
        {category}
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
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.totalFAQs}</div>
                <div className="text-sm text-gray-500">Total FAQs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.visibleFAQs}</div>
                <div className="text-sm text-gray-500">Visible</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <EyeOff className="h-5 w-5 text-gray-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.hiddenFAQs}</div>
                <div className="text-sm text-gray-500">Hidden</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.totalCategories}</div>
                <div className="text-sm text-gray-500">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.activeCategories}</div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-gray-500">Manage frequently asked questions and categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCategoryDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Manage Categories
          </Button>
          <Button onClick={() => {
            setIsEditing(false);
            setNewFAQ({
              question: '',
              answer: '',
              category: '',
              isVisible: true,
              order: 1
            });
            setShowFAQDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
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
                  placeholder="Search FAQs by question or answer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="createdAt">Date Created</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Order</TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Answer Preview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFAQs.map((faq, index) => (
                <TableRow key={faq.id}>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{faq.order}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium max-w-xs truncate">{faq.question}</div>
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(faq.category)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getVisibilityBadge(faq.isVisible)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{faq.updatedAt}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditFAQDialog(faq)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleVisibility(faq.id)}
                      >
                        {faq.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveFAQ(faq.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveFAQ(faq.id, 'down')}
                        disabled={index === filteredFAQs.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteFAQ(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* FAQ Dialog */}
      <Dialog open={showFAQDialog} onOpenChange={setShowFAQDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the FAQ information' : 'Create a new frequently asked question'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input
                value={newFAQ.question}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter the question..."
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={newFAQ.category}
                onValueChange={(value) => setNewFAQ(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea
                value={newFAQ.answer}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter the answer..."
                rows={6}
              />
              <p className="text-xs text-gray-500">
                You can use basic formatting. For links, use [text](url) format.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order Position</Label>
                <Input
                  type="number"
                  value={newFAQ.order}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newFAQ.isVisible}
                  onCheckedChange={(checked) => setNewFAQ(prev => ({ ...prev, isVisible: checked }))}
                />
                <Label>Visible on site</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowFAQDialog(false)}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleEditFAQ : handleAddFAQ}>
                {isEditing ? 'Update FAQ' : 'Add FAQ'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Management Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add, edit, and organize FAQ categories
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">Categories</TabsTrigger>
              <TabsTrigger value="add">Add Category</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-gray-500">Order: {category.order}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name..."
                />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input
                  type="number"
                  value={newCategory.order}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newCategory.isActive}
                  onCheckedChange={(checked) => setNewCategory(prev => ({ ...prev, isActive: checked }))}
                />
                <Label>Active</Label>
              </div>
              <Button onClick={handleAddCategory}>
                Add Category
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQ; 