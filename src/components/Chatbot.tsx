'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';
import { Property, mockProperties } from '@/data/mockData';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  onSelectProperty: (property: Property) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  properties?: Property[]; // Optional embedded property card matching results
  customCard?: {
    type: 'booking' | 'offer';
    data: {
      propertyName: string;
      date?: string;
      medium?: string;
      price?: string;
      status?: string;
    };
  };
}

const PREDEFINED_CHIPS = [
  { label: '📅 Book Tour', query: 'book tour' },
  { label: '💰 Submit Offer', query: 'submit offer' },
  { label: '🏖️ Malibu Villas', query: 'Malibu Villa' },
  { label: '🏙️ Penthouses', query: 'Penthouse' },
  { label: '🌴 Miami Homes', query: 'Miami' },
];

interface WorkflowData {
  property?: Property;
  date?: string;
  medium?: string;
  offerPrice?: number;
}

export default function Chatbot({ isOpen, onClose, onSearch, onSelectProperty }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'bot',
      text: 'Hello! I am your AURA Virtual Assistant. I can help you search properties, filter locations, schedule tours, and submit purchase offers. What can I do for you today?',
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Workflow states
  const [activeWorkflow, setActiveWorkflow] = useState<'none' | 'booking' | 'offer'>('none');
  const [workflowStep, setWorkflowStep] = useState(0);
  const [workflowData, setWorkflowData] = useState<WorkflowData>({});

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // 2. Process query and update main page filter
    setTimeout(() => {
      let botResponseText = '';
      let matchedProps: Property[] = [];
      let customCard: any = undefined;

      const query = textToSend.toLowerCase();

      // Check for active workflows
      if (activeWorkflow === 'booking') {
        if (workflowStep === 0) {
          // Expecting Property selection
          const found = mockProperties.find(p => p.title.toLowerCase().includes(query) || p.id.toLowerCase() === query);
          if (found) {
            setWorkflowData(prev => ({ ...prev, property: found }));
            botResponseText = `You selected "${found.title}". Next, which date would you like to schedule? (e.g. YYYY-MM-DD)`;
            setWorkflowStep(1);
          } else {
            botResponseText = "I couldn't match that property. Please type the name of one of our properties (e.g. Aero Luxury Villa, Solaris Penthouse):";
          }
        } else if (workflowStep === 1) {
          // Expecting date
          setWorkflowData(prev => ({ ...prev, date: textToSend }));
          botResponseText = "Perfect! Lastly, what format do you prefer? (Type: virtual, video, or physical)";
          setWorkflowStep(2);
        } else if (workflowStep === 2) {
          // Expecting medium
          const medium = query.includes('virtual') ? 'virtual' : query.includes('video') ? 'video' : 'physical';
          const finalData = { ...workflowData, medium };
          
          botResponseText = "Excellent! Your spatial guided viewing request has been confirmed. I have generated your entry pass below:";
          customCard = {
            type: 'booking',
            data: {
              propertyName: finalData.property.title,
              date: finalData.date,
              medium: medium === 'virtual' ? '3D Virtual Guided' : medium === 'video' ? 'Private Video Walk' : 'In-Person Site Visit',
              status: 'Holographic Pass Activated'
            }
          };
          setActiveWorkflow('none');
          setWorkflowStep(0);
          setWorkflowData({});
        }
      } else if (activeWorkflow === 'offer') {
        if (workflowStep === 0) {
          // Expecting property
          const found = mockProperties.find(p => p.title.toLowerCase().includes(query) || p.id.toLowerCase() === query);
          if (found) {
            setWorkflowData(prev => ({ ...prev, property: found }));
            botResponseText = `Great. What is your offer price in USD for "${found.title}"? (Listing Price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(found.price)})`;
            setWorkflowStep(1);
          } else {
            botResponseText = "Please specify which property you want to place an offer on (e.g. Aero Luxury Villa, Solaris Penthouse):";
          }
        } else if (workflowStep === 1) {
          // Expecting offer price
          const priceNum = parseInt(textToSend.replace(/[^0-9]/g, ''));
          if (isNaN(priceNum)) {
            botResponseText = "Please enter a valid numeric value (e.g. $4,500,000):";
          } else {
            setWorkflowData(prev => ({ ...prev, offerPrice: priceNum }));
            botResponseText = `Got it. An offer of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(priceNum)}. Would you like to officially submit this to the seller? (Type: yes / no)`;
            setWorkflowStep(2);
          }
        } else if (workflowStep === 2) {
          // Expecting confirmation
          if (query.includes('yes') || query.includes('yup') || query.includes('sure')) {
            const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(workflowData.offerPrice);
            botResponseText = "Congratulations! Your offer has been officially registered and dispatched to the property owner's representative. Here is your receipt:";
            customCard = {
              type: 'offer',
              data: {
                propertyName: workflowData.property.title,
                price: formattedPrice,
                status: 'Dispatched to Seller'
              }
            };
          } else {
            botResponseText = "Offer submission cancelled. Let me know if you want to perform any other searches!";
          }
          setActiveWorkflow('none');
          setWorkflowStep(0);
          setWorkflowData({});
        }
      } else {
        // Normal assistant flows
        if (query.includes('book') || query.includes('schedule') || query.includes('tour') || query.includes('showing')) {
          setActiveWorkflow('booking');
          setWorkflowStep(0);
          botResponseText = "I would be happy to assist you in booking a private tour! First, which property would you like to schedule for?";
        } else if (query.includes('offer') || query.includes('submit') || query.includes('make offer') || query.includes('buy')) {
          setActiveWorkflow('offer');
          setWorkflowStep(0);
          botResponseText = "I can guide you through submitting a secure, non-binding purchase offer. To begin, which of our properties are you placing the offer on?";
        } else if (query.includes('location')) {
          botResponseText = 'I have highlighted our prime neighborhoods on the map carousel. You can click on Malibu, Miami, New York, or Los Angeles to view properties.';
          onSearch('locations');
        } else if (query.includes('under')) {
          const numberMatch = query.match(/\d+/g);
          const maxPrice = numberMatch ? parseInt(numberMatch.join('')) : 5000000;
          matchedProps = mockProperties.filter(p => p.price <= maxPrice);
          botResponseText = `Here are the luxury listings priced under $${(maxPrice / 1000000).toFixed(1)}M. I've updated the property showcase below for you.`;
          onSearch(`under ${maxPrice}`);
        } else {
          matchedProps = mockProperties.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.location.toLowerCase().includes(query) || 
            p.tag.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
          );

          if (matchedProps.length > 0) {
            botResponseText = `I found ${matchedProps.length} property match${matchedProps.length > 1 ? 'es' : ''} for "${textToSend}". I have filtered the display below, and listed the options right here:`;
            onSearch(textToSend);
          } else {
            botResponseText = `I couldn't find any direct matches for "${textToSend}", but here are some of our finest recommendations:`;
            matchedProps = mockProperties.slice(0, 2);
            onSearch('');
          }
        }
      }

      const botMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date(),
        properties: matchedProps.length > 0 ? matchedProps : undefined,
        customCard: customCard
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputVal);
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.chatContainer} glass-panel`}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.botProfile}>
          <div className={styles.botAvatar}>A</div>
          <div>
            <h4 className={styles.botName}>AURA Agent</h4>
            <span className={styles.status}><span className={styles.pulse} /> Online</span>
          </div>
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Minimize chat">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className={styles.chatBody}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.userWrapper : styles.botWrapper}`}>
            <div className={styles.messageBubble}>
              <p>{msg.text}</p>
            </div>

            {/* Embedded Property Card in Chat */}
            {msg.properties && (
              <div className={styles.embeddedProps}>
                {msg.properties.map((prop) => (
                  <div 
                    key={prop.id} 
                    className={`${styles.embeddedCard} glass-panel`}
                    onClick={() => {
                      onSelectProperty(prop);
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={prop.image} alt={prop.title} className={styles.embeddedImage} />
                    <div className={styles.embeddedInfo}>
                      <h5>{prop.title}</h5>
                      <p>{prop.location}</p>
                      <span className={styles.embeddedPrice}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(prop.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Custom confirmation card in Chat */}
            {msg.customCard && (
              <div className={styles.customCardWrapper}>
                <div className={styles.ticketCard}>
                  <div className={styles.ticketHeader}>
                    {msg.customCard.type === 'booking' ? '📅 Spatial Showing Pass' : '💰 Purchase Offer Receipt'}
                  </div>
                  <div className={styles.ticketBody}>
                    <p><strong>Property:</strong> {msg.customCard.data.propertyName}</p>
                    {msg.customCard.data.date && <p><strong>Date:</strong> {msg.customCard.data.date}</p>}
                    {msg.customCard.data.medium && <p><strong>Medium:</strong> {msg.customCard.data.medium}</p>}
                    {msg.customCard.data.price && <p><strong>Offer Price:</strong> {msg.customCard.data.price}</p>}
                    <p><strong>Status:</strong> {msg.customCard.data.status}</p>
                  </div>
                  <div className={styles.ticketFooter}>
                    {msg.customCard.type === 'booking' ? 'Aura Estate Guided Access' : 'Aura Secure Offer Portal'}
                  </div>
                </div>
              </div>
            )}

            <span className={styles.time}>
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
            <div className={styles.typingIndicator}>
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className={styles.chipsContainer}>
        {PREDEFINED_CHIPS.map((chip) => (
          <button 
            key={chip.query} 
            className={chip.query.includes('book') || chip.query.includes('offer') ? `${styles.chip} ${styles.activeChip}` : styles.chip}
            style={chip.query.includes('book') || chip.query.includes('offer') ? { borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' } : {}}
            onClick={() => handleSend(chip.query)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleInputSubmit} className={styles.inputArea}>
        <input 
          type="text" 
          placeholder="Ask about Malibu, book a tour..." 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className={styles.chatInput}
        />
        <button type="submit" className={`${styles.sendBtn} glow-btn-teal`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}
