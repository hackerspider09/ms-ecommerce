import React, { useEffect, useState } from 'react';
import { productApi, orderApi } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.get('');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products');
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
      alert('Checkout failed');
    }
  };

  return (
    <div className="page home-page">
      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {cart.length > 0 && (
        <div className="cart-sidebar">
          <h3>Your Cart</h3>
          <ul>
            {cart.map(item => (
              <li key={item.id}>{item.name} x {item.quantity}</li>
            ))}
          </ul>
          <button onClick={handleCheckout} className="btn-checkout">Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Home;
