import React from 'react';

export const Card = ({ children, className = '' }) => {
  return <div className={`custom-card ${className}`}>{children}</div>;
};