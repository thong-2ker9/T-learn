import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { EducationalBackground } from "./educational-background";
import { useState } from "react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGetStarted = () => {
    setIsAnimating(true);
    // Reduced delay for faster transition
    setTimeout(() => {
      onGetStarted();
    }, 1200);
  };
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6 overflow-hidden">
      <EducationalBackground variant="primary" />
      
      {/* Split Screen Animation Layers */}
      <div className={`absolute inset-0 z-50 transition-opacity duration-500 ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Left Half */}
        <div className={`absolute inset-0 bg-gradient-to-r from-red-500 to-red-400 transition-transform duration-1000 ease-in-out ${isAnimating ? 'animate-split-left' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-600/40"></div>
        </div>
        
        {/* Right Half */}
        <div className={`absolute inset-0 bg-gradient-to-l from-red-500 to-red-400 transition-transform duration-1000 ease-in-out ${isAnimating ? 'animate-split-right' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-bl from-red-400/20 to-red-600/40"></div>
        </div>
        
        {/* Liquid Effect Center */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out ${isAnimating ? 'animate-liquid-expand scale-150 opacity-0' : 'scale-0 opacity-100'}`}>
          <div className="w-32 h-32 bg-white rounded-full animate-pulse shadow-2xl"></div>
        </div>
        
        {/* Ripple Effects */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'animate-ripple-1' : 'scale-0'}`}>
          <div className="w-16 h-16 border-4 border-white/30 rounded-full"></div>
        </div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'animate-ripple-2' : 'scale-0'}`}>
          <div className="w-24 h-24 border-2 border-white/20 rounded-full"></div>
        </div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isAnimating ? 'animate-ripple-3' : 'scale-0'}`}>
          <div className="w-32 h-32 border border-white/10 rounded-full"></div>
        </div>
      </div>
      
      {/* Simple floating decorations */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-20 left-1/4 text-4xl opacity-20 educational-float">📚</div>
        <div className="absolute top-32 right-1/4 text-3xl opacity-15 gentle-pulse" style={{ animationDelay: '1s' }}>💡</div>
        <div className="absolute bottom-32 left-1/3 text-2xl opacity-20 subtle-bounce" style={{ animationDelay: '2s' }}>🎯</div>
        <div className="absolute bottom-20 right-1/3 text-3xl opacity-15 educational-float" style={{ animationDelay: '1.5s' }}>✨</div>
        <div className="absolute top-1/2 left-20 text-xl opacity-10 gentle-pulse" style={{ animationDelay: '3s' }}>🔬</div>
        <div className="absolute top-1/3 right-20 text-xl opacity-15 subtle-bounce" style={{ animationDelay: '0.5s' }}>🎨</div>
      </div>
      
      <div className={`relative z-10 flex flex-col items-center text-center transition-all duration-500 ${isAnimating ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
        {/* Logo */}
        <div className="flex items-center gap-4 mb-8">
          <BookOpen className="w-16 h-16 text-white educational-float" />
          <h1 className="text-6xl font-bold text-white">T-Learn</h1>
        </div>
        
        {/* Welcome text */}
        <h2 className="text-2xl text-white mb-16 font-normal gentle-pulse">
          Welcome to T-Learn
        </h2>
        
        {/* Get started button */}
        <Button 
          onClick={handleGetStarted}
          disabled={isAnimating}
          className={`bg-white text-red-500 hover:bg-gray-100 px-12 py-4 text-lg rounded-full shadow-lg transform transition-all duration-100 hover:scale-105 active:scale-95 relative overflow-hidden ${isAnimating ? 'animate-button-explode scale-110' : ''}`}
        >
          <span className={`transition-all duration-200 ${isAnimating ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
            Bắt đầu học ngay
          </span>
          {isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}