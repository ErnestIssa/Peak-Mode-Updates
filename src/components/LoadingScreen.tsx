import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete, isLoading }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('Initializing...');

  const loadingSteps = [
    { progress: 0, text: 'Initializing...' },
    { progress: 15, text: 'Loading assets...' },
    { progress: 30, text: 'Preparing interface...' },
    { progress: 45, text: 'Connecting to database...' },
    { progress: 60, text: 'Loading products...' },
    { progress: 80, text: 'Finalizing setup...' },
    { progress: 95, text: 'Almost ready...' },
    { progress: 100, text: 'Welcome to Peak Mode!' }
  ];

  useEffect(() => {
    if (!isLoading) return;

    // Animate logo appearance
    const logoTimer = setTimeout(() => setShowLogo(true), 300);
    
    // Animate tagline appearance
    const taglineTimer = setTimeout(() => setShowTagline(true), 800);
    
    // Animate progress bar
    const progressTimer = setTimeout(() => setShowProgress(true), 1200);

    // Simulate loading progress with detailed steps
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + Math.random() * 8 + 2; // Slower, more realistic progress
        
        // Update loading step based on progress
        const currentStep = loadingSteps.find(step => nextProgress >= step.progress);
        if (currentStep) {
          setLoadingStep(currentStep.text);
        }
        
        if (nextProgress >= 100) {
          clearInterval(progressInterval);
          setProgress(100);
          setLoadingStep('Welcome to Peak Mode!');
          // Complete loading after progress reaches 100%
          setTimeout(() => {
            onLoadingComplete();
          }, 1000);
          return 100;
        }
        return nextProgress;
      });
    }, 150);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
      clearTimeout(progressTimer);
      clearInterval(progressInterval);
    };
  }, [isLoading, onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center overflow-hidden">
      {/* Animated Light Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/2 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo */}
        <div 
          className={cn(
            "transition-all duration-1000 ease-out",
            showLogo 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          )}
        >
          <h1 className="font-black text-4xl md:text-6xl lg:text-7xl tracking-tighter text-white mb-8 drop-shadow-lg">
            PEAK | MODE
          </h1>
        </div>

        {/* Tagline */}
        <div 
          className={cn(
            "transition-all duration-1000 ease-out delay-300",
            showTagline 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
          )}
        >
          <p className="text-white/90 text-sm md:text-base lg:text-lg font-light tracking-wide max-w-md mx-auto leading-relaxed drop-shadow-sm">
            Not Just Apparel, A Mode You Enter, A Mindset You Wear
          </p>
        </div>

        {/* Progress Section */}
        <div 
          className={cn(
            "mt-16 transition-all duration-500 ease-out",
            showProgress 
              ? "opacity-100" 
              : "opacity-0"
          )}
        >
          {/* Loading Step Text */}
          <div className="mb-6">
            <p className="text-white/80 text-sm md:text-base font-medium tracking-wide mb-2">
              {loadingStep}
            </p>
            <p className="text-white/60 text-xs tracking-wide">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-80 md:w-96 h-2 bg-white/10 rounded-full overflow-hidden mx-auto backdrop-blur-sm border border-white/20">
            <div 
              className="h-full bg-gradient-to-r from-white/90 to-white/70 transition-all duration-300 ease-out rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {[0, 25, 50, 75, 100].map((marker) => (
              <div 
                key={marker}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  progress >= marker 
                    ? "bg-white/80" 
                    : "bg-white/20"
                )}
              />
            ))}
          </div>
        </div>

        {/* Live Indicator */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/60 text-xs tracking-wide font-medium">
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 