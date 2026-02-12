# 🚀 Deployment Guide - Interest Calculator App

This guide covers deploying both **Frontend (React)** and **Backend (Node.js/Express)** to cloud platforms.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

- [ ] Copy `backend/.env.example` to `backend/.env`
- [ ] Set strong JWT_SECRET for production
- [ ] Configure MongoDB Atlas connection string
- [ ] Verify all sensitive data is in .gitignore

### 2. Code Preparation

- [ ] All tests passing
- [ ] No console errors
- [ ] All dependencies in package.json
- [ ] README.md is complete

### 3. Database Setup

- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Network access configured (0.0.0.0/0 or specific IPs)
- [ ] Database user created with password

---

## 🎯 Recommended Deployment Architecture

### Option 1: Separate Deployments (Recommended)

- **Frontend:** Vercel or Netlify (Free, Optimized for React)
- **Backend:** Render or Railway (Free tier available)
- **Database:** MongoDB Atlas (Free tier: 512MB)

### Option 2: All-in-One

- **Full Stack:** Render (Both frontend + backend)

---

## 🗄️ Step 1: MongoDB Atlas Setup (Database)

### 1.1 Create Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up (free)

### 1.2 Create Cluster

1. Click "Build a Database"
2. Choose **FREE** (M0 Sandbox)
3. Select **Cloud Provider:** AWS
4. Select **Region:** Closest to your users
5. Cluster Name: `interest-calculator-cluster`
6. Click "Create"

### 1.3 Configure Database Access

1. **Security → Database Access**
2. Click "Add New Database User"
   - Authentication Method: Password
   - Username: `interestapp_user`
   - Password: Generate secure password (save it!)
   - Database User Privileges: Read and write to any database
3. Click "Add User"

### 1.4 Configure Network Access

1. **Security → Network Access**
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://interestapp_user:<password>@cluster.mongodb.net/interest_app?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Save this - you'll need it for backend deployment!

---

## 🎨 Step 2: Frontend Deployment (Vercel)

### 2.1 Prepare Frontend

**Update API URL for production:**

Create environment config file:

```bash
# In project root, create .env file
echo "REACT_APP_API_URL=https://your-backend-url.onrender.com/api" > .env
```

**Update `src/services/api.js`:**

```javascript
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
```

### 2.2 Deploy to Vercel

#### Via Vercel Website:

1. Go to [https://vercel.com/signup](https://vercel.com/signup)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Create React App
   - **Root Directory:** `./` (leave blank)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`
6. **Environment Variables:**
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.onrender.com/api` (add after backend is deployed)
7. Click "Deploy"
8. Wait for deployment (2-3 minutes)
9. Get your URL: `https://interest-calculator-app.vercel.app`

#### Via Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd c:\unlox_capstone_project\interest-app
vercel

# Follow prompts:
# - Setup and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? interest-calculator-app
# - Directory? ./
# - Override settings? No

# After backend is deployed, set environment variable:
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend-url.onrender.com/api
```

---

## ⚙️ Step 3: Backend Deployment (Render)

### 3.1 Prepare Backend

**Create `backend/package.json` scripts if missing:**

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 3.2 Deploy to Render

1. Go to [https://render.com/](https://render.com/)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:

   **Basic Settings:**
   - **Name:** `interest-calculator-backend`
   - **Region:** Oregon (US West) or closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

   **Environment Variables:** (Click "Add Environment Variable")

   ```
   PORT = 5000
   MONGO_URI = mongodb+srv://interestapp_user:YOUR_PASSWORD@cluster.mongodb.net/interest_app?retryWrites=true&w=majority
   JWT_SECRET = your_production_jwt_secret_change_this_to_random_string
   NODE_ENV = production
   ```

6. **Instance Type:** Free
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. **Copy your backend URL:** `https://interest-calculator-backend.onrender.com`

### 3.3 Update CORS Settings

**Edit `backend/src/app.js`:**

```javascript
import cors from "cors";

// Update CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://interest-calculator-app.vercel.app", // Your Vercel frontend URL
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

Commit and push changes:

```bash
git add backend/src/app.js
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-deploy the changes.

---

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update Frontend Environment

1. Go to Vercel dashboard
2. Select your project
3. Go to **Settings → Environment Variables**
4. Update `REACT_APP_API_URL`:
   - Value: `https://interest-calculator-backend.onrender.com/api`
5. Click "Save"
6. Go to **Deployments**
7. Click "Redeploy" on latest deployment

### 4.2 Test the Connection

1. Open your Vercel URL: `https://interest-calculator-app.vercel.app`
2. Try registering a new user
3. Login and test features
4. Check if data is saving to MongoDB Atlas

---

## 🚂 Alternative: Deploy Backend to Railway

### Railway Setup

1. Go to [https://railway.app/](https://railway.app/)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`
6. Add Environment Variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_production_secret
   NODE_ENV=production
   ```
7. Deploy
8. Get URL from "Settings → Domains"

---

## 🌐 Alternative: Deploy to Render (Full Stack)

### Deploy Both Frontend & Backend Together

1. **Backend:** Follow Step 3 above
2. **Frontend:**
   - Create another Web Service
   - Root Directory: `.` (root)
   - Build Command: `npm run build`
   - Start Command: `npx serve -s build -l $PORT`
   - Add `serve` to dependencies:
     ```bash
     npm install serve --save
     ```

---

## 🧪 Post-Deployment Testing

### Test Checklist:

- [ ] Frontend loads without errors
- [ ] Registration works
- [ ] Login works and redirects to dashboard
- [ ] Create account works
- [ ] Create transaction works
- [ ] Payment recording works
- [ ] Dashboard displays data
- [ ] Charts render
- [ ] Export PDF/Excel works
- [ ] Notifications work
- [ ] Mobile responsive
- [ ] Check browser console for errors
- [ ] Check Render logs for backend errors

### Access Logs:

**Render Backend Logs:**

- Dashboard → Your Service → Logs tab

**Vercel Frontend Logs:**

- Dashboard → Your Project → Deployments → View Function Logs

**MongoDB Atlas:**

- Collections → Browse Collections → Verify data

---

## 🔒 Security Checklist

- [ ] Strong JWT_SECRET in production (min 32 characters)
- [ ] MongoDB connection string not exposed
- [ ] CORS configured with specific origins
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Environment variables not in code
- [ ] .env files in .gitignore
- [ ] Helmet.js enabled in backend
- [ ] Rate limiting configured (optional)

---

## 💰 Free Tier Limitations

### Vercel (Frontend)

- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ❌ Cold start after inactivity

### Render (Backend)

- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ Automatic HTTPS
- ⚠️ **Sleeps after 15 min inactivity**
- ⚠️ Cold start takes 30-60 seconds

### MongoDB Atlas

- ✅ 512MB storage (enough for 1000s of transactions)
- ✅ Shared cluster
- ❌ No backups on free tier

---

## ⚡ Performance Optimization

### Keep Backend Awake

Use a cron job service (like cron-job.org) to ping your backend every 10 minutes:

```
https://your-backend-url.onrender.com/api/health
```

### Frontend Optimization

Add to `package.json`:

```json
{
  "scripts": {
    "build": "react-scripts build",
    "postbuild": "echo 'Build complete!'"
  }
}
```

---

## 🆙 Upgrading for Production

### When to upgrade:

1. **High Traffic** (>10,000 users/month)
   - Upgrade Render: $7/month (no sleep)
   - Upgrade MongoDB: $9/month (2GB storage)

2. **Need Custom Domain**
   - Buy domain (Namecheap, GoDaddy)
   - Add to Vercel: Settings → Domains
   - Add to Render: Settings → Custom Domain

3. **Need Backups**
   - Upgrade MongoDB Atlas
   - Or implement backup cron job

---

## 🛠️ Maintenance

### Update Deployment:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployment will trigger
# Vercel: ~30 seconds
# Render: ~2-5 minutes
```

### Rollback:

```bash
# Vercel: Dashboard → Deployments → Previous deployment → Promote to Production
# Render: Dashboard → Manual Deploy → Select previous commit
```

---

## 📱 Custom Domain Setup (Optional)

### 1. Buy Domain

- Namecheap: ~$10/year
- GoDaddy: ~$12/year
- Domain.com: ~$10/year

### 2. Configure Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `interestcalculator.com`
3. Follow DNS instructions
4. Add CNAME record:
   - Host: `www`
   - Value: `cname.vercel-dns.com`
5. Wait for propagation (5-60 minutes)

### 3. Configure Render

1. Render Dashboard → Your Service → Settings → Custom Domain
2. Add domain: `api.interestcalculator.com`
3. Add CNAME record:
   - Host: `api`
   - Value: Your Render URL
4. Wait for SSL certificate (automatic)

---

## 📊 Monitoring & Analytics

### Add to Frontend:

- Google Analytics
- Sentry (Error tracking)
- Vercel Analytics (built-in)

### Add to Backend:

- Render Metrics (built-in)
- MongoDB Atlas Monitoring
- Custom logging service

---

## ❓ Troubleshooting

### Frontend not loading:

- Check Vercel build logs
- Verify REACT_APP_API_URL is set
- Check browser console for CORS errors

### Backend not responding:

- Check Render logs for errors
- Verify MongoDB connection string
- Check environment variables
- Test health endpoint: `https://your-backend.onrender.com/api/health`

### Database connection failed:

- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check database user credentials
- Test connection string locally first

### CORS errors:

- Update CORS origins in backend
- Include both http://localhost:3000 and production URL
- Redeploy backend after changes

---

## 🎉 Deployment Complete!

### Your Live URLs:

- **Frontend:** `https://interest-calculator-app.vercel.app`
- **Backend:** `https://interest-calculator-backend.onrender.com`
- **Database:** MongoDB Atlas Cloud

### Share Your Project:

- Add URLs to README.md
- Share on LinkedIn/Twitter
- Add to portfolio
- Add to resume

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**🎊 Congratulations! Your app is now live and accessible worldwide!**
