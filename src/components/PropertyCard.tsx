'use client';

import React, { useRef, useState } from 'react';
import styles from './PropertyCard.module.css';
import { Property } from '@/data/mockData';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
}

export default function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Normalize coordinates from -0.5 to 0.5
    const xc = x / width - 0.5;
    const yc = y / height - 0.5;
    
    // Calculate rotation angle (max 15 degrees)
    setCoords({
      rx: -yc * 20, // Rotate on X axis
      ry: xc * 20,  // Rotate on Y axis
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ rx: 0, ry: 0 }); // Reset rotation
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className={`${styles.cardWrapper} ${isHovered ? styles.activeWrapper : ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onViewDetails(property)}
    >
      <div 
        className={`${styles.cardBody} glass-panel`}
        style={{
          transform: `rotateX(${coords.rx}deg) rotateY(${coords.ry}deg) ${isHovered ? 'translateZ(10px)' : 'translateZ(0)'}`
        }}
      >
        {/* Glowing aura under card */}
        <div className={styles.glowingAura} />

        {/* Image & tag */}
        <div className={styles.imageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={property.image} alt={property.title} className={styles.image} />
          <span className={styles.tag}>{property.tag}</span>
          <span className={styles.rating}>
            <svg viewBox="0 0 20 20" fill="currentColor" className={styles.starIcon}>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {property.rating}
          </span>
        </div>

        {/* Property Info */}
        <div className={styles.info}>
          <p className={styles.location}>{property.location}</p>
          <h3 className={styles.title}>{property.title}</h3>
          
          <div className={styles.specs}>
            <div className={styles.spec}>
              <span className={styles.specVal}>{property.beds}</span>
              <span className={styles.specLabel}>Beds</span>
            </div>
            <div className={styles.spec}>
              <span className={styles.specVal}>{property.baths}</span>
              <span className={styles.specLabel}>Baths</span>
            </div>
            <div className={styles.spec}>
              <span className={styles.specVal}>{property.size.toLocaleString()}</span>
              <span className={styles.specLabel}>Sq Ft</span>
            </div>
          </div>

          <div className={styles.footer}>
            <span className={styles.price}>{formatPrice(property.price)}</span>
            <button className={`${styles.btn} glow-btn-teal`}>View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}
