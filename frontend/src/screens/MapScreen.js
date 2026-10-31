import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../config/theme';
import Header from '../components/Header';
import TransportMap from '../components/TransportMap';
import CrowdBadge from '../components/CrowdBadge';
import { KOTA_STOPS, KOTA_ROUTES } from '../data/demoData';

export default function MapScreen({
  onNavigate,
  onOpenReportModal,
  selectedStop = null,
  onSelectStop
}) {
  const [activeStop, setActiveStop] = useState(selectedStop || KOTA_STOPS[0]);
  const [activeRouteFilter, setActiveRouteFilter] = useState('ALL');

  const handleStopSelected = (stop) => {
    setActiveStop(stop);
    if (onSelectStop) onSelectStop(stop);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Transport Map"
        subtitle="Kota Transit Network"
        showBack={true}
        onBack={() => onNavigate('dashboard')}
        onPressNotifications={() => onNavigate('notifications')}
        onPressProfile={() => onNavigate('profile')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map Information Tag */}
        <View style={styles.mapInfoPill}>
          <Text style={styles.infoPillText}>
            🟢 Low Crowd &nbsp;|&nbsp; 🟡 Moderate &nbsp;|&nbsp; 🔴 High Crowd (Tap any stop to inspect)
          </Text>
        </View>

        {/* Leaflet Map Integration */}
        <TransportMap
          stops={KOTA_STOPS}
          routes={KOTA_ROUTES}
          selectedStop={activeStop}
          onSelectStop={handleStopSelected}
          onReportForStop={(stop) => {
            setActiveStop(stop);
            if (onOpenReportModal) onOpenReportModal(stop);
          }}
        />

        {/* Selected Stop Details Card */}
        {activeStop && (
          <View style={styles.detailCard}>
            <View style={styles.cardHeader}>
              <View style={styles.headerTitleGroup}>
                <Text style={styles.stationName}>{activeStop.name}</Text>
                <Text style={styles.stationMeta}>
                  Code: {activeStop.code} • Category: {activeStop.type.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
              <CrowdBadge level={activeStop.crowdLevel} size="large" />
            </View>

            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricVal}>⏱️ {activeStop.nextVehicleInMin} min</Text>
                <Text style={styles.metricLab}>Next Arrival</Text>
              </View>

              <View style={styles.metricBox}>
                <Text style={styles.metricVal}>👥 {activeStop.waitingPassengers || 24}</Text>
                <Text style={styles.metricLab}>Waiting at Stop</Text>
              </View>

              <View style={styles.metricBox}>
                <Text style={styles.metricVal}>📊 {activeStop.crowdScore}%</Text>
                <Text style={styles.metricLab}>Density Index</Text>
              </View>
            </View>

            <View style={styles.routesServingBox}>
              <Text style={styles.routesServingTitle}>Active Transit Lines Serving this Stop:</Text>
              <View style={styles.routeChipsRow}>
                {activeStop.routesServing?.map(rid => {
                  const rObj = KOTA_ROUTES.find(r => r.id === rid);
                  return (
                    <TouchableOpacity
                      key={rid}
                      style={styles.linePill}
                      onPress={() => onNavigate('routes')}
                    >
                      <Text style={styles.linePillText}>{rid}: {rObj?.name || 'Line'}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              style={styles.reportCta}
              onPress={() => onOpenReportModal ? onOpenReportModal(activeStop) : null}
              activeOpacity={0.85}
            >
              <Text style={styles.reportCtaText}>📢 Report Crowd Density at {activeStop.code}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* All Kota Transit Stops List */}
        <Text style={styles.sectionTitle}>All Monitored Stops in Kota ({KOTA_STOPS.length})</Text>
        <View style={styles.stopsGrid}>
          {KOTA_STOPS.map(stop => {
            const isCurrent = activeStop?.id === stop.id;
            return (
              <TouchableOpacity
                key={stop.id}
                style={[styles.stopRow, isCurrent && styles.stopRowActive]}
                onPress={() => handleStopSelected(stop)}
                activeOpacity={0.7}
              >
                <View style={styles.stopRowLeft}>
                  <Text style={styles.stopRowIcon}>
                    {stop.type === 'railway' ? '🚂' : (stop.type === 'metro_junction' ? '🚇' : '🚏')}
                  </Text>
                  <View>
                    <Text style={styles.stopRowName}>{stop.name}</Text>
                    <Text style={styles.stopRowRoutes}>Lines: {stop.routesServing.join(', ')}</Text>
                  </View>
                </View>
                <CrowdBadge level={stop.crowdLevel} size="small" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  mapInfoPill: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    alignItems: 'center'
  },
  infoPillText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700'
  },
  detailCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    marginTop: 14,
    marginBottom: 18,
    ...SHADOWS.md
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  headerTitleGroup: {
    flex: 1,
    marginRight: 10
  },
  stationName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  stationMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  metricBox: {
    flex: 1,
    backgroundColor: COLORS.cardMuted,
    padding: 10,
    borderRadius: RADIUS.sm,
    alignItems: 'center'
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  metricLab: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2
  },
  routesServingBox: {
    marginBottom: 14
  },
  routesServingTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6
  },
  routeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  linePill: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  linePillText: {
    fontSize: 11,
    color: COLORS.secondary,
    fontWeight: '700'
  },
  reportCta: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingVertical: 11,
    alignItems: 'center'
  },
  reportCtaText: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '800'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10
  },
  stopsGrid: {
    gap: 8
  },
  stopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  stopRowActive: {
    borderColor: COLORS.secondary,
    backgroundColor: '#F0FDFA'
  },
  stopRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  stopRowIcon: {
    fontSize: 18,
    marginRight: 10
  },
  stopRowName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  stopRowRoutes: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2
  }
});

