helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm install monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring \
  --create-namespace


user is admin

kubectl --namespace monitoring get secrets monitoring-grafana -o jsonpath="{.data.admin-password}" | base64 -d ; echo


kubectl port-forward -n monitoring svc/monitoring-grafana 8000:80


---

# **who is collecting what**.

```text
EKS Cluster

Node 1
 ├─ CPU
 ├─ Memory
 ├─ Disk
 └─ Pods

Node 2
 ├─ CPU
 ├─ Memory
 ├─ Disk
 └─ Pods

Kubernetes API
 ├─ Deployments
 ├─ Pods
 ├─ Services
 └─ Nodes
```

Prometheus doesnt know everything. It needs exporters.

---

# Node Exporter

Node Exporter runs on every node (usually as a DaemonSet).

Its job is:

> Collect operating system and hardware metrics.

It talks to the Linux OS directly.

```text
Linux Node
    ↓
Node Exporter
    ↓
Prometheus
```

Metrics it provides:

```text
CPU usage
Memory usage
Disk usage
Filesystem usage
Network traffic
Load average
```

Example metrics:

```text
node_cpu_seconds_total
node_memory_MemAvailable_bytes
node_filesystem_avail_bytes
```

---

## Example

Suppose your EKS node has:

```text
4 CPU
8 GB RAM
```

Node Exporter tells Prometheus:

```text
CPU Usage = 70%
Memory Usage = 6 GB
Disk Usage = 40 GB
```

Grafana then shows:

```text
Node CPU Usage
Node Memory Usage
Node Disk Usage
```

---

# kube-state-metrics

This is completely different.

It does **not** read CPU or memory from Linux.

Instead it talks to:

```text
Kubernetes API Server
```

and converts Kubernetes objects into metrics.

```text
Kubernetes API
       ↓
kube-state-metrics
       ↓
Prometheus
```

---

## Metrics it provides

Things like:

```text
How many pods exist?
How many replicas are desired?
How many replicas are running?
How many pod restarts happened?
Deployment health?
Node status?
```

Example metrics:

```text
kube_pod_status_phase
kube_deployment_status_replicas
kube_pod_container_status_restarts_total
```

---

## Example

You have:

```yaml
replicas: 3
```

for your product service.

Current state:

```text
Desired = 3
Running = 2
```

kube-state-metrics exposes:

```text
deployment wants 3 pods
deployment has 2 pods
```

Grafana can then show:

```text
Deployment Health
2 / 3 replicas available
```

---

# Difference

## Node Exporter

Answers:

```text
How is the machine doing?
```

Examples:

```text
CPU
Memory
Disk
Network
```

---

## kube-state-metrics

Answers:

```text
How is Kubernetes doing?
```

Examples:

```text
Pods
Deployments
ReplicaSets
Jobs
DaemonSets
Namespaces
```

---

# Real Example

order service is crashing.

### Node Exporter says:

```text
Node CPU = 95%
Node Memory = 90%
```

Meaning:

> The machine is overloaded.

---

### kube-state-metrics says:

```text
order-service replicas desired = 3
order-service replicas available = 1

pod restarts = 45
```

Meaning:

> Kubernetes is struggling to keep the deployment healthy.

---

## One line

installed kube-prometheus-stack on EKS. Prometheus collected infrastructure metrics through Node Exporter and Kubernetes object state through kube-state-metrics. Grafana dashboards allowed us to monitor node resource utilization, pod health, deployment status, replica availability, and restart counts."
