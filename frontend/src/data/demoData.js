/**
 * SmartCommute - Kota, Rajasthan Public Transport Demo Dataset
 * Realistic coordinates, stops, bus/metro feeder lines, and sample crowd metrics.
 */

export const KOTA_STOPS = [
  {
    id: 'stop_kota_jn',
    name: 'Kota Junction Railway Station',
    type: 'railway',
    code: 'KOTA-JN',
    lat: 25.2138,
    lng: 75.8648,
    crowdLevel: 'CROWDED', // high morning arrivals
    crowdScore: 82,
    routesServing: ['R101', 'R303'],
    waitingPassengers: 64,
    nextVehicleInMin: 3
  },
  {
    id: 'stop_nayapura',
    name: 'Nayapura Central Bus Stand',
    type: 'bus_terminal',
    code: 'NYP-01',
    lat: 25.1868,
    lng: 75.8450,
    crowdLevel: 'MODERATE',
    crowdScore: 54,
    routesServing: ['R101', 'R202', 'R303', 'R404'],
    waitingPassengers: 28,
    nextVehicleInMin: 4
  },
  {
    id: 'stop_cad_circle',
    name: 'CAD Circle (Chambal Area)',
    type: 'bus_stop',
    code: 'CAD-02',
    lat: 25.1789,
    lng: 75.8441,
    crowdLevel: 'EMPTY',
    crowdScore: 24,
    routesServing: ['R101', 'R202'],
    waitingPassengers: 8,
    nextVehicleInMin: 7
  },
  {
    id: 'stop_gumanpura',
    name: 'Gumanpura Market Square',
    type: 'bus_stop',
    code: 'GMP-03',
    lat: 25.1745,
    lng: 75.8385,
    crowdLevel: 'CROWDED',
    crowdScore: 78,
    routesServing: ['R101'],
    waitingPassengers: 42,
    nextVehicleInMin: 5
  },
  {
    id: 'stop_aerodrome',
    name: 'Aerodrome Circle Interchange',
    type: 'metro_junction',
    code: 'AER-04',
    lat: 25.1612,
    lng: 75.8361,
    crowdLevel: 'MODERATE',
    crowdScore: 58,
    routesServing: ['R101', 'R202', 'R303'],
    waitingPassengers: 31,
    nextVehicleInMin: 2
  },
  {
    id: 'stop_dadabari',
    name: 'Dadabari Chauraha',
    type: 'bus_stop',
    code: 'DDB-05',
    lat: 25.1558,
    lng: 75.8242,
    crowdLevel: 'EMPTY',
    crowdScore: 22,
    routesServing: ['R202'],
    waitingPassengers: 11,
    nextVehicleInMin: 9
  },
  {
    id: 'stop_vigyan_nagar',
    name: 'Vigyan Nagar Main Gate',
    type: 'bus_stop',
    code: 'VGN-06',
    lat: 25.1432,
    lng: 75.8315,
    crowdLevel: 'MODERATE',
    crowdScore: 49,
    routesServing: ['R101', 'R404'],
    waitingPassengers: 25,
    nextVehicleInMin: 6
  },
  {
    id: 'stop_talwandi',
    name: 'Talwandi Circle (Commerce College)',
    type: 'bus_stop',
    code: 'TLW-07',
    lat: 25.1384,
    lng: 75.8427,
    crowdLevel: 'EMPTY',
    crowdScore: 19,
    routesServing: ['R202', 'R303', 'R404'],
    waitingPassengers: 7,
    nextVehicleInMin: 5
  },
  {
    id: 'stop_mahaveer_nagar',
    name: 'Mahaveer Nagar Coaching Corridor',
    type: 'bus_stop',
    code: 'MHN-08',
    lat: 25.1350,
    lng: 75.8350,
    crowdLevel: 'CROWDED',
    crowdScore: 88,
    routesServing: ['R101', 'R404'],
    waitingPassengers: 55,
    nextVehicleInMin: 4
  },
  {
    id: 'stop_landmark_city',
    name: 'Landmark City (Kunhari Hub)',
    type: 'bus_terminal',
    code: 'LND-09',
    lat: 25.2155,
    lng: 75.8175,
    crowdLevel: 'MODERATE',
    crowdScore: 61,
    routesServing: ['R202', 'R404'],
    waitingPassengers: 37,
    nextVehicleInMin: 8
  },
  {
    id: 'stop_medical_college',
    name: 'Medical College & Rangbari Hospital',
    type: 'bus_stop',
    code: 'MED-10',
    lat: 25.1275,
    lng: 75.8282,
    crowdLevel: 'EMPTY',
    crowdScore: 28,
    routesServing: ['R202', 'R303'],
    waitingPassengers: 14,
    nextVehicleInMin: 6
  },
  {
    id: 'stop_keshavpura',
    name: 'Keshavpura Sector 7',
    type: 'bus_stop',
    code: 'KSH-11',
    lat: 25.1481,
    lng: 75.8488,
    crowdLevel: 'EMPTY',
    crowdScore: 18,
    routesServing: ['R303'],
    waitingPassengers: 6,
    nextVehicleInMin: 11
  }
];

export const KOTA_ROUTES = [
  {
    id: 'R101',
    name: 'Route 101 - City Central Express',
    type: 'City Bus',
    badgeColor: '#2563EB',
    from: 'Kota Junction Railway Station',
    to: 'Mahaveer Nagar Coaching Corridor',
    distanceKm: 12.4,
    baseDurationMin: 32,
    currentCrowdLevel: 'CROWDED',
    currentCrowdScore: 84,
    stopsCount: 7,
    fare: 20,
    frequencyMin: 6,
    activeVehicles: ['RJ-20-EB-4102', 'RJ-20-EB-4115'],
    stopIds: [
      'stop_kota_jn',
      'stop_cad_circle',
      'stop_nayapura',
      'stop_gumanpura',
      'stop_aerodrome',
      'stop_vigyan_nagar',
      'stop_mahaveer_nagar'
    ],
    predictedCrowdNextHour: 'MODERATE',
    recommendationReason: 'Direct route but high passenger density during current hours.'
  },
  {
    id: 'R202',
    name: 'Route 202 - Chambal Metro Feeder',
    type: 'AC Electric Feeder',
    badgeColor: '#0D9488',
    from: 'Landmark City (Kunhari Hub)',
    to: 'Medical College & Rangbari Hospital',
    distanceKm: 14.8,
    baseDurationMin: 38,
    currentCrowdLevel: 'EMPTY',
    currentCrowdScore: 26,
    stopsCount: 6,
    fare: 25,
    frequencyMin: 8,
    activeVehicles: ['RJ-20-EV-1008', 'RJ-20-EV-1021'],
    stopIds: [
      'stop_landmark_city',
      'stop_nayapura',
      'stop_cad_circle',
      'stop_dadabari',
      'stop_talwandi',
      'stop_medical_college'
    ],
    predictedCrowdNextHour: 'EMPTY',
    recommendationReason: 'Recommended: 65% less crowded, comfortable seating and AC.'
  },
  {
    id: 'R303',
    name: 'Route 303 - Green Ring Rapid Shuttle',
    type: 'Rapid Shuttle',
    badgeColor: '#10B981',
    from: 'Kota Junction Railway Station',
    to: 'Medical College & Rangbari Hospital',
    distanceKm: 15.2,
    baseDurationMin: 34,
    currentCrowdLevel: 'MODERATE',
    currentCrowdScore: 48,
    stopsCount: 5,
    fare: 22,
    frequencyMin: 10,
    activeVehicles: ['RJ-20-RS-9011'],
    stopIds: [
      'stop_kota_jn',
      'stop_nayapura',
      'stop_aerodrome',
      'stop_keshavpura',
      'stop_talwandi',
      'stop_medical_college'
    ],
    predictedCrowdNextHour: 'MODERATE',
    recommendationReason: 'Balanced choice with moderate seating availability and quick bypass.'
  },
  {
    id: 'R404',
    name: 'Route 404 - Coaching Hub Student Express',
    type: 'Student Special Bus',
    badgeColor: '#F59E0B',
    from: 'Landmark City (Kunhari Hub)',
    to: 'Mahaveer Nagar Coaching Corridor',
    distanceKm: 11.5,
    baseDurationMin: 29,
    currentCrowdLevel: 'CROWDED',
    currentCrowdScore: 91,
    stopsCount: 5,
    fare: 15,
    frequencyMin: 5,
    activeVehicles: ['RJ-20-ST-7703', 'RJ-20-ST-7719'],
    stopIds: [
      'stop_landmark_city',
      'stop_nayapura',
      'stop_vigyan_nagar',
      'stop_talwandi',
      'stop_mahaveer_nagar'
    ],
    predictedCrowdNextHour: 'CROWDED',
    recommendationReason: 'Extremely popular with coaching students. Standing room only.'
  }
];

export const INITIAL_CROWD_REPORTS = [
  {
    id: 'rep_101',
    userId: 'usr_demo_neha',
    userName: 'Neha Sharma',
    userBadge: 'Verified Commuter',
    routeId: 'R101',
    routeName: 'Route 101 - City Central Express',
    vehicleId: 'RJ-20-EB-4102',
    stopId: 'stop_gumanpura',
    stopName: 'Gumanpura Market Square',
    crowdLevel: 'CROWDED', // CROWDED (Red)
    crowdScore: 85,
    comment: 'Heavy rush near market stop. No seats available, passengers standing.',
    timestamp: Date.now() - 6 * 60 * 1000, // 6 mins ago
    upvotes: 9
  },
  {
    id: 'rep_102',
    userId: 'usr_demo_rahul',
    userName: 'Rahul Verma',
    userBadge: 'Daily Rider',
    routeId: 'R202',
    routeName: 'Route 202 - Chambal Metro Feeder',
    vehicleId: 'RJ-20-EV-1008',
    stopId: 'stop_talwandi',
    stopName: 'Talwandi Circle (Commerce College)',
    crowdLevel: 'EMPTY', // EMPTY (Green)
    crowdScore: 20,
    comment: 'Super peaceful ride! More than 15 window seats vacant.',
    timestamp: Date.now() - 14 * 60 * 1000, // 14 mins ago
    upvotes: 14
  },
  {
    id: 'rep_103',
    userId: 'usr_demo_amit',
    userName: 'Amit Meena',
    userBadge: 'Student Commuter',
    routeId: 'R303',
    routeName: 'Route 303 - Green Ring Rapid Shuttle',
    vehicleId: 'RJ-20-RS-9011',
    stopId: 'stop_aerodrome',
    stopName: 'Aerodrome Circle Interchange',
    crowdLevel: 'MODERATE', // MODERATE (Yellow)
    crowdScore: 50,
    comment: 'Almost all seats filled, but comfortable standing space near front door.',
    timestamp: Date.now() - 25 * 60 * 1000, // 25 mins ago
    upvotes: 5
  },
  {
    id: 'rep_104',
    userId: 'usr_demo_priya',
    userName: 'Priya Joshi',
    userBadge: 'Active Reporter',
    routeId: 'R404',
    routeName: 'Route 404 - Coaching Hub Student Express',
    vehicleId: 'RJ-20-ST-7703',
    stopId: 'stop_landmark_city',
    stopName: 'Landmark City (Kunhari Hub)',
    crowdLevel: 'CROWDED',
    crowdScore: 92,
    comment: 'Massive rush as batch just ended at Kunhari. Take Route 202 instead!',
    timestamp: Date.now() - 32 * 60 * 1000,
    upvotes: 21
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'CROWD_SURGE',
    title: 'Crowd Surge Detected on Route 101',
    message: 'Passenger count increased by 45% between Nayapura and Gumanpura. Route 303 recommended as a faster, less-crowded alternative.',
    time: '8 mins ago',
    read: false,
    severity: 'high'
  },
  {
    id: 'notif_2',
    type: 'SMART_RECOMMENDATION',
    title: 'Beat the Rush: Departure Optimization',
    message: 'If you leave in 15 minutes, Route 202 offers 70% chance of comfortable seating according to the AI Prediction Engine.',
    time: '22 mins ago',
    read: false,
    severity: 'medium'
  },
  {
    id: 'notif_3',
    type: 'COMMUNITY_REPORT',
    title: 'Thank you for your crowd report!',
    message: 'Your report for Talwandi Circle helped 38 fellow commuters find comfortable seats today.',
    time: '1 hour ago',
    read: true,
    severity: 'low'
  },
  {
    id: 'notif_4',
    type: 'SYSTEM_UPDATE',
    title: 'Kota Transit Network Demo Mode Active',
    message: 'SmartCommute AI engine is running in high-fidelity demo mode with 12 Kota transit stops and 4 active transit lines.',
    time: '2 hours ago',
    read: true,
    severity: 'info'
  }
];

export const HISTORICAL_HOURLY_PATTERNS = {
  weekday: {
    6: { crowdLevel: 'EMPTY', score: 15 },
    7: { crowdLevel: 'MODERATE', score: 45 },
    8: { crowdLevel: 'CROWDED', score: 85 }, // Morning rush
    9: { crowdLevel: 'CROWDED', score: 92 }, // Morning coaching + office rush
    10: { crowdLevel: 'MODERATE', score: 62 },
    11: { crowdLevel: 'MODERATE', score: 40 },
    12: { crowdLevel: 'MODERATE', score: 48 },
    13: { crowdLevel: 'CROWDED', score: 78 }, // Student shift change
    14: { crowdLevel: 'MODERATE', score: 55 },
    15: { crowdLevel: 'EMPTY', score: 30 },
    16: { crowdLevel: 'MODERATE', score: 45 },
    17: { crowdLevel: 'CROWDED', score: 88 }, // Evening coaching dispersal
    18: { crowdLevel: 'CROWDED', score: 94 }, // Peak evening rush
    19: { crowdLevel: 'CROWDED', score: 82 },
    20: { crowdLevel: 'MODERATE', score: 58 },
    21: { crowdLevel: 'EMPTY', score: 32 },
    22: { crowdLevel: 'EMPTY', score: 18 }
  },
  weekend: {
    6: { crowdLevel: 'EMPTY', score: 10 },
    8: { crowdLevel: 'EMPTY', score: 25 },
    10: { crowdLevel: 'MODERATE', score: 40 },
    12: { crowdLevel: 'MODERATE', score: 50 },
    14: { crowdLevel: 'MODERATE', score: 45 },
    16: { crowdLevel: 'MODERATE', score: 55 },
    18: { crowdLevel: 'MODERATE', score: 65 },
    20: { crowdLevel: 'MODERATE', score: 60 },
    22: { crowdLevel: 'EMPTY', score: 20 }
  }
};

