'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { mockProperties, Property } from '@/data/mockData';
import styles from './page.module.css';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  description: string;
}

interface Room {
  id: string;
  name: string;
  image: string;
  imageNight?: string;
  imageShell?: string;
  voiceDesc: string;
  hotspots: Hotspot[];
}

const ROOM_DATA: Record<string, Room[]> = {
  'prop-1': [
    {
      id: 'living',
      name: 'Grand Living Area',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      imageNight: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      imageShell: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the grand living area. Featuring twelve-foot smart glass walls, custom Italian velvet seating, and a modern gold-accented fireplace.',
      hotspots: [
        { id: 'glass', x: 25, y: 40, title: 'Smart Glass Walls', description: 'Double-glazed smart glass with automated tinting for sun protection and privacy.' },
        { id: 'couch', x: 60, y: 70, title: 'Custom Italian Sofa', description: 'Designer leather seating tailored for maximum comfort and premium styling.' },
        { id: 'fireplace', x: 80, y: 55, title: 'Gold-Accented Fireplace', description: 'Suspended bio-ethanol fireplace with champagne gold framing.' }
      ]
    },
    {
      id: 'bed',
      name: 'Master Suite',
      image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
      imageNight: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      imageShell: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the master suite. Highlighting a floating cantilevered king-size bed with custom LED ambient under-glow and ocean panoramas.',
      hotspots: [
        { id: 'bed-glow', x: 50, y: 60, title: 'Floating Bed', description: 'Cantilevered king size bed with integrated under-lighting.' }
      ]
    },
    {
      id: 'pool',
      name: 'Infinity Pool Deck',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      imageNight: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
      imageShell: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the infinity pool deck. Complete with a heated, zero-edge temperature regulated pool that seamlessly merges with the blue Pacific horizon.',
      hotspots: [
        { id: 'water', x: 45, y: 75, title: 'Heated Infinity Pool', description: 'Zero-edge temperature regulated pool merging with the Pacific Ocean.' }
      ]
    }
  ],
  'prop-2': [
    {
      id: 'living',
      name: 'Sky-High Living Area',
      image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      imageNight: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      imageShell: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the sky-high living area. Hovering above Manhattan, this room features double-height glass panels with integrated thermal-regulating glaze.',
      hotspots: [
        { id: 'view', x: 30, y: 35, title: 'Central Park Panoramas', description: 'Unobstructed north-facing views of Central Park and upper Manhattan.' },
        { id: 'balcony', x: 75, y: 65, title: 'Glass Guard Balcony', description: 'Heated floor tiles and triple-pane structural glass wrapping the perimeter.' }
      ]
    },
    {
      id: 'kitchen',
      name: 'Minimalist Culinary Suite',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the minimalist culinary suite. Outfitted with bespoke dark granite worktops, push-to-open walnut cabinets, and fully voice-integrated professional appliances.',
      hotspots: [
        { id: 'fridge', x: 50, y: 55, title: 'Smart Panel Hub', description: 'Bespoke sub-zero refrigeration with transparent display controls.' }
      ]
    }
  ],
  'prop-3': [
    {
      id: 'pool',
      name: 'Tropical Lagoon Deck',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      imageNight: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the tropical lagoon pool. Flanked by architectural planters filled with rare palms, leading directly to a private yacht dock.',
      hotspots: [
        { id: 'dock', x: 80, y: 70, title: 'Private Yacht Slip', description: 'Bespoke teakwood docking deck with automated shore power connections.' }
      ]
    },
    {
      id: 'living',
      name: 'Botanical Great Room',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'This is the botanical great room. Highlighting high wooden-beam ceilings, sliding panoramic pocket doors, and lush indoor planters.',
      hotspots: [
        { id: 'plants', x: 20, y: 60, title: 'Living Green Wall', description: 'Self-watering modular vertical garden designed for indoor air purification.' }
      ]
    }
  ],
  'prop-4': [
    {
      id: 'living',
      name: 'Cantilevered Sunset Terrace',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the cantilevered sunset terrace. Suspended high above Los Angeles, this outdoor lounge features a concrete-molded firepit and custom glass guardrails.',
      hotspots: [
        { id: 'firepit', x: 50, y: 70, title: 'Bio-Ethanol Fire Pit', description: 'Clean-burning modern fireplace cast in volcanic fiber concrete.' }
      ]
    },
    {
      id: 'lounge',
      name: 'Concrete Minimalist Lounge',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the concrete minimalist lounge. Architectural board-formed concrete walls meet warm teakwood ceiling paneling for an organic modernist feel.',
      hotspots: [
        { id: 'ceiling', x: 45, y: 25, title: 'Acoustic Teak Planks', description: 'Sustainably sourced teakwood paneling with sound-dampening insulation.' }
      ]
    }
  ],
  'prop-5': [
    {
      id: 'living',
      name: 'Nebula Living Space',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the Nebula living space. Equipped with automated smart scenes, smart lighting presets, and panoramic sunset views of Biscayne Bay.',
      hotspots: [
        { id: 'scene-controller', x: 85, y: 60, title: 'Spatial Control Screen', description: 'Centrally manages illumination levels, background media, and HVAC zones.' }
      ]
    }
  ],
  'prop-6': [
    {
      id: 'lounge',
      name: 'Crestwood Courtyard Lounge',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the Crestwood courtyard lounge. An intimate retreat nestled among private canyons, featuring native landscaping and low-voltage warm ambient lighting.',
      hotspots: [
        { id: 'seating', x: 40, y: 75, title: 'Sunken Seating Well', description: 'Built-in fireside lounge pit upholstered in weather-resistant linen.' }
      ]
    }
  ],
  'default': [
    {
      id: 'living',
      name: 'Luxury Lounge',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      imageNight: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      imageShell: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'This is the luxury lounge. Decorated with fine quartz moldings and voice-controlled multi-hue smart LED grids.',
      hotspots: [
        { id: 'ambient', x: 50, y: 30, title: 'Ambient Lighting', description: 'Multi-hue smart LED strips controlled via voice command.' }
      ]
    },
    {
      id: 'kitchen',
      name: 'State-of-the-Art Kitchen',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      imageNight: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      imageShell: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
      voiceDesc: 'Welcome to the premium show kitchen. Outfitted with bespoke Calacatta marble waterfall counter islands.',
      hotspots: [
        { id: 'counter', x: 40, y: 65, title: 'Calacatta Marble', description: 'Seamless quartz marble waterfall countertop.' }
      ]
    }
  ]
};

const startSynthesizer = (type: 'ocean' | 'city' | 'breeze') => {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return null;

  const ctx = new AudioContext();
  
  // Noise generator helper
  const bufferSize = 2 * ctx.sampleRate;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 1;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, ctx.currentTime); // start low

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  let intervalId: any = null;

  if (type === 'ocean') {
    // Ocean waves
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    noise.start();
    
    let time = 0;
    intervalId = setInterval(() => {
      time += 0.1;
      const wave = Math.sin(time * 0.25) * 0.5 + 0.5;
      const freq = 150 + wave * 400;
      const vol = 0.02 + wave * 0.05;
      filter.frequency.setTargetAtTime(freq, ctx.currentTime, 0.1);
      gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.1);
    }, 100);
  } else if (type === 'city') {
    // NYC Penthouse hum: low frequency hum + soft high hum + ventilation noise
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(60, ctx.currentTime);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(120, ctx.currentTime);
    
    oscGain.gain.setValueAtTime(0.02, ctx.currentTime);
    
    osc1.connect(oscGain);
    osc2.connect(oscGain);
    oscGain.connect(ctx.destination);
    
    osc1.start();
    osc2.start();
    
    filter.frequency.setValueAtTime(120, ctx.currentTime);
    noise.start();
    gain.gain.setValueAtTime(0.008, ctx.currentTime);

    const originalStop = () => {
      try {
        osc1.stop();
        osc2.stop();
        noise.stop();
      } catch(e){}
      ctx.close();
    };
    return { stop: originalStop };
  } else {
    // breeze: soft wind noise
    filter.frequency.setValueAtTime(250, ctx.currentTime);
    noise.start();
    gain.gain.setValueAtTime(0.015, ctx.currentTime);

    let time = 0;
    intervalId = setInterval(() => {
      time += 0.1;
      const windSpeed = Math.sin(time * 0.1) * Math.cos(time * 0.05);
      const freq = 200 + Math.abs(windSpeed) * 250;
      const vol = 0.01 + Math.abs(windSpeed) * 0.015;
      filter.frequency.setTargetAtTime(freq, ctx.currentTime, 0.2);
      gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.2);
    }, 100);
  }

  const stopSynth = () => {
    if (intervalId) clearInterval(intervalId);
    try {
      noise.stop();
    } catch(e){}
    ctx.close();
  };

  return { stop: stopSynth };
};

export default function TourPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [lightMode, setLightMode] = useState<'day' | 'night'>('day');

  // Showcase Feature States
  const [isSliderActive, setIsSliderActive] = useState(false);
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 - 100)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingType, setBookingType] = useState<'physical' | 'video' | 'virtual'>('virtual');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [ambientAudioOn, setAmbientAudioOn] = useState(false);
  const synthRef = useRef<{ stop: () => void } | null>(null);
  
  const viewportRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const currentRoom = rooms[activeRoomIdx] || null;

  // Synthesizer controls
  useEffect(() => {
    if (ambientAudioOn && property) {
      if (synthRef.current) {
        synthRef.current.stop();
      }
      const loc = property.location.toLowerCase();
      let type: 'ocean' | 'city' | 'breeze' = 'breeze';
      if (loc.includes('malibu')) type = 'ocean';
      else if (loc.includes('new york') || loc.includes('manhattan')) type = 'city';
      
      const synth = startSynthesizer(type);
      synthRef.current = synth;
    } else {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    };
  }, [ambientAudioOn, property]);

  // Handle Speech Synthesis (AI Voice Guide)
  const handleSpeak = () => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;

    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    if (currentRoom) {
      synth.cancel(); // Cancel any current utterances
      const utterance = new SpeechSynthesisUtterance(currentRoom.voiceDesc);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      setIsSpeaking(true);
      synth.speak(utterance);
    }
  };

  // Stop speaking when switching rooms
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setActiveHotspot(null);
  }, [activeRoomIdx]);

  useEffect(() => {
    const foundProp = mockProperties.find((p) => p.id === id);
    if (!foundProp) {
      setProperty(mockProperties[0]);
      setRooms(ROOM_DATA['prop-1']);
    } else {
      setProperty(foundProp);
      setRooms(ROOM_DATA[foundProp.id] || ROOM_DATA['default']);
    }
  }, [id]);

  // Handle 3D rotation dragging
  useEffect(() => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input')) {
        return;
      }
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      setRotate(prev => ({
        x: Math.max(-15, Math.min(15, prev.x - dy * 0.15)),
        y: prev.y + dx * 0.2
      }));

      startX = e.clientX;
      startY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const viewport = viewportRef.current;
    if (viewport) {
      viewport.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      if (viewport) {
        viewport.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Handle Before/After Slider Move
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  useEffect(() => {
    const handleMouseOrTouchMove = (e: any) => {
      if (!isSliderActive) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      handleSliderMove(clientX);
    };

    const handleMouseOrTouchUp = () => {
      setIsSliderActive(false);
    };

    if (isSliderActive) {
      window.addEventListener('mousemove', handleMouseOrTouchMove);
      window.addEventListener('touchmove', handleMouseOrTouchMove);
      window.addEventListener('mouseup', handleMouseOrTouchUp);
      window.addEventListener('touchend', handleMouseOrTouchUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseOrTouchMove);
      window.removeEventListener('touchmove', handleMouseOrTouchMove);
      window.removeEventListener('mouseup', handleMouseOrTouchUp);
      window.removeEventListener('touchend', handleMouseOrTouchUp);
    };
  }, [isSliderActive]);

  if (!property || rooms.length === 0 || !currentRoom) {
    return <div className={styles.loading}>Initializing 3D Tour Environment...</div>;
  }

  return (
    <div className={`${styles.tourContainer} ${lightMode === 'night' ? styles.nightTime : ''}`}>
      {/* Top Header */}
      <header className={`${styles.header} glass-panel`}>
        <div className={styles.headerLeft}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            ← Back
          </button>
          <div>
            <h1 className={styles.propTitle}>{property.title}</h1>
            <p className={styles.propLoc}>{property.location}</p>
          </div>
        </div>

        <div className={styles.headerRight}>
          {/* Day/Night Lighting Swap Buttons */}
          <div className={styles.toggleGroup}>
            <button 
              className={`${styles.timeToggle} ${lightMode === 'day' ? styles.activeTime : ''}`} 
              onClick={() => setLightMode('day')}
            >
              ☀️ Day
            </button>
            <button 
              className={`${styles.timeToggle} ${lightMode === 'night' ? styles.activeTime : ''}`} 
              onClick={() => setLightMode('night')}
            >
              🌙 Dusk
            </button>
          </div>
          <button 
            className={`${styles.ambientToggle} ${ambientAudioOn ? styles.activeAmbient : ''}`}
            onClick={() => setAmbientAudioOn(!ambientAudioOn)}
            title="Toggle Ambient Sounds"
          >
            {ambientAudioOn ? '🔊 Audio On' : '🔇 Audio Off'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className={styles.workspace}>
        {/* Left Sidebar: Room Deck */}
        <aside className={`${styles.sidebar} glass-panel`}>
          <h3 className={styles.sideTitle}>Select Room</h3>
          <div className={styles.roomList}>
            {rooms.map((room, idx) => (
              <button 
                key={room.id}
                className={`${styles.roomBtn} ${idx === activeRoomIdx ? styles.activeRoom : ''}`}
                onClick={() => {
                  setActiveRoomIdx(idx);
                  setActiveHotspot(null);
                  setRotate({ x: 0, y: 0 });
                }}
              >
                {room.name}
              </button>
            ))}
          </div>

          {/* AI Voice Guide Widget */}
          <div className={styles.aiGuideWidget}>
            <div className={styles.widgetHeader}>
              <h4>🎙️ AI Audio Guide</h4>
              <button 
                className={`${styles.audioBtn} ${isSpeaking ? styles.speaking : ''}`}
                onClick={handleSpeak}
              >
                {isSpeaking ? '⏹️ Stop' : '▶️ Play Tour'}
              </button>
            </div>
            {isSpeaking && (
              <div className={styles.soundWave}>
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
              </div>
            )}
            <p className={styles.voiceText}>{currentRoom.voiceDesc}</p>
          </div>

          {/* Visit Scheduling CTA */}
          <div className={styles.schedulingSection}>
            <button 
              className={`${styles.bookingCTA} primary-glow-btn`}
              onClick={() => setShowBookingModal(true)}
            >
              📅 Schedule Private Tour
            </button>
          </div>

          <div className={styles.instructions}>
            <h4>💡 Navigation Hint</h4>
            <p>Drag inside the viewport to pan the room. Click hotspots to inspect premium amenities.</p>
          </div>
        </aside>

        {/* Viewport: 3D Room Viewer */}
        <main className={styles.viewportArea}>
          <div 
            className={styles.viewportOuter} 
            ref={viewportRef}
            style={{ position: 'relative' }}
          >
            {/* Crisp Parallax Room Photo Background */}
            <div 
              className={styles.parallaxBg}
              ref={sliderRef}
              style={{
                transform: `translate3d(${rotate.y * -0.5}px, ${rotate.x * -0.5}px, -40px) scale(1.15)`
              }}
            >
              {/* Finished Room Image Layer */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={lightMode === 'night' && currentRoom.imageNight ? currentRoom.imageNight : currentRoom.image} 
                alt={currentRoom.name} 
                className={styles.bgImg} 
                draggable="false" 
              />

              {/* Before/After Renovation Slider Layer */}
              {isSliderActive && currentRoom.imageShell && (
                <div 
                  className={styles.shellOverlay}
                  style={{
                    clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={currentRoom.imageShell} 
                    alt="Under Construction Shell" 
                    className={styles.bgImgShell}
                    draggable="false"
                  />
                  <div className={styles.shellLabel}>Bare Structure</div>
                </div>
              )}

              {/* Slider Controller Handle */}
              {isSliderActive && currentRoom.imageShell && (
                <div 
                  className={styles.sliderHandle}
                  style={{ left: `${sliderPos}%` }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsSliderActive(true);
                  }}
                  onTouchStart={(e) => {
                    setIsSliderActive(true);
                  }}
                >
                  <div className={styles.sliderBar} />
                  <div className={styles.sliderBtn}>↔</div>
                  <div className={styles.sliderBar} />
                </div>
              )}
            </div>

            {/* Before/After Activation Toggle */}
            {currentRoom.imageShell && (
              <button 
                className={`${styles.sliderToggle} glass-panel`}
                onClick={() => setIsSliderActive(!isSliderActive)}
              >
                📐 {isSliderActive ? 'Show Finished View' : 'Compare Structure Shell'}
              </button>
            )}

            <div className={`${styles.miniFloorPlan} glass-panel`}>
              <h5>🗺️ Teleport Blueprint</h5>
              <svg viewBox="0 0 200 120" className={styles.floorPlanSvg}>
                {rooms.map((room, idx) => {
                  const getRoomGeometry = (i: number, total: number) => {
                    if (total === 1) {
                      return { d: "M10 10 H190 V110 H10 Z", textX: 100, textY: 60 };
                    }
                    if (total === 2) {
                      if (i === 0) return { d: "M10 10 H95 V110 H10 Z", textX: 52, textY: 60 };
                      return { d: "M105 10 H190 V110 H105 Z", textX: 147, textY: 60 };
                    }
                    if (i === 0) return { d: "M10 10 H115 V65 H10 Z", textX: 62, textY: 42 };
                    if (i === 1) return { d: "M125 10 H190 V110 H125 Z", textX: 157, textY: 60 };
                    return { d: "M10 75 H115 V110 H10 Z", textX: 62, textY: 98 };
                  };

                  const geom = getRoomGeometry(idx, rooms.length);
                  return (
                    <g key={room.id} style={{ cursor: 'pointer' }}>
                      <path 
                        d={geom.d}
                        className={`${styles.blueprintRoom} ${idx === activeRoomIdx ? styles.activeRoomSector : ''}`}
                        onClick={() => {
                          setActiveRoomIdx(idx);
                          setActiveHotspot(null);
                          setRotate({ x: 0, y: 0 });
                        }}
                      />
                      <text x={geom.textX} y={geom.textY} className={styles.blueprintText}>
                        {room.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 3D Holographic Perspective Overlay Scene */}
            <div 
              className={styles.scene3D}
              style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
              }}
            >
              {/* 3D Hologram Chamber lines */}
              <div className={styles.chamber3D}>
                <div className={`${styles.chamberWall} ${styles.wallLeft}`}>
                  <div className={styles.hologramGrid} />
                </div>
                <div className={`${styles.chamberWall} ${styles.wallRight}`}>
                  <div className={styles.hologramGrid} />
                </div>
                <div className={`${styles.chamberWall} ${styles.wallFloor}`}>
                  <div className={styles.floorGrid} />
                </div>
                <div className={`${styles.chamberWall} ${styles.wallCeiling}`}>
                  <div className={styles.ceilingGrid} />
                </div>
              </div>

              {/* Hotspots floating in 3D */}
              {currentRoom.hotspots.map((spot) => (
                <button
                  key={spot.id}
                  className={`${styles.hotspot} ${activeHotspot?.id === spot.id ? styles.activeHotspot : ''}`}
                  style={{
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    transform: `translate3d(-50%, -50%, 30px)`
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(spot);
                  }}
                >
                  <span className={styles.hotspotPulse} />
                </button>
              ))}
            </div>

            {/* Hotspot details banner */}
            {activeHotspot && (
              <div className={`${styles.hotspotBanner} glass-panel`}>
                <button onClick={() => setActiveHotspot(null)} className={styles.closeBanner}>×</button>
                <h4>{activeHotspot.title}</h4>
                <p>{activeHotspot.description}</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Futuristic Booking Calendar Modal */}
      {showBookingModal && (
        <div className={styles.modalBackdrop}>
          <div className={`${styles.modalCard} glass-panel`}>
            <button 
              className={styles.closeModal} 
              onClick={() => {
                setShowBookingModal(false);
                setBookingSuccess(false);
              }}
            >
              ×
            </button>

            {!bookingSuccess ? (
              <>
                <h3 className={styles.modalTitle}>📅 Schedule Private Showing</h3>
                <p className={styles.modalSub}>Reserve a guided spatial viewing slot with a senior property advisor.</p>
                
                <div className={styles.formGroup}>
                  <label>Choose Date</label>
                  <input 
                    type="date" 
                    className={styles.formInput} 
                    value={bookingDate} 
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Visit Medium</label>
                  <div className={styles.typeSelector}>
                    <button 
                      className={`${styles.typeBtn} ${bookingType === 'virtual' ? styles.activeType : ''}`}
                      onClick={() => setBookingType('virtual')}
                    >
                      🖥️ 3D Virtual Guided
                    </button>
                    <button 
                      className={`${styles.typeBtn} ${bookingType === 'video' ? styles.activeType : ''}`}
                      onClick={() => setBookingType('video')}
                    >
                      📹 Private Video Walk
                    </button>
                    <button 
                      className={`${styles.typeBtn} ${bookingType === 'physical' ? styles.activeType : ''}`}
                      onClick={() => setBookingType('physical')}
                    >
                      🚗 In-Person Site Visit
                    </button>
                  </div>
                </div>

                <button 
                  className={`${styles.submitBooking} primary-glow-btn`}
                  disabled={!bookingDate}
                  onClick={() => setBookingSuccess(true)}
                >
                  Confirm Request
                </button>
              </>
            ) : (
              <div className={styles.successTicket}>
                <div className={styles.successIcon}>✓</div>
                <h3>Showing Request Confirmed!</h3>
                <div className={styles.ticketCard}>
                  <div className={styles.ticketHeader}>
                    AURA<span className={styles.gold}>ESTATE</span> PASS
                  </div>
                  <div className={styles.ticketBody}>
                    <p><strong>Property:</strong> {property.title}</p>
                    <p><strong>Date:</strong> {bookingDate}</p>
                    <p><strong>Medium:</strong> {bookingType === 'virtual' ? '3D Virtual Guided' : bookingType === 'video' ? 'Private Video Walk' : 'In-Person Site Visit'}</p>
                    <p><strong>Status:</strong> Holographic Pass Activated</p>
                  </div>
                  <div className={styles.ticketFooter}>
                    PRESENT AT PORTAL ENTRY
                  </div>
                </div>
                <button 
                  className={styles.closeSuccess}
                  onClick={() => setShowBookingModal(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
