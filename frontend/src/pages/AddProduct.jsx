import React, { useState } from 'react';
import { productApi } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productApi.post('', formData);
      alert('Product added successfully!');
      navigate('/');
    } catch (err) {
      alert('Failed to add product');
    }
  };

  return (
    <div className="page login-page">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Add New Product</h2>
        <input type="text" placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <textarea placeholder="Description" onChange={e => setFormData({...formData, description: e.target.value})} required />
        <input type="number" placeholder="Price" onChange={e => setFormData({...formData, price: e.target.value})} required />
        <input type="text" placeholder="Category" onChange={e => setFormData({...formData, category: e.target.value})} required />
        <input type="number" placeholder="Stock" onChange={e => setFormData({...formData, stock: e.target.value})} required />
        <input type="text" placeholder="Image URL" onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
        <button type="submit" className="btn-login-submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
