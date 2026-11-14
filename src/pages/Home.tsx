import { Link } from 'react-router-dom';
import { DestinationCard } from '../components/DestinationCard';
import { Icon } from '../components/Icon';
import { destinations, dishes, events } from '../data/demo';

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow light"><Icon name="Sparkles" size={15} /> Locally curious? Start here.</span>
          <h1>Find your way to <em>Iloilo.</em></h1>
          <p>A welcoming starting point for heritage, food, language, and moments worth remembering.</p>
          <div className="search-box"><Icon name="Search" size={20} /><input aria-label="Search destinations" placeholder="Search places, dishes, or events" /><button aria-label="Submit search"><Icon name="ArrowRight" size={19} /></button></div>
          <div className="hero-note"><span className="status-dot" /> Sample content is clearly marked until locally verified.</div>
        </div>
        <div className="hero-shape" aria-hidden="true" />
      </section>
      <section className="welcome-row">
        <div><span className="eyebrow">YOUR ILOILO STARTER</span><h2>Small plans, meaningful places.</h2><p>Browse with context, discover at your pace, and keep the places you love close.</p></div>
        <Link className="outline-button" to="/explore">Explore the map <Icon name="ArrowRight" size={17} /></Link>
      </section>
      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">HANDPICKED FOR YOU</span><h2>Begin with a story</h2></div><Link to="/explore" className="text-link">See all <Icon name="ChevronRight" size={17} /></Link></div>
        <div className="destination-grid">{destinations.map((destination) => <DestinationCard key={destination.id} destination={destination} />)}</div>
      </section>
      <section className="split-section">
        <div className="info-panel phrase-panel"><div className="panel-icon"><Icon name="BookOpen" /></div><span className="eyebrow">SAY HELLO</span><h2>Try a little Hiligaynon.</h2><p>Useful phrases for ordering food, asking directions, and making a warm first impression.</p><Link className="solid-button" to="/phrasebook">Open phrasebook <Icon name="ArrowRight" size={17} /></Link></div>
        <div className="info-panel food-panel"><div className="panel-icon orange"><Icon name="Utensils" /></div><span className="eyebrow">TASTE ILOILO</span><h2>What’s on the table?</h2><div className="dish-list">{dishes.map((dish) => <Link to="/discover" className="dish-row" key={dish.name}><span className="dish-emoji">{dish.icon}</span><span><strong>{dish.name}</strong><small>{dish.note}</small></span><Icon name="ChevronRight" size={17} /></Link>)}</div></div>
      </section>
      <section className="section-block events-preview"><div className="section-heading"><div><span className="eyebrow">ON THE CALENDAR</span><h2>Upcoming moments</h2></div><Link to="/events" className="text-link">View events <Icon name="ChevronRight" size={17} /></Link></div><div className="event-list">{events.map((event) => <Link to="/events" className="event-row" key={event.title}><div className="date-box"><strong>{event.date}</strong><small>{event.month}</small></div><div><span className="eyebrow">{event.type}</span><h3>{event.title}</h3><p>{event.place}</p></div><Icon name="ChevronRight" size={19} /></Link>)}</div></section>
    </>
  );
}
