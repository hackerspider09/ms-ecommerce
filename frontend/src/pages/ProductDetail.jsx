import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../api/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productApi.get(`/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div className="page"><h2>Product not found.</h2></div>;

  return (
    <div className="page product-detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      <div className="product-detail-container">
        <div className="product-detail-image">
          <img
            src={product.imageUrl || 'https://placehold.co/400x400'}
            alt={product.name}
          />
        </div>
        <div className="product-detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <div className="product-detail-price">${product.price}</div>
          <p className="product-stock">
            {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
          </p>
          <button
            onClick={() => { addToCart(product); navigate('/'); }}
            className="btn-add btn-add-large"
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
