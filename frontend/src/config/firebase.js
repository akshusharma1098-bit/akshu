/**
 * Firebase Client Configuration for SmartCommute
 * Reads credentials from environment variables safely.
 * Includes seamless Demo/Offline synchronization fallback when credentials are not yet supplied.
 */

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'smartcommute-demo.firebaseapp.com',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || 'https://smartcommute-demo-default-rtdb.firebaseio.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'smartcommute-demo',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'smartcommute-demo.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.apiKey !== ''
);

// Fallback Realtime Database client for Demo Mode
class DemoRealtimeDB {
  constructor() {
    this.listeners = {};
    this.store = {
      crowd_reports: {},
      routes: {},
      stops: {},
      notifications: {}
    };
  }

  ref(path) {
    const self = this;
    return {
      push: (data) => {
        const id = 'rep_' + Date.now();
        const fullData = { ...data, id };
        if (!self.store[path]) self.store[path] = {};
        self.store[path][id] = fullData;
        self.trigger(path, self.store[path]);
        return Promise.resolve({ key: id });
      },
      set: (data) => {
        self.store[path] = data;
        self.trigger(path, data);
        return Promise.resolve();
      },
      on: (event, callback) => {
        if (!self.listeners[path]) self.listeners[path] = [];
        self.listeners[path].push(callback);
        // Immediate emit
        callback({
          val: () => self.store[path] || {}
        });
      },
      off: (event, callback) => {
        if (self.listeners[path]) {
          self.listeners[path] = self.listeners[path].filter(cb => cb !== callback);
        }
      }
    };
  }

  trigger(path, value) {
    if (this.listeners[path]) {
      this.listeners[path].forEach(cb => {
        try {
          cb({ val: () => value });
        } catch (e) {
          console.warn('Listener error', e);
        }
      });
    }
  }
}

export const demoDb = new DemoRealtimeDB();
export { firebaseConfig };

