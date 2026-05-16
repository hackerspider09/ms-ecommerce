# Kubernetes Deployment & Argo CD Rollback Mechanism

## Overview

This document explains:

* How Kubernetes Deployments create ReplicaSets
* When ReplicaSets are created
* How rollback works in Kubernetes
* Why changing replicas does NOT create new ReplicaSets
* How Argo CD rollback works
* Difference between Kubernetes rollback vs Argo CD rollback

---

# 1. Kubernetes Deployment Architecture

When we create a Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 1
```

Kubernetes internally creates:

```text
Deployment
   └── ReplicaSet
          └── Pods
```

The Deployment controller manages ReplicaSets automatically.

---

# 2. What is a ReplicaSet?

ReplicaSet ensures:

* Required number of Pods are running
* Pods are recreated if deleted
* Deployment history can be maintained

Example:

```text
ReplicaSet
   └── Pod-1
   └── Pod-2
```

---

# 3. When Kubernetes Creates a NEW ReplicaSet

A new ReplicaSet is created ONLY when:

## `.spec.template` changes

This means Pod template changes.

Example:

```yaml
spec:
  template:
    spec:
      containers:
      - name: app
        image: nginx:v2
```

Since Pod template changed, Kubernetes creates a NEW ReplicaSet.

---

# 4. Changes That CREATE New ReplicaSets

## Example 1: Image Change

```yaml
image: nginx:v1
→
image: nginx:v2
```

Result:

```text
Deployment
   ├── RS-1 (v1)
   └── RS-2 (v2)
```

---

## Example 2: Environment Variable Change

```yaml
env:
  - name: ENV
    value: dev
```

changed to:

```yaml
env:
  - name: ENV
    value: prod
```

New ReplicaSet created.

---

## Example 3: Container Port Change

```yaml
containerPort: 8080
→
containerPort: 9090
```

New ReplicaSet created.

---

# 5. Changes That DO NOT Create ReplicaSets

Some Deployment changes only scale/update existing ReplicaSet.

---

## Example: Replica Count Change

```yaml
replicas: 1
→
replicas: 2
```

This DOES NOT create new ReplicaSet.

Kubernetes only scales existing ReplicaSet.

---

## Why?

Because Pod template did not change.

Only number of Pods changed.

---

# 6. Kubernetes Rollback Mechanism

Kubernetes rollback works using Deployment revision history.

Each new ReplicaSet becomes a revision.

Example:

```text
Revision 1 → nginx:v1
Revision 2 → nginx:v2
Revision 3 → nginx:v3
```

---

# 7. How Rollback Happens

Command:

```bash
kubectl rollout undo deployment/myapp
```

Kubernetes:

1. Finds previous ReplicaSet
2. Copies old Pod template
3. Creates/scales ReplicaSet
4. Moves traffic to old Pods

---

# 8. Rollback Example

Current:

```text
RS-1 → nginx:v1
RS-2 → nginx:v2
RS-3 → nginx:v3   ← active
```

Rollback:

```bash
kubectl rollout undo deployment/myapp
```

Result:

```text
RS-2 → nginx:v2   ← active again
```

---

# 9. Deployment Revision History

Check revisions:

```bash
kubectl rollout history deployment/myapp
```

Check ReplicaSets:

```bash
kubectl get rs
```

---

# 10. revisionHistoryLimit

Deployment stores old ReplicaSets for rollback.

Example:

```yaml
spec:
  revisionHistoryLimit: 10
```

Default: `10`

Older ReplicaSets are automatically deleted after limit exceeded.

---

# 11. Important Kubernetes Rollback Notes

## Rollback works properly only if:

* Old ReplicaSets still exist
* Pod template changed previously
* Revision history available

---

## Rollback may NOT work when:

### 1. No Pod Template Change

Example:

```yaml
replicas: 1 → 2
```

No new ReplicaSet created.

No revision created.

No rollback history for this change.

---

### 2. Old ReplicaSets Deleted

If `revisionHistoryLimit` exceeded:

```text
Old ReplicaSets removed
```

Rollback to very old version becomes impossible.

---

# 12. Argo CD Architecture

Argo CD works differently.

Argo CD itself DOES NOT create ReplicaSets.

Architecture:

```text
Git Repository
      ↓
Argo CD
      ↓
Kubernetes API
      ↓
Deployment Controller
      ↓
ReplicaSets
      ↓
Pods
```

---

# 13. How Argo CD Works

Argo CD continuously compares:

```text
Git state
vs
Cluster state
```

If difference found:

```text
Argo CD applies manifests
```

using Kubernetes API.

---

# 14. Argo CD Rollback Mechanism

Suppose Git history:

```text
Commit A → nginx:v1
Commit B → nginx:v2
Commit C → nginx:v3
```

Current running:

```text
nginx:v3
```

---

## Rollback in Argo CD

When rollback triggered:

```text
Rollback to Commit A
```

Argo CD:

1. Reads old manifest from Git history
2. Applies old YAML again
3. Kubernetes Deployment controller detects template change
4. Kubernetes creates/scales ReplicaSet

---

# 15. Important Understanding

## Argo CD DOES NOT manage ReplicaSets directly

Argo CD only:

```text
Apply YAML manifests
```

Kubernetes Deployment controller handles:

* ReplicaSets
* Rollouts
* Rollbacks
* Pod creation

---

# 16. Why You May NOT See ReplicaSets During Argo Rollback

---

## Case 1: Only replicas changed

Example:

```yaml
replicas: 1 → 2
```

No new ReplicaSet created.

Reason:

```text
Pod template unchanged
```

---

## Case 2: Same image already running

Rollback target:

```yaml
image: nginx:v1
```

But cluster already using `v1`.

No new ReplicaSet needed.

---

## Case 3: Old ReplicaSets deleted

If history limit exceeded:

```text
Older ReplicaSets garbage collected
```

---

## Case 4: Wrong namespace

Check all namespaces:

```bash
kubectl get rs -A
```

---

# 17. Difference Between Kubernetes Rollback and Argo CD Rollback

| Feature             | Kubernetes Rollback             | Argo CD Rollback         |
| ------------------- | ------------------------------- | ------------------------ |
| Based on            | ReplicaSets                     | Git commits/manifests    |
| Managed by          | Deployment controller           | Argo CD                  |
| Uses Git            | No                              | Yes                      |
| Creates ReplicaSets | Yes (via Deployment controller) | Indirectly               |
| Rollback source     | Old ReplicaSet                  | Old Git manifest         |
| Main purpose        | Deployment revision rollback    | GitOps state restoration |

---

# 18. Real Flow Example

## Initial Deployment

```yaml
image: nginx:v1
```

Creates:

```text
Deployment
   └── RS-1
```

---

## Update Image

```yaml
image: nginx:v2
```

Creates:

```text
Deployment
   ├── RS-1
   └── RS-2
```

---

## Change Replicas

```yaml
replicas: 1 → 3
```

Result:

```text
NO new ReplicaSet
RS-2 scaled from 1 Pod → 3 Pods
```

---

## Argo Rollback to v1

Argo applies old YAML:

```yaml
image: nginx:v1
```

Kubernetes sees template change:

```text
v2 → v1
```

Then Deployment controller handles ReplicaSet rollout.

---

# 19. Useful Commands

## Check Deployments

```bash
kubectl get deploy
```

---

## Check ReplicaSets

```bash
kubectl get rs
```

---

## Check Rollout History

```bash
kubectl rollout history deployment/myapp
```

---

## Rollback Deployment

```bash
kubectl rollout undo deployment/myapp
```

---

## Describe Deployment

```bash
kubectl describe deployment myapp
```

---

# 20. Final Key Understanding

## New ReplicaSet is created ONLY when:

```text
.spec.template changes
```

NOT when:

```text
Only replicas count changes
```

---

## Argo CD does NOT create ReplicaSets

Argo CD:

```text
Git → Apply YAML
```

Kubernetes Deployment controller:

```text
Deployment → ReplicaSets → Pods
```

That is the actual rollback and rollout mechanism internally.
