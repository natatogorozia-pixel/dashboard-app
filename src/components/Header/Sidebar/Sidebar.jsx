import React from 'react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li className="active">📊 მთავარი</li>
          <li>📦 გადაზიდვები</li>
          <li>🚚 ავტოპარკი</li>
          <li>👥 მომხმარებლები</li>
          <li>⚙️ პარამეტრები</li>
        </ul>
      </nav>
    </aside>
  );
}