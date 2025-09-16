import { 
  BookOpen, 
  Lightbulb, 
  Calculator, 
  Microscope, 
  Globe, 
  Palette, 
  Music, 
  Atom,
  PenTool,
  GraduationCap,
  Beaker,
  Compass,
  Zap,
  Star,
  Heart,
  Target
} from "lucide-react";

interface EducationalBackgroundProps {
  variant?: "primary" | "secondary";
  className?: string;
}

export function EducationalBackground({ variant = "primary", className = "" }: EducationalBackgroundProps) {
  const icons = [
    BookOpen, Lightbulb, Calculator, Microscope, Globe, 
    Palette, Music, Atom, PenTool, GraduationCap, 
    Beaker, Compass, Zap, Star, Heart, Target
  ];

  const mathematicalSymbols = ["∑", "∫", "π", "√", "∞", "α", "β", "γ"];
  
  const gradientClass = variant === "primary" 
    ? "bg-gradient-to-br from-red-400 via-red-500 to-red-600" 
    : "bg-gradient-to-br from-blue-50 via-white to-red-50";

  return (
    <div className={`absolute inset-0 overflow-hidden ${gradientClass} ${className}`}>
      {/* Animated floating icons using CSS animations */}
      {icons.map((Icon, index) => (
        <div
          key={`icon-${index}`}
          className="absolute educational-float"
          style={{
            left: `${10 + (index * 5)}%`,
            top: `${15 + (index * 4)}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${6 + Math.random() * 4}s`
          }}
        >
          <Icon 
            className={`w-6 h-6 ${
              variant === "primary" 
                ? "text-white/20" 
                : "text-red-300/30"
            }`} 
          />
        </div>
      ))}

      {/* Mathematical symbols */}
      {mathematicalSymbols.map((symbol, index) => (
        <div
          key={`math-${index}`}
          className="absolute select-none pointer-events-none gentle-pulse"
          style={{
            left: `${20 + (index * 10)}%`,
            top: `${20 + (index * 8)}%`,
            fontSize: '24px',
            fontFamily: 'serif',
            animationDelay: `${index * 0.7}s`
          }}
        >
          <span className={`font-bold ${
            variant === "primary" 
              ? "text-white/15" 
              : "text-red-400/25"
          }`}>
            {symbol}
          </span>
        </div>
      ))}

      {/* Floating geometric shapes */}
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={`shape-${index}`}
          className="absolute subtle-bounce"
          style={{
            left: `${15 + (index * 11)}%`,
            top: `${25 + (index * 7)}%`,
            animationDelay: `${index * 0.4}s`
          }}
        >
          <div 
            className={`w-4 h-4 ${
              variant === "primary" 
                ? "border-2 border-white/10" 
                : "border-2 border-red-200/30"
            } ${
              index % 3 === 0 ? "rounded-full" : 
              index % 3 === 1 ? "rotate-45" : ""
            }`}
          />
        </div>
      ))}

      {/* Bokeh light effects */}
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`bokeh-${index}`}
          className="absolute rounded-full blur-sm gentle-pulse"
          style={{
            left: `${30 + (index * 12)}%`,
            top: `${35 + (index * 9)}%`,
            width: `${30 + Math.random() * 20}px`,
            height: `${30 + Math.random() * 20}px`,
            animationDelay: `${index * 1.2}s`
          }}
        >
          <div className={`w-full h-full rounded-full ${
            variant === "primary" 
              ? "bg-white/10" 
              : "bg-red-300/20"
          }`} />
        </div>
      ))}

      {/* Fun emoji decorations - Enhanced visibility */}
      {variant === "primary" && (
        <>
          <div className="absolute top-10 left-10 text-4xl opacity-30 educational-float">📚</div>
          <div className="absolute top-20 right-20 text-3xl opacity-25 gentle-pulse">💡</div>
          <div className="absolute bottom-20 left-20 text-3xl opacity-30 subtle-bounce">🎯</div>
          <div className="absolute bottom-10 right-10 text-4xl opacity-25 educational-float" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute top-1/2 left-1/4 text-2xl opacity-20 gentle-pulse" style={{ animationDelay: '2s' }}>🔬</div>
          <div className="absolute top-1/3 right-1/3 text-2xl opacity-25 subtle-bounce" style={{ animationDelay: '1.5s' }}>🎨</div>
          <div className="absolute top-40 left-1/2 text-2xl opacity-20 sparkle-animation">⭐</div>
          <div className="absolute bottom-40 right-1/2 text-2xl opacity-25 educational-float" style={{ animationDelay: '0.5s' }}>🧪</div>
        </>
      )}

      {/* Pattern overlay for texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Gradient overlay to soften the background */}
      <div className={`absolute inset-0 ${
        variant === "primary" 
          ? "bg-gradient-to-b from-transparent via-red-500/10 to-transparent" 
          : "bg-gradient-to-b from-transparent via-white/30 to-transparent"
      }`} />
    </div>
  );
}