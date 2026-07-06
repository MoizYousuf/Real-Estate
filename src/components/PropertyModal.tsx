'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './PropertyModal.module.css';

import { Property } from '@/data/mockData';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function PropertyModal({ property, onClose }: PropertyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent background scrolling
    if (property) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [property, onClose]);

  // Reset toast when property modal changes
  useEffect(() => {
    setShowToast(false);
  }, [property]);

  if (!property) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInquire = () => {
    setShowToast(true);
    // Let the CSS animation handle fadeout, state hides it after 3s
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={`${styles.modalContainer} glass-panel`} ref={modalRef}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className={styles.grid}>
          {/* Left Side: 3D-styled Image Gallery Frame */}
          <div className={styles.imageFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={property.image} alt={property.title} className={styles.image} />
            <div className={styles.imageGlow} />
            <div className={styles.ratingBadge}>★ {property.rating}</div>
          </div>

          {/* Right Side: Information Details */}
          <div className={styles.details}>
            <span className={styles.tag}>{property.tag}</span>
            <span className={styles.location}>{property.location}</span>
            <h2 className={styles.title}>{property.title}</h2>

            <div className={styles.priceContainer}>
              <span className={styles.priceLabel}>Exclusive Valuation</span>
              <span className={styles.price}>{formatPrice(property.price)}</span>
            </div>

            <p className={styles.description}>{property.description}</p>

            {/* Specifications Grid */}
            <div className={styles.specsGrid}>
              <div className={styles.specBox}>
                <span className={styles.specLabel}>Bedrooms</span>
                <span className={styles.specVal}>{property.beds} Bedrooms</span>
              </div>
              <div className={styles.specBox}>
                <span className={styles.specLabel}>Bathrooms</span>
                <span className={styles.specVal}>{property.baths} Bathrooms</span>
              </div>
              <div className={styles.specBox}>
                <span className={styles.specLabel}>Total Area</span>
                <span className={styles.specVal}>{property.size.toLocaleString()} Sq Ft</span>
              </div>
              <div className={styles.specBox}>
                <span className={styles.specLabel}>Smart Living</span>
                <span className={styles.specVal}>Fully Integrated</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className={styles.actions}>
              <button 
                className={`${styles.ctaBtn} glow-btn`} 
                onClick={handleInquire}
              >
                Inquire & Buy Now
              </button>
              
              <Link 
                href={`/tour/${property.id}`}
                className={`${styles.ctaBtnSec} glow-btn-teal`}
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Virtual 3D Tour
              </Link>
            </div>
          </div>
        </div>

        {/* Beautiful Floating Toast Notification */}
        {showToast && (
          <div className={styles.toast}>
            <span className={styles.toastIcon}>✓</span>
            <span>Simulated booking request sent for {property.title}.</span>
          </div>
        )}
      </div>
    </div>
  );
}
