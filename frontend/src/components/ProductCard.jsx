import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <div className="price-tag">${product.price}</div>
      <button onClick={() => addToCart(product)} className="btn-add">Add to Cart</button>
    </div>
  );
};

export default ProductCard;
