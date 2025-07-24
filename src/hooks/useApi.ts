// Custom hooks for API state management
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiUtils } from '@/lib/api';

// Generic API state hook
export function useApiState<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Hook for fetching data on mount
export function useApiData<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const { data, loading, error, execute, reset } = useApiState<T>();

  useEffect(() => {
    execute(apiCall);
  }, dependencies);

  const refetch = useCallback(() => {
    execute(apiCall);
  }, [execute, apiCall]);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
  };
}

// Hook for API mutations (POST, PUT, DELETE)
export function useApiMutation<T, P = any>() {
  const { loading, error, execute, reset } = useApiState<T>();

  const mutate = useCallback(async (apiCall: (params: P) => Promise<T>, params: P) => {
    return execute(() => apiCall(params));
  }, [execute]);

  return {
    loading,
    error,
    mutate,
    reset,
  };
}

// Hook for checking API health
export function useApiHealth() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkHealth = useCallback(async () => {
    setChecking(true);
    try {
      const healthy = await apiUtils.healthCheck();
      setIsHealthy(healthy);
      return healthy;
    } catch {
      setIsHealthy(false);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    isHealthy,
    checking,
    checkHealth,
  };
}

// Hook for managing cart state
export function useCart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      // For now, get from localStorage until backend is connected
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCart = useCallback((newCart: any) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
    localStorage.removeItem('cart');
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    updateCart,
    clearCart,
    refetch: fetchCart,
  };
}

// Hook for managing user authentication state
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      // For now, simulate login until backend is connected
      // const response = await authApi.login(credentials);
      // setUser(response.user);
      // setIsAuthenticated(true);
      // localStorage.setItem('token', response.token);
      
      // Simulate successful login
      setUser({ email: credentials.email, name: 'User' });
      setIsAuthenticated(true);
      toast.success('Login successful');
    } catch (error) {
      toast.error('Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // const user = await authApi.getCurrentUser();
        // setUser(user);
        // setIsAuthenticated(true);
        
        // For now, simulate authenticated user
        setUser({ email: 'user@example.com', name: 'User' });
        setIsAuthenticated(true);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
}

// Hook for managing products
export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // For now, use mock data until backend is connected
      const mockProducts = [
        {
          id: '1',
          name: 'Peak Mode Performance Shorts',
          description: 'Premium athletic shorts for peak performance',
          price: 299,
          images: ['/placeholder.svg'],
          category: 'shorts',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Black', 'Navy'],
          inStock: true,
          featured: true,
        },
        // Add more mock products as needed
      ];
      setProducts(mockProducts);
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // For now, find in mock data
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
  };
}

// Hook for managing orders
export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(async (orderData: any) => {
    setLoading(true);
    setError(null);
    try {
      // For now, simulate order creation
      const newOrder = {
        id: `order-${Date.now()}`,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      // In real implementation, this would be sent to backend
      // const order = await ordersApi.createOrder(orderData);
      
      setOrders(prev => [newOrder, ...prev]);
      toast.success('Order created successfully');
      return newOrder;
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // For now, return empty array until backend is connected
      // const orders = await ordersApi.getUserOrders();
      setOrders([]);
    } catch (err) {
      const errorMessage = apiUtils.handleError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    createOrder,
    fetchOrders,
  };
} 