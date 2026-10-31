/**
 * SmartCommute Route Optimizer
 * Evaluates candidate transit paths balancing travel duration and crowd density.
 */

const { KOTA_ROUTES, KOTA_STOPS } = require('../data/kotaTransitData');
const predictionEngine = require('./predictionEngine');

class RouteOptimizer {
  /**
   * Find and rank routes between origin and destination
   * @param {Object} query
   * @param {string} query.origin
   * @param {string} query.destination
   * @param {string} query.preference - 'least_crowded' | 'balanced' | 'fastest'
   * @param {Array} query.liveReports
   */
  findOptimizedRoutes({ origin, destination, preference = 'least_crowded', liveReports = [] }) {
    // Collect candidate routes
    const candidates = KOTA_ROUTES.map(route => {
      // Calculate prediction for current time and arrival time
      const now = new Date();
      const currentPred = predictionEngine.predict({
        routeId: route.id,
        targetTime: now,
        recentReports: liveReports
      });

      const arrivalTime = new Date(now.getTime() + (route.baseDurationMin * 60000));
      const arrivalPred = predictionEngine.predict({
        routeId: route.id,
        targetTime: arrivalTime,
        recentReports: liveReports
      });

      // Weightings based on preference
      let timeWeight = 0.4;
      let crowdWeight = 0.6;

      if (preference === 'fastest') {
        timeWeight = 0.85;
        crowdWeight = 0.15;
      } else if (preference === 'least_crowded') {
        timeWeight = 0.25;
        crowdWeight = 0.75;
      }

      // Penalty function: lower is better
      const penalty = (route.baseDurationMin * timeWeight) + (arrivalPred.crowdScore * crowdWeight);

      return {
        ...route,
        currentCrowdLevel: currentPred.crowdLevel,
        currentCrowdScore: currentPred.crowdScore,
        estimatedArrivalCrowd: arrivalPred.crowdLevel,
        arrivalCrowdScore: arrivalPred.crowdScore,
        penaltyScore: Math.round(penalty),
        confidence: arrivalPred.confidence
      };
    });

    // Sort by penalty score (lowest penalty = best recommendation)
    candidates.sort((a, b) => a.penaltyScore - b.penaltyScore);

    // Annotate the best recommendation
    if (candidates.length > 0) {
      candidates[0].isRecommended = true;
      candidates[0].recommendationBadge = 'AI RECOMMENDED';
      candidates[0].recommendationReason = `Optimal choice: ${100 - candidates[0].currentCrowdScore}% seating probability with only ${candidates[0].baseDurationMin} mins commute.`;
    }

    return {
      totalFound: candidates.length,
      preferenceApplied: preference,
      routes: candidates
    };
  }
}

module.exports = new RouteOptimizer();

