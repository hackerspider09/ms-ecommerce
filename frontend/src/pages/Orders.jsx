import React, { useEffect, useState } from 'react';
import { orderApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const res = await orderApi.get(`/user/${user.id}`);
          setOrders(res.data);
        } catch (err) {
          console.error('Failed to fetch orders');
        }
      };
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="page orders-page">
      <h2>My Orders</h2>
      {!user && <p>Please login to see your orders.</p>}
      {orders.length === 0 && user && <p>No orders yet.</p>}
      <div className="order-list">
        {orders.map(order => (
          <div key={order.id} className="order-card-wrap">
            <div className="order-card-header">
              <div className="order-main-info">
                <h4>Order #{order.orderNumber}</h4>
                <span className="order-date">Date: {new Date().toLocaleDateString()}</span>
              </div>
              <span className="order-status-tag">Ready</span>
            </div>
            
            <div className="order-items-list">
              {order.orderItems.map(item => (
                <div key={item.id} className="order-item-row">
                  <div className="item-details">
                    <span className="item-id">Product ID: {item.productId}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="order-card-footer">
              <span>Total Amount:</span>
              <span className="total-price">
                ${order.orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
