import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../components/Icon';

const content: Record<string, { eyebrow: string; title: string; description: string; icon: 'Compass' | 'Utensils' | 'BookOpen' | 'CalendarDays' | 'UserRound' | 'MessageCircle' }> = {
  Explore: { eyebrow: 'EXPLORE ILOILO', title: 'Places with a point of view.', description: 'The interactive map, verified landmark directory, and location-aware discovery will live here in the next milestone.', icon: 'Compass' },
  Discover: { eyebrow: 'DISCOVER LOCAL', title: 'Good food carries a story.', description: 'Explore locally researched dishes, restaurant references, and culture notes. Sample records will be replaced after review.', icon: 'Utensils' },
  Phrasebook: { eyebrow: 'SPEAK LOCAL', title: 'A few words go a long way.', description: 'Find reviewed Hiligaynon phrases with pronunciation and audio support. Audio uploads arrive with the content-management milestone.', icon: 'BookOpen' },
  Events: { eyebrow: 'WHAT’S HAPPENING', title: 'Make room for a new memory.', description: 'Only verified events will appear here. This foundation includes the calendar surface for the moderation workflow.', icon: 'CalendarDays' },
  Account: { eyebrow: 'MY ILOILO', title: 'Keep your favorites close.', description: 'Sign in to save destinations, events, and trips. Public browsing stays available without an account.', icon: 'UserRound' },
  Chatbot: { eyebrow: 'ILOILO ASSISTANT', title: 'Curious is a good place to start.', description: 'The assistant will answer from reviewed tourism content after the Supabase Edge Function and knowledge base are configured.', icon: 'MessageCircle' },
};

export function PlaceholderPage() {
  const key = useLocation().pathname.slice(1).split('/')[0];
  const page = content[key.charAt(0).toUpperCase() + key.slice(1)] ?? content.Explore;
  return <section className="placeholder-page"><div className="placeholder-icon"><Icon name={page.icon} size={30} /></div><span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.description}</p><div className="notice-card"><strong>Milestone 1 foundation</strong><span>This screen is intentionally a clear placeholder, not a fake integration.</span></div><Link to="/" className="solid-button">Back to home <Icon name="ArrowRight" size={17} /></Link></section>;
}
