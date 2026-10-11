import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h2>LogiExpress Panel</h2>
      </div>
      <div className="profile">
        <span className="user-name">ნათია გორგოძე</span>
        <div className="avatar">NG</div>
      </div>
    </header>
  );
}