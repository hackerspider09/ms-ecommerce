
# Understanding APT Repository Configuration in Linux & Ansible

This document explains:

- What an APT repository is
- How Ubuntu installs packages
- What `.sources` files are
- How Docker repository configuration works
- Difference between old and new repository formats
- Why Ansible `apt_repository` failed
- How to correctly add repositories using Ansible

---

## 1. What is a Repository?

Linux does not usually install software directly from websites.

Instead, it downloads packages from **repositories**.

A repository is simply a server containing packages.

Example:

```text
https://download.docker.com/linux/ubuntu
````

This server contains Docker packages.

---

## 2. How APT Works

Ubuntu uses the `apt` package manager.

When you run:

```bash
sudo apt install docker-ce
```

APT:

1. Checks configured repositories
2. Downloads package metadata
3. Verifies package signatures
4. Downloads package
5. Installs package

---

## 3. Where Repository Configurations are Stored

APT reads repository information from:

```text
/etc/apt/sources.list
```

and:

```text
/etc/apt/sources.list.d/
```

Files inside these locations tell APT:

* where packages are located
* which Ubuntu release to use
* which architecture to use
* which GPG key verifies packages

---

## 4. Old Repository Format

Traditional repository format:

```text
deb [OPTIONS] URL SUITE COMPONENT
```

Example:

```text
deb [arch=amd64] https://download.docker.com/linux/ubuntu jammy stable
```

Explanation:

| Part       | Meaning                   |
| ---------- | ------------------------- |
| deb        | binary package repository |
| arch=amd64 | CPU architecture          |
| URL        | repository server         |
| jammy      | Ubuntu version            |
| stable     | repository section        |

---

## 5. New `.sources` Format

Modern Ubuntu/Debian introduced structured repository files.

Example:

```text
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: jammy
Components: stable
Architectures: amd64
Signed-By: /etc/apt/keyrings/docker.asc
```

This is stored in files like:

```text
/etc/apt/sources.list.d/docker.sources
```

---

## 6. Docker Documentation Example

Docker docs use this format:

```text
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
```

---

## 7. Understanding Each Line

### Types

```text
Types: deb
```

Means binary package repository.

Possible values:

| Type    | Meaning         |
| ------- | --------------- |
| deb     | binary packages |
| deb-src | source packages |

---

### URIs

```text
URIs: https://download.docker.com/linux/ubuntu
```

Repository server URL.

APT downloads packages from here.

---

### Suites

```bash
$(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
```

Shell command that returns Ubuntu codename.

Examples:

| Ubuntu Version | Codename |
| -------------- | -------- |
| 20.04          | focal    |
| 22.04          | jammy    |
| 24.04          | noble    |

---

### Components

```text
Components: stable
```

Repository channel.

Possible Docker channels:

| Component | Meaning          |
| --------- | ---------------- |
| stable    | stable releases  |
| test      | testing packages |
| nightly   | nightly builds   |

---

### Architectures

```bash
$(dpkg --print-architecture)
```

Returns CPU architecture.

Examples:

| CPU              | Result |
| ---------------- | ------ |
| Intel/AMD 64-bit | amd64  |
| ARM64            | arm64  |

---

### Signed-By

```text
Signed-By: /etc/apt/keyrings/docker.asc
```

GPG key used to verify packages.

This ensures packages are trusted and not modified.

---

## 8. Converting `.sources` Format to One-Line Format

This:

```text
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: jammy
Components: stable
Architectures: amd64
Signed-By: /etc/apt/keyrings/docker.asc
```

becomes:

```text
deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu jammy stable
```

---

## 9. Why `apt_repository` Failed in Ansible

Ansible module:

```yaml
apt_repository:
```

supports only the old one-line format.

It DOES NOT support `.sources` structured format.

So this fails:

```yaml
- name: Add docker repo
  apt_repository:
    filename: /etc/apt/sources.list.d/docker.sources
    repo: |
      Types: deb
      URIs: https://download.docker.com/linux/ubuntu
      Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
      Components: stable
      Architectures: $(dpkg --print-architecture)
      Signed-By: /etc/apt/keyrings/docker.asc

    state: present
```

because `apt_repository` expects:

```yaml
repo: "deb ..."
```

---

## 10. Correct Ansible Way

### Option 1 — Use `apt_repository`

Oneliner (old way):

```yaml
- name: Add Docker repository
  apt_repository:
    repo: "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu {{ ansible_distribution_release }} stable"
    state: present
    filename: docker
```

---

## 11. Using Exact Docker `.sources` Format in Ansible

Docker-doc style:

```yaml
- name: Create docker sources file
  copy:
    dest: /etc/apt/sources.list.d/docker.sources
    content: |
      Types: deb
      URIs: https://download.docker.com/linux/ubuntu
      Suites: {{ ansible_distribution_release }}
      Components: stable
      Architectures: amd64
      Signed-By: /etc/apt/keyrings/docker.asc
```

---

## 12. Why Shell Commands Did Not Work in YAML

This works in shell:

```bash
$(dpkg --print-architecture)
```

but NOT inside YAML.

Ansible does not execute shell substitutions automatically.

Instead use Ansible facts.

Examples:

| Shell                        | Ansible                            |
| ---------------------------- | ---------------------------------- |
| $(dpkg --print-architecture) | {{ ansible_architecture }}         |
| ${UBUNTU_CODENAME}           | {{ ansible_distribution_release }} |

---

## 13. Important Ansible Facts

Useful variables:

| Variable                     | Meaning |
| ---------------------------- | ------- |
| ansible_distribution         | Ubuntu  |
| ansible_distribution_release | jammy   |
| ansible_architecture         | x86_64  |

---

## 14. Why Docker Docs Use `chmod a+r`

Docker docs:

```bash
chmod a+r /etc/apt/keyrings/docker.asc
```

Equivalent Ansible permission:

```yaml
mode: '0644'
```


---

To understand list and sources see [list_source](list_source.md)