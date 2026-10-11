import React from 'react';
import './StatCard.css';

export default function StatCard({ title, value, icon, change }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
        <span className="stat-change">{change}</span>
      </div>
    </div>
  );
}