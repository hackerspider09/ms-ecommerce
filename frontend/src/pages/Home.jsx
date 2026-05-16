import React, { useEffect, useState } from 'react';
import { productApi, orderApi } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.get('');
        setProducts(res.data);
        setError(null);
      } catch (err) {
        setError('Product service is currently unavailable. Please try again later.');
      }
    };
    fetchProducts();
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }
    try {
      await orderApi.post('', {
        userId: user.id,
        orderItems: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
      });
      alert('Order placed successfully!');
      clearCart();
    } catch (err) {
      alert('Checkout failed: Order service might be down');
    }
  };

  return (
    <div className="page home-page">
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {!error && products.length === 0 && (
        <div className="loading-state">Loading products...</div>
      )}
    </div>
  );
};

export default Home;
