'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './Hero.module.css';

interface HeroProps {
  onSearch: (query: string) => void;
  onOpenChat: () => void;
}

export default function Hero({ onSearch, onOpenChat }: HeroProps) {
  const [searchVal, setSearchVal] = useState('');
  const [rotate, setRotate] = useState({ x: 15, y: -20 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    // Scroll to properties section
    const el = document.getElementById('properties');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - top) / height - 0.5; // -0.5 to 0.5
      
      // Update rotation based on mouse coordinates
      setRotate({
        x: 15 - y * 40, // Tilt up/down
        y: -20 + x * 60, // Rotate left/right
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* Decorative background grid and glow */}
      <div className={styles.bgGlow} />
      <div className={styles.gridOverlay} />

      <div className={styles.container}>
        {/* Left: Content */}
        <div className={styles.infoContent}>
          <div className={styles.badge}>
            <span className={styles.badgePulse} />
            Futuristic 3D Real Estate
          </div>
          
          <h1 className={styles.title}>
            Discover Your <br />
            <span className={styles.goldGradient}>3D Dream Space</span>
          </h1>
          
          <p className={styles.subtitle}>
            Experience luxury living through modern interactive architectures. Search and customize premium properties in our simulated virtual environment.
          </p>

          {/* Hero Search Bar */}
          <form className={`${styles.searchBox} glass-panel`} onSubmit={handleSearchSubmit}>
            <div className={styles.searchIcon}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search by Malibu, Miami, Villa..." 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={`${styles.searchBtn} glow-btn-teal`}>
              Search
            </button>
          </form>

          {/* Quick Questions Chips */}
          <div className={styles.chipsRow}>
            <button className={styles.chip} onClick={() => { setSearchVal('Malibu'); onSearch('Malibu'); }}>Malibu</button>
            <button className={styles.chip} onClick={() => { setSearchVal('Penthouse'); onSearch('Penthouse'); }}>Penthouses</button>
            <button className={styles.chip} onClick={() => { setSearchVal('Miami'); onSearch('Miami'); }}>Miami</button>
            <button className={styles.chip} onClick={onOpenChat}>Ask AI Bot</button>
          </div>

          {/* Stats */}
          <div className={styles.statsContainer}>
            <div className={styles.statBox}>
              <h3 className={styles.statNum}>$18B+</h3>
              <p className={styles.statLabel}>Transactions</p>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <h3 className={styles.statNum}>400+</h3>
              <p className={styles.statLabel}>Luxury Villas</p>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <h3 className={styles.statNum}>99.4%</h3>
              <p className={styles.statLabel}>Satisfied Clients</p>
            </div>
          </div>
        </div>

        {/* Right: 3D Animated Architecture Model */}
        <div className={styles.modelContainer} ref={containerRef}>
          <div 
            className={styles.scene3D}
            style={{
              transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
            }}
          >
            {/* The Ground Ring */}
            <div className={styles.floor3D} />

            {/* Glass Mansion structure */}
            <div className={styles.glassHouse}>
              {/* Floor 1 */}
              <div className={`${styles.wall} ${styles.wallFront}`} />
              <div className={`${styles.wall} ${styles.wallBack}`} />
              <div className={`${styles.wall} ${styles.wallLeft}`} />
              <div className={`${styles.wall} ${styles.wallRight}`} />
              <div className={styles.roofIntermediary} />

              {/* Floor 2 - cantilevered */}
              <div className={styles.floor2}>
                <div className={`${styles.wall} ${styles.wallFront}`} />
                <div className={`${styles.wall} ${styles.wallBack}`} />
                <div className={`${styles.wall} ${styles.wallLeft}`} />
                <div className={`${styles.wall} ${styles.wallRight}`} />
              </div>

              {/* Cantilever Roof */}
              <div className={styles.roof3D} />

              {/* 3D Pool glowing sheet */}
              <div className={styles.pool3D} />
            </div>

            {/* Floating glowing nodes */}
            <div className={`${styles.floatingNode} ${styles.node1}`}>
              <span>$4.8M</span>
            </div>
            <div className={`${styles.floatingNode} ${styles.node2}`}>
              <span>Malibu</span>
            </div>
            <div className={`${styles.floatingNode} ${styles.node3}`}>
              <span>★ 4.9</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
