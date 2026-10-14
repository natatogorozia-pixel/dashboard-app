import React, { useState, useEffect } from 'react';
import './ItemForm.css';

export default function ItemForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    destination: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'სახელის ველი სავალდებულოა!';
    } else if (formData.name.length < 3) {
      newErrors.name = 'სახელი უნდა შედგებოდეს მინიმუმ 3 სიმბოლოსგან!';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'რაოდენობის ველი სავალდებულოა!';
    } else if (Number(formData.quantity) <= 0) {
      newErrors.quantity = 'რაოდენობა უნდა იყოს 0-ზე მეტი!';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'დანიშნულების პუნქტი სავალდებულოა!';
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
    <form onSubmit={handleSubmit} className="item-form">
      <div className="form-group">
        <label>ტვირთის დასახელება:</label>
        <input 
          type="text" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="მაგ: ელექტრონიკა"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>რაოდენობა:</label>
        <input 
          type="number" 
          value={formData.quantity} 
          onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          placeholder="მაგ: 150"
        />
        {errors.quantity && <span className="error-text">{errors.quantity}</span>}
      </div>

      <div className="form-group">
        <label>დანიშნულება:</label>
        <input 
          type="text" 
          value={formData.destination} 
          onChange={(e) => setFormData({...formData, destination: e.target.value})}
          placeholder="მაგ: თბილისი, საწყობი #2"
        />
        {errors.destination && <span className="error-text">{errors.destination}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn">შენახვა</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>გაუქმება</button>
      </div>
    </form>
  );
}