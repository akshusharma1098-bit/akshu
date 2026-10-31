import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS, RADIUS } from '../config/theme';
import CrowdBadge from './CrowdBadge';

export default function RouteCard({
  route,
  isRecommended = false,
  isSelected = false,
  onSelect,
  onViewStops
}) {
  if (!route) return null;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        isRecommended && styles.cardRecommended
      ]}
      onPress={onSelect}
      activeOpacity={0.85}
    >
      {isRecommended && (
        <View style={styles.recommendationBanner}>
          <Text style={styles.recommendationBannerText}>
            ✨ AI RECOMMENDED • BEST CROWD & TIME BALANCE
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.routeBadge}>
            <Text style={styles.routeIdText}>{route.id}</Text>
          </View>
          <View style={styles.routeDetails}>
            <Text style={styles.routeName} numberOfLines={1}>{route.name}</Text>
            <Text style={styles.routeModeText}>{route.type} • Every {route.frequencyMin || 8}m</Text>
          </View>
          <CrowdBadge level={route.currentCrowdLevel} />
        </View>

        <View style={styles.pathRow}>
          <View style={styles.dotLineGroup}>
            <View style={styles.pathDotStart} />
            <View style={styles.pathDashedLine} />
            <View style={styles.pathDotEnd} />
          </View>
          <View style={styles.pathLabelsGroup}>
            <Text style={styles.stopLabel} numberOfLines={1}>{route.from}</Text>
            <Text style={styles.stopLabel} numberOfLines={1}>{route.to}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>⏱️ {route.baseDurationMin} min</Text>
            <Text style={styles.statCaption}>Travel Time</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>🚏 {route.stopsCount} stops</Text>
            <Text style={styles.statCaption}>Intermediate</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{route.fare || 20}</Text>
            <Text style={styles.statCaption}>Fare</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {route.currentCrowdScore !== undefined ? `${route.currentCrowdScore}%` : 'N/A'}
            </Text>
            <Text style={styles.statCaption}>Crowd Index</Text>
          </View>
        </View>

        {route.recommendationReason && (
          <View style={styles.reasonBox}>
            <Text style={styles.reasonText}>💡 {route.recommendationReason}</Text>
          </View>
        )}

        <View style={styles.actionRow}>
          {onViewStops && (
            <TouchableOpacity onPress={onViewStops} style={styles.viewStopsBtn}>
              <Text style={styles.viewStopsText}>View Stops on Map</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onSelect} style={styles.chooseRouteBtn}>
            <Text style={styles.chooseRouteText}>
              {isSelected ? 'Selected Route ✓' : 'Select This Route'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.md
  },
  cardSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: '#F0FDFA'
  },
  cardRecommended: {
    borderColor: COLORS.secondary
  },
  recommendationBanner: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  recommendationBannerText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  content: {
    padding: 14
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  routeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10
  },
  routeIdText: {
    color: COLORS.textWhite,
    fontWeight: '800',
    fontSize: 13
  },
  routeDetails: {
    flex: 1
  },
  routeName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  routeModeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardMuted,
    padding: 10,
    borderRadius: RADIUS.sm,
    marginBottom: 12
  },
  dotLineGroup: {
    alignItems: 'center',
    marginRight: 10
  },
  pathDotStart: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary
  },
  pathDashedLine: {
    width: 2,
    height: 16,
    backgroundColor: COLORS.border,
    marginVertical: 2
  },
  pathDotEnd: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary
  },
  pathLabelsGroup: {
    flex: 1,
    justifyContent: 'space-between'
  },
  stopLabel: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  statCaption: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2
  },
  reasonBox: {
    backgroundColor: '#EFF6FF',
    padding: 8,
    borderRadius: RADIUS.sm,
    marginBottom: 10
  },
  reasonText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '500',
    lineHeight: 16
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    alignItems: 'center'
  },
  viewStopsBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardMuted
  },
  viewStopsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  chooseRouteBtn: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondary
  },
  chooseRouteText: {
    fontSize: 12,
    color: COLORS.textWhite,
    fontWeight: '700'
  }
});

