import React, { useState, useMemo, useCallback, memo } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useModal } from './hooks/useModal';
import { useLogisticsStore } from './store/useLogisticsStore'; // Zustand store-ის იმპორტი
import './App.css';

// Zod schema
const schema = z.object({
  title: z.string().min(3, 'დასახელება უნდა იყოს მინიმუმ 3 სიმბოლო!'),
  value: z.string().min(1, 'მნიშვნელობის ველი სავალდებულოა!'),
  change: z.string().optional()
});

function ItemForm({ initialData, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || { title: '', value: '', change: '' }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>მონაცემის დასახელება:</label>
        <input {...register('title')} placeholder="მაგ: ახალი საწყობი" />
        {errors.title && <span className="error-text">{errors.title.message}</span>}
      </div>

      <div className="form-group">
        <label>მნიშვნელობა:</label>
        <input {...register('value')} placeholder="მაგ: 150" />
        {errors.value && <span className="error-text">{errors.value.message}</span>}
      </div>

      <div className="form-group">
        <label>ცვლილება (მაგ: +10%):</label>
        <input {...register('change')} placeholder="მაგ: +8%" />
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

const StatCard = memo(function StatCard({ stat, onEdit, onDelete }) {
  return (
    <div className="stat-card">
      <div>
        <div style={{ fontSize: '24px' }}>{stat.icon}</div>
        <h3 style={{ margin: '10px 0 5px 0' }}>{stat.title}</h3>
        <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{stat.value}</p>
        <span style={{ color: stat.change?.includes('+') ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
          {stat.change}
        </span>
      </div>

      <div className="card-actions">
        <button onClick={() => onEdit(stat)} className="edit-btn">Edit</button>
        <button onClick={() => onDelete(stat.id)} className="delete-btn">Delete</button>
      </div>
    </div>
  );
});

function Modal({ isOpen, onClose, title, children }) {
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

export default function DashboardApp() {
  // Zustand store-დან გამოგვაქვს მონაცემები და მეთოდები
  const { stats, searchTerm, setSearchTerm, addStat, editStat, deleteStat } = useLogisticsStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { isOpen: isModalOpen, openModal, closeModal } = useModal(false);

  const handleOpenAdd = useCallback(() => {
    setEditingItem(null);
    openModal();
  }, [openModal]);

  const handleOpenEdit = useCallback((stat) => {
    setEditingItem(stat);
    openModal();
  }, [openModal]);

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      editStat(editingItem.id, formData);
    } else {
      addStat(formData);
    }
    closeModal();
  };

  const handleDelete = useCallback((id) => {
    deleteStat(id);
  }, [deleteStat]);

  // ფილტრაცია და ძებნა
  const filteredStats = useMemo(() => {
    return stats.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stats, searchTerm]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>B2B ლოჯისტიკის დეშბორდი</h1>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <button onClick={handleOpenAdd} className="add-new-btn">
            + Add New
          </button>
          
          <div className="pulse-wrapper">
            <span className="pulse-dot"></span>
            {/* Header-ში ავტომატურად აისახება სთეითის რაოდენობა */}
            <span className="pulse-text">
              სულ ელემენტი: ({stats.length})
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
      />

      <div className="stats-grid">
        {filteredStats.map((stat) => (
          <StatCard 
            key={stat.id} 
            stat={stat} 
            onEdit={handleOpenEdit} 
            onDelete={handleDelete} 
          />
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingItem ? "მონაცემების რედაქტირება" : "ახალი მონაცემის დამატება"}
      >
        <ItemForm 
          initialData={editingItem} 
          onSubmit={handleFormSubmit} 
          onCancel={closeModal} 
        />
      </Modal>
    </div>
  );
}