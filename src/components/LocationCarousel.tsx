'use client';

import React, { useState } from 'react';
import styles from './LocationCarousel.module.css';
import { mockLocations } from '@/data/mockData';

interface LocationCarouselProps {
  onSelectLocation: (location: string) => void;
}

export default function LocationCarousel({ onSelectLocation }: LocationCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % mockLocations.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + mockLocations.length) % mockLocations.length);
  };

  const handleLocationClick = (name: string) => {
    onSelectLocation(name);
    // Scroll to properties section
    const el = document.getElementById('properties');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="locations" className={styles.locationsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>Prime Neighborhoods</div>
          <h2 className={styles.title}>Explore Luxury Locations</h2>
          <p className={styles.subtitle}>
            Select a location to explore premium properties, mansions, and apartments available in each prime district.
          </p>
        </div>

        {/* 3D Stack Container */}
        <div className={styles.carouselContainer}>
          <div className={styles.deck}>
            {mockLocations.map((loc, idx) => {
              // Calculate offset relative to active card
              const total = mockLocations.length;
              const offset = (idx - activeIndex + total) % total;
              
              let cardClass = styles.inactiveCard;
              let zIndex = total - offset;
              let transformStyle = '';

              if (offset === 0) {
                cardClass = styles.activeCard;
                transformStyle = 'translateZ(100px) rotateY(0deg) scale(1)';
              } else if (offset === 1) {
                cardClass = styles.rightCard;
                transformStyle = 'translateX(40%) translateZ(40px) rotateY(-25deg) scale(0.9)';
              } else if (offset === total - 1) {
                cardClass = styles.leftCard;
                transformStyle = 'translateX(-40%) translateZ(40px) rotateY(25deg) scale(0.9)';
              } else {
                cardClass = styles.hiddenCard;
                transformStyle = 'translateZ(-100px) scale(0.7) opacity(0)';
              }

              return (
                <div 
                  key={loc.name}
                  className={`${styles.card} ${cardClass} glass-panel`}
                  style={{
                    zIndex,
                    transform: transformStyle
                  }}
                  onClick={() => offset === 0 ? handleLocationClick(loc.name) : setActiveIndex(idx)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={loc.image} alt={loc.name} className={styles.cardImage} />
                  <div className={styles.cardOverlay}>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.locationName}>{loc.name}</h3>
                      <p className={styles.locationCount}>{loc.count} Exclusive Properties</p>
                      {offset === 0 && (
                        <span className={styles.exploreBtn}>Explore Properties →</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <button className={styles.ctrlBtn} onClick={handlePrev} aria-label="Previous Location">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className={styles.indicator}>
              {activeIndex + 1} / {mockLocations.length}
            </span>
            <button className={styles.ctrlBtn} onClick={handleNext} aria-label="Next Location">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
