import React from 'react';
import Timeline from './components/Timeline';
import './App.css';

function App() {
  const timelineItems = [
    {
      date: '10 May 2025',
      title: 'Flowbite Figma Design System',
      description: 'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &, Publisher and Marketing pages.',
      actions: {
        primary: {
          label: 'Read more',
          onClick: () => console.log('Read more clicked'),
        },
        secondary: {
          label: 'Download now',
          onClick: () => console.log('Download clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V10M8 10L5 7M8 10L11 7M3 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        },
      },
    },
    {
      date: '14 March 2025',
      title: 'Flowbite Figma Design System',
      description: 'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &, Publisher and Marketing pages.',
      tags: ['Changelog'],
      actions: {
        secondary: {
          label: 'Download now',
          onClick: () => console.log('Download clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V10M8 10L5 7M8 10L11 7M3 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        },
      },
    },
    {
      date: '22 February 2025',
      title: 'Flowbite Blocks v.3.0',
      description: 'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &, Publisher and Marketing pages.',
      actions: {
        primary: {
          label: 'View blocks',
          onClick: () => console.log('View blocks clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        },
      },
    },
    {
      date: '29 October 2024',
      title: 'E-commerce UI Figma & Code',
      description: 'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &, Publisher and Marketing pages.',
      actions: {
        primary: {
          label: 'View in blocks',
          onClick: () => console.log('View in blocks clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        },
        secondary: {
          label: 'Download now',
          onClick: () => console.log('Download clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V10M8 10L5 7M8 10L11 7M3 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        },
      },
    },
  ];

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Timeline Component Example</h1>
          <p>This example shows how you can use the component as a variant. Simply click on the component, and you'll see all the available options in the right sidebar.</p>
          <a href="#" className="docs-link">
            Coded version docs →
          </a>
        </header>

        <div className="timeline-demo">
          <Timeline items={timelineItems} />
        </div>

        <div className="variant-demo">
          <h2>Compact Variant</h2>
          <Timeline items={timelineItems} variant="compact" />
        </div>

        <div className="variant-demo">
          <h2>Without Connector Lines</h2>
          <Timeline items={timelineItems} showConnector={false} />
        </div>
      </div>
    </div>
  );
}

export default App;
