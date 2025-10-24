# 🔒 Security Guide

## What's Safe to Upload to GitHub

### ✅ SAFE - These Files Are Public
```
✅ Source code (Python, JavaScript, HTML)
✅ requirements.txt (package names only)
✅ Dockerfile, docker-compose.yml
✅ IaC code (Terraform .tf files, CDK code)
✅ Documentation (README.md, etc.)
✅ .gitignore
✅ env.example (example template, NO real keys)
```

### ❌ NEVER Upload These
```
❌ .env (contains real API keys)
❌ terraform.tfvars (contains real values)
❌ terraform.tfstate (contains infrastructure state & secrets)
❌ *.pem, *.key files (SSH keys, SSL certificates)
❌ AWS credentials files
❌ Any file with actual API keys hardcoded
```

---

## 🔑 How This Project Handles Secrets

### Current Setup (Already Secure ✅)

**1. Environment Variables (.env file)**
```bash
# .env - This file is in .gitignore
GROQ_API_KEY=gsk_real_key_here
SERPAPI_KEY=real_key_here
```

**2. Code Loads from Environment**
```python
# backend/app.py - SAFE ✅
os.getenv('GROQ_API_KEY')  # No hardcoded keys
os.getenv('SERPAPI_KEY')   # No hardcoded keys
```

**3. Example File for GitHub**
```bash
# env.example - Safe to upload ✅
GROQ_API_KEY=gsk_your_key_here  # Placeholder only
SERPAPI_KEY=your_key_here       # Placeholder only
```

---

## 🚀 For IaC Deployment

### When Using Terraform

**Files to Upload:**
```
infrastructure/main.tf           ✅ Infrastructure code
infrastructure/variables.tf      ✅ Variable definitions
infrastructure/outputs.tf        ✅ Output definitions
infrastructure/terraform.tfvars.example  ✅ Example values
```

**Files to Keep Secret:**
```
infrastructure/terraform.tfvars  ❌ Real values (in .gitignore)
infrastructure/terraform.tfstate ❌ State file (in .gitignore)
infrastructure/.terraform/       ❌ Terraform cache (in .gitignore)
```

**Example: terraform.tfvars.example** (safe to upload)
```hcl
# Copy to terraform.tfvars and fill in real values
aws_region = "us-east-1"
groq_api_key = "your_groq_key_here"
serpapi_key = "your_serpapi_key_here"
```

**Your real terraform.tfvars** (NOT uploaded)
```hcl
aws_region = "us-east-1"
groq_api_key = "gsk_abc123..."  # Real key
serpapi_key = "xyz789..."        # Real key
```

---

## 🛡️ Best Practices

### 1. **Use AWS Secrets Manager / Parameter Store**
Instead of environment variables, store secrets in AWS:
```python
import boto3

def get_secret(secret_name):
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return response['SecretString']
```

### 2. **Use GitHub Secrets for CI/CD**
When setting up GitHub Actions:
- Store secrets in: Settings → Secrets and variables → Actions
- Reference in workflow: `${{ secrets.GROQ_API_KEY }}`

### 3. **Never Commit History with Secrets**
If you accidentally commit a secret:
```bash
# Remove from git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Or use git-secrets tool
git secrets --install
git secrets --register-aws
```

### 4. **Rotate Keys if Exposed**
If you accidentally push a key to GitHub:
1. Immediately revoke/delete the key from the service
2. Generate a new key
3. Update your .env file
4. Remove from git history
5. Force push: `git push --force`

---

## 📋 Checklist Before Pushing to GitHub

```bash
- [ ] No .env file in commit
- [ ] No terraform.tfstate in commit  
- [ ] No *.pem or *.key files in commit
- [ ] No hardcoded API keys in code
- [ ] All secrets use environment variables
- [ ] .gitignore is properly configured
- [ ] env.example provided for documentation
- [ ] terraform.tfvars.example provided (if using Terraform)
```

---

## 🔍 How to Check for Leaked Secrets

**Before committing:**
```bash
# Check what's being committed
git status
git diff --cached

# Search for potential secrets
grep -r "gsk_" .        # Groq API keys
grep -r "AKIA" .        # AWS keys
grep -r "api_key" .     # Generic API keys
```

**Use git-secrets tool:**
```bash
# Install
brew install git-secrets

# Setup
git secrets --install
git secrets --register-aws

# Scan repo
git secrets --scan
```

---

## ✅ Current Status

Your project is already secure:
- ✅ .env in .gitignore
- ✅ Code uses environment variables
- ✅ No hardcoded secrets
- ✅ Cache directory excluded
- ✅ Virtual environment excluded

**For reviewers:** This repository contains NO secrets. Users must provide their own API keys via environment variables.

