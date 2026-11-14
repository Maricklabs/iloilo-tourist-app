import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import type { Destination } from '../data/demo';

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link to={`/explore/${destination.id}`} className="destination-card">
      <div className="destination-image" style={{ backgroundImage: `url(${destination.image})` }}>
        <span className="image-label">Sample imagery</span>
        <span className="save-button" aria-label={`Save ${destination.name}`}><Icon name="Heart" size={17} /></span>
      </div>
      <div className="destination-copy">
        <span className="eyebrow">{destination.category}</span>
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>
        <span className="text-link">View details <Icon name="ArrowRight" size={16} /></span>
      </div>
    </Link>
  );
}
