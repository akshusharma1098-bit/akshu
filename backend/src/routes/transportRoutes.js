const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const routeOptimizer = require('../engine/routeOptimizer');

// GET /api/transport/stops - Monitored Kota stops
router.get('/stops', (req, res) => {
  const stops = db.getStops();
  res.json({
    success: true,
    count: stops.length,
    stops
  });
});

// GET /api/transport/routes - Kota transit routes
router.get('/routes', (req, res) => {
  const routes = db.getRoutes();
  res.json({
    success: true,
    count: routes.length,
    routes
  });
});

// POST /api/transport/optimize - AI Route Optimization
router.post('/optimize', (req, res) => {
  const { origin, destination, preference } = req.body;
  const liveReports = db.getReports();

  const results = routeOptimizer.findOptimizedRoutes({
    origin: origin || 'Landmark City (Kunhari Hub)',
    destination: destination || 'Medical College & Rangbari Hospital',
    preference: preference || 'least_crowded',
    liveReports
  });

  res.json({
    success: true,
    ...results
  });
});

// GET /api/transport/notifications - Transit alerts
router.get('/notifications', (req, res) => {
  const notifs = db.getNotifications();
  res.json({
    success: true,
    notifications: notifs
  });
});

module.exports = router;

