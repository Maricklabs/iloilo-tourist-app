export type Destination = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  accent: string;
};

export const destinations: Destination[] = [
  {
    id: 'molo-mansion',
    name: 'Molo Mansion',
    category: 'Culture & heritage',
    description: 'A sample destination card for the foundation release.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
    accent: 'Warm history',
  },
  {
    id: 'esplanade',
    name: 'Iloilo River Esplanade',
    category: 'Parks & plazas',
    description: 'A sample place record awaiting local verification.',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    accent: 'Slow mornings',
  },
  {
    id: 'heritage-walk',
    name: 'Heritage Walk',
    category: 'History',
    description: 'A sample itinerary prompt for future verified content.',
    image: 'https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=900&q=80',
    accent: 'Stories to keep',
  },
];

export const dishes = [
  { name: 'La Paz Batchoy', note: 'Local dish · sample record', icon: '🍜' },
  { name: 'Pancit Molo', note: 'Local dish · sample record', icon: '🥟' },
  { name: 'KBL', note: 'Local dish · sample record', icon: '🍲' },
];

export const events = [
  { date: '18', month: 'NOV', title: 'Sample cultural weekend', place: 'Iloilo City · Demo listing', type: 'Cultural' },
  { date: '23', month: 'NOV', title: 'Sample food discovery walk', place: 'Venue to be verified', type: 'Food' },
  { date: '30', month: 'NOV', title: 'Sample community showcase', place: 'Organizer to be confirmed', type: 'Community' },
];
