import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/api';

const CartSidebar = () => {
  const { cart, clearCart, isCartOpen, toggleCart, removeFromCart } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to checkout');
      return;
    }
    try {
      await orderApi.post('', {
        userId: user.id,
        orderItems: cart.map(item => ({ productId: item.id || item._id, quantity: item.quantity }))
      });
      alert('Order placed successfully!');
      clearCart();
      toggleCart();
    } catch (err) {
      alert('Checkout failed');
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={toggleCart}></div>
      <div className={`cart-sidebar-container ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-sidebar-header">
          <h3>Your Cart</h3>
          <button className="btn-close" onClick={toggleCart}>&times;</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart-msg">Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">x {item.quantity}</span>
                </div>
                <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-sidebar-footer">
            <div className="cart-total">
              <span>Total Items:</span>
              <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
            </div>
            <button onClick={handleCheckout} className="btn-checkout-large">Checkout Now</button>
          </div>
        )}
      </div>
      
      <style>{`
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 2000;
        }
        
        .cart-sidebar-container {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 380px;
          background: var(--bg-card);
          backdrop-filter: var(--glass-blur);
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
          z-index: 2001;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .cart-sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-sidebar-header h3 {
          margin: 0;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-close {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.7;
          transition: 0.2s;
        }

        .btn-close:hover {
          opacity: 1;
          color: var(--accent-cyan);
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          background: rgba(255, 255, 255, 0.03);
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-item-name {
          display: block;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .cart-item-qty {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .btn-remove {
          background: none;
          border: none;
          color: var(--status-red);
          font-size: 0.8rem;
          cursor: pointer;
          text-decoration: underline;
        }

        .cart-sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          font-weight: bold;
        }

        .btn-checkout-large {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
          color: #000;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-checkout-large:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(188, 19, 254, 0.4);
        }

        .empty-cart-msg {
          text-align: center;
          color: var(--text-secondary);
          margin-top: 4rem;
        }
      `}</style>
    </>
  );
};

export default CartSidebar;
