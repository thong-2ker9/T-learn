import { useState, useEffect, useRef } from "react";
import banner1 from "asset/a0643a46ccef0c357cbea335d0b696b837ab668a.png";
import banner2 from "asset/515db65ce07fa3b667f132296ecc914530dd830c.png";

interface BannerData {
  id: string;
  image: string;
  title: string;
  feature: string;
}

const banners: BannerData[] = [
  {
    id: "banner-1",
    image: banner1,
    title: "Phân biệt tin tức thật giả bằng AI",
    feature: "fake-news-detector"
  },
  {
    id: "banner-2",
    image: banner2,
    title: "Định hướng nghề nghiệp cùng AI",
    feature: "career-ai"
  }
];

interface AIBannerCarouselProps {
  onBannerClick: (feature: string) => void;
}

export function AIBannerCarousel({ onBannerClick }: AIBannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [currentSlide]);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setTimeout(() => {
      goToNext();
    }, 4000); // Auto-slide every 4 seconds
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % banners.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToPrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToSlide = (index: number) => {
    if (!isTransitioning && index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    stopAutoPlay();
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      startAutoPlay();
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    } else {
      startAutoPlay();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleBannerClick = (feature: string) => {
    stopAutoPlay();
    onBannerClick(feature);
  };

  const handleMouseEnter = () => {
    stopAutoPlay();
  };

  const handleMouseLeave = () => {
    startAutoPlay();
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl shadow-lg group"
      style={{ height: "20vh" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="absolute inset-0 cursor-pointer transition-all duration-500 ease-in-out"
            style={{
              opacity: currentSlide === index ? 1 : 0,
              transform: currentSlide === index 
                ? "scale(1) translateX(0)" 
                : currentSlide < index 
                  ? "scale(0.95) translateX(100%)" 
                  : "scale(0.95) translateX(-100%)",
              pointerEvents: currentSlide === index ? "auto" : "none",
            }}
            onClick={() => handleBannerClick(banner.feature)}
          >
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              
              {/* Banner Title (Optional - uncomment if you want text overlay) */}
              {/* <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-semibold text-lg drop-shadow-lg">{banner.title}</h3>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className="transition-all duration-300"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white w-8 h-2"
                  : "bg-white/50 w-2 h-2 hover:bg-white/75"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Navigation Arrows (visible on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          goToPrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          goToNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}