# 🚀 Quick Start - GitHub & Deployment

## Part 1: Push to GitHub (5 minutes)

### Step 1: Stage all changes

```bash
cd c:\unlox_capstone_project\interest-app
git add -A
git status
```

### Step 2: Commit changes

```bash
git commit -m "Prepare for deployment - Add guides and documentation"
```

### Step 3: Create GitHub Repository

1. Go to: https://github.com/new
2. Name: `interest-calculator-app`
3. Keep all checkboxes UNCHECKED
4. Click "Create repository"

### Step 4: Connect and Push

Replace `YOUR-USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/interest-calculator-app.git
git push -u origin main
```

**If asked for credentials:**

- Username: Your GitHub username
- Password: Use Personal Access Token from https://github.com/settings/tokens

✅ **Done! Your code is now on GitHub!**

---

## Part 2: Deploy Application (30 minutes)

### A. Setup MongoDB Atlas (10 min)

1. **Sign up:** https://www.mongodb.com/cloud/atlas/register
2. **Create FREE cluster** (M0)
3. **Database Access:**
   - Username: `interestapp_user`
   - Password: (generate and save it!)
4. **Network Access:** Allow 0.0.0.0/0
5. **Get connection string:**
   ```
   mongodb+srv://interestapp_user:PASSWORD@cluster.mongodb.net/interest_app
   ```
6. **Save this! You'll need it next.**

---

### B. Deploy Backend to Render (10 min)

1. **Sign up:** https://render.com/ (use GitHub)
2. **New Web Service** → Connect your GitHub repo
3. **Configure:**
   - Name: `interest-calculator-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Environment Variables:**

   ```
   PORT = 5000
   MONGO_URI = (paste your MongoDB connection string here)
   JWT_SECRET = mysuper$ecretJWT2026production
   NODE_ENV = production
   ```

5. **Create Service** (wait 5 minutes)
6. **Copy your backend URL:** `https://interest-calculator-backend.onrender.com`

---

### C. Deploy Frontend to Vercel (10 min)

1. **Sign up:** https://vercel.com/ (use GitHub)
2. **New Project** → Import your GitHub repo
3. **Configure:**
   - Framework: Create React App
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Environment Variable:**

   ```
   REACT_APP_API_URL = https://YOUR-BACKEND-URL.onrender.com/api
   ```

5. **Deploy** (wait 2 minutes)
6. **Your frontend URL:** `https://interest-calculator-app.vercel.app`

---

### D. Update CORS & Redeploy (5 min)

**Edit `backend/src/app.js`** - Add your Vercel URL:

```javascript
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://interest-calculator-app.vercel.app", // ADD THIS
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

**Push changes:**

```bash
git add backend/src/app.js
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy in 3-4 minutes.

---

### E. Test Your Live App! 🎉

1. Open: `https://interest-calculator-app.vercel.app`
2. Register a new account
3. Create an account (customer)
4. Create a transaction
5. Record a payment
6. Check dashboard

✅ **Your app is LIVE!**

---

## 🆘 Need Help?

### Frontend issues:

- Check Vercel logs: Dashboard → Deployments → Function Logs
- Check browser console (F12)

### Backend issues:

- Check Render logs: Dashboard → Logs tab
- Test: `https://your-backend.onrender.com/api/health`

### Database issues:

- Verify MongoDB connection string
- Check Network Access: 0.0.0.0/0 allowed
- Verify database user credentials

---

## 📱 Share Your Project

Update your GitHub README with live links:

```markdown
## 🌐 Live Demo

- **Frontend:** https://interest-calculator-app.vercel.app
- **Backend API:** https://interest-calculator-backend.onrender.com/api

## 🧪 Test Credentials

- Email: demo@test.com
- Password: Demo@123
```

---

## 📚 Complete Guides

- **Detailed GitHub Guide:** [GITHUB_SETUP.md](./GITHUB_SETUP.md)
- **Full Deployment Guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Testing Guide:** [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

**Total Time:** ~45 minutes
**Cost:** $0 (All free tiers)
**Result:** Fully deployed, cloud-hosted application! 🚀
