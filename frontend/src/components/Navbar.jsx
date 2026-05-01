import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart, toggleCart } = useCart();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">E-Shop</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Products</Link>
        <Link to="/status">Infrastructure</Link>

        {/* uncomment after complete arch */}
        <Link to="/workflow">Architecture</Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            <Link to="/add-product">Add Product</Link>
            <span className="user-info">Welcome, {user.username}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </>
        )}
        <div className="cart-summary" onClick={toggleCart} style={{ cursor: 'pointer' }}>
          🛒 {cart.reduce((acc, item) => acc + item.quantity, 0)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
