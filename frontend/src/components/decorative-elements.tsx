import { 
  BookOpen, 
  Lightbulb, 
  Star, 
  Heart,
  Sparkles
} from "lucide-react";

interface DecorativeElementsProps {
  variant?: "minimal" | "accent";
  className?: string;
}

export function DecorativeElements({ variant = "minimal", className = "" }: DecorativeElementsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Corner decorations */}
      <div className="absolute top-4 right-4 educational-float">
        <Star className="w-6 h-6 text-red-300/40" />
      </div>

      <div className="absolute top-4 left-4 gentle-pulse" style={{ animationDelay: '2s' }}>
        <Lightbulb className="w-5 h-5 text-yellow-400/30" />
      </div>

      <div className="absolute bottom-4 right-4 gentle-pulse" style={{ animationDelay: '1s' }}>
        <Heart className="w-4 h-4 text-pink-400/35" />
      </div>

      <div className="absolute bottom-4 left-4 subtle-bounce" style={{ animationDelay: '3s' }}>
        <BookOpen className="w-5 h-5 text-blue-400/30" />
      </div>

      {/* Floating sparkles */}
      {variant === "accent" && Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`sparkle-${index}`}
          className="absolute educational-float"
          style={{
            left: `${20 + (index * 10)}%`,
            top: `${20 + (index * 8)}%`,
            animationDelay: `${index * 0.5}s`
          }}
        >
          <Sparkles className="w-3 h-3 text-yellow-400/50" />
        </div>
      ))}

      {/* Subtle mathematical symbols */}
      {["∑", "π", "√"].map((symbol, index) => (
        <div
          key={`symbol-${index}`}
          className="absolute select-none text-sm gentle-pulse"
          style={{
            left: `${30 + (index * 20)}%`,
            top: `${30 + (index * 15)}%`,
            fontFamily: 'serif',
            animationDelay: `${index * 2}s`
          }}
        >
          <span className="text-red-300/20 font-bold">{symbol}</span>
        </div>
      ))}
    </div>
  );
}