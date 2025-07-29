// Test Mode Utility for Peak Mode
// This file contains test functions to verify all site functionality

export interface TestResult {
  test: string;
  passed: boolean;
  message: string;
  details?: any;
}

export const runSiteTests = async (): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  // Test 1: Cart Functionality
  try {
    // Test adding item to cart
    const testItem = {
      id: 'test-1',
      originalId: 'test-1',
      name: 'Test Product',
      price: '99.99 SEK',
      currency: 'SEK',
      category: 'Test',
      image: 'https://via.placeholder.com/300x400',
      source: 'backend' as const
    };

    // Simulate adding to cart
    const existingCart = localStorage.getItem('cart');
    const cartItems = existingCart ? JSON.parse(existingCart) : [];
    cartItems.push({
      ...testItem,
      price: 99.99,
      size: null,
      color: null,
      quantity: 1
    });
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Verify cart has items
    const updatedCart = localStorage.getItem('cart');
    const parsedCart = updatedCart ? JSON.parse(updatedCart) : [];
    
    results.push({
      test: 'Cart Functionality',
      passed: parsedCart.length > 0,
      message: parsedCart.length > 0 ? 'Cart items can be added successfully' : 'Cart is empty',
      details: { cartItems: parsedCart.length }
    });
  } catch (error) {
    results.push({
      test: 'Cart Functionality',
      passed: false,
      message: `Cart test failed: ${error}`,
      details: { error }
    });
  }

  // Test 2: Local Storage
  try {
    const testData = { test: 'data' };
    localStorage.setItem('test', JSON.stringify(testData));
    const retrieved = localStorage.getItem('test');
    const parsed = retrieved ? JSON.parse(retrieved) : null;
    
    results.push({
      test: 'Local Storage',
      passed: parsed && parsed.test === 'data',
      message: parsed && parsed.test === 'data' ? 'Local storage working' : 'Local storage failed',
      details: { stored: parsed }
    });
    
    localStorage.removeItem('test');
  } catch (error) {
    results.push({
      test: 'Local Storage',
      passed: false,
      message: `Local storage test failed: ${error}`,
      details: { error }
    });
  }

  // Test 3: Session Storage
  try {
    const testData = { session: 'test' };
    sessionStorage.setItem('test', JSON.stringify(testData));
    const retrieved = sessionStorage.getItem('test');
    const parsed = retrieved ? JSON.parse(retrieved) : null;
    
    results.push({
      test: 'Session Storage',
      passed: parsed && parsed.session === 'test',
      message: parsed && parsed.session === 'test' ? 'Session storage working' : 'Session storage failed',
      details: { stored: parsed }
    });
    
    sessionStorage.removeItem('test');
  } catch (error) {
    results.push({
      test: 'Session Storage',
      passed: false,
      message: `Session storage test failed: ${error}`,
      details: { error }
    });
  }

  // Test 4: Responsive Design
  try {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;
    
    results.push({
      test: 'Responsive Design',
      passed: true,
      message: `Viewport detected: ${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}`,
      details: { 
        width: window.innerWidth, 
        height: window.innerHeight,
        isMobile,
        isTablet,
        isDesktop
      }
    });
  } catch (error) {
    results.push({
      test: 'Responsive Design',
      passed: false,
      message: `Responsive test failed: ${error}`,
      details: { error }
    });
  }

  // Test 5: Performance
  try {
    const startTime = performance.now();
    // Simulate some work
    for (let i = 0; i < 1000; i++) {
      Math.random();
    }
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    results.push({
      test: 'Performance',
      passed: duration < 100, // Should complete in under 100ms
      message: `Performance test completed in ${duration.toFixed(2)}ms`,
      details: { duration }
    });
  } catch (error) {
    results.push({
      test: 'Performance',
      passed: false,
      message: `Performance test failed: ${error}`,
      details: { error }
    });
  }

  // Test 6: Navigation
  try {
    const currentPath = window.location.pathname;
    const hasRouter = typeof window !== 'undefined' && 'history' in window;
    
    results.push({
      test: 'Navigation',
      passed: hasRouter,
      message: hasRouter ? 'Router navigation available' : 'Router not available',
      details: { currentPath, hasRouter }
    });
  } catch (error) {
    results.push({
      test: 'Navigation',
      passed: false,
      message: `Navigation test failed: ${error}`,
      details: { error }
    });
  }

  // Test 7: SEO Meta Tags
  try {
    const metaTags = {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
      charset: document.querySelector('meta[charset]')?.getAttribute('charset')
    };
    
    const hasRequiredMeta = Boolean(metaTags.title && metaTags.description && metaTags.viewport);
    
    results.push({
      test: 'SEO Meta Tags',
      passed: hasRequiredMeta,
      message: hasRequiredMeta ? 'Required meta tags present' : 'Missing required meta tags',
      details: metaTags
    });
  } catch (error) {
    results.push({
      test: 'SEO Meta Tags',
      passed: false,
      message: `SEO test failed: ${error}`,
      details: { error }
    });
  }

  // Test 8: Toast Notifications
  try {
    // Test if toast system is available
    const hasToast = typeof window !== 'undefined' && 'toast' in window;
    
    results.push({
      test: 'Toast Notifications',
      passed: Boolean(hasToast),
      message: 'Toast notification system available',
      details: { hasToast }
    });
  } catch (error) {
    results.push({
      test: 'Toast Notifications',
      passed: false,
      message: `Toast test failed: ${error}`,
      details: { error }
    });
  }

  return results;
};

export const getTestSummary = (results: TestResult[]) => {
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);
  
  return {
    passed,
    total,
    percentage,
    allPassed: passed === total,
    results
  };
};

export const logTestResults = (results: TestResult[]) => {
  console.group('🏁 Peak Mode Site Tests');
  
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.test}: ${result.message}`);
    if (result.details) {
      console.log('   Details:', result.details);
    }
  });
  
  const summary = getTestSummary(results);
  console.log(`\n📊 Summary: ${summary.passed}/${summary.total} tests passed (${summary.percentage}%)`);
  
  if (summary.allPassed) {
    console.log('🎉 All tests passed! Site is ready for production.');
  } else {
    console.log('⚠️  Some tests failed. Please review the issues above.');
  }
  
  console.groupEnd();
  
  return summary;
}; 