'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PropertyCard from '@/components/PropertyCard';
import LocationCarousel from '@/components/LocationCarousel';
import PropertyModal from '@/components/PropertyModal';
import Chatbot from '@/components/Chatbot';
import { mockProperties, Property } from '@/data/mockData';
import styles from './page.module.css';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Sync theme with document class
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  // Filter properties based on search query
  const getFilteredProperties = () => {
    if (!searchQuery) return mockProperties;
    
    const query = searchQuery.toLowerCase();

    // Check for "under X" price filter
    if (query.startsWith('under ')) {
      const priceStr = query.replace('under ', '').trim();
      const price = parseInt(priceStr);
      if (!isNaN(price)) {
        return mockProperties.filter((p) => p.price <= price);
      }
    }

    if (query === 'locations') {
      return mockProperties; // Don't filter, just show all
    }

    return mockProperties.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.tag.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  };

  const filteredProperties = getFilteredProperties();

  // Reset filters
  const handleClearFilters = () => {
    setSearchQuery('');
  };

  return (
    <>
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onOpenChat={() => setIsChatOpen(true)} 
      />

      <Hero 
        onSearch={setSearchQuery} 
        onOpenChat={() => setIsChatOpen(true)} 
      />

      {/* Properties Display */}
      <section id="properties" className={styles.propertiesSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.badge}>Exclusive Listings</div>
            <div className={styles.headerFlex}>
              <div>
                <h2 className={styles.title}>Featured Modern Properties</h2>
                <p className={styles.subtitle}>
                  Hover to explore in 3D. Click to view detailed blueprints, features, and take a virtual tour.
                </p>
              </div>
              {searchQuery && (
                <div className={styles.filterStatus}>
                  <span>Showing results for &quot;{searchQuery}&quot;</span>
                  <button onClick={handleClearFilters} className={styles.clearBtn}>
                    Clear Filter ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className={styles.grid}>
              {filteredProperties.map((prop) => (
                <PropertyCard 
                  key={prop.id} 
                  property={prop} 
                  onViewDetails={setSelectedProperty} 
                />
              ))}
            </div>
          ) : (
            <div className={`${styles.noResults} glass-panel`}>
              <h3>No Properties Match Your Criteria</h3>
              <p>Try searching for a different location like Malibu, Miami, or reset filters.</p>
              <button onClick={handleClearFilters} className={`${styles.resetBtn} glow-btn`}>
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Locations Section */}
      <LocationCarousel onSelectLocation={setSearchQuery} />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <h3 className={styles.footerLogo}>AURA<span className={styles.gold}>ESTATE</span></h3>
              <p className={styles.footerDesc}>
                Architecting the future of real estate display through immersive 3D digital interaction.
              </p>
            </div>
            <div className={styles.footerLinks}>
              <h4>Navigation</h4>
              <a href="#">Home</a>
              <a href="#properties">Properties</a>
              <a href="#locations">Locations</a>
            </div>
            <div className={styles.footerLinks}>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Licensing</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 AURA Estate. Loved by <a href="https://khananiinnovations.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>Khanani Innovations</a>. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot Trigger Bubble */}
      {!isChatOpen && (
        <button 
          className={`${styles.chatTrigger} glow-btn-teal`} 
          onClick={() => setIsChatOpen(true)}
          aria-label="Open Chat Bot"
        >
          <span className={styles.triggerPulse} />
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}

      {/* Chatbot Overlay */}
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onSearch={setSearchQuery}
        onSelectProperty={setSelectedProperty}
      />

      {/* Property Details Modal */}
      <PropertyModal 
        property={selectedProperty} 
        onClose={() => setSelectedProperty(null)} 
      />
    </>
  );
}
