import React, { useEffect, useState } from 'react';
import { userApi, productApi, orderApi } from '../api/api';

const Workflow = () => {
  const [health, setHealth] = useState({
    user: { service: 'offline', db: 'offline' },
    product: { service: 'offline', db: 'offline' },
    order: { service: 'offline', db: 'offline' },
    redis: 'offline'
  });

  useEffect(() => {
    const fetchHealth = async () => {
      const [uS, uD, pS, pD, oS, oD, rS] = await Promise.allSettled([
        userApi.get('/health'),
        userApi.get('/health/db'),
        productApi.get('/health'),
        productApi.get('/health/db'),
        orderApi.get('/health'),
        orderApi.get('/health/db'),
        userApi.get('/redis-status')
      ]);

      setHealth({
        user: { 
          service: uS.status === 'fulfilled' ? 'online' : 'offline', 
          db: uD.status === 'fulfilled' ? uD.value.data.database : 'offline' 
        },
        product: { 
          service: pS.status === 'fulfilled' ? 'online' : 'offline', 
          db: pD.status === 'fulfilled' ? pD.value.data.database : 'offline' 
        },
        order: { 
          service: oS.status === 'fulfilled' ? 'online' : 'offline', 
          db: oD.status === 'fulfilled' ? oD.value.data.database : 'offline' 
        },
        redis: rS.status === 'fulfilled' ? rS.value.data.redis : 'offline'
      });
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const StatusDot = ({ status, x, y }) => (
    <circle cx={x} cy={y} r="4" className={`status-dot ${status === 'online' ? 'online' : 'offline'}`} />
  );

  return (
    <div className="page workflow-page">
      <div className="status-header">
        <h1>Deployment Workflow & Architecture</h1>
        <p>Full lifecycle visualization from code push to production cluster.</p>
      </div>

      <div className="workflow-section">
        <h3>CI/CD Pipeline</h3>
        <div className="workflow-container cicd-container">
          <svg viewBox="0 0 800 120" className="cicd-svg">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 Z" fill="rgba(255,255,255,0.3)" />
              </marker>
            </defs>
            <g transform="translate(20, 20)">
              {/* Nodes */}
              <rect x="0" y="20" width="80" height="40" rx="5" className="cicd-node" />
              <text x="40" y="45" className="node-text small">Dev Push</text>
              
              <line x1="80" y1="40" x2="120" y2="40" className="cicd-line" markerEnd="url(#arrow)" />
              
              <rect x="120" y="20" width="80" height="40" rx="5" className="cicd-node github" />
              <text x="160" y="45" className="node-text small">GitHub</text>
              
              <line x1="200" y1="40" x2="240" y2="40" className="cicd-line" markerEnd="url(#arrow)" />
              
              <rect x="240" y="20" width="100" height="40" rx="5" className="cicd-node actions" />
              <text x="290" y="40" className="node-text xsmall">Actions CI</text>
              <text x="290" y="52" className="node-subtext xsmall">Build & Scan</text>
              
              <line x1="340" y1="40" x2="380" y2="40" className="cicd-line" markerEnd="url(#arrow)" />
              
              <rect x="380" y="20" width="80" height="40" rx="5" className="cicd-node hub" />
              <text x="420" y="45" className="node-text small">Docker Hub</text>
              
              <line x1="460" y1="40" x2="500" y2="40" className="cicd-line" markerEnd="url(#arrow)" />
              
              <rect x="500" y="20" width="80" height="40" rx="5" className="cicd-node argo" />
              <text x="540" y="45" className="node-text small">ArgoCD</text>
              
              <line x1="580" y1="40" x2="620" y2="40" className="cicd-line" markerEnd="url(#arrow)" />
              
              <rect x="620" y="20" width="100" height="40" rx="5" className="cicd-node k8s" />
              <text x="670" y="45" className="node-text small">K8s Cluster</text>
            </g>
          </svg>
        </div>
      </div>

      <div className="workflow-section">
        <h3>Live Cluster Architecture</h3>
        <div className="workflow-container">
          <svg viewBox="0 0 800 500" className="architecture-svg">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-cyan)" />
              </marker>
            </defs>

            {/* Connection Lines */}
            <g className="connections">
              <path d="M 400 30 L 400 80" className="flow-path" markerEnd="url(#arrowhead)" />
              <path d="M 400 130 L 200 200" className="flow-path" markerEnd="url(#arrowhead)" />
              <path d="M 400 130 L 400 200" className="flow-path" markerEnd="url(#arrowhead)" />
              <path d="M 400 130 L 600 200" className="flow-path" markerEnd="url(#arrowhead)" />
              <path d="M 200 260 L 150 380" className="flow-path" markerEnd="url(#arrowhead)" />
              <path d="M 400 260 L 350 380" className="flow-path" markerEnd="url(#arrowhead)" />
              <path d="M 400 260 L 450 380" className="flow-path" markerEnd="url(#arrowhead)" />
              <path d="M 600 260 L 650 380" className="flow-path" markerEnd="url(#arrowhead)" />
            </g>

            {/* Nodes */}
            <g className="nodes">
              {/* Ingress */}
              <g transform="translate(340, 80)">
                <rect width="120" height="50" rx="8" className="node-box gateway" />
                <text x="60" y="30" className="node-text">API Gateway</text>
              </g>

              {/* Services */}
              <g transform="translate(140, 200)">
                <rect width="120" height="60" rx="10" className={`node-box service ${health.user.service}`} />
                <text x="60" y="30" className="node-text">User Service</text>
                <text x="60" y="45" className="node-subtext">(FastAPI)</text>
                <StatusDot status={health.user.service} x="110" y="10" />
                <g className="pod-badge"><rect x="5" y="5" width="40" height="15" rx="3" fill="#333"/><text x="25" y="16" className="pod-text">Pods: 1</text></g>
              </g>

              <g transform="translate(340, 200)">
                <rect width="120" height="60" rx="10" className={`node-box service ${health.product.service}`} />
                <text x="60" y="30" className="node-text">Product Service</text>
                <text x="60" y="45" className="node-subtext">(Express)</text>
                <StatusDot status={health.product.service} x="110" y="10" />
                <g className="pod-badge"><rect x="5" y="5" width="40" height="15" rx="3" fill="#333"/><text x="25" y="16" className="pod-text">Pods: 1</text></g>
              </g>

              <g transform="translate(540, 200)">
                <rect width="120" height="60" rx="10" className={`node-box service ${health.order.service}`} />
                <text x="60" y="30" className="node-text">Order Service</text>
                <text x="60" y="45" className="node-subtext">(SpringBoot)</text>
                <StatusDot status={health.order.service} x="110" y="10" />
                <g className="pod-badge"><rect x="5" y="5" width="40" height="15" rx="3" fill="#333"/><text x="25" y="16" className="pod-text">Pods: 1</text></g>
              </g>

              {/* Databases */}
              <g transform="translate(100, 380)">
                <ellipse cx="50" cy="30" rx="45" ry="25" className={`node-box db ${health.user.db}`} />
                <text x="50" y="35" className="node-text small">PostgreSQL</text>
                <StatusDot status={health.user.db} x="85" y="15" />
              </g>

              <g transform="translate(300, 380)">
                <ellipse cx="50" cy="30" rx="45" ry="25" className={`node-box db ${health.product.db}`} />
                <text x="50" y="35" className="node-text small">MongoDB</text>
                <StatusDot status={health.product.db} x="85" y="15" />
              </g>

              <g transform="translate(410, 380)">
                <ellipse cx="40" cy="25" rx="35" ry="20" className={`node-box cache ${health.redis}`} />
                <text x="40" y="30" className="node-text small">Redis</text>
                <StatusDot status={health.redis} x="70" y="10" />
              </g>

              <g transform="translate(615, 380)">
                <ellipse cx="50" cy="30" rx="45" ry="25" className={`node-box db ${health.order.db}`} />
                <text x="50" y="35" className="node-text small">PostgreSQL</text>
                <StatusDot status={health.order.db} x="85" y="15" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      <style>{`
        .workflow-section { margin-bottom: 4rem; }
        .workflow-section h3 { 
          color: var(--accent-cyan); 
          text-transform: uppercase; 
          letter-spacing: 2px; 
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        .workflow-container {
          background: var(--bg-card);
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: var(--glass-blur);
        }
        .architecture-svg, .cicd-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .node-box {
          fill: rgba(255, 255, 255, 0.03);
          stroke: rgba(255, 255, 255, 0.1);
          stroke-width: 1.5;
          transition: 0.3s;
        }
        .node-box.online { stroke: var(--accent-cyan); filter: drop-shadow(0 0 5px rgba(0, 242, 255, 0.2)); }
        .node-box.offline { stroke: var(--status-red); opacity: 0.6; }
        .node-box.gateway { stroke: var(--accent-purple); }
        .node-box.db.online { stroke: #ffcc00; }
        .node-box.cache.online { stroke: #ff3131; }
        
        .node-text { fill: white; font-size: 13px; font-weight: 600; text-anchor: middle; }
        .node-text.small { font-size: 11px; }
        .node-text.xsmall { font-size: 10px; }
        .node-subtext { fill: var(--text-secondary); font-size: 10px; text-anchor: middle; }
        .node-subtext.xsmall { font-size: 8px; }
        
        .status-dot { transition: 0.3s; }
        .status-dot.online { fill: var(--status-green); animation: pulse-green 2s infinite; }
        .status-dot.offline { fill: var(--status-red); }
        
        @keyframes pulse-green {
          0% { opacity: 1; r: 4; }
          50% { opacity: 0.5; r: 5; }
          100% { opacity: 1; r: 4; }
        }

        .pod-text { fill: var(--accent-cyan); font-size: 8px; font-weight: bold; text-anchor: middle; }
        
        /* CICD Styles */
        .cicd-node { fill: rgba(255, 255, 255, 0.05); stroke: rgba(255, 255, 255, 0.2); }
        .cicd-node.github { stroke: #6e5494; }
        .cicd-node.actions { stroke: #2088ff; }
        .cicd-node.hub { stroke: #0db7ed; }
        .cicd-node.argo { stroke: #ef7b4d; }
        .cicd-node.k8s { stroke: #326ce5; }
        .cicd-line { stroke: rgba(255, 255, 255, 0.2); stroke-width: 1; stroke-dasharray: 4; }

        .flow-path {
          fill: none;
          stroke: rgba(255, 255, 255, 0.1);
          stroke-width: 1.5;
          stroke-dasharray: 5 5;
          animation: march 20s linear infinite;
        }
        @keyframes march { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
};

export default Workflow;
