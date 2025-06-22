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
  Search, Filter, Eye, CheckCircle, Archive, Trash2, MessageSquare, Star,
  User, Mail, Calendar, ThumbsUp, TrendingUp, Plus, Image, Video,
  Crown, Award, BarChart3, Star as StarIcon, Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface Review {
  id: string;
  reviewerName: string;
  reviewerEmail?: string;
  product: Product;
  rating: number;
  reviewText: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  isStaffPick: boolean;
  isFeatured: boolean;
  tags: string[];
  adminReply?: string;
  internalNotes?: string;
  reviewImage?: string;
  reviewVideo?: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      reviewerName: 'Sarah Johnson',
      reviewerEmail: 'sarah@example.com',
      product: {
        id: '1',
        name: 'Performance T-Shirt',
        image: 'https://via.placeholder.com/100x100',
        price: 299
      },
      rating: 5,
      reviewText: 'Absolutely love this t-shirt! The fabric is incredibly soft and breathable. Perfect for my morning runs and gym sessions. The fit is exactly as expected and it washes really well. Highly recommend!',
      dateSubmitted: '2024-01-20',
      status: 'approved',
      isStaffPick: true,
      isFeatured: true,
      tags: ['Featured', 'Top Rated'],
      adminReply: 'Thank you for your wonderful review, Sarah! We\'re so glad you love the Performance T-Shirt.',
      internalNotes: 'Great detailed review, customer seems very satisfied'
    },
    {
      id: '2',
      reviewerName: 'Anonymous',
      product: {
        id: '2',
        name: 'Athletic Hoodie',
        image: 'https://via.placeholder.com/100x100',
        price: 399
      },
      rating: 4,
      reviewText: 'Good quality hoodie, comfortable fit. The material is nice and warm for outdoor activities.',
      dateSubmitted: '2024-01-19',
      status: 'pending',
      isStaffPick: false,
      isFeatured: false,
      tags: [],
      internalNotes: 'Anonymous review, moderate rating'
    },
    {
      id: '3',
      reviewerName: 'Mike Chen',
      reviewerEmail: 'mike@example.com',
      product: {
        id: '3',
        name: 'Athletic Leggings',
        image: 'https://via.placeholder.com/100x100',
        price: 199
      },
      rating: 3,
      reviewText: 'The leggings are okay but run a bit small. The material is comfortable but I expected better quality for the price.',
      dateSubmitted: '2024-01-18',
      status: 'approved',
      isStaffPick: false,
      isFeatured: false,
      tags: [],
      internalNotes: 'Customer mentions sizing issue, consider adding size guide'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReviewDetails, setShowReviewDetails] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [adminReply, setAdminReply] = useState('');

  // New review form state
  const [newReview, setNewReview] = useState({
    reviewerName: '',
    reviewerEmail: '',
    productId: '',
    rating: 5,
    reviewText: '',
    isStaffPick: false,
    reviewImage: '',
    reviewVideo: ''
  });

  // Mock products for the form
  const products = [
    { id: '1', name: 'Performance T-Shirt', image: 'https://via.placeholder.com/100x100' },
    { id: '2', name: 'Athletic Hoodie', image: 'https://via.placeholder.com/100x100' },
    { id: '3', name: 'Athletic Leggings', image: 'https://via.placeholder.com/100x100' }
  ];

  // Analytics
  const analytics = {
    averageRating: reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length,
    fiveStarPercentage: (reviews.filter(r => r.rating === 5).length / reviews.length) * 100,
    mostReviewedProduct: 'Performance T-Shirt',
    totalReviews: reviews.length,
    pendingReviews: reviews.filter(r => r.status === 'pending').length,
    approvedReviews: reviews.filter(r => r.status === 'approved').length
  };

  // Filtered reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewText.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProduct = productFilter === 'all' || review.product.id === productFilter;
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = review.dateSubmitted === new Date().toISOString().split('T')[0];
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(review.dateSubmitted) >= weekAgo;
    }
    
    return matchesSearch && matchesProduct && matchesRating && matchesStatus && matchesDate;
  });

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setInternalNotes(review.internalNotes || '');
    setAdminReply(review.adminReply || '');
    setShowReviewDetails(true);
  };

  const handleUpdateStatus = (reviewId: string, status: Review['status']) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status } : review
    ));
    toast.success(`Review status updated to ${status}`);
  };

  const handleSaveNotes = () => {
    if (selectedReview) {
      setReviews(prev => prev.map(review => 
        review.id === selectedReview.id ? { ...review, internalNotes } : review
      ));
      toast.success('Internal notes saved');
    }
  };

  const handleSaveReply = () => {
    if (selectedReview) {
      setReviews(prev => prev.map(review => 
        review.id === selectedReview.id ? { ...review, adminReply } : review
      ));
      toast.success('Admin reply saved');
    }
  };

  const handleToggleStaffPick = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, isStaffPick: !review.isStaffPick } : review
    ));
    toast.success('Staff pick status updated');
  };

  const handleToggleFeatured = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, isFeatured: !review.isFeatured } : review
    ));
    toast.success('Featured status updated');
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    toast.success('Review deleted');
  };

  const handleBulkAction = (action: string) => {
    if (selectedReviews.length === 0) {
      toast.error('Please select reviews first');
      return;
    }

    switch (action) {
      case 'approve':
        setReviews(prev => prev.map(review => 
          selectedReviews.includes(review.id) ? { ...review, status: 'approved' } : review
        ));
        toast.success('Reviews approved');
        break;
      case 'reject':
        setReviews(prev => prev.map(review => 
          selectedReviews.includes(review.id) ? { ...review, status: 'rejected' } : review
        ));
        toast.success('Reviews rejected');
        break;
      case 'archive':
        setReviews(prev => prev.map(review => 
          selectedReviews.includes(review.id) ? { ...review, status: 'archived' } : review
        ));
        toast.success('Reviews archived');
        break;
      case 'delete':
        setReviews(prev => prev.filter(review => !selectedReviews.includes(review.id)));
        toast.success('Reviews deleted');
        break;
    }
    setSelectedReviews([]);
  };

  const handleAddReview = () => {
    const product = products.find(p => p.id === newReview.productId);
    if (!product) {
      toast.error('Please select a product');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      reviewerName: newReview.reviewerName || 'Anonymous',
      reviewerEmail: newReview.reviewerEmail,
      product: {
        id: product.id,
        name: product.name,
        image: product.image,
        price: 0
      },
      rating: newReview.rating,
      reviewText: newReview.reviewText,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: autoApprove ? 'approved' : 'pending',
      isStaffPick: newReview.isStaffPick,
      isFeatured: false,
      tags: newReview.isStaffPick ? ['Staff Pick'] : [],
      reviewImage: newReview.reviewImage,
      reviewVideo: newReview.reviewVideo
    };

    setReviews(prev => [review, ...prev]);
    setShowAddReview(false);
    setNewReview({
      reviewerName: '',
      reviewerEmail: '',
      productId: '',
      rating: 5,
      reviewText: '',
      isStaffPick: false,
      reviewImage: '',
      reviewVideo: ''
    });
    toast.success('Review added successfully');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReviews(filteredReviews.map(r => r.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (reviewId: string, checked: boolean) => {
    if (checked) {
      setSelectedReviews(prev => [...prev, reviewId]);
    } else {
      setSelectedReviews(prev => prev.filter(id => id !== reviewId));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      archived: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
                <div className="text-sm text-gray-500">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.fiveStarPercentage.toFixed(0)}%</div>
                <div className="text-sm text-gray-500">5-Star Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.totalReviews}</div>
                <div className="text-sm text-gray-500">Total Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{analytics.pendingReviews}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm font-bold">{analytics.mostReviewedProduct}</div>
                <div className="text-sm text-gray-500">Top Product</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-gray-500">Manage product and site reviews</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoApprove}
              onCheckedChange={setAutoApprove}
            />
            <Label className="text-sm">Auto-approve new reviews</Label>
          </div>
          <Button onClick={() => setShowAddReview(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Review
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
                  placeholder="Search reviews by name, product, or text..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date" />
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
      {selectedReviews.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedReviews.length} review(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleBulkAction('approve')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('archive')}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedReviews.length === filteredReviews.length && filteredReviews.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReviews.includes(review.id)}
                      onCheckedChange={(checked) => handleSelectReview(review.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{review.reviewerName}</div>
                      {review.reviewerEmail && (
                        <div className="text-sm text-gray-500">{review.reviewerEmail}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <img
                        src={review.product.image}
                        alt={review.product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="text-sm">{review.product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderStars(review.rating)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm line-clamp-2 cursor-pointer hover:text-blue-600" 
                         onClick={() => handleViewReview(review)}>
                        {review.reviewText}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{review.dateSubmitted}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(review.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {review.isStaffPick && (
                        <Badge variant="secondary" className="text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Staff Pick
                        </Badge>
                      )}
                      {review.isFeatured && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewReview(review)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {review.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(review.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStaffPick(review.id)}
                      >
                        <Crown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Details Dialog */}
      <Dialog open={showReviewDetails} onOpenChange={setShowReviewDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Manage review and respond to customer
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Review Details</TabsTrigger>
                <TabsTrigger value="manage">Manage</TabsTrigger>
                <TabsTrigger value="reply">Reply</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Review Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Review Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Reviewer Name</Label>
                        <p>{selectedReview.reviewerName}</p>
                      </div>
                      {selectedReview.reviewerEmail && (
                        <div>
                          <Label className="text-sm font-medium">Email</Label>
                          <p>{selectedReview.reviewerEmail}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium">Rating</Label>
                        <div>{renderStars(selectedReview.rating)}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Date Submitted</Label>
                        <p>{selectedReview.dateSubmitted}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Reviewed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedReview.product.image}
                        alt={selectedReview.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{selectedReview.product.name}</h4>
                        <p className="text-sm text-gray-500">{selectedReview.product.price} SEK</p>
                        <Button size="sm" variant="outline">
                          View Product
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Full Review Text */}
                <Card>
                  <CardHeader>
                    <CardTitle>Review Text</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedReview.reviewText}</p>
                  </CardContent>
                </Card>

                {/* Review Media */}
                {(selectedReview.reviewImage || selectedReview.reviewVideo) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Review Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4">
                        {selectedReview.reviewImage && (
                          <div>
                            <Label className="text-sm font-medium">Image</Label>
                            <img
                              src={selectedReview.reviewImage}
                              alt="Review"
                              className="w-32 h-32 object-cover rounded mt-2"
                            />
                          </div>
                        )}
                        {selectedReview.reviewVideo && (
                          <div>
                            <Label className="text-sm font-medium">Video</Label>
                            <video
                              src={selectedReview.reviewVideo}
                              className="w-32 h-32 object-cover rounded mt-2"
                              controls
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="manage" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Review Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status Management */}
                    <div className="space-y-2">
                      <Label>Update Status</Label>
                      <Select
                        value={selectedReview.status}
                        onValueChange={(value) => handleUpdateStatus(selectedReview.id, value as Review['status'])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Feature Controls */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Staff Pick</Label>
                          <p className="text-sm text-gray-500">Highlight this review as a staff favorite</p>
                        </div>
                        <Switch
                          checked={selectedReview.isStaffPick}
                          onCheckedChange={() => handleToggleStaffPick(selectedReview.id)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Featured Review</Label>
                          <p className="text-sm text-gray-500">Show on homepage or landing pages</p>
                        </div>
                        <Switch
                          checked={selectedReview.isFeatured}
                          onCheckedChange={() => handleToggleFeatured(selectedReview.id)}
                        />
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="space-y-2">
                      <Label>Internal Notes (Admin Only)</Label>
                      <Textarea
                        value={internalNotes}
                        onChange={(e) => setInternalNotes(e.target.value)}
                        placeholder="Add internal notes about this review..."
                        rows={4}
                      />
                      <Button onClick={handleSaveNotes}>
                        Save Notes
                      </Button>
                    </div>

                    {/* Delete Review */}
                    <div className="pt-4 border-t">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleDeleteReview(selectedReview.id);
                          setShowReviewDetails(false);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reply" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Public Reply</CardTitle>
                    <CardDescription>
                      This reply will be visible to customers on the product page
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Admin Reply</Label>
                      <Textarea
                        value={adminReply}
                        onChange={(e) => setAdminReply(e.target.value)}
                        placeholder="Write a public reply to this review..."
                        rows={6}
                      />
                      <Button onClick={handleSaveReply}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Save Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Review Dialog */}
      <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Review</DialogTitle>
            <DialogDescription>
              Manually add a review for seeding trust or from testers/influencers
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reviewer Name</Label>
                <Input
                  value={newReview.reviewerName}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewerName: e.target.value }))}
                  placeholder="Enter reviewer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email (Optional)</Label>
                <Input
                  value={newReview.reviewerEmail}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewerEmail: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product</Label>
              <Select
                value={newReview.productId}
                onValueChange={(value) => setNewReview(prev => ({ ...prev, productId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center space-x-2">
                        <img src={product.image} alt={product.name} className="w-6 h-6 object-cover rounded" />
                        <span>{product.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <StarIcon
                      className={`h-6 w-6 ${
                        star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">({newReview.rating} stars)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Review Text</Label>
              <Textarea
                value={newReview.reviewText}
                onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                placeholder="Write the review text..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Image URL (Optional)</Label>
                <Input
                  value={newReview.reviewImage}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Video URL (Optional)</Label>
                <Input
                  value={newReview.reviewVideo}
                  onChange={(e) => setNewReview(prev => ({ ...prev, reviewVideo: e.target.value }))}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={newReview.isStaffPick}
                onCheckedChange={(checked) => setNewReview(prev => ({ ...prev, isStaffPick: checked as boolean }))}
              />
              <Label>Mark as Staff Pick</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddReview(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddReview}>
                Add Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews; 