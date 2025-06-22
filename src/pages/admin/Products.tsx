import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, Upload, X, FileText, Video, Image, Search, Filter, 
  Edit, Trash2, Eye, EyeOff, MoreHorizontal, Save
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: File[];
  videos: File[];
  sizes: string[];
  category: string;
  collectionTags: string[];
  productType: string;
  inventoryQuantity: number;
  status: string;
  isFeatured: boolean;
  shippingWeight?: number;
  sizeGuide?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Product extends Omit<ProductFormData, 'images' | 'videos'> {
  id: string;
  images: string[];
  videos: string[];
  thumbnail: string;
}

const Products = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Mock products data - replace with actual API calls
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Performance T-Shirt',
      description: 'High-performance athletic t-shirt',
      price: 299,
      discountPrice: 249,
      images: ['https://via.placeholder.com/300x400'],
      videos: [],
      thumbnail: 'https://via.placeholder.com/300x400',
      sizes: ['S', 'M', 'L', 'XL'],
      category: 'Men',
      collectionTags: ['Performance', 'Bestseller'],
      productType: 'T-Shirts',
      inventoryQuantity: 50,
      status: 'active',
      isFeatured: true,
      shippingWeight: 0.2,
      sizeGuide: 'Standard sizing',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Athletic Hoodie',
      description: 'Comfortable athletic hoodie',
      price: 399,
      discountPrice: 0,
      images: ['https://via.placeholder.com/300x400'],
      videos: [],
      thumbnail: 'https://via.placeholder.com/300x400',
      sizes: ['M', 'L', 'XL'],
      category: 'Women',
      collectionTags: ['New Arrival'],
      productType: 'Hoodies',
      inventoryQuantity: 5,
      status: 'active',
      isFeatured: false,
      shippingWeight: 0.4,
      sizeGuide: 'Fitted sizing',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    }
  ]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    images: [],
    videos: [],
    sizes: [],
    category: '',
    collectionTags: [],
    productType: '',
    inventoryQuantity: 0,
    status: 'draft',
    isFeatured: false,
    shippingWeight: 0,
    sizeGuide: '',
  });

  const categories = ['Men', 'Women', 'Accessories'];
  const productTypes = ['Shorts', 'Hoodies', 'Leggings', 'T-Shirts', 'Tank Tops', 'Jackets', 'Pants', 'Socks', 'Hats', 'Bags'];
  const statusOptions = ['Draft', 'Active', 'Hidden'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const collectionTagOptions = [
    'New Arrival', 'Bestseller', 'Performance', 'Summer 2025', 
    'Winter Collection', 'Limited Edition', 'Trending', 'Staff Pick'
  ];

  // Inventory summary
  const inventorySummary = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    draftProducts: products.filter(p => p.status === 'draft').length,
    lowStockProducts: products.filter(p => p.inventoryQuantity <= 10).length,
    featuredProducts: products.filter(p => p.isFeatured).length
  };

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    if (isCreating || isEditing) {
      const timer = setTimeout(() => {
        saveAsDraft();
      }, 30000); // Auto-save every 30 seconds
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [formData, isCreating, isEditing]);

  const saveAsDraft = () => {
    if (formData.name || formData.description) {
      localStorage.setItem('productDraft', JSON.stringify(formData));
      toast.success('Draft saved automatically');
    }
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('productDraft');
    if (draft) {
      setFormData(JSON.parse(draft));
      toast.success('Draft loaded');
    }
  };

  const clearDraft = () => {
    localStorage.removeItem('productDraft');
  };

  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCollection = collectionFilter === 'all' || 
                             product.collectionTags.some(tag => tag === collectionFilter);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesCollection;
  });

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList, type: 'images' | 'videos') => {
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileArray]
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'images' | 'videos') => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files, type);
  };

  const removeFile = (index: number, type: 'images' | 'videos') => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      collectionTags: prev.collectionTags.includes(tag)
        ? prev.collectionTags.filter(t => t !== tag)
        : [...prev.collectionTags, tag]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      discountPrice: 0,
      images: [],
      videos: [],
      sizes: [],
      category: '',
      collectionTags: [],
      productType: '',
      inventoryQuantity: 0,
      status: 'draft',
      isFeatured: false,
      shippingWeight: 0,
      sizeGuide: '',
    });
    clearDraft();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (formData.sizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.productType) {
      toast.error('Please select a product type');
      return;
    }

    try {
      if (isEditing && editingProductId) {
        // Update existing product
        const updatedProduct: Product = {
          ...formData,
          id: editingProductId,
          thumbnail: formData.images.length > 0 ? URL.createObjectURL(formData.images[0]) : '',
          images: formData.images.map(file => URL.createObjectURL(file)),
          videos: formData.videos.map(file => URL.createObjectURL(file)),
          updatedAt: new Date().toISOString().split('T')[0]
        };
        
        setProducts(prev => prev.map(p => p.id === editingProductId ? updatedProduct : p));
        toast.success('Product updated successfully!');
      } else {
        // Create new product
        const newProduct: Product = {
          ...formData,
          id: Date.now().toString(),
          thumbnail: formData.images.length > 0 ? URL.createObjectURL(formData.images[0]) : '',
          images: formData.images.map(file => URL.createObjectURL(file)),
          videos: formData.videos.map(file => URL.createObjectURL(file)),
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        
        setProducts(prev => [...prev, newProduct]);
        toast.success('Product created successfully!');
      }
      
      resetForm();
      setIsCreating(false);
      setIsEditing(false);
      setEditingProductId(null);
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      images: [],
      videos: [],
      sizes: product.sizes,
      category: product.category,
      collectionTags: product.collectionTags,
      productType: product.productType,
      inventoryQuantity: product.inventoryQuantity,
      status: product.status,
      isFeatured: product.isFeatured,
      shippingWeight: product.shippingWeight || 0,
      sizeGuide: product.sizeGuide || '',
    });
    setEditingProductId(product.id);
    setIsEditing(true);
    setIsCreating(false);
    setActiveTab('create');
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
    }
  };

  const handleStatusToggle = (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'hidden' : 'active';
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, status: newStatus } : p
    ));
    toast.success(`Product ${newStatus === 'active' ? 'activated' : 'hidden'} successfully!`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first');
      return;
    }

    switch (action) {
      case 'activate':
        setProducts(prev => prev.map(p => 
          selectedProducts.includes(p.id) ? { ...p, status: 'active' } : p
        ));
        toast.success('Products activated successfully!');
        break;
      case 'hide':
        setProducts(prev => prev.map(p => 
          selectedProducts.includes(p.id) ? { ...p, status: 'hidden' } : p
        ));
        toast.success('Products hidden successfully!');
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
          setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id)));
          toast.success('Products deleted successfully!');
        }
        break;
      case 'feature':
        setProducts(prev => prev.map(p => 
          selectedProducts.includes(p.id) ? { ...p, isFeatured: true } : p
        ));
        toast.success('Products marked as featured!');
        break;
    }
    setSelectedProducts([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{inventorySummary.totalProducts}</div>
            <div className="text-sm text-gray-500">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{inventorySummary.activeProducts}</div>
            <div className="text-sm text-gray-500">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{inventorySummary.draftProducts}</div>
            <div className="text-sm text-gray-500">Drafts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{inventorySummary.lowStockProducts}</div>
            <div className="text-sm text-gray-500">Low Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{inventorySummary.featuredProducts}</div>
            <div className="text-sm text-gray-500">Featured</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <Button onClick={() => {
          setIsCreating(true);
          setIsEditing(false);
          setEditingProductId(null);
          resetForm();
          setActiveTab('create');
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="list">Product List</TabsTrigger>
          <TabsTrigger value="create" onClick={() => {
            setIsCreating(true);
            setIsEditing(false);
            setEditingProductId(null);
            resetForm();
          }}>
            {isEditing ? 'Edit Product' : 'Create Product'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
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
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={collectionFilter} onValueChange={setCollectionFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Collections</SelectItem>
                    {collectionTagOptions.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedProducts.length} product(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleBulkAction('activate')}>
                      Activate
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('hide')}>
                      Hide
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('feature')}>
                      Feature
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.productType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.price} SEK</div>
                          {product.discountPrice && product.discountPrice > 0 && (
                            <div className="text-sm text-red-600">{product.discountPrice} SEK</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                            {product.status}
                          </Badge>
                          <Switch
                            checked={product.status === 'active'}
                            onCheckedChange={() => handleStatusToggle(product.id, product.status)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${product.inventoryQuantity <= 10 ? 'text-red-600' : ''}`}>
                          {product.inventoryQuantity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">{product.updatedAt}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product.id)}
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
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          {(isCreating || isEditing) && (
            <Card>
              <CardHeader>
                <CardTitle>{isEditing ? 'Edit Product' : 'Create New Product'}</CardTitle>
                <CardDescription>
                  {isEditing ? 'Update product information' : 'Add a new product to your catalog'}
                </CardDescription>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={loadDraft}>
                    Load Draft
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Product Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter product description"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (SEK) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountPrice">Discount Price (SEK)</Label>
                        <Input
                          id="discountPrice"
                          type="number"
                          value={formData.discountPrice}
                          onChange={(e) => handleInputChange('discountPrice', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Media</h3>
                    
                    {/* Product Images */}
                    <div className="space-y-2">
                      <Label>Product Images *</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center ${
                          dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'images')}
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag and drop images here, or click to select files
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'images')}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload">
                          <Button variant="outline" type="button">
                            <Image className="h-4 w-4 mr-2" />
                            Select Images
                          </Button>
                        </label>
                      </div>
                      
                      {/* Display uploaded images */}
                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                          {formData.images.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index, 'images')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Videos */}
                    <div className="space-y-2">
                      <Label>Product Videos (Optional)</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center ${
                          dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'videos')}
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag and drop videos here, or click to select files
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="video/*"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'videos')}
                          className="hidden"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload">
                          <Button variant="outline" type="button">
                            <Video className="h-4 w-4 mr-2" />
                            Select Videos
                          </Button>
                        </label>
                      </div>
                      
                      {/* Display uploaded videos */}
                      {formData.videos.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                          {formData.videos.map((file, index) => (
                            <div key={index} className="relative">
                              <video
                                src={URL.createObjectURL(file)}
                                className="w-full h-24 object-cover rounded"
                                controls
                              />
                              <button
                                type="button"
                                onClick={() => removeFile(index, 'videos')}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Product Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="productType">Product Type *</Label>
                        <Select value={formData.productType} onValueChange={(value) => handleInputChange('productType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                          <SelectContent>
                            {productTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Sizes Available *</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {sizeOptions.map((size) => (
                          <div key={size} className="flex items-center space-x-2">
                            <Checkbox
                              id={size}
                              checked={formData.sizes.includes(size)}
                              onCheckedChange={() => handleSizeToggle(size)}
                            />
                            <Label htmlFor={size}>{size}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Collection Tags</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {collectionTagOptions.map((tag) => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              id={tag}
                              checked={formData.collectionTags.includes(tag)}
                              onCheckedChange={() => handleTagToggle(tag)}
                            />
                            <Label htmlFor={tag}>{tag}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="inventoryQuantity">Inventory Quantity *</Label>
                        <Input
                          id="inventoryQuantity"
                          type="number"
                          value={formData.inventoryQuantity}
                          onChange={(e) => handleInputChange('inventoryQuantity', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="shippingWeight">Shipping Weight (kg)</Label>
                        <Input
                          id="shippingWeight"
                          type="number"
                          value={formData.shippingWeight}
                          onChange={(e) => handleInputChange('shippingWeight', parseFloat(e.target.value) || 0)}
                          placeholder="0.0"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status.toLowerCase()}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sizeGuide">Size Guide</Label>
                      <Textarea
                        id="sizeGuide"
                        value={formData.sizeGuide}
                        onChange={(e) => handleInputChange('sizeGuide', e.target.value)}
                        placeholder="Enter size guide information..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                      />
                      <Label htmlFor="isFeatured">Feature Product (Show on homepage)</Label>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setIsEditing(false);
                        setEditingProductId(null);
                        resetForm();
                        setActiveTab('list');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditing ? 'Update Product' : 'Create Product'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Products; 