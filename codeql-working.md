# 🔐 Security Scanning Pipeline (SAST + SCA)

This repository uses automated security scanning in CI/CD to detect vulnerabilities in both **application code** and **dependencies**.

---

## 📌 Overview

We use two types of security scans:

| Scan Type                                      | Tool   | Purpose                              |
| ---------------------------------------------- | ------ | ------------------------------------ |
| **SAST** (Static Application Security Testing) | CodeQL | Finds vulnerabilities in source code |
| **SCA** (Software Composition Analysis)        | Trivy  | Finds CVEs in dependencies           |

---

## 🧩 Jobs in Pipeline

### 1️⃣ Dependency Scan (SCA)

Uses **Trivy** to scan project dependencies.

### 🔍 What it does:

* Scans `package.json`, `pom.xml`, `requirements.txt`, etc.
* Detects known vulnerabilities (CVEs)
* Fails pipeline on critical issues

### ⚙️ Key Config:

```yaml
scan-type: 'fs'
scan-ref: ${{ inputs.dir_name }}
```

### 📌 Important:

* `scan-ref` defines **what directory is scanned**
* If set to `.` → entire repo is scanned
* Always pass correct service directory in monorepo

---

### 2️⃣ Code Scan (SAST)

Uses **CodeQL** to analyze source code.

---

## ⚙️ Workflow Breakdown

### 🔹 Step 1: Checkout Code

```yaml
uses: actions/checkout@v4
```

* Fetches repository code
* Required for analysis

---

### 🔹 Step 2: Initialize CodeQL

```yaml
uses: github/codeql-action/init@v4
```

#### 🧠 Purpose:

* Configure CodeQL engine
* Select programming language
* Define **analysis scope**

#### 📌 Important:

```yaml
config: |
  paths:
    - ${{ inputs.dir_name }}
```

👉 This is where **scope is defined**

* Only files inside this path are analyzed
* If not set → entire repo is scanned

---

### 🔹 Step 3: Autobuild

```yaml
uses: github/codeql-action/autobuild@v4
```

#### 🔨 Purpose:

* Detects build system (npm, maven, pip, etc.)
* Builds the project
* Extracts code structure (AST, data flow)

#### ⚠️ Note:

* May attempt to build entire repo (monorepo behavior)
* But analysis is still limited by `paths` from init

---

### 🔹 Step 4: Analyze

```yaml
uses: github/codeql-action/analyze@v4
```

#### 🔍 Purpose:

* Runs security queries
* Detects vulnerabilities like:

  * SQL Injection
  * XSS
  * Command Injection
* Uploads results to GitHub Security tab

#### ❗ Important:

* Does **NOT control scope**
* Only analyzes previously collected data

---

## 🧠 How CodeQL Works (Simple Model)

| Phase | Step      | Description          |
| ----- | --------- | -------------------- |
| 1     | init      | Define what to scan  |
| 2     | autobuild | Collect code data    |
| 3     | analyze   | Find vulnerabilities |

---

## ⚠️ Common Pitfalls

### ❌ `working-directory` does NOT affect actions

```yaml
defaults:
  run:
    working-directory: ...
```

* Only applies to `run:` steps
* Does NOT affect `uses:` actions like CodeQL or Trivy

---

### ❌ Forgetting `scan-ref` in Trivy

* Leads to full repo scan unintentionally

---

### ❌ Expecting `analyze` to filter scope

* Scope is already fixed in `init`

---

## ✅ Best Practices (Monorepo)

* Always pass `dir_name` per service
* Restrict:

  * Trivy → using `scan-ref`
  * CodeQL → using `paths` in init
* Consider separate workflows per service for better isolation

---

## 🚀 Summary

* **Trivy (SCA)** → scans dependencies
* **CodeQL (SAST)** → scans source code
* **Scope must be defined early (init / scan-ref)**
* **Actions ignore `working-directory`**

---

## 📬 Future Improvements

* Parallel scans per service
* Custom CodeQL queries
* Secret scanning integration
* Faster builds with manual build steps

---
