import React, { useState, useEffect } from 'react';
import './App.css';

// API/სერვისის სიმულაცია
const fetchDashboardStats = async () => {
  return [
    { id: '1', title: 'სულ შეკვეთები', value: '1,284', icon: '📦', change: '+12%' },
    { id: '2', title: 'აქტიური ტრანსპორტი', value: '42', icon: '🚚', change: '+5%' },
    { id: '3', title: 'შემოსავალი', value: '₾45,200', icon: '💰', change: '+18%' },
    { id: '4', title: 'დაყოვნებული', value: '3', icon: '⚠️', change: '-2%' },
  ];
};

// Custom Hook: Debounce
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Custom Hook: Fetch Stats
const useStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
};

function App() {
  const { stats, loading } = useStats();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Event Delegation
  const handleGridClick = (event) => {
    const target = event.target;
    if (target.tagName === 'BUTTON') {
      const shipmentId = target.dataset.id;
      alert(`არჩეულია ტვირთი ID: ${shipmentId}`);
    }
  };

  const filteredStats = stats.filter((item) =>
    item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="app-container" style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>B2B ლოჯისტიკის დეშბორდი</h1>
        
        {/* Pulse Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="pulse-dot"></span>
          <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold' }}>
            დაყოვნებული ტვირთები (3)
          </span>
        </div>
      </header>

      {/* Debounced Search */}
      <input
        type="text"
        className="search-input"
        placeholder="ძებნა ტვირთის დასახელებით..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="ძებნა"
        style={{ width: '100%', maxWidth: '400px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px' }}
      />

      {loading ? (
        <p>იტვირთება...</p>
      ) : (
        /* Event Delegation Wrapper */
        <div 
          className="stats-grid" 
          onClick={handleGridClick}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}
        >
          {filteredStats.map((stat) => (
            <div 
              key={stat.id} 
              className="stat-card" 
              tabIndex={0}
              role="button"
              aria-label={`${stat.title}: ${stat.value}`}
              style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '24px' }}>{stat.icon}</div>
              <h3 style={{ margin: '10px 0 5px 0' }}>{stat.title}</h3>
              <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{stat.value}</p>
              <span style={{ color: stat.change.includes('+') ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                {stat.change}
              </span>
              <button 
                data-id={stat.id} 
                style={{ marginTop: '15px', display: 'block', width: '100%', padding: '8px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                დეტალები
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;