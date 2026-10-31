import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../config/theme';
import Header from '../components/Header';
import CrowdBadge from '../components/CrowdBadge';
import { KOTA_ROUTES } from '../data/demoData';

export default function AdminDashboardScreen({
  reports = [],
  onDeleteReport,
  onNavigate
}) {
  const [adminReports, setAdminReports] = useState(reports);
  const [toastMsg, setToastMsg] = useState('');

  const handleDelete = (reportId) => {
    const updated = adminReports.filter(r => r.id !== reportId);
    setAdminReports(updated);
    if (onDeleteReport) onDeleteReport(reportId);
    setToastMsg(`Report ${reportId} removed from live database.`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleVerify = (reportId) => {
    const updated = adminReports.map(r => r.id === reportId ? { ...r, verified: true, upvotes: (r.upvotes || 0) + 5 } : r);
    setAdminReports(updated);
    setToastMsg(`Report verified and highlighted in public feed.`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Admin Console"
        subtitle="Kota Transit Control"
        showBack={true}
        onBack={() => onNavigate('dashboard')}
        onPressNotifications={() => onNavigate('notifications')}
        onPressProfile={() => onNavigate('profile')}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Admin Header Banner */}
        <View style={styles.banner}>
          <View>
            <View style={styles.tagRow}>
              <Text style={styles.tag}>TRANSIT AUTHORITY DASHBOARD</Text>
              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>SYSTEM ONLINE</Text>
              </View>
            </View>
            <Text style={styles.bannerTitle}>Kota Smart Commute Intelligence Hub</Text>
            <Text style={styles.bannerSub}>Real-time passenger flow, crowd analytics, and report moderation</Text>
          </View>
        </View>

        {toastMsg ? (
          <View style={styles.toastBox}>
            <Text style={styles.toastText}>🛡️ {toastMsg}</Text>
          </View>
        ) : null}

        {/* 4 Core KPIs */}
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>1,482</Text>
            <Text style={styles.kpiLabel}>Registered Users</Text>
            <Text style={styles.kpiChange}>+12% this week</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>{adminReports.length + 860}</Text>
            <Text style={styles.kpiLabel}>Crowd Reports</Text>
            <Text style={styles.kpiChange}>98.2% valid</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>92.4%</Text>
            <Text style={styles.kpiLabel}>AI Prediction Accuracy</Text>
            <Text style={styles.kpiChange}>Continuous ML</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiValue}>4 Lines</Text>
            <Text style={styles.kpiLabel}>Active Transit Corridors</Text>
            <Text style={styles.kpiChange}>Kota City Feeder</Text>
          </View>
        </View>

        {/* Most Crowded Routes Heatmap */}
        <Text style={styles.sectionTitle}>Route-wise Real-Time Crowd Density</Text>
        <View style={styles.routeStatsCard}>
          {KOTA_ROUTES.map(r => {
            const isHigh = r.currentCrowdScore > 75;
            const isLow = r.currentCrowdScore < 35;
            const barColor = isHigh ? COLORS.crowdHigh : (isLow ? COLORS.crowdLow : COLORS.crowdModerate);
            return (
              <View key={r.id} style={styles.routeStatRow}>
                <View style={styles.routeStatInfo}>
                  <View style={styles.routeStatBadge}>
                    <Text style={styles.routeStatBadgeText}>{r.id}</Text>
                  </View>
                  <View style={styles.routeStatNameCol}>
                    <Text style={styles.routeStatName}>{r.name}</Text>
                    <Text style={styles.routeStatSub}>{r.activeVehicles?.length || 2} vehicles active • {r.type}</Text>
                  </View>
                  <CrowdBadge level={r.currentCrowdLevel} size="small" />
                </View>

                {/* Meter Bar */}
                <View style={styles.barContainer}>
                  <View style={[styles.barFill, { width: `${r.currentCrowdScore}%`, backgroundColor: barColor }]} />
                </View>
                <View style={styles.barLabels}>
                  <Text style={styles.densityText}>Density: {r.currentCrowdScore}%</Text>
                  <Text style={styles.statusText}>{isHigh ? '⚠️ Congested' : isLow ? '✅ Low Load' : '🟡 Balanced'}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Report Moderation & Review Queue */}
        <View style={styles.queueHeaderRow}>
          <View>
            <Text style={styles.sectionTitle}>Recent User Reports Moderation</Text>
            <Text style={styles.queueSub}>Review, verify accuracy, or remove inappropriate reports</Text>
          </View>
        </View>

        <View style={styles.moderationList}>
          {adminReports.map(rep => (
            <View key={rep.id} style={styles.modCard}>
              <View style={styles.modCardTop}>
                <View style={styles.modUserGroup}>
                  <Text style={styles.modAvatar}>👤</Text>
                  <View>
                    <Text style={styles.modUserName}>{rep.userName} {rep.verified ? '✓ (Verified)' : ''}</Text>
                    <Text style={styles.modMeta}>{rep.routeName} • {rep.stopName}</Text>
                  </View>
                </View>
                <CrowdBadge level={rep.crowdLevel} size="small" />
              </View>

              <Text style={styles.modComment}>"{rep.comment || 'No comment added'}"</Text>

              <View style={styles.modFooter}>
                <Text style={styles.modDetails}>
                  Vehicle: {rep.vehicleId || 'N/A'} • ID: {rep.id}
                </Text>

                <View style={styles.modActions}>
                  {!rep.verified && (
                    <TouchableOpacity
                      style={styles.verifyBtn}
                      onPress={() => handleVerify(rep.id)}
                    >
                      <Text style={styles.verifyText}>Verify ✓</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(rep.id)}
                  >
                    <Text style={styles.deleteText}>Remove ✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
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
  banner: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 16,
    ...SHADOWS.md
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  tag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2DD4BF',
    letterSpacing: 0.8
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.crowdLow,
    marginRight: 4
  },
  liveText: {
    color: COLORS.textWhite,
    fontSize: 9,
    fontWeight: '700'
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textWhite
  },
  bannerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 3
  },
  toastBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 10,
    borderRadius: RADIUS.sm,
    marginBottom: 12
  },
  toastText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46'
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2
  },
  kpiChange: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondary,
    marginTop: 4
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4
  },
  queueHeaderRow: {
    marginBottom: 10,
    marginTop: 10
  },
  queueSub: {
    fontSize: 11,
    color: COLORS.textSecondary
  },
  routeStatsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 18,
    gap: 14,
    ...SHADOWS.sm
  },
  routeStatRow: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 12
  },
  routeStatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  routeStatBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8
  },
  routeStatBadgeText: {
    color: COLORS.textWhite,
    fontSize: 11,
    fontWeight: '800'
  },
  routeStatNameCol: {
    flex: 1
  },
  routeStatName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  routeStatSub: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  barContainer: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4
  },
  barFill: {
    height: '100%',
    borderRadius: 4
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  densityText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted
  },
  moderationList: {
    gap: 10
  },
  modCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm
  },
  modCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  modUserGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  modAvatar: {
    fontSize: 16,
    marginRight: 8
  },
  modUserName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  modMeta: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  modComment: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    marginVertical: 4
  },
  modFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight
  },
  modDetails: {
    fontSize: 9,
    color: COLORS.textMuted
  },
  modActions: {
    flexDirection: 'row',
    gap: 6
  },
  verifyBtn: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  verifyText: {
    color: COLORS.crowdLow,
    fontSize: 10,
    fontWeight: '700'
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA'
  },
  deleteText: {
    color: COLORS.crowdHigh,
    fontSize: 10,
    fontWeight: '700'
  }
});

