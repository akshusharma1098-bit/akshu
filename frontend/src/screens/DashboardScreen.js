import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../config/theme';
import Header from '../components/Header';
import CrowdBadge from '../components/CrowdBadge';
import RouteCard from '../components/RouteCard';
import PredictionBar from '../components/PredictionBar';
import { KOTA_STOPS, KOTA_ROUTES } from '../data/demoData';

export default function DashboardScreen({
  user,
  reports = [],
  onNavigate,
  onOpenReportModal,
  onSelectRoute,
  onSelectStop
}) {
  const popularRoutes = KOTA_ROUTES.slice(0, 3);
  const recommendedRoute = KOTA_ROUTES.find(r => r.currentCrowdLevel === 'EMPTY') || KOTA_ROUTES[1];
  const nearbyStops = KOTA_STOPS.slice(0, 4);

  return (
    <View style={styles.container}>
      <Header
        title="SmartCommute"
        subtitle="Kota, Rajasthan"
        unreadCount={2}
        onPressNotifications={() => onNavigate('notifications')}
        onPressProfile={() => onNavigate('profile')}
        onPressAdmin={() => onNavigate('admin')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Current Location & Quick Search Card */}
        <View style={styles.searchHeroCard}>
          <View style={styles.locationPill}>
            <Text style={styles.locIcon}>📍</Text>
            <Text style={styles.locText} numberOfLines={1}>Current: Aerodrome Circle, Kota</Text>
            <View style={styles.gpsPulse} />
          </View>

          <Text style={styles.searchPrompt}>Where are you traveling in Kota?</Text>
          
          <TouchableOpacity
            style={styles.searchBarFake}
            onPress={() => onNavigate('search')}
            activeOpacity={0.8}
          >
            <Text style={styles.searchBarIcon}>🔍</Text>
            <Text style={styles.searchBarPlaceholder}>Search destination (e.g. Kota Junction, Landmark City)...</Text>
            <View style={styles.searchGoPill}>
              <Text style={styles.searchGoText}>GO</Text>
            </View>
          </TouchableOpacity>

          {/* Quick chip suggestions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {['Kota Jn Railway', 'Landmark City Hub', 'Medical College', 'Nayapura Stand', 'Talwandi Circle'].map((chip, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                onPress={() => onNavigate('search', { destination: chip })}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Live Crowd Intelligence Banner */}
        <View style={styles.crowdStatusBanner}>
          <View style={styles.bannerLeft}>
            <View style={styles.bannerTagRow}>
              <View style={styles.liveDot} />
              <Text style={styles.bannerTag}>LIVE TRANSIT CROWD MONITOR</Text>
            </View>
            <Text style={styles.bannerHeadline}>Peak student commute detected in Kunhari corridor.</Text>
            <Text style={styles.bannerSub}>Route 202 has 65% more empty seats than Route 101 right now.</Text>
          </View>

          <TouchableOpacity
            style={styles.bannerActionBtn}
            onPress={() => onNavigate('routes')}
          >
            <Text style={styles.bannerActionText}>Avoid Crowd →</Text>
          </TouchableOpacity>
        </View>

        {/* AI Prediction Forecast Widget */}
        <PredictionBar
          confidenceScore={91}
          forecastHours={[
            { hour: 'Now', timeLabel: 'Live', level: 'CROWDED', score: 84, isLive: true },
            { hour: '+30m', timeLabel: '10:00 AM', level: 'MODERATE', score: 55, isLive: false },
            { hour: '+1h', timeLabel: '10:30 AM', level: 'EMPTY', score: 28, isLive: false },
            { hour: '+2h', timeLabel: '11:30 AM', level: 'EMPTY', score: 22, isLive: false },
            { hour: '+3h', timeLabel: '12:30 PM', level: 'MODERATE', score: 48, isLive: false },
            { hour: '+4h', timeLabel: '1:30 PM', level: 'CROWDED', score: 86, isLive: false }
          ]}
        />

        {/* Nearby Stops & Stations */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Nearby Stops & Stations</Text>
            <Text style={styles.sectionSubtitle}>Real-time passenger crowd at walking distance</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('map')}>
            <Text style={styles.viewAllText}>Open Map →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalStopsScroll}>
          {nearbyStops.map((stop) => (
            <TouchableOpacity
              key={stop.id}
              style={styles.stopCard}
              onPress={() => onSelectStop ? onSelectStop(stop) : onNavigate('map')}
              activeOpacity={0.8}
            >
              <View style={styles.stopCardTop}>
                <Text style={styles.stopIcon}>
                  {stop.type === 'railway' ? '🚂' : (stop.type === 'metro_junction' ? '🚇' : '🚏')}
                </Text>
                <CrowdBadge level={stop.crowdLevel} size="small" />
              </View>
              <Text style={styles.stopName} numberOfLines={2}>{stop.name}</Text>
              <Text style={styles.stopWait}>Next bus in: <strong>{stop.nextVehicleInMin} min</strong></Text>
              <View style={styles.stopRoutesPill}>
                <Text style={styles.stopRoutesText}>Lines: {stop.routesServing.join(', ')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Suggested Less-Crowded Route Card */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Featured Route Recommendation</Text>
            <Text style={styles.sectionSubtitle}>AI calculated lowest passenger density</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('routes')}>
            <Text style={styles.viewAllText}>Compare (4) →</Text>
          </TouchableOpacity>
        </View>

        <RouteCard
          route={recommendedRoute}
          isRecommended={true}
          onSelect={() => onSelectRoute ? onSelectRoute(recommendedRoute) : onNavigate('routes')}
          onViewStops={() => onNavigate('map')}
        />

        {/* Recent Community Crowd Reports */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Community Crowd Reports (Live)</Text>
            <Text style={styles.sectionSubtitle}>Verified passenger reports synced via Firebase</Text>
          </View>
          <TouchableOpacity onPress={onOpenReportModal}>
            <Text style={styles.reportActionLink}>+ Submit Report</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportsFeed}>
          {reports.slice(0, 3).map((rep) => (
            <View key={rep.id} style={styles.feedItem}>
              <View style={styles.feedHeader}>
                <View style={styles.feedUser}>
                  <Text style={styles.feedAvatar}>👤</Text>
                  <View>
                    <Text style={styles.feedUserName}>{rep.userName}</Text>
                    <Text style={styles.feedMeta}>{rep.routeName} • {rep.stopName}</Text>
                  </View>
                </View>
                <CrowdBadge level={rep.crowdLevel} size="small" />
              </View>
              {rep.comment ? (
                <Text style={styles.feedComment}>"{rep.comment}"</Text>
              ) : null}
              <View style={styles.feedFooter}>
                <Text style={styles.feedTime}>
                  Vehicle: {rep.vehicleId || 'Bus'} • {Math.round((Date.now() - rep.timestamp) / 60000)}m ago
                </Text>
                <Text style={styles.upvotesTag}>👍 {rep.upvotes || 1} commuters helped</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Hackathon Callout Button */}
        <TouchableOpacity
          style={styles.floatingReportBanner}
          onPress={onOpenReportModal}
          activeOpacity={0.85}
        >
          <View style={styles.floatIconCircle}>
            <Text style={styles.floatEmoji}>📢</Text>
          </View>
          <View style={styles.floatTextGroup}>
            <Text style={styles.floatTitle}>Are you traveling right now?</Text>
            <Text style={styles.floatSub}>Tap here to report bus/train crowd in 5 seconds.</Text>
          </View>
          <Text style={styles.floatArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40
  },
  searchHeroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    ...SHADOWS.md
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12
  },
  locIcon: {
    fontSize: 12,
    marginRight: 4
  },
  locText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
    maxWidth: 220
  },
  gpsPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.crowdLow,
    marginLeft: 6
  },
  searchPrompt: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginBottom: 12
  },
  searchBarFake: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    ...SHADOWS.sm
  },
  searchBarIcon: {
    fontSize: 16,
    marginRight: 8
  },
  searchBarPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  searchGoPill: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6
  },
  searchGoText: {
    color: COLORS.textWhite,
    fontSize: 11,
    fontWeight: '800'
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 4
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14
  },
  chipText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600'
  },
  crowdStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 16
  },
  bannerLeft: {
    flex: 1,
    marginRight: 10
  },
  bannerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.crowdModerate,
    marginRight: 5
  },
  bannerTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.6
  },
  bannerHeadline: {
    fontSize: 13,
    fontWeight: '700',
    color: '#78350F'
  },
  bannerSub: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2
  },
  bannerActionBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.sm
  },
  bannerActionText: {
    color: COLORS.textWhite,
    fontSize: 11,
    fontWeight: '700'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary
  },
  reportActionLink: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondary
  },
  horizontalStopsScroll: {
    gap: 12,
    paddingBottom: 6,
    marginBottom: 16
  },
  stopCard: {
    width: 170,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm
  },
  stopCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  stopIcon: {
    fontSize: 20
  },
  stopName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    height: 36
  },
  stopWait: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6
  },
  stopRoutesPill: {
    backgroundColor: COLORS.cardMuted,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8
  },
  stopRoutesText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  reportsFeed: {
    gap: 10,
    marginBottom: 18
  },
  feedItem: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  feedUser: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  feedAvatar: {
    fontSize: 16,
    marginRight: 8
  },
  feedUserName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  feedMeta: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  feedComment: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    marginVertical: 4
  },
  feedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 6
  },
  feedTime: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  upvotesTag: {
    fontSize: 10,
    color: COLORS.secondary,
    fontWeight: '700'
  },
  floatingReportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.lg,
    padding: 14,
    ...SHADOWS.md
  },
  floatIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  floatEmoji: {
    fontSize: 18
  },
  floatTextGroup: {
    flex: 1
  },
  floatTitle: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '800'
  },
  floatSub: {
    color: '#CCFBF1',
    fontSize: 11,
    marginTop: 2
  },
  floatArrow: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '700'
  }
});

