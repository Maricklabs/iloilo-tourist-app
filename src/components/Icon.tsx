import {
  ArrowRight, BookOpen, CalendarDays, Camera, ChevronRight, Compass, Heart, Home, Map,
  MapPin, Menu, MessageCircle, Search, Sparkles, Utensils, UserRound, X,
} from 'lucide-react';

const icons = { ArrowRight, BookOpen, CalendarDays, Camera, ChevronRight, Compass, Heart, Home, Map, MapPin, Menu, MessageCircle, Search, Sparkles, Utensils, UserRound, X };
export type IconName = keyof typeof icons;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const Component = icons[name];
  return <Component size={size} strokeWidth={1.8} aria-hidden="true" />;
}
