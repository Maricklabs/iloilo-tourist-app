import { Link, NavLink, Outlet } from 'react-router-dom';
import { Icon, type IconName } from './Icon';

const navItems: Array<{ label: string; to: string; icon: IconName }> = [
  { label: 'Home', to: '/', icon: 'Home' },
  { label: 'Explore', to: '/explore', icon: 'Compass' },
  { label: 'Discover', to: '/discover', icon: 'Utensils' },
  { label: 'Phrasebook', to: '/phrasebook', icon: 'BookOpen' },
  { label: 'Events', to: '/events', icon: 'CalendarDays' },
];

export function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Iloilo Tourist Guide home">
          <span className="brand-mark"><Icon name="MapPin" size={21} /></span>
          <span>Iloilo <strong>Tourist Guide</strong></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => <NavItem key={item.to} {...item} />)}
        </nav>
        <Link className="profile-link" to="/account" aria-label="Open account"><Icon name="UserRound" /></Link>
      </header>
      <main className="page-content"><Outlet /></main>
      <Link to="/chatbot" className="assistant-button" aria-label="Open tourism assistant"><Icon name="MessageCircle" size={22} /></Link>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>
    </div>
  );
}

function NavItem({ label, to, icon }: { label: string; to: string; icon: IconName }) {
  return <NavLink to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Icon name={icon} size={19} /><span>{label}</span></NavLink>;
}
