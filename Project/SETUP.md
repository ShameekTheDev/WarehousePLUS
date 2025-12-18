# 🚀 Warehouse+ Setup Guide

This guide will walk you through setting up Warehouse+ from scratch.

## Table of Contents
1. [Google Sheet Setup](#1-google-sheet-setup)
2. [Google Apps Script Setup](#2-google-apps-script-setup)
3. [Local Development Setup](#3-local-development-setup)
4. [Testing](#4-testing)
5. [Production Deployment](#5-production-deployment)

---

## 1. Google Sheet Setup

### Step 1.1: Create New Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it **"Warehouse+ Assets"** (or your preferred name)

### Step 1.2: Set Up Columns

In the first row, add these exact column headers:

```
A1: id
B1: name
C1: type
D1: url
E1: tags
F1: version
G1: status
H1: updatedAt
```

**Important:** Column names must match exactly (case-sensitive)!

### Step 1.3: Add Sample Data

Add some sample assets to test with:

**Row 2:**
```
A2: 1
B2: Main Stylesheet
C2: css
D2: https://cdn.example.com/styles/main.css
E2: layout,responsive,core
F2: 2.1.0
G2: active
H2: 2024-12-15T10:30:00Z
```

**Row 3:**
```
A3: 2
B3: App Bundle
C3: js
D3: https://cdn.example.com/scripts/app.bundle.js
E3: core,production
F3: 3.0.2
G3: active
H3: 2024-12-14T15:20:00Z
```

**Row 4:**
```
A4: 3
B4: Hero Background
C4: img
D4: https://cdn.example.com/images/hero-bg.webp
E4: hero,landing,optimized
F4: 1.0.0
G4: active
H4: 2024-12-13T09:15:00Z
```

### Step 1.4: Rename the Tab

1. Right-click on the tab at the bottom (probably says "Sheet1")
2. Click **Rename**
3. Name it exactly: `assets`

### Step 1.5: Publish to Web

1. Click **File → Share → Publish to web**
2. In the first dropdown, select **assets** (your tab name)
3. In the second dropdown, select **Comma-separated values (.csv)**
4. Click **Publish**
5. Click **OK** on the confirmation dialog
6. **Copy the published URL** - it will look like:
   ```
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/pub?output=csv
   ```

### Step 1.6: Convert to JSON Endpoint

Take your published URL and modify it:

**Original:**
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv
```

**Convert to:**
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json&sheet=assets
```

**Save this URL** - you'll need it for the `.env.local` file!

---

## 2. Google Apps Script Setup

### Step 2.1: Open Apps Script Editor

1. In your Google Sheet, click **Extensions → Apps Script**
2. You'll see a new tab with a code editor

### Step 2.2: Add the Script

1. **Delete** any existing code in the editor
2. Open the file `google-apps-script/Code.gs` from this project
3. **Copy all the code**
4. **Paste** it into the Apps Script editor

### Step 2.3: Save the Project

1. Click the **💾 Save** icon (or Ctrl+S / Cmd+S)
2. Name your project: **"Warehouse+ API"**

### Step 2.4: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the **⚙️ gear icon** next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description:** `Warehouse+ Write API v1`
   - **Execute as:** `Me (your-email@gmail.com)`
   - **Who has access:** `Anyone`
5. Click **Deploy**

### Step 2.5: Authorize the Script

1. You'll see a dialog: **"Authorization required"**
2. Click **Authorize access**
3. Choose your Google account
4. Click **Advanced** (if you see a warning)
5. Click **Go to Warehouse+ API (unsafe)**
6. Click **Allow**

### Step 2.6: Copy the Web App URL

After authorization, you'll see:
```
Web app URL: https://script.google.com/macros/s/AKfycbx.../exec
```

**Copy this entire URL** - you'll need it for `.env.local`!

### Step 2.7: Test the Deployment

1. Click on the **Web app URL** to open it in a new tab
2. You should see a JSON response like:
   ```json
   {
     "status": 200,
     "message": "Warehouse+ API is running",
     "timestamp": "2024-12-15T...",
     "data": {
       "version": "1.0.0",
       "endpoints": {
         "POST": "Update asset field"
       }
     }
   }
   ```

If you see this, your API is working! ✅

---

## 3. Local Development Setup

### Step 3.1: Install Dependencies

```bash
cd WarehousePLUS
npm install
```

### Step 3.2: Create Environment File

```bash
# Copy the example file
cp .env.local.example .env.local
```

### Step 3.3: Configure Environment Variables

Open `.env.local` in your text editor and add your URLs:

```env
# JSON endpoint from Step 1.6
NEXT_PUBLIC_SHEETS_JSON_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json&sheet=assets

# Apps Script URL from Step 2.6
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**Replace** `YOUR_SHEET_ID` and `YOUR_SCRIPT_ID` with your actual values!

### Step 3.4: Start Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

### Step 3.5: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You should see:
- ✅ Warehouse+ logo and header
- ✅ Filter bar with search and buttons
- ✅ Stats cards showing your asset counts
- ✅ Asset table with your sample data

---

## 4. Testing

### Test 4.1: View Assets

- ✅ Verify all your sample assets appear in the table
- ✅ Check that badges show correct colors (CSS=blue, JS=orange, IMG=green)
- ✅ Confirm stats cards show correct counts

### Test 4.2: Search Functionality

1. Type **"main"** in the search box
2. ✅ Only "Main Stylesheet" should appear
3. Clear the search
4. Type **"core"** (a tag)
5. ✅ Assets with "core" tag should appear

### Test 4.3: Type Filters

1. Click **CSS** button
2. ✅ Only CSS assets should appear
3. Click **JavaScript** button
4. ✅ Only JS assets should appear
5. Click **All Types**
6. ✅ All assets should appear again

### Test 4.4: Inline Editing

1. **Hover** over the "Main Stylesheet" name cell
2. ✅ You should see a ✏️ edit icon appear
3. **Click** the cell
4. ✅ Cell should become an input field
5. Change the name to **"Primary Stylesheet"**
6. **Press Enter** or click outside
7. ✅ Cell should update in the UI
8. **Check your Google Sheet**
9. ✅ The name should be updated there too!
10. ✅ The `updatedAt` timestamp should be updated

### Test 4.5: URL Editing

1. Click on a URL cell
2. Change the URL
3. Press Enter
4. ✅ Verify it updates in both UI and Google Sheet

### Test 4.6: Tag Editing

1. Click on a tags cell
2. Add a new tag: `test,new-tag`
3. Press Enter
4. ✅ Tag chips should update
5. ✅ Google Sheet should reflect changes

---

## 5. Production Deployment

### Step 5.1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)

### Step 5.2: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 5.3: Deploy

```bash
# From your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? warehouse-plus
# - Directory? ./
# - Override settings? No
```

### Step 5.4: Add Environment Variables

1. Go to your Vercel dashboard
2. Select your **warehouse-plus** project
3. Click **Settings → Environment Variables**
4. Add both variables:

**Variable 1:**
- **Name:** `NEXT_PUBLIC_SHEETS_JSON_URL`
- **Value:** Your Google Sheets JSON URL
- **Environment:** Production, Preview, Development

**Variable 2:**
- **Name:** `NEXT_PUBLIC_APPS_SCRIPT_URL`
- **Value:** Your Apps Script Web App URL
- **Environment:** Production, Preview, Development

5. Click **Save**

### Step 5.5: Redeploy

```bash
vercel --prod
```

### Step 5.6: Update Apps Script CORS (Optional)

If you want to restrict access to your production domain:

1. Open your Apps Script editor
2. Find the `ALLOWED_ORIGINS` array
3. Add your Vercel domain:
   ```javascript
   const ALLOWED_ORIGINS = [
     'http://localhost:3000',
     'https://warehouse-plus.vercel.app' // Your actual domain
   ];
   ```
4. Save and redeploy the script

---

## 🎉 Congratulations!

Your Warehouse+ installation is complete!

### Next Steps

- 📝 Add your real assets to the Google Sheet
- 🎨 Customize the theme in `globals.css`
- 🚀 Share your deployment URL with your team
- ⭐ Star the repo if you found this useful!

### Need Help?

- 📖 Check the main [README.md](README.md)
- 🐛 Report issues on GitHub
- 💬 Join our community discussions

---

## Common Issues & Solutions

### Issue: "Sheet not found"
**Solution:** Make sure your sheet tab is named exactly `assets` (lowercase)

### Issue: "CORS error"
**Solution:** Verify your Apps Script is deployed as "Anyone" can access

### Issue: "Updates not saving"
**Solution:** 
1. Check Apps Script logs (Executions tab)
2. Verify the Apps Script URL is correct
3. Make sure you authorized the script

### Issue: "No data showing"
**Solution:**
1. Test your JSON URL directly in browser
2. Check browser console for errors
3. Verify sheet is published to web

---

**Happy asset managing! 🚀**
