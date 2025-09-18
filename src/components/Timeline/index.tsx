import React from 'react';
import './Timeline.css';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
    };
    secondary?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
    };
  };
  tags?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'compact';
  showConnector?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({
  items,
  variant = 'default',
  showConnector = true
}) => {
  return (
    <div className={`timeline timeline--${variant}`}>
      {items.map((item, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-marker">
            <div className="timeline-marker-dot"></div>
            {showConnector && index < items.length - 1 && (
              <div className="timeline-marker-line"></div>
            )}
          </div>

          <div className="timeline-content">
            <div className="timeline-date">
              <svg className="timeline-date-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10.8 1.6V4M5.2 1.6V4M2 6.4H14M3.2 2.8H12.8C13.4627 2.8 14 3.3373 14 4V13.6C14 14.2627 13.4627 14.8 12.8 14.8H3.2C2.5373 14.8 2 14.2627 2 13.6V4C2 3.3373 2.5373 2.8 3.2 2.8Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"/>
              </svg>
              <span>{item.date}</span>
            </div>

            <h3 className="timeline-title">{item.title}</h3>

            <p className="timeline-description">{item.description}</p>

            <div className="timeline-actions">
              {item.actions?.primary && (
                <button className="timeline-button timeline-button--primary" onClick={item.actions.primary.onClick}>
                  {item.actions.primary.icon}
                  {item.actions.primary.label}
                </button>
              )}
              {item.actions?.secondary && (
                <button className="timeline-button timeline-button--secondary" onClick={item.actions.secondary.onClick}>
                  {item.actions.secondary.icon}
                  {item.actions.secondary.label}
                </button>
              )}
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="timeline-tags">
                {item.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="timeline-tag">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="2" cy="2" r="1" fill="currentColor"/>
                    </svg>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;