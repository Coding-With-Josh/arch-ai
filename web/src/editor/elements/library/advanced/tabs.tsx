import { ComponentProps } from '@/editor/types';
import React, { useState } from 'react';

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps extends ComponentProps {
  tabs?: TabItem[];
  defaultActiveTab?: number;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs = [], defaultActiveTab = 0, style, className, ...props }, ref) => {
    const [activeTab, setActiveTab] = useState(defaultActiveTab);

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...style,
        }}
        className={className}
        {...props}
      >
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {tabs.map((tab, index) => (
            <button
              key={index}
              style={{
                padding: '0.75rem 1rem',
                borderBottom: activeTab === index ? '2px solid #3b82f6' : 'none',
                color: activeTab === index ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === index ? 600 : 500,
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '1rem' }}>
          {tabs[activeTab]?.content}
        </div>
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';