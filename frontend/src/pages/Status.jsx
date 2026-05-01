import React, { useEffect, useState } from 'react';
import { userApi, productApi, orderApi } from '../api/api';

const Status = () => {
  const [statuses, setStatuses] = useState([]);
  const [redisStatus, setRedisStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, productRes, orderRes, redisRes, userDb, prodDb, orderDb] = await Promise.allSettled([
          userApi.get('/info'),
          productApi.get('/info'),
          orderApi.get('/info'),
          userApi.get('/redis-status'),
          userApi.get('/health/db'),
          productApi.get('/health/db'),
          orderApi.get('/health/db')
        ]);

        const data = [
          {
            ...(userRes.status === 'fulfilled' ? userRes.value.data : { service: 'User Service', error: 'Offline' }),
            db: userDb.status === 'fulfilled' ? userDb.value.data.database : 'offline'
          },
          {
            ...(productRes.status === 'fulfilled' ? productRes.value.data : { service: 'Product Service', error: 'Offline' }),
            db: prodDb.status === 'fulfilled' ? prodDb.value.data.database : 'offline'
          },
          {
            ...(orderRes.status === 'fulfilled' ? orderRes.value.data : { service: 'Order Service', error: 'Offline' }),
            db: orderDb.status === 'fulfilled' ? orderDb.value.data.database : 'offline'
          }
        ];
        
        setStatuses(data);
        if (redisRes.status === 'fulfilled') {
          setRedisStatus(redisRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching status data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Checking system health...</div>;

  return (
    <div className="page status-page">
      <div className="status-header">
        <h1>System Architecture Status</h1>
        <p>Real-time network and service information for the microservices cluster.</p>
      </div>

      <div className="status-grid">
        {statuses.map((s, i) => (
          <div key={i} className={`status-card ${s.error ? 'status-offline' : 'status-online'}`}>
            <div className="status-card-header">
              <h3>{s.service}</h3>
              <div className="pulse-indicator"></div>
            </div>
            <div className="status-card-body">
              {s.error ? (
                <p className="error-text">Service Unreachable</p>
              ) : (
                <>
                  <p><strong>Hostname:</strong> <code>{s.hostname}</code></p>
                  <p><strong>Container IP:</strong> <code>{s.ip}</code></p>
                  <p><strong>Database:</strong> <span className={s.db === 'online' ? 'text-ok' : 'text-error'}>{s.db}</span></p>
                  <p><strong>Status:</strong> Ready</p>
                </>
              )}
            </div>
          </div>
        ))}

        <div className={`status-card ${redisStatus?.redis === 'online' ? 'status-online' : 'status-offline'}`}>
          <div className="status-card-header">
            <h3>Redis Cache</h3>
            <div className="pulse-indicator"></div>
          </div>
          <div className="status-card-body">
            <p><strong>Service:</strong> Redis v7.0</p>
            <p><strong>Status:</strong> {redisStatus?.redis === 'online' ? 'Online' : 'Offline'}</p>
            {redisStatus?.error && <p className="error-text">{redisStatus.error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
