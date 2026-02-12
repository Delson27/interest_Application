# 🚀 GitHub Push Guide

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website
1. Go to [https://github.com/new](https://github.com/new)
2. Repository details:
   - **Name:** `interest-calculator-app` (or your preferred name)
   - **Description:** Interest Calculator WebApp - Loan & Investment Management System
   - **Visibility:** Choose Public or Private
   - ⚠️ **DO NOT** check "Add README" (you already have one)
   - ⚠️ **DO NOT** add .gitignore or license (you have them)
3. Click **"Create repository"**
4. Copy the repository URL (e.g., `https://github.com/YOUR-USERNAME/interest-calculator-app.git`)

### Option B: Using GitHub CLI (if installed)
```bash
gh repo create interest-calculator-app --public --source=. --remote=origin
```

---

## Step 2: Stage Your Changes

```bash
cd c:\unlox_capstone_project\interest-app

# Clean up deleted files
git add -A

# Check what will be committed
git status
```

---

## Step 3: Commit Your Changes

```bash
git commit -m "Add testing guides and documentation"
```

---

## Step 4: Add GitHub Remote

Replace `YOUR-USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/interest-calculator-app.git
```

Verify remote added:
```bash
git remote -v
```

---

## Step 5: Push to GitHub

### First time push:
```bash
git push -u origin main
```

### If prompted for credentials:
- **Username:** Your GitHub username
- **Password:** Use a [Personal Access Token (PAT)](https://github.com/settings/tokens) - NOT your GitHub password

#### Create Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes: ✅ `repo` (full control)
4. Click "Generate token"
5. Copy the token (you won't see it again!)
6. Use this token as your password when pushing

---

## Step 6: Verify Push

1. Go to your GitHub repository URL
2. You should see all your files
3. README.md should be displayed on the main page

---

## 🔄 Future Pushes (After Making Changes)

```bash
# Stage changes
git add .

# Commit with a descriptive message
git commit -m "Your commit message here"

# Push to GitHub
git push origin main
```

---

## 📝 Good Commit Message Examples

```bash
git commit -m "Add payment tracking feature"
git commit -m "Fix interest calculation bug for compound interest"
git commit -m "Update dashboard UI with new charts"
git commit -m "Add export to PDF functionality"
git commit -m "Configure deployment settings"
```

---

## 🔐 Security Checklist

Before pushing, verify these files are **NOT** being tracked:

```bash
# Check if .env is ignored (should show nothing)
git ls-files | grep "\.env"

# Check if node_modules is ignored (should show nothing)
git ls-files | grep "node_modules"

# Check what files will be pushed
git ls-files
```

### Files that SHOULD be ignored (in .gitignore):
- ✅ `backend/.env` - Contains database credentials
- ✅ `node_modules/` - Large dependency folders
- ✅ `backend/uploads/*` - Uploaded files
- ✅ `package-lock.json` - Lock files
- ✅ `.DS_Store`, `.vscode/` - System/IDE files

---

## ⚠️ Troubleshooting

### Error: "remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR-USERNAME/interest-calculator-app.git
```

### Error: "failed to push some refs"
```bash
# Pull first (if repo has changes)
git pull origin main --rebase

# Then push
git push origin main
```

### Error: Authentication failed
- Use Personal Access Token instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Large file error (file > 100MB)
```bash
# Remove file from git tracking
git rm --cached path/to/large/file

# Add to .gitignore
echo "path/to/large/file" >> .gitignore

# Commit and retry
git commit -m "Remove large file"
git push origin main
```

---

## 🎯 Quick Commands Reference

```bash
# Check status
git status

# View changes
git diff

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD

# Pull latest from GitHub
git pull origin main

# Clone repository to another machine
git clone https://github.com/YOUR-USERNAME/interest-calculator-app.git
```

---

## ✅ Verification Checklist

After pushing to GitHub, verify:
- [ ] All files visible on GitHub (except ignored ones)
- [ ] README.md displays correctly
- [ ] No .env files visible
- [ ] No node_modules folders
- [ ] Repository description is set
- [ ] Topics/tags added (optional: `nodejs`, `react`, `mongodb`, `expressjs`, `tailwindcss`)

---

**Next Step:** Once pushed to GitHub, proceed to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deploying your application! 🚀
