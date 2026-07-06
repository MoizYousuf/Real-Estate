'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import PropertyModal from '@/components/PropertyModal';
import Chatbot from '@/components/Chatbot';
import { mockProperties, Property } from '@/data/mockData';
import styles from './page.module.css';

const LOCATIONS = ['All', 'Malibu', 'Miami', 'New York', 'Los Angeles'];
const TYPES = ['Villa', 'Penthouse', 'Mansion', 'Apartment'];

export default function SearchPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [beds, setBeds] = useState<string>('Any');
  const [baths, setBaths] = useState<string>('Any');
  const [sizeRange, setSizeRange] = useState<[number, number]>([0, 10000]);

  // Sync theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  };

  const handleToggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(prev => prev.filter(t => t !== type));
    } else {
      setSelectedTypes(prev => [...prev, type]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('All');
    setSelectedTypes([]);
    setPriceRange([0, 10000000]);
    setBeds('Any');
    setBaths('Any');
    setSizeRange([0, 10000]);
  };

  // Filter Logic
  const filteredProperties = mockProperties.filter((p) => {
    // 1. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchQuery = 
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      if (!matchQuery) return false;
    }

    // 2. Location
    if (selectedLocation !== 'All') {
      if (!p.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    }

    // 3. Property Type
    if (selectedTypes.length > 0) {
      if (!selectedTypes.includes(p.tag)) return false;
    }

    // 4. Price Range
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;

    // 5. Beds
    if (beds !== 'Any') {
      const minBeds = parseInt(beds);
      if (p.beds < minBeds) return false;
    }

    // 6. Baths
    if (baths !== 'Any') {
      const minBaths = parseFloat(baths);
      if (p.baths < minBaths) return false;
    }

    // 7. Size
    if (p.size < sizeRange[0] || p.size > sizeRange[1]) return false;

    return true;
  });

  return (
    <>
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onOpenChat={() => setIsChatOpen(true)} 
      />

      <main className={styles.mainWrapper}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <div className={styles.badge}>Aura Finder</div>
            <h1 className={styles.pageTitle}>Refined Property Search</h1>
            <p className={styles.pageSubtitle}>Apply detailed parameters to discover your ideal architectural sanctuary.</p>
          </div>

          <div className={styles.contentGrid}>
            {/* Left Filter Sidebar */}
            <aside className={`${styles.filterPanel} glass-panel`}>
              <div className={styles.filterSectionHeader}>
                <h3>Filters</h3>
                <button onClick={handleResetFilters} className={styles.resetBtn}>Reset All</button>
              </div>

              {/* Text Search */}
              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Keywords</label>
                <input 
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.filterInput}
                />
              </div>

              {/* Location Select */}
              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Location</label>
                <div className={styles.locationGrid}>
                  {LOCATIONS.map(loc => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`${styles.filterBtn} ${selectedLocation === loc ? styles.filterBtnActive : ''}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type Checkboxes */}
              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>Property Type</label>
                <div className={styles.checkboxGroup}>
                  {TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => handleToggleType(type)}
                      className={`${styles.filterBtn} ${selectedTypes.includes(type) ? styles.filterBtnActive : ''}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider */}
              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>
                  Max Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(priceRange[1])}
                </label>
                <input 
                  type="range"
                  min={1000000}
                  max={10000000}
                  step={50000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className={styles.rangeSlider}
                />
                <div className={styles.sliderLimits}>
                  <span>$1M</span>
                  <span>$10M</span>
                </div>
              </div>

              {/* Beds & Baths */}
              <div className={styles.filterSectionRow}>
                <div className={styles.rowField}>
                  <label className={styles.filterLabel}>Min Beds</label>
                  <select 
                    value={beds} 
                    onChange={(e) => setBeds(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="Any">Any</option>
                    <option value="2">2+ Beds</option>
                    <option value="3">3+ Beds</option>
                    <option value="4">4+ Beds</option>
                    <option value="5">5+ Beds</option>
                  </select>
                </div>

                <div className={styles.rowField}>
                  <label className={styles.filterLabel}>Min Baths</label>
                  <select 
                    value={baths} 
                    onChange={(e) => setBaths(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="Any">Any</option>
                    <option value="2">2+ Baths</option>
                    <option value="3">3+ Baths</option>
                    <option value="4">4+ Baths</option>
                  </select>
                </div>
              </div>

              {/* Size Slider */}
              <div className={styles.filterSection}>
                <label className={styles.filterLabel}>
                  Min Size: {sizeRange[0].toLocaleString()} sqft
                </label>
                <input 
                  type="range"
                  min={0}
                  max={8000}
                  step={100}
                  value={sizeRange[0]}
                  onChange={(e) => setSizeRange([parseInt(e.target.value), sizeRange[1]])}
                  className={styles.rangeSlider}
                />
                <div className={styles.sliderLimits}>
                  <span>0 sqft</span>
                  <span>8,000 sqft</span>
                </div>
              </div>
            </aside>

            {/* Right Properties Grid */}
            <div className={styles.resultsArea}>
              <div className={styles.resultsHeader}>
                <span className={styles.resultsCount}>Found {filteredProperties.length} matches</span>
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
                  <h3>No matching sanctuaries found</h3>
                  <p>Try resetting the sliders, location selects, or keyword parameters.</p>
                  <button onClick={handleResetFilters} className={`${styles.resetBtnAction} glow-btn`}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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
              <a href="/">Home</a>
              <a href="/search">Properties</a>
            </div>
            <div className={styles.footerLinks}>
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 AURA Estate. Loved by <a href="https://khananiinnovations.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>Khanani Innovations</a>. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot overlay */}
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onSearch={setSearchQuery}
        onSelectProperty={setSelectedProperty}
      />

      {/* Details modal */}
      <PropertyModal 
        property={selectedProperty} 
        onClose={() => setSelectedProperty(null)} 
      />
    </>
  );
}
