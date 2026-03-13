import { statCards } from '../../data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  red: { text: '#ff3b3b', bg: 'rgba(255,59,59,0.08)', border: 'rgba(255,59,59,0.2)' },
  orange: { text: '#ff7b3b', bg: 'rgba(255,123,59,0.08)', border: 'rgba(255,123,59,0.2)' },
  yellow: { text: '#ffcb3b', bg: 'rgba(255,203,59,0.08)', border: 'rgba(255,203,59,0.2)' },
  green: { text: '#3bff8a', bg: 'rgba(59,255,138,0.08)', border: 'rgba(59,255,138,0.2)' },
  blue: { text: '#3b9eff', bg: 'rgba(59,158,255,0.08)', border: 'rgba(59,158,255,0.2)' },
  cyan: { text: '#00e5ff', bg: 'rgba(0,229,255,0.08)', border: 'rgba(0,229,255,0.2)' },
};

const StatCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
      {statCards.map((card, i) => {
        const c = colorMap[card.color];
        return (
          <div
            key={i}
            className="card p-4 animate-slide-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xl">{card.icon}</span>
              <div
                className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded font-mono-custom"
                style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
              >
                {card.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {card.change}
              </div>
            </div>
            <div
              className="font-display font-bold text-2xl"
              style={{ color: c.text }}
            >
              {card.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#7aa3bc' }}>
              {card.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
