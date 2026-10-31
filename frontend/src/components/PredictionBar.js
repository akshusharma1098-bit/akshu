import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, RADIUS, SHADOWS, CROWD_CONFIG } from '../config/theme';

export default function PredictionBar({
  forecastHours = [],
  currentHour = 9,
  liveReportCount = 12,
  confidenceScore = 88,
  hasInsufficientData = false
}) {
  if (hasInsufficientData) {
    return (
      <View style={styles.insufficientContainer}>
        <Text style={styles.insufficientIcon}>⚠️</Text>
        <Text style={styles.insufficientTitle}>Insufficient Crowd Data</Text>
        <Text style={styles.insufficientDesc}>
          Not enough historical travel records or live crowd reports exist for this interval. Be the first to submit a report!
        </Text>
      </View>
    );
  }

  // Generate 6 sample upcoming intervals if not passed
  const intervals = forecastHours.length > 0 ? forecastHours : [
    { hour: 'Now', timeLabel: 'Live', level: 'CROWDED', score: 85, isLive: true },
    { hour: '+30m', timeLabel: '10:00 AM', level: 'CROWDED', score: 78, isLive: false },
    { hour: '+1h', timeLabel: '10:30 AM', level: 'MODERATE', score: 62, isLive: false },
    { hour: '+2h', timeLabel: '11:30 AM', level: 'EMPTY', score: 32, isLive: false },
    { hour: '+3h', timeLabel: '12:30 PM', level: 'EMPTY', score: 28, isLive: false },
    { hour: '+4h', timeLabel: '1:30 PM', level: 'CROWDED', score: 82, isLive: false }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>AI Crowd Forecast by Departure Time</Text>
          <Text style={styles.subtitle}>
            Combines day-of-week trends + live reports + occupancy models
          </Text>
        </View>
        <View style={styles.confidenceTag}>
          <Text style={styles.confidenceText}>Confidence: {confidenceScore}%</Text>
        </View>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.secondary }]} />
          <Text style={styles.legendLabel}>LIVE REPORTED CROWD</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primaryLight, borderWidth: 1, borderColor: COLORS.secondary }]} />
          <Text style={styles.legendLabel}>AI PREDICTED CROWD</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotsScroll}>
        {intervals.map((slot, index) => {
          const config = CROWD_CONFIG[slot.level] || CROWD_CONFIG.MODERATE;
          return (
            <View
              key={index}
              style={[
                styles.slotCard,
                slot.isLive && styles.slotCardLive,
                { borderColor: slot.isLive ? COLORS.secondary : COLORS.border }
              ]}
            >
              <View style={styles.slotTagRow}>
                <Text style={[styles.slotTag, slot.isLive && styles.slotTagLive]}>
                  {slot.isLive ? '🔴 LIVE' : '🔮 PREDICTED'}
                </Text>
              </View>

              <Text style={styles.slotTime}>{slot.timeLabel}</Text>
              <Text style={styles.slotRelTime}>{slot.hour}</Text>

              {/* Progress crowd level bar */}
              <View style={styles.meterContainer}>
                <View
                  style={[
                    styles.meterFill,
                    { width: `${Math.max(slot.score, 18)}%`, backgroundColor: config.color }
                  ]}
                />
              </View>

              <View style={[styles.pillBadge, { backgroundColor: config.bg, borderColor: config.borderColor }]}>
                <Text style={[styles.pillText, { color: config.color }]}>
                  {slot.level}
                </Text>
              </View>

              <Text style={styles.scoreText}>{slot.score}% Density</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  confidenceTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  confidenceText: {
    color: COLORS.crowdLow,
    fontSize: 10,
    fontWeight: '700'
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5
  },
  legendLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.3
  },
  slotsScroll: {
    paddingVertical: 6,
    gap: 10
  },
  slotCard: {
    width: 108,
    backgroundColor: COLORS.cardMuted,
    borderRadius: RADIUS.sm,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1
  },
  slotCardLive: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5
  },
  slotTagRow: {
    marginBottom: 4
  },
  slotTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.5
  },
  slotTagLive: {
    color: COLORS.secondary
  },
  slotTime: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  slotRelTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 6
  },
  meterContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6
  },
  meterFill: {
    height: '100%',
    borderRadius: 3
  },
  pillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4
  },
  pillText: {
    fontSize: 9,
    fontWeight: '800'
  },
  scoreText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  insufficientContainer: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginVertical: 10
  },
  insufficientIcon: {
    fontSize: 26,
    marginBottom: 6
  },
  insufficientTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 4
  },
  insufficientDesc: {
    fontSize: 11,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 16
  }
});

