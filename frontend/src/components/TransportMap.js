import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS, RADIUS, SHADOWS, CROWD_CONFIG } from '../config/theme';
import { KOTA_STOPS, KOTA_ROUTES } from '../data/demoData';

export default function TransportMap({
  stops = KOTA_STOPS,
  routes = KOTA_ROUTES,
  selectedStop = null,
  onSelectStop,
  onReportForStop
}) {
  const [filterCrowd, setFilterCrowd] = useState('ALL');
  const [activeStop, setActiveStop] = useState(selectedStop || stops[0]);

  // Filter stops according to crowd indicator
  const filteredStops = stops.filter(stop => {
    if (filterCrowd === 'ALL') return true;
    return stop.crowdLevel === filterCrowd;
  });

  // Generate Leaflet HTML embed
  const leafletHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #map { height: 100%; width: 100%; background: #f1f5f9; }
    .custom-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.35);
      cursor: pointer;
      font-weight: 800;
      color: white;
      font-size: 11px;
      transition: transform 0.2s ease;
    }
    .custom-marker:hover {
      transform: scale(1.2);
    }
    .marker-green { background: #10B981; }
    .marker-yellow { background: #F59E0B; }
    .marker-red { background: #EF4444; }
    .pulse-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      animation: pulsate 2s infinite ease-out;
      opacity: 0;
    }
    @keyframes pulsate {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    .leaflet-popup-content-wrapper {
      border-radius: 14px;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
      padding: 4px;
    }
    .popup-box {
      font-family: inherit;
      padding: 6px 4px;
      min-width: 180px;
    }
    .popup-header {
      font-size: 13px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 4px;
    }
    .popup-type {
      font-size: 10px;
      font-weight: 600;
      color: #64748B;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .popup-crowd-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .popup-crowd-red { background: #FEF2F2; color: #EF4444; }
    .popup-crowd-yellow { background: #FFFBEB; color: #D97706; }
    .popup-crowd-green { background: #ECFDF5; color: #059669; }
    .popup-routes {
      font-size: 11px;
      color: #334155;
      margin-bottom: 8px;
    }
    .popup-btn {
      display: block;
      width: 100%;
      text-align: center;
      background: #0D9488;
      color: white;
      padding: 6px 0;
      border-radius: 8px;
      text-decoration: none;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    // Initialize map centered at Kota, Rajasthan
    var map = L.map('map', {
      center: [25.1780, 75.8420],
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | SmartCommute Kota'
    }).addTo(map);

    var stops = ${JSON.stringify(filteredStops)};
    var routes = ${JSON.stringify(routes)};

    // Draw route polylines
    var routeColors = {
      'R101': '#2563EB',
      'R202': '#0D9488',
      'R303': '#10B981',
      'R404': '#F59E0B'
    };

    var stopsMap = {};
    stops.forEach(function(s) { stopsMap[s.id] = s; });

    routes.forEach(function(r) {
      var latlngs = [];
      if (r.stopIds) {
        r.stopIds.forEach(function(sid) {
          if (stopsMap[sid]) {
            latlngs.push([stopsMap[sid].lat, stopsMap[sid].lng]);
          }
        });
      }
      if (latlngs.length > 1) {
        L.polyline(latlngs, {
          color: routeColors[r.id] || '#64748b',
          weight: 4,
          opacity: 0.75,
          dashArray: r.id === 'R202' ? '6, 6' : null
        }).addTo(map).bindTooltip(r.name, { sticky: true });
      }
    });

    // Add Stops with colored crowd markers
    stops.forEach(function(stop) {
      var markerClass = stop.crowdLevel === 'EMPTY' ? 'marker-green' : (stop.crowdLevel === 'MODERATE' ? 'marker-yellow' : 'marker-red');
      var crowdClass = stop.crowdLevel === 'EMPTY' ? 'popup-crowd-green' : (stop.crowdLevel === 'MODERATE' ? 'popup-crowd-yellow' : 'popup-crowd-red');
      var labelIcon = stop.type === 'railway' ? '🚂' : (stop.type === 'metro_junction' ? '🚇' : '🚏');

      var customIcon = L.divIcon({
        className: '',
        html: '<div class="custom-marker ' + markerClass + '" style="width: 28px; height: 28px;">' +
                '<div class="pulse-ring ' + markerClass + '"></div>' +
                labelIcon +
              '</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      var popupContent = 
        '<div class="popup-box">' +
          '<div class="popup-header">' + stop.name + '</div>' +
          '<div class="popup-type">' + stop.code + ' • ' + stop.type.replace('_', ' ') + '</div>' +
          '<div class="popup-crowd-row ' + crowdClass + '">' +
            '<span>Crowd: <strong>' + stop.crowdLevel + '</strong></span>' +
            '<span>' + (stop.crowdScore || 50) + '%</span>' +
          '</div>' +
          '<div class="popup-routes"><strong>Routes:</strong> ' + stop.routesServing.join(', ') + '</div>' +
          '<div class="popup-routes"><strong>Next Vehicle:</strong> in ' + (stop.nextVehicleInMin || 4) + ' mins</div>' +
          '<a class="popup-btn" href="javascript:void(0)" onclick="parent.postMessage({ type: \\'SELECT_STOP\\', stopId: \\'' + stop.id + '\\' }, \\'*\\'); window.selectStopFromMap(\\'' + stop.id + '\\');">Select & Report Crowd</a>' +
        '</div>';

      var marker = L.marker([stop.lat, stop.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(popupContent);

      marker.on('click', function() {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SELECT_STOP', stopId: stop.id }));
        }
      });
    });

    window.selectStopFromMap = function(id) {
      if (window.parent) {
        window.parent.postMessage({ type: 'SELECT_STOP', stopId: id }, '*');
      }
    };
  </script>
</body>
</html>
  `;

  return (
    <View style={styles.container}>
      {/* Map Filter & Status Header */}
      <View style={styles.controlsBar}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Filter Crowd:</Text>
          {['ALL', 'EMPTY', 'MODERATE', 'CROWDED'].map(level => {
            const isSelected = filterCrowd === level;
            return (
              <TouchableOpacity
                key={level}
                onPress={() => setFilterCrowd(level)}
                style={[
                  styles.filterBtn,
                  isSelected && styles.filterBtnActive,
                  level === 'EMPTY' && styles.filterGreen,
                  level === 'MODERATE' && styles.filterYellow,
                  level === 'CROWDED' && styles.filterRed
                ]}
              >
                <Text style={[styles.filterBtnText, isSelected && styles.filterBtnTextActive]}>
                  {level === 'ALL' ? 'All (12)' : level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.legendBar}>
          <View style={styles.legendTag}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.crowdLow }]} />
            <Text style={styles.legendText}>Green = Empty</Text>
          </View>
          <View style={styles.legendTag}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.crowdModerate }]} />
            <Text style={styles.legendText}>Yellow = Mod</Text>
          </View>
          <View style={styles.legendTag}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.crowdHigh }]} />
            <Text style={styles.legendText}>Red = Packed</Text>
          </View>
        </View>
      </View>

      {/* Map Viewport Container */}
      <View style={styles.mapViewport}>
        {/* Render interactive iframe on web / webview */}
        <iframe
          title="Kota Transport Leaflet Map"
          srcDoc={leafletHtml}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </View>

      {/* Selected Stop Card */}
      {activeStop && (
        <View style={styles.selectedStopBanner}>
          <View style={styles.stopInfoGroup}>
            <Text style={styles.stopNameText}>{activeStop.name}</Text>
            <Text style={styles.stopMetaText}>
              Lines: {activeStop.routesServing?.join(', ')} • Next: {activeStop.nextVehicleInMin} min • Waiting: {activeStop.waitingPassengers}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => {
              if (onReportForStop) onReportForStop(activeStop);
            }}
          >
            <Text style={styles.reportBtnText}>+ Report Crowd</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md
  },
  controlsBar: {
    padding: 10,
    backgroundColor: COLORS.cardMuted,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 6
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  filterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  filterGreen: {
    borderColor: '#A7F3D0'
  },
  filterYellow: {
    borderColor: '#FDE68A'
  },
  filterRed: {
    borderColor: '#FECACA'
  },
  filterBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  filterBtnTextActive: {
    color: COLORS.textWhite
  },
  legendBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2
  },
  legendTag: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 4
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  mapViewport: {
    height: 340,
    width: '100%',
    backgroundColor: '#E2E8F0'
  },
  selectedStopBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  stopInfoGroup: {
    flex: 1,
    marginRight: 10
  },
  stopNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  stopMetaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  reportBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm
  },
  reportBtnText: {
    color: COLORS.textWhite,
    fontSize: 11,
    fontWeight: '700'
  }
});

