const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const predictionEngine = require('../engine/predictionEngine');

// GET /api/predict - Forecast crowd levels for route or stop
router.get('/', (req, res) => {
  const { routeId, stopId, offsetHours } = req.query;

  const targetDate = new Date();
  if (offsetHours) {
    targetDate.setHours(targetDate.getHours() + parseInt(offsetHours, 10));
  }

  const liveReports = db.getReports();

  const prediction = predictionEngine.predict({
    routeId,
    stopId,
    targetTime: targetDate,
    recentReports: liveReports
  });

  res.json({
    success: true,
    targetTime: targetDate.toISOString(),
    routeId: routeId || null,
    stopId: stopId || null,
    prediction
  });
});

module.exports = router;

