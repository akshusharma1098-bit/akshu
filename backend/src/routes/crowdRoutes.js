const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { spamGuard } = require('../middleware/rateLimiter');
const predictionEngine = require('../engine/predictionEngine');

// GET /api/crowd/reports - List live crowd reports
router.get('/reports', (req, res) => {
  const reports = db.getReports();
  res.json({
    success: true,
    count: reports.length,
    reports
  });
});

// POST /api/crowd/report - Submit a crowd report (with anti-spam rate limiting)
router.post('/report', spamGuard, (req, res) => {
  const { routeId, routeName, stopId, stopName, vehicleId, crowdLevel, comment, userId, userName } = req.body;

  if (!crowdLevel || !['EMPTY', 'MODERATE', 'CROWDED'].includes(crowdLevel.toUpperCase())) {
    return res.status(400).json({
      success: false,
      error: 'INVALID_CROWD_LEVEL',
      message: 'Crowd level must be EMPTY, MODERATE, or CROWDED.'
    });
  }

  const normalizedLevel = crowdLevel.toUpperCase();
  const crowdScore = normalizedLevel === 'EMPTY' ? 20 : (normalizedLevel === 'MODERATE' ? 50 : 85);

  const report = db.addReport({
    userId: userId || 'usr_anon',
    userName: userName || 'Kota Commuter',
    routeId: routeId || 'R101',
    routeName: routeName || 'City Bus',
    stopId: stopId || 'stop_nayapura',
    stopName: stopName || 'Nayapura Stand',
    vehicleId: vehicleId || 'RJ-20-EB-4102',
    crowdLevel: normalizedLevel,
    crowdScore,
    comment: comment || '',
    upvotes: 1
  });

  res.status(201).json({
    success: true,
    message: 'Crowd report broadcasted live to network.',
    report
  });
});

// GET /api/crowd/density - Overall city crowd density summary
router.get('/density', (req, res) => {
  const reports = db.getReports();
  const stops = db.getStops();
  const routes = db.getRoutes();

  let totalScore = 0;
  routes.forEach(r => totalScore += (r.currentCrowdScore || 50));
  const avgDensity = Math.round(totalScore / (routes.length || 1));

  res.json({
    success: true,
    city: 'Kota, Rajasthan',
    averageDensity: avgDensity,
    overallStatus: avgDensity < 35 ? 'EMPTY' : (avgDensity < 70 ? 'MODERATE' : 'CROWDED'),
    totalActiveVehicles: 32,
    totalReportsToday: reports.length + 860
  });
});

module.exports = router;

