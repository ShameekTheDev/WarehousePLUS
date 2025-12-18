# 📁 Warehouse+ Project Structure

```
WarehousePLUS/
├── 📄 README.md                    # Main documentation
├── 📄 SETUP.md                     # Detailed setup guide
├── 📄 package.json                 # Dependencies and scripts
├── 📄 next.config.js               # Next.js configuration
├── 📄 .eslintrc.json              # ESLint configuration
├── 📄 .gitignore                  # Git ignore rules
├── 📄 .env.local.example          # Environment variables template
├── 📄 .env.local                  # Your local environment (not in git)
│
├── 📁 public/                     # Static assets
│   └── 🖼️ Logo.svg                # Warehouse+ logo
│
├── 📁 src/                        # Source code
│   └── 📁 app/                    # Next.js App Router
│       ├── 📄 layout.js           # Root layout component
│       ├── 📄 page.js             # Main page with asset table
│       ├── 📄 globals.css         # Global styles & design system
│       │
│       └── 📁 api/                # API routes
│           └── 📁 assets/
│               └── 📄 route.js    # Assets API endpoint
│
└── 📁 google-apps-script/         # Google Apps Script code
    └── 📄 Code.gs                 # Apps Script for write operations
```

---

## 📄 File Descriptions

### Root Configuration Files

#### `package.json`
- **Purpose:** Project metadata and dependencies
- **Key Dependencies:**
  - `next`: Next.js framework (v14.2.0)
  - `react`: React library (v18.3.0)
  - `react-dom`: React DOM renderer
- **Scripts:**
  - `npm run dev`: Start development server
  - `npm run build`: Build for production
  - `npm start`: Start production server
  - `npm run lint`: Run ESLint

#### `next.config.js`
- **Purpose:** Next.js configuration
- **Key Settings:**
  - React strict mode enabled
  - Image domains configured for Google assets

#### `.env.local.example`
- **Purpose:** Template for environment variables
- **Variables:**
  - `NEXT_PUBLIC_SHEETS_JSON_URL`: Google Sheets JSON endpoint
  - `NEXT_PUBLIC_APPS_SCRIPT_URL`: Apps Script Web App URL

---

### Source Files

#### `src/app/layout.js`
- **Purpose:** Root layout wrapper for all pages
- **Features:**
  - Metadata configuration (title, description, SEO)
  - Font loading (Inter, JetBrains Mono)
  - Global HTML structure

#### `src/app/page.js`
- **Purpose:** Main application page
- **Features:**
  - Asset table with inline editing
  - Search and filter functionality
  - Stats dashboard
  - Google Sheets integration
- **State Management:**
  - `assets`: All assets from Google Sheets
  - `filteredAssets`: Filtered view based on search/filters
  - `editingCell`: Currently editing cell
  - `searchQuery`: Search input value
  - `typeFilter`: Selected type filter (css/js/img)
  - `statusFilter`: Selected status filter

#### `src/app/globals.css`
- **Purpose:** Global styles and design system
- **Sections:**
  1. **CSS Variables:** Colors, spacing, typography
  2. **Reset & Base:** Normalize browser defaults
  3. **Typography:** Headings, fonts, code blocks
  4. **Layout:** Container, header, filter bar
  5. **Components:** Buttons, badges, table, cards
  6. **Animations:** Transitions, keyframes
  7. **Responsive:** Mobile breakpoints
  8. **Utilities:** Helper classes

#### `src/app/api/assets/route.js`
- **Purpose:** Server-side API route for fetching assets
- **Features:**
  - Fetches from Google Sheets JSON endpoint
  - Parses Google Visualization API format
  - Implements ISR (Incremental Static Regeneration)
  - Error handling and validation

---

### Google Apps Script

#### `google-apps-script/Code.gs`
- **Purpose:** Handle write operations to Google Sheets
- **Functions:**
  - `doPost(e)`: Handle POST requests for updates
  - `doGet(e)`: Handle GET requests (testing)
  - `createResponse()`: Create JSON responses
  - `testSheetAccess()`: Test function for debugging
- **Features:**
  - Find and update specific cells by asset ID
  - Auto-update `updatedAt` timestamp
  - Error handling and validation
  - CORS support

---

## 🔄 Data Flow

### Read Flow (Viewing Assets)
```
Google Sheets
    ↓ (Published as JSON)
NEXT_PUBLIC_SHEETS_JSON_URL
    ↓ (Fetch)
/api/assets route
    ↓ (Parse & Transform)
page.js (Client)
    ↓ (Render)
Browser UI
```

### Write Flow (Editing Assets)
```
Browser UI (Edit Cell)
    ↓ (Click to edit)
page.js (handleCellEdit)
    ↓ (Update local state)
Optimistic UI Update
    ↓ (POST request)
NEXT_PUBLIC_APPS_SCRIPT_URL
    ↓ (Apps Script)
Google Sheets (Update Cell)
    ↓ (Success/Error)
Confirmation / Revert
```

---

## 🎨 Design System

### Color Palette
- **Primary:** `#6366f1` (Indigo)
- **Secondary:** `#8b5cf6` (Purple)
- **Success:** `#10b981` (Green)
- **Warning:** `#f59e0b` (Amber)
- **Danger:** `#ef4444` (Red)
- **Info:** `#3b82f6` (Blue)

### Typography
- **Sans-serif:** Inter (UI text)
- **Monospace:** JetBrains Mono (code, URLs)

### Spacing Scale
- XS: 0.25rem (4px)
- SM: 0.5rem (8px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)
- 2XL: 3rem (48px)

### Border Radius
- SM: 0.375rem (6px)
- MD: 0.5rem (8px)
- LG: 0.75rem (12px)
- XL: 1rem (16px)
- Full: 9999px

---

## 🔧 Component Architecture

### Main Components

#### Header
- Logo display
- Refresh button
- Add asset button (placeholder)

#### Filter Bar
- Search input
- Type filter buttons (All/CSS/JS/Images)
- Status filter buttons (All/Active/Beta/Disabled)

#### Stats Grid
- Total assets count
- Active assets count
- CSS files count
- JS files count
- Images count

#### Asset Table
- Sticky header
- Sortable columns
- Inline editable cells
- Type badges
- Status badges
- Tag chips
- Responsive scrolling

---

## 🚀 Performance Optimizations

### Next.js Features
- **Static Generation:** Pre-render at build time
- **ISR:** Revalidate every 60 seconds
- **Image Optimization:** Automatic image optimization
- **Code Splitting:** Automatic route-based splitting

### Custom Optimizations
- **Optimistic Updates:** UI updates before server confirmation
- **Client-Side Filtering:** No server requests for filters
- **Debounced Search:** Reduce unnecessary re-renders
- **Memoization:** Cache filtered results

---

## 📦 Build Output

When you run `npm run build`, Next.js creates:

```
.next/
├── static/           # Static assets
├── server/           # Server-side code
└── cache/            # Build cache
```

Production files are optimized:
- Minified JavaScript
- Optimized CSS
- Compressed images
- Tree-shaken code

---

## 🔐 Security Considerations

### Current Setup
- ✅ Read-only public Google Sheet
- ⚠️ Open Apps Script endpoint (anyone with URL)
- ✅ No credentials in frontend code
- ✅ HTTPS for all requests (production)

### Recommended Improvements
1. **Add Authentication:** Implement user login
2. **API Keys:** Use secret tokens for Apps Script
3. **Rate Limiting:** Prevent abuse
4. **Input Validation:** Sanitize all inputs
5. **CORS Restrictions:** Limit allowed origins

---

## 📝 Development Workflow

### Local Development
```bash
npm run dev          # Start dev server
npm run lint         # Check code quality
```

### Production Build
```bash
npm run build        # Create production build
npm start            # Start production server
```

### Deployment
```bash
vercel               # Deploy to Vercel
# or
npm run build        # Build locally
# Upload to your hosting
```

---

## 🐛 Debugging

### Check Logs
- **Browser Console:** Client-side errors
- **Terminal:** Next.js server logs
- **Apps Script:** Executions tab in Apps Script editor

### Common Debug Points
1. Environment variables loaded?
2. Google Sheets URL accessible?
3. Apps Script deployed and authorized?
4. Network requests successful?
5. Data format correct?

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Apps Script Guide](https://developers.google.com/apps-script)
- [Vercel Deployment](https://vercel.com/docs)

---

**Built with ❤️ by ShameekTheDev**
