import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id || product._id}`)}>
      <img src={product.imageUrl || 'https://placehold.co/300x200'} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <div className="price-tag">${product.price}</div>
      <button
        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
        className="btn-add"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
