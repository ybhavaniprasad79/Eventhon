import React from 'react';

export function SemiCard({ title, collegeName, location, eventType, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '15px 20px',
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        backgroundColor: 'white',
        fontFamily: 'Poppins, sans-serif',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        maxWidth: '500px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
      }}
    >
      <img
        src="https://ui-avatars.com/api/?name=Event&background=random"
        alt="event logo"
        style={{ width: '60px', height: '60px', borderRadius: '12px', flexShrink: 0 }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#333' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '15px', color: '#555' }}>
          {collegeName}, {location}
        </p>
        <div
          style={{
            backgroundColor: '#e0f4ff',
            color: '#007acc',
            padding: '5px 12px',
            borderRadius: '12px',
            width: 'fit-content',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {eventType}
        </div>
      </div>
    </div>
  );
}
