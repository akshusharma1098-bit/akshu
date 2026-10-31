# 🚌 SmartCommute – AI-Powered Smart Transport & Crowd Predictor

> **"Travel Smarter. Beat the Crowd."**

SmartCommute is a modern, responsive, and functional public transportation web and mobile platform designed to help commuters find less crowded routes (buses, metros, trains) and make smarter travel decisions using community-reported density and predictive AI analytics.

---

## 🌟 Key Innovations

1. **Community-Powered Real-Time Crowd Intelligence**: Commuters submit live crowd levels (`EMPTY`, `MODERATE`, `CROWDED`) with anti-spam rate limiting.
2. **AI Crowd Prediction Engine**: Synthesizes historical time-series matrices, day-of-week trends, and time-decayed exponential weights ($e^{-\Delta t / \tau}$) to forecast upcoming crowd density up to 4 hours in advance.
3. **Smart Multi-Route Optimization**: Evaluates alternative routes using a composite penalty function balancing travel duration and crowd congestion ($Duration \times W_t + Crowd \times W_c$).
4. **Interactive Leaflet Transit Map**: Visualizes Kota, Rajasthan stops, route paths, real-time vehicle arrivals, and live crowd color indicators (Green = Low, Yellow = Moderate, Red = High).
5. **Admin Operations Console**: Route-wise passenger flow analytics, KPI cards, and moderation queue for verifying/removing user reports.

---

## 🗂️ Project Architecture

```
d:\project\
  ├── backend\
  │   ├── src\
  │   │   ├── config\
  │   │   │   └── firebase.js          # Realtime DB & In-Memory Store Adapter
  │   │   ├── data\
  │   │   │   └── kotaTransitData.js   # Kota stops, routes, and hourly matrices
  │   │   ├── engine\
  │   │   │   ├── predictionEngine.js  # AI crowd forecasting algorithm
  │   │   │   └── routeOptimizer.js    # Multi-route penalty optimization
  │   │   ├── middleware\
  │   │   │   └── rateLimiter.js       # Anti-spam token bucket guard
  │   │   ├── routes\
  │   │   │   ├── authRoutes.js        # Authentication & guest demo logins
  │   │   │   ├── crowdRoutes.js       # Live report broadcasting & density feeds
  │   │   │   ├── transportRoutes.js   # Stops, routes, and route suggestions
  │   │   │   ├── predictionRoutes.js  # Prediction API queries
  │   │   │   └── adminRoutes.js       # Admin KPIs and moderation
  │   │   └── server.js                # Native zero-dependency REST HTTP server
  │   ├── package.json
  │   └── .env.example
  │
  ├── frontend\
  │   ├── src\
  │   │   ├── components\
  │   │   │   ├── BottomNav.js         # Tab navigation bar
  │   │   │   ├── CrowdBadge.js        # Green/Yellow/Red status indicator
  │   │   │   ├── Header.js            # App top bar with Kota demo pill
  │   │   │   ├── PredictionBar.js     # Live vs Predicted crowd curve
  │   │   │   ├── ReportModal.js       # 3-step crowd report dialog
  │   │   │   ├── RouteCard.js         # Route card with AI recommendation banner
  │   │   │   └── TransportMap.js      # Leaflet.js interactive transit map
  │   │   ├── config\
  │   │   │   ├── firebase.js          # Firebase client config & fallback DB
  │   │   │   └── theme.js             # Design tokens & color palette
  │   │   ├── data\
  │   │   │   └── demoData.js          # High-fidelity Kota demo dataset
  │   │   ├── screens\
  │   │   │   ├── SplashScreen.js       # 1. Splash Screen
  │   │   │   ├── OnboardingScreen.js   # 2. Onboarding Screen
  │   │   │   ├── AuthScreen.js         # 3. Login, Register & Guest Mode
  │   │   │   ├── DashboardScreen.js    # 4. Smart Home Dashboard
  │   │   │   ├── SearchScreen.js       # 5. Search Destination & Preferences
  │   │   │   ├── MapScreen.js          # 6. Interactive Transport Map
  │   │   │   ├── RouteComparisonScreen.js # 7. Route Comparison & Forecasts
  │   │   │   ├── CrowdReportScreen.js  # 8. Live Crowd Reporting Sentinel
  │   │   │   ├── NotificationsScreen.js# 9. Real-time Transit Alerts
  │   │   │   ├── ProfileScreen.js      # 10. User Profile & Preferences
  │   │   │   └── AdminDashboardScreen.js # 11. Transit Authority Admin Console
  │   │   └── App.js                   # Root React Native / Web controller
  │   ├── app.json                     # Expo configuration
  │   └── package.json
  │
  ├── push-to-github.bat               # 1-Click script to push code to GitHub
  ├── .gitignore                       # Clean Git exclusion rules
  └── README.md
```

---

## 🚀 How to Run the Backend Server

The backend is built with a zero-external-dependency architecture on Node.js native HTTP modules, which means it starts instantly without needing `npm install`:

```bash
# Start backend server
node backend/src/server.js
```

Backend will be active at: `http://localhost:5000/api/`

### Available API Endpoints:
- `GET  /api/health` — System status
- `GET  /api/transport/stops` — All 12 monitored Kota stops
- `GET  /api/transport/routes` — Active Kota transit lines
- `POST /api/transport/optimize` — Multi-route AI optimizer
- `GET  /api/crowd/reports` — Real-time crowd reports feed
- `POST /api/crowd/report` — Submit new crowd report
- `GET  /api/crowd/density` — City-wide crowd summary
- `GET  /api/predict` — AI prediction for upcoming hours
- `GET  /api/admin/stats` — Admin metrics and moderation queue
