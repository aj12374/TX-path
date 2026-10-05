import React, { useEffect, useRef, useState } from "react";

import ai from "../../../../../assets/marketplaceImages/ai-data.png";
import career from "../../../../../assets/marketplaceImages/career.png";
import cloud from "../../../../../assets/marketplaceImages/cloud-devops.png";
import software from "../../../../../assets/marketplaceImages/software-development.png";
import testing from "../../../../../assets/marketplaceImages/testing.png";

import "./MarketHeroSec.css";

function BannerCarousel() {
  const bannerImages = [
    ai,
    career,
    cloud,
    software,
    testing,
  ];

  const slides = [
    bannerImages[bannerImages.length - 1],
    ...bannerImages,
    bannerImages[0],
  ];

  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const timerRef = useRef(null);

  const startAutoSlide = () => {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4000);
  };

  useEffect(() => {
    startAutoSlide();

    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== "transform") {
      return;
    }

    if (currentSlide === slides.length - 1) {
      setIsTransitioning(false);
      setCurrentSlide(1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          startAutoSlide();
        });
      });

      return;
    }

    if (currentSlide === 0) {
      setIsTransitioning(false);
      setCurrentSlide(bannerImages.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          startAutoSlide();
        });
      });

      return;
    }

    startAutoSlide();
  };

  const handlePrevious = () => {
    clearTimeout(timerRef.current);
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  const handleNext = () => {
    clearTimeout(timerRef.current);
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const activeDot =
    currentSlide === 0
      ? bannerImages.length - 1
      : currentSlide === slides.length - 1
      ? 0
      : currentSlide - 1;

  const handleDotClick = (index) => {
    clearTimeout(timerRef.current);
    setIsTransitioning(true);
    setCurrentSlide(index + 1);
  };

  return (
    <section className="banner-carousel">
      <div className="banner-window">
        <div
          className="banner-track"
          style={{
            transform: `translate3d(-${currentSlide * 100}%, 0, 0)`,
            transition: isTransitioning
              ? "transform 0.7s ease-in-out"
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((image, index) => (
            <div className="banner-slide" key={index}>
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                draggable="false"
              />
            </div>
          ))}
        </div>

        <button
          className="banner-arrow banner-prev"
          onClick={handlePrevious}
          aria-label="Previous banner"
        >
          ‹
        </button>

        <button
          className="banner-arrow banner-next"
          onClick={handleNext}
          aria-label="Next banner"
        >
          ›
        </button>
      </div>

      <div className="banner-dots">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            className={`banner-dot ${
              activeDot === index ? "active" : ""
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default BannerCarousel;