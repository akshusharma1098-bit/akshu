/**
 * Kota Transit Master Dataset
 * Kota, Rajasthan Public Transportation Network
 */

const KOTA_STOPS = [
  {
    id: 'stop_kota_jn',
    name: 'Kota Junction Railway Station',
    type: 'railway',
    code: 'KOTA-JN',
    lat: 25.2138,
    lng: 75.8648,
    crowdLevel: 'CROWDED',
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

const KOTA_ROUTES = [
  {
    id: 'R101',
    name: 'Route 101 - City Central Express',
    type: 'City Bus',
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
    ]
  },
  {
    id: 'R202',
    name: 'Route 202 - Chambal Metro Feeder',
    type: 'AC Electric Feeder',
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
    ]
  },
  {
    id: 'R303',
    name: 'Route 303 - Green Ring Rapid Shuttle',
    type: 'Rapid Shuttle',
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
    ]
  },
  {
    id: 'R404',
    name: 'Route 404 - Coaching Hub Student Express',
    type: 'Student Special Bus',
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
    ]
  }
];

const HISTORICAL_CROWD_PATTERNS = {
  weekday: {
    6: 18, 7: 42, 8: 84, 9: 92, 10: 64, 11: 42,
    12: 48, 13: 80, 14: 56, 15: 32, 16: 46, 17: 86,
    18: 94, 19: 82, 20: 58, 21: 34, 22: 20
  },
  weekend: {
    6: 10, 7: 20, 8: 30, 9: 45, 10: 48, 11: 40,
    12: 50, 13: 45, 14: 42, 15: 48, 16: 55, 17: 64,
    18: 68, 19: 62, 20: 54, 21: 30, 22: 18
  }
};

module.exports = {
  KOTA_STOPS,
  KOTA_ROUTES,
  HISTORICAL_CROWD_PATTERNS
};

