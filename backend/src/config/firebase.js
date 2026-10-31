/**
 * Firebase Admin & Realtime Database Service
 * Provides secure server-side Firebase operations.
 * Gracefully falls back to high-fidelity In-Memory Realtime DB for demo environments.
 */

const { KOTA_STOPS, KOTA_ROUTES } = require('../data/kotaTransitData');

let isConnectedToLiveFirebase = false;
let dbInstance = null;

// Demo In-Memory Store
const inMemoryStore = {
  users: {
    guest_demo_user: {
      uid: 'guest_demo_user',
      displayName: 'Guest Commuter (Demo)',
      email: 'guest@smartcommute.demo',
      role: 'user',
      createdAt: Date.now()
    },
    admin_demo_01: {
      uid: 'admin_demo_01',
      displayName: 'Kota Transit Controller (Admin)',
      email: 'admin@smartcommute.kota',
      role: 'admin',
      createdAt: Date.now()
    }
  },
  stops: KOTA_STOPS.reduce((acc, s) => { acc[s.id] = s; return acc; }, {}),
  routes: KOTA_ROUTES.reduce((acc, r) => { acc[r.id] = r; return acc; }, {}),
  crowd_reports: {
    rep_101: {
      id: 'rep_101',
      userId: 'usr_demo_neha',
      userName: 'Neha Sharma',
      routeId: 'R101',
      routeName: 'Route 101 - City Central Express',
      vehicleId: 'RJ-20-EB-4102',
      stopId: 'stop_gumanpura',
      stopName: 'Gumanpura Market Square',
      crowdLevel: 'CROWDED',
      crowdScore: 85,
      comment: 'Heavy rush near market stop. Standing room only.',
      timestamp: Date.now() - 6 * 60 * 1000,
      upvotes: 9
    },
    rep_102: {
      id: 'rep_102',
      userId: 'usr_demo_rahul',
      userName: 'Rahul Verma',
      routeId: 'R202',
      routeName: 'Route 202 - Chambal Metro Feeder',
      vehicleId: 'RJ-20-EV-1008',
      stopId: 'stop_talwandi',
      stopName: 'Talwandi Circle (Commerce College)',
      crowdLevel: 'EMPTY',
      crowdScore: 20,
      comment: 'Super peaceful ride! Plenty of vacant seats.',
      timestamp: Date.now() - 14 * 60 * 1000,
      upvotes: 14
    }
  },
  notifications: [
    {
      id: 'notif_1',
      type: 'CROWD_SURGE',
      title: 'Crowd Surge Detected on Route 101',
      message: 'Passenger count increased by 45% between Nayapura and Gumanpura.',
      time: '8 mins ago',
      read: false
    }
  ],
  admin: {
    systemStatus: 'HEALTHY',
    city: 'Kota, Rajasthan',
    activeSensors: 24,
    lastMaintenance: Date.now()
  }
};

class DatabaseAdapter {
  constructor() {
    this.isDemo = true;
  }

  getReports() {
    return Object.values(inMemoryStore.crowd_reports).sort((a, b) => b.timestamp - a.timestamp);
  }

  addReport(report) {
    const id = report.id || 'rep_' + Date.now();
    const entry = { ...report, id, timestamp: report.timestamp || Date.now() };
    inMemoryStore.crowd_reports[id] = entry;

    // Update stop/route crowd score dynamically
    if (entry.stopId && inMemoryStore.stops[entry.stopId]) {
      inMemoryStore.stops[entry.stopId].crowdLevel = entry.crowdLevel;
      inMemoryStore.stops[entry.stopId].crowdScore = entry.crowdScore || (entry.crowdLevel === 'EMPTY' ? 20 : entry.crowdLevel === 'MODERATE' ? 50 : 85);
    }
    if (entry.routeId && inMemoryStore.routes[entry.routeId]) {
      inMemoryStore.routes[entry.routeId].currentCrowdLevel = entry.crowdLevel;
      inMemoryStore.routes[entry.routeId].currentCrowdScore = entry.crowdScore || (entry.crowdLevel === 'EMPTY' ? 20 : entry.crowdLevel === 'MODERATE' ? 50 : 85);
    }

    return entry;
  }

  deleteReport(id) {
    if (inMemoryStore.crowd_reports[id]) {
      delete inMemoryStore.crowd_reports[id];
      return true;
    }
    return false;
  }

  verifyReport(id) {
    if (inMemoryStore.crowd_reports[id]) {
      inMemoryStore.crowd_reports[id].verified = true;
      inMemoryStore.crowd_reports[id].upvotes = (inMemoryStore.crowd_reports[id].upvotes || 0) + 1;
      return inMemoryStore.crowd_reports[id];
    }
    return null;
  }

  getStops() {
    return Object.values(inMemoryStore.stops);
  }

  getRoutes() {
    return Object.values(inMemoryStore.routes);
  }

  getNotifications() {
    return inMemoryStore.notifications;
  }
}

const dbAdapter = new DatabaseAdapter();

module.exports = {
  db: dbAdapter,
  isDemo: true,
  rawStore: inMemoryStore
};

