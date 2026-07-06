export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  size: number; // sqft
  rating: number;
  image: string;
  description: string;
  tag: 'Villa' | 'Penthouse' | 'Mansion' | 'Apartment';
  coordinates: { x: number; y: number };
}

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    title: 'Aero Luxury Villa',
    location: 'Malibu, California',
    price: 4850000,
    beds: 5,
    baths: 6,
    size: 6200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    description: 'Suspended over the cliffs of Malibu, Aero Luxury Villa is a masterclass in modern architectural engineering. Featuring 3D glass floor-to-ceiling windows, an infinity pool extending into the horizon, and fully integrated smart home capabilities.',
    tag: 'Villa',
    coordinates: { x: 34.0259, y: -118.7798 }
  },
  {
    id: 'prop-2',
    title: 'Solaris Penthouse',
    location: 'Manhattan, New York',
    price: 8200000,
    beds: 3,
    baths: 3.5,
    size: 4100,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
    description: 'Rising above the New York skyline, the Solaris Penthouse offers unparalleled panoramic views of Central Park and the East River. With private elevator access and a wrapping 3D structural glass balcony.',
    tag: 'Penthouse',
    coordinates: { x: 40.7831, y: -73.9712 }
  },
  {
    id: 'prop-3',
    title: 'Verdant Canopy Mansion',
    location: 'Miami, Florida',
    price: 6400000,
    beds: 6,
    baths: 7,
    size: 7800,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: 'A botanical paradise in the heart of Miami. Surrounded by lush tropical greenery, this modern mansion offers outdoor living space with an integrated waterfall and private boating dock.',
    tag: 'Mansion',
    coordinates: { x: 25.7617, y: -80.1918 }
  },
  {
    id: 'prop-4',
    title: 'The Edge Residences',
    location: 'Los Angeles, California',
    price: 3950000,
    beds: 4,
    baths: 4.5,
    size: 5100,
    rating: 4.75,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    description: 'A striking minimalist mansion sitting atop the Hollywood Hills. Features a cantilevered deck, modern concrete-glass elements, and private wellness spa.',
    tag: 'Mansion',
    coordinates: { x: 34.0522, y: -118.2437 }
  },
  {
    id: 'prop-5',
    title: 'Nebula Sky Suite',
    location: 'Miami, Florida',
    price: 2600000,
    beds: 2,
    baths: 2.5,
    size: 2400,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    description: 'Modern luxury meets high-tech comfort. A smart apartment situated in downtown Miami, offering automated lighting, motorized shades, and a private sky pool access.',
    tag: 'Apartment',
    coordinates: { x: 25.7781, y: -80.1892 }
  },
  {
    id: 'prop-6',
    title: 'Crestwood Oasis',
    location: 'Malibu, California',
    price: 5900000,
    beds: 4,
    baths: 5,
    size: 5800,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Tucked away in the private canyons of Malibu, Crestwood Oasis offers clean lines, warm natural materials, and an immersive outdoor fire pit and lounge deck.',
    tag: 'Villa',
    coordinates: { x: 34.0322, y: -118.7500 }
  }
];

export const mockLocations = [
  { name: 'Malibu', count: 2, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80' },
  { name: 'Miami', count: 2, image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?auto=format&fit=crop&w=500&q=80' },
  { name: 'New York', count: 1, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80' },
  { name: 'Los Angeles', count: 1, image: 'https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=500&q=80' },
];
