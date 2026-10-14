import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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

// 1. მოდალის კომპონენტი Portal-ით
function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}

// 2. ფორმის კომპონენტი ვალიდაციით
function ItemForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    change: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    let newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'დასახელების ველი სავალდებულოა!';
    } else if (formData.title.length < 3) {
      newErrors.title = 'დასახელება უნდა იყოს მინიმუმ 3 სიმბოლო!';
    }

    if (!formData.value.toString().trim()) {
      newErrors.value = 'მნიშვნელობის ველი სავალდებულოა!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>მონაცემის დასახელება:</label>
        <input 
          type="text" 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="მაგ: ახალი საწყობი"
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
        />
        {errors.title && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.title}</span>}
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>მნიშვნელობა:</label>
        <input 
          type="text" 
          value={formData.value} 
          onChange={(e) => setFormData({...formData, value: e.target.value})}
          placeholder="მაგ: 150"
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
        />
        {errors.value && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{errors.value}</span>}
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
        <label style={{ fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>ცვლილება (მაგ: +10%):</label>
        <input 
          type="text" 
          value={formData.change} 
          onChange={(e) => setFormData({...formData, change: e.target.value})}
          placeholder="მაგ: +8%"
          style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '6px' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <button type="submit" style={{ background: '#0284c7', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>შენახვა</button>
        <button type="button" onClick={onCancel} style={{ background: '#e5e7eb', color: '#333', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer' }}>გაუქმება</button>
      </div>
    </form>
  );
}

function App() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  // მოდალის და CRUD სტრუქტურის სტეიტები
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  // გახსნა Add New-სთვის
  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  // გახსნა Edit-ისთვის
  const handleOpenEdit = (stat) => {
    setEditingItem(stat);
    setIsModalOpen(true);
  };

  // დამატება ან რედაქტირება დინამიკურად
  const handleFormSubmit = (formData) => {
    if (editingItem) {
      setStats(stats.map(item => item.id === editingItem.id ? { ...item, ...formData } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        icon: '📊',
        ...formData
      };
      setStats([...stats, newItem]);
    }
    setIsModalOpen(false);
  };

  // წაშლა
  const handleDelete = (id) => {
    setStats(stats.filter(item => item.id !== id));
  };

  const filteredStats = stats.filter((item) =>
    item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="app-container" style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>B2B ლოჯისტიკის დეშბორდი</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={handleOpenAdd}
            style={{ padding: '10px 18px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            + Add New
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot"></span>
            <span style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold' }}>
              დაყოვნებული ტვირთები (3)
            </span>
          </div>
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
        <div 
          className="stats-grid" 
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}
        >
          {filteredStats.map((stat) => (
            <div 
              key={stat.id} 
              className="stat-card" 
              style={{ padding: '20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ fontSize: '24px' }}>{stat.icon}</div>
                <h3 style={{ margin: '10px 0 5px 0' }}>{stat.title}</h3>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{stat.value}</p>
                <span style={{ color: stat.change.includes('+') ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                  {stat.change}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                <button 
                  onClick={() => handleOpenEdit(stat)}
                  style={{ flex: 1, padding: '8px', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(stat.id)}
                  style={{ flex: 1, padding: '8px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* მოდალური ფანჯარა ფორმით */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "მონაცემების რედაქტირება" : "ახალი მონაცემის დამატება"}
      >
        <ItemForm 
          initialData={editingItem} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}

export default App;