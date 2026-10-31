/**
 * SmartCommute Crowd Prediction Engine
 * Synthesizes historical time-series matrices, day-of-week trends,
 * time-decayed community reports, and occupancy factors.
 * Ready for TensorFlow/ONNX ML model integration.
 */

const { HISTORICAL_CROWD_PATTERNS } = require('../data/kotaTransitData');

class PredictionEngine {
  constructor() {
    this.decayConstantMinutes = 35; // Exponential decay constant for crowd reports
    this.minimumRequiredReports = 1; // Threshold for sufficient data
  }

  /**
   * Predicts crowd level for a given route/stop and target time
   * @param {Object} params
   * @param {string} params.routeId
   * @param {string} params.stopId
   * @param {Date} params.targetTime
   * @param {Array} params.recentReports
   * @param {number} params.currentOccupancy
   * @returns {Object} Prediction result
   */
  predict({ routeId, stopId, targetTime = new Date(), recentReports = [], currentOccupancy = null }) {
    const day = targetTime.getDay();
    const isWeekend = day === 0 || day === 6;
    const hour = targetTime.getHours();

    const patternKey = isWeekend ? 'weekend' : 'weekday';
    const historicalHourScore = HISTORICAL_CROWD_PATTERNS[patternKey][hour] ?? 50;

    // Filter reports relevant to this route or stop within last 90 minutes
    const now = Date.now();
    const relevantReports = recentReports.filter(rep => {
      const isMatch = (routeId && rep.routeId === routeId) || (stopId && rep.stopId === stopId);
      const isFresh = (now - rep.timestamp) <= 90 * 60 * 1000;
      return isMatch && isFresh;
    });

    // Check insufficient data criteria
    if (relevantReports.length === 0 && historicalHourScore === undefined) {
      return {
        status: 'INSUFFICIENT_DATA',
        insufficientData: true,
        message: 'Insufficient data to compute confident crowd prediction for this interval.',
        confidence: 0
      };
    }

    // 1. Calculate Time-Decayed Live Crowd Report Score
    let decayedReportScore = null;
    let totalWeight = 0;

    if (relevantReports.length > 0) {
      let weightedSum = 0;
      relevantReports.forEach(rep => {
        const ageMinutes = Math.max(0, (now - rep.timestamp) / 60000);
        // Exponential decay: w = exp(-age / tau)
        const weight = Math.exp(-ageMinutes / this.decayConstantMinutes);
        weightedSum += (rep.crowdScore || (rep.crowdLevel === 'EMPTY' ? 20 : rep.crowdLevel === 'MODERATE' ? 50 : 85)) * weight;
        totalWeight += weight;
      });

      if (totalWeight > 0) {
        decayedReportScore = weightedSum / totalWeight;
      }
    }

    // 2. Synthesize Composite Score
    let finalScore = 0;
    let confidence = 70;

    if (decayedReportScore !== null) {
      // Both live reports and historical patterns exist
      const liveWeight = 0.55;
      const histWeight = 0.35;
      const occWeight = 0.10;

      const occScore = currentOccupancy !== null ? currentOccupancy : decayedReportScore;
      finalScore = (decayedReportScore * liveWeight) + (historicalHourScore * histWeight) + (occScore * occWeight);
      confidence = Math.min(96, 75 + (relevantReports.length * 4));
    } else {
      // Historical baseline only (predicted crowd)
      finalScore = historicalHourScore;
      confidence = 68;
    }

    finalScore = Math.round(Math.max(5, Math.min(98, finalScore)));

    // Categorize
    const crowdLevel = finalScore < 35 ? 'EMPTY' : (finalScore <= 68 ? 'MODERATE' : 'CROWDED');

    // Generate upcoming 4 hours forecast
    const forecast = [];
    for (let i = 0; i <= 4; i++) {
      const forecastHour = (hour + i) % 24;
      const baseH = HISTORICAL_CROWD_PATTERNS[patternKey][forecastHour] ?? 50;
      // Damped decay forward in time
      const score = Math.round(i === 0 ? finalScore : (finalScore * Math.exp(-i * 0.4) + baseH * (1 - Math.exp(-i * 0.4))));
      const lvl = score < 35 ? 'EMPTY' : (score <= 68 ? 'MODERATE' : 'CROWDED');
      
      const timeStr = new Date(targetTime.getTime() + i * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      forecast.push({
        interval: i === 0 ? 'Now' : `+${i}h`,
        timeLabel: timeStr,
        level: lvl,
        score,
        isLive: i === 0 && relevantReports.length > 0
      });
    }

    return {
      status: 'SUCCESS',
      insufficientData: false,
      crowdLevel,
      crowdScore: finalScore,
      confidence,
      source: relevantReports.length > 0 ? 'HYBRID_LIVE_AND_HISTORICAL' : 'HISTORICAL_MODEL',
      hasLiveReports: relevantReports.length > 0,
      forecast
    };
  }

  /**
   * ML Extensibility Hook
   * Prepares feature vector for future Python/TF model deployment
   */
  exportFeatureVector({ routeId, hour, day, temperature = 30, rain = false }) {
    return {
      route_encoded: routeId,
      hour_norm: hour / 24,
      day_of_week: day,
      weather_factor: rain ? 1.25 : 1.0,
      timestamp: Date.now()
    };
  }
}

module.exports = new PredictionEngine();

