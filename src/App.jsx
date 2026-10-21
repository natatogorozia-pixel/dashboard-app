import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { z } from 'zod';
import './App.css';

// Zod სქემა Fail-Fast ვალიდაციისთვის
const itemSchema = z.object({
  title: z.string().min(3, 'დასახელება უნდა იყოს მინიმუმ 3 სიმბოლო!'),
  value: z.string().min(1, 'მნიშვნელობის ველი სავალდებულოა!'),
  change: z.string().optional()
});

// 1. React Error Boundary (UI-ს დაცვა თეთრი ეკრანისგან)
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary დაიჭირა შეცდომა:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>⚠️ სისტემური შეცდომა (Runtime Error)</h2>
          <p>სამწუხაროდ, აპლიკაციის ამ ნაწილში მოხდა შეფერხება.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            სცადეთ ხელახლა (Retry)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// API/სერვისის სიმულაცია DevTools Debugging მეთოდებით (`console.time` და `console.table`)
const fetchDashboardStats = async () => {
  debugger;
  console.time('StatsLoadTime'); // ზომავს ჩატვირთვის სისწრაფეს
  
  const data = [
    { id: '1', title: 'სულ შეკვეთები', value: '1,284', icon: '📦', change: '+12%' },
    { id: '2', title: 'აქტიური ტრანსპორტი', value: '42', icon: '🚚', change: '+5%' },
    { id: '3', title: 'შემოსავალი', value: '₾45,200', icon: '💰', change: '+18%' },
    { id: '4', title: 'დაყოვნებული', value: '3', icon: '⚠️', change: '-2%' },
  ];

  console.table(data); // აფიქსირებს ცხრილის სახით კონსოლში
  console.timeEnd('StatsLoadTime'); // აჩვენებს ჩატვირთვის დროს კონსოლში
  
  return data;
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

// მოდალის კომპონენტი Portal-ით
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ფორმის კომპონენტი Zod ვალიდაციით და Double-Click ბლოკირებით
function ItemForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    change: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Double-click-ის პრევენცია

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Zod-ის ვალიდაციის ლოგიკა
 // Zod-ის ვალიდაციის ლოგიკა
  const validate = () => {
    const result = itemSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach(issue => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true); // ბლოკავს ღილაკს
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false); // ხსნის ბლოკს
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>მონაცემის დასახელება:</label>
        <input 
          type="text" 
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="მაგ: ახალი საწყობი"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>მნიშვნელობა:</label>
        <input 
          type="text" 
          value={formData.value} 
          onChange={(e) => setFormData({...formData, value: e.target.value})}
          placeholder="მაგ: 150"
        />
        {errors.value && <span className="error-text">{errors.value}</span>}
      </div>

      <div className="form-group">
        <label>ცვლილება (მაგ: +10%):</label>
        <input 
          type="text" 
          value={formData.change} 
          onChange={(e) => setFormData({...formData, change: e.target.value})}
          placeholder="მაგ: +8%"
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="save-btn">
          {isSubmitting ? 'იგზავნება...' : 'შენახვა'}
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">გაუქმება</button>
      </div>
    </form>
  );
}

function DashboardApp() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false); // ოფლაინ / API Fallback
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardStats();
        setStats(data);
        setIsOfflineMode(false);
      } catch (error) {
        // API/სერვერის გათიშვისას გადართვა ლოკალურ Fallback რეჟიმზე
        setIsOfflineMode(true);
        setStats([
          { id: '1', title: 'სულ შეკვეთები (ქეში)', value: '1,284', icon: '📦', change: '+12%' },
          { id: '2', title: 'აქტიური ტრანსპორტი (ქეში)', value: '42', icon: '🚚', change: '+5%' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (stat) => {
    setEditingItem(stat);
    setIsModalOpen(true);
  };

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

  const handleDelete = (id) => {
    setStats(stats.filter(item => item.id !== id));
  };

  const filteredStats = stats.filter((item) =>
    item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* ოფლაინ / Fallback ინდიკატორი */}
      {isOfflineMode && (
        <div style={{ background: '#fef08a', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontWeight: 'bold', color: '#854d0e' }}>
          ⚠️ ნაჩვენებია ლოკალური დემო მონაცემები (სერვერთან კავშირი შეწყვეტილია)
        </div>
      )}

      <header className="app-header">
        <h1>B2B ლოჯისტიკის დეშბორდი</h1>
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="hamburger-btn"
          aria-label="მენიუ"
        >
          ☰
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <button 
            onClick={() => { handleOpenAdd(); setIsMobileMenuOpen(false); }}
            className="add-new-btn"
          >
            + Add New
          </button>
          
          <div className="pulse-wrapper">
            <span className="pulse-dot"></span>
            <span className="pulse-text">
              დაყოვნებული ტვირთები (3)
            </span>
          </div>
        </div>
      </header>

      <input
        type="text"
        className="search-input"
        placeholder="ძებნა ტვირთის დასახელებით..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="ძებნა"
      />

      {loading ? (
        <p>იტვირთება...</p>
      ) : (
        <div className="stats-grid">
          {filteredStats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div>
                <div style={{ fontSize: '24px' }}>{stat.icon}</div>
                <h3 style={{ margin: '10px 0 5px 0' }}>{stat.title}</h3>
                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{stat.value}</p>
                <span style={{ color: stat.change.includes('+') ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                  {stat.change}
                </span>
              </div>

              <div className="card-actions">
                <button onClick={() => handleOpenEdit(stat)} className="edit-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(stat.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

// საბოლოო ექსპორტი ErrorBoundary-ით შეფუთული
export default function App() {
  return (
    <ErrorBoundary>
      <DashboardApp />
    </ErrorBoundary>
  );
}