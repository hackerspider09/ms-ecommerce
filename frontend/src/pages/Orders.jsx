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
          <div key={order.id} className="order-card">
            <h4>Order #{order.orderNumber}</h4>
            <ul>
              {order.orderItems.map(item => (
                <li key={item.id}>Product ID: {item.productId} | Quantity: {item.quantity} | Price: ${item.price}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
