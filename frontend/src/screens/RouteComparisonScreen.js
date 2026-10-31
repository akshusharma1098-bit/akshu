import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../config/theme';
import Header from '../components/Header';
import RouteCard from '../components/RouteCard';
import PredictionBar from '../components/PredictionBar';
import { KOTA_ROUTES } from '../data/demoData';

export default function RouteComparisonScreen({
  searchQuery = { origin: 'Landmark City (Kunhari Hub)', destination: 'Medical College & Rangbari Hospital' },
  onNavigate,
  onOpenReportModal
}) {
  const [selectedRouteId, setSelectedRouteId] = useState('R202');
  const [departureOffset, setDepartureOffset] = useState('now'); // 'now', '15m', '30m', '60m'

  // Calculate dynamic crowd level and recommendation based on departure time
  const routesWithPredictions = KOTA_ROUTES.map(route => {
    let arrivalCrowd = route.currentCrowdLevel;
    let arrivalScore = route.currentCrowdScore;

    if (departureOffset === '30m' || departureOffset === '60m') {
      arrivalCrowd = route.predictedCrowdNextHour || 'MODERATE';
      arrivalScore = arrivalCrowd === 'EMPTY' ? 24 : (arrivalCrowd === 'MODERATE' ? 52 : 86);
    }

    // Recommendation logic: balancing travel time and crowd score
    // Composite penalty = durationMin * 0.4 + crowdScore * 0.6
    const compositeScore = Math.round((route.baseDurationMin * 0.4) + (arrivalScore * 0.6));

    return {
      ...route,
      estimatedArrivalCrowd: arrivalCrowd,
      arrivalScore,
      compositeScore,
      isBestPick: route.id === 'R202' // Route 202 has AC and 26% density
    };
  });

  const selectedRoute = routesWithPredictions.find(r => r.id === selectedRouteId) || routesWithPredictions[0];

  return (
    <View style={styles.container}>
      <Header
        title="Route Optimizer"
        subtitle="Route Comparison"
        showBack={true}
        onBack={() => onNavigate('dashboard')}
        onPressNotifications={() => onNavigate('notifications')}
        onPressProfile={() => onNavigate('profile')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Origin / Destination Header Banner */}
        <View style={styles.odBanner}>
          <View style={styles.odRow}>
            <View style={styles.odDots}>
              <View style={styles.dotStart} />
              <View style={styles.odDashed} />
              <View style={styles.dotEnd} />
            </View>
            <View style={styles.odTexts}>
              <Text style={styles.odFrom} numberOfLines={1}>From: {searchQuery.origin || 'Landmark City'}</Text>
              <Text style={styles.odTo} numberOfLines={1}>To: {searchQuery.destination || 'Medical College'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.modifyBtn} onPress={() => onNavigate('search')}>
            <Text style={styles.modifyText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Departure Time Selector (AI Predictive Optimization) */}
        <View style={styles.departurePickerCard}>
          <Text style={styles.pickerTitle}>Select Planned Departure Time:</Text>
          <View style={styles.timeButtonsRow}>
            {[
              { id: 'now', label: 'Depart Now', sub: 'Live' },
              { id: '15m', label: '+15 Mins', sub: 'Optimal' },
              { id: '30m', label: '+30 Mins', sub: 'Less Crowd' },
              { id: '60m', label: '+1 Hour', sub: 'Forecast' }
            ].map(slot => {
              const isActive = departureOffset === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[styles.timeBtn, isActive && styles.timeBtnActive]}
                  onPress={() => setDepartureOffset(slot.id)}
                >
                  <Text style={[styles.timeBtnText, isActive && styles.timeBtnTextActive]}>
                    {slot.label}
                  </Text>
                  <Text style={[styles.timeBtnSub, isActive && styles.timeBtnSubActive]}>
                    {slot.sub}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* AI Recommendation Summary Box */}
        <View style={styles.aiInsightCard}>
          <View style={styles.insightIconGroup}>
            <Text style={styles.insightIcon}>✨</Text>
          </View>
          <View style={styles.insightTextGroup}>
            <Text style={styles.insightTitle}>SmartCommute AI Recommendation</Text>
            <Text style={styles.insightBody}>
              Taking <strong>Route 202 (Chambal Metro Feeder)</strong> avoids 65% of passenger congestion compared to the direct Route 101, saving you from standing room only with a mere 6-minute duration trade-off.
            </Text>
          </View>
        </View>

        {/* 3+ Route Options Comparison Cards */}
        <Text style={styles.sectionHeader}>Available Route Options ({routesWithPredictions.length})</Text>

        {routesWithPredictions.map(route => (
          <RouteCard
            key={route.id}
            route={route}
            isSelected={selectedRouteId === route.id}
            isRecommended={route.isBestPick}
            onSelect={() => setSelectedRouteId(route.id)}
            onViewStops={() => onNavigate('map')}
          />
        ))}

        {/* Predictive Curve for Selected Route */}
        <PredictionBar
          confidenceScore={94}
          forecastHours={[
            { hour: 'Now', timeLabel: 'Now', level: selectedRoute.currentCrowdLevel, score: selectedRoute.currentCrowdScore, isLive: true },
            { hour: '+15m', timeLabel: 'In 15m', level: 'EMPTY', score: 25, isLive: false },
            { hour: '+30m', timeLabel: 'In 30m', level: 'EMPTY', score: 20, isLive: false },
            { hour: '+1h', timeLabel: 'In 1h', level: 'MODERATE', score: 50, isLive: false },
            { hour: '+2h', timeLabel: 'In 2h', level: 'CROWDED', score: 85, isLive: false }
          ]}
        />

        {/* Selected Route Action Bar */}
        <View style={styles.selectedRouteBar}>
          <View>
            <Text style={styles.selectedRouteBarTitle}>Selected: {selectedRoute.name}</Text>
            <Text style={styles.selectedRouteBarMeta}>
              Fare: ₹{selectedRoute.fare} • ETA: {selectedRoute.baseDurationMin} mins • Crowd: {selectedRoute.currentCrowdLevel}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.startNavBtn}
            onPress={() => onNavigate('map')}
            activeOpacity={0.85}
          >
            <Text style={styles.startNavText}>View on Map 🗺️</Text>
          </TouchableOpacity>
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
  odBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 14,
    ...SHADOWS.sm
  },
  odRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  odDots: {
    alignItems: 'center',
    marginRight: 10
  },
  dotStart: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary
  },
  odDashed: {
    width: 2,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 2
  },
  dotEnd: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444'
  },
  odTexts: {
    flex: 1
  },
  odFrom: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '700'
  },
  odTo: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4
  },
  modifyBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm
  },
  modifyText: {
    color: COLORS.textWhite,
    fontSize: 11,
    fontWeight: '700'
  },
  departurePickerCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    ...SHADOWS.sm
  },
  pickerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5
  },
  timeButtonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  timeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  timeBtnActive: {
    backgroundColor: '#F0FDFA',
    borderColor: COLORS.secondary
  },
  timeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  timeBtnTextActive: {
    color: COLORS.secondary
  },
  timeBtnSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 2
  },
  timeBtnSubActive: {
    color: '#0F766E',
    fontWeight: '600'
  },
  aiInsightCard: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 16
  },
  insightIconGroup: {
    marginRight: 10
  },
  insightIcon: {
    fontSize: 22
  },
  insightTextGroup: {
    flex: 1
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 2
  },
  insightBody: {
    fontSize: 11,
    color: '#047857',
    lineHeight: 16
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12
  },
  selectedRouteBar: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    ...SHADOWS.md
  },
  selectedRouteBarTitle: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '800'
  },
  selectedRouteBarMeta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3
  },
  startNavBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.sm
  },
  startNavText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '800'
  }
});

