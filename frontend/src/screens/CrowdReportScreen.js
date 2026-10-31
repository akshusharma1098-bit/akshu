import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, RADIUS, SHADOWS, CROWD_CONFIG } from '../config/theme';
import Header from '../components/Header';
import CrowdBadge from '../components/CrowdBadge';
import { KOTA_STOPS, KOTA_ROUTES } from '../data/demoData';

export default function CrowdReportScreen({
  reports = [],
  onAddNewReport,
  onNavigate
}) {
  const [selectedLevel, setSelectedLevel] = useState('EMPTY');
  const [routeId, setRouteId] = useState('R202');
  const [stopId, setStopId] = useState('stop_nayapura');
  const [vehicleId, setVehicleId] = useState('');
  const [comment, setComment] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [filterRoute, setFilterRoute] = useState('ALL');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const filteredReports = reports.filter(r => {
    if (filterRoute === 'ALL') return true;
    return r.routeId === filterRoute;
  });

  const handleQuickSubmit = () => {
    setStatusMsg('');
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      setStatusMsg('⏳ Anti-Spam protection active. Please wait 10 seconds between reports.');
      return;
    }

    const routeObj = KOTA_ROUTES.find(r => r.id === routeId) || KOTA_ROUTES[0];
    const stopObj = KOTA_STOPS.find(s => s.id === stopId) || KOTA_STOPS[0];

    const newRep = {
      id: 'rep_' + Date.now(),
      userId: 'usr_me_' + Math.floor(Math.random() * 1000),
      userName: 'Verified Commuter (You)',
      userBadge: 'Community Sentinel',
      routeId: routeObj.id,
      routeName: routeObj.name,
      vehicleId: vehicleId.trim() || routeObj.activeVehicles?.[0] || 'RJ-20-EB-4102',
      stopId: stopObj.id,
      stopName: stopObj.name,
      crowdLevel: selectedLevel,
      crowdScore: selectedLevel === 'EMPTY' ? 18 : (selectedLevel === 'MODERATE' ? 52 : 90),
      comment: comment.trim() || (selectedLevel === 'EMPTY' ? 'Plenty of vacant seats!' : selectedLevel === 'MODERATE' ? 'Few empty seats available.' : 'Packed, standing crowd only.'),
      timestamp: Date.now(),
      upvotes: 1
    };

    setLastSubmitTime(now);
    if (onAddNewReport) {
      onAddNewReport(newRep);
    }
    setStatusMsg('✅ Report broadcasted live to Firebase Realtime Database & all Kota commuters!');
    setComment('');
    setVehicleId('');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Crowd Sentinel"
        subtitle="Community Intelligence"
        showBack={true}
        onBack={() => onNavigate('dashboard')}
        onPressNotifications={() => onNavigate('notifications')}
        onPressProfile={() => onNavigate('profile')}
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Karma / Contribution Stats Hero */}
        <View style={styles.karmaCard}>
          <View style={styles.karmaTextGroup}>
            <Text style={styles.karmaTag}>COMMUNITY CROWD SOURCING</Text>
            <Text style={styles.karmaTitle}>Every report powers accurate AI predictions</Text>
            <Text style={styles.karmaSub}>You have helped 52 commuters beat peak congestion this week.</Text>
          </View>
          <View style={styles.karmaPointsBadge}>
            <Text style={styles.karmaPointsVal}>+10 pts</Text>
            <Text style={styles.karmaPointsLab}>Per Report</Text>
          </View>
        </View>

        {/* Live Submission Panel */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Submit Live Passenger Density</Text>
          <Text style={styles.formSubtitle}>Choose what matches your current transit experience</Text>

          {statusMsg ? (
            <View style={[styles.statusBox, statusMsg.startsWith('⏳') ? styles.statusBoxWarn : styles.statusBoxSuccess]}>
              <Text style={styles.statusBoxText}>{statusMsg}</Text>
            </View>
          ) : null}

          {/* 3 Crowd Options: EMPTY, MODERATE, CROWDED */}
          <View style={styles.levelRow}>
            {[
              { key: 'EMPTY', icon: '🟢', label: 'EMPTY', desc: 'Seats Available', color: COLORS.crowdLow, bg: COLORS.crowdLowBg, border: COLORS.crowdLowBorder },
              { key: 'MODERATE', icon: '🟡', label: 'MODERATE', desc: 'Most Seats Taken', color: COLORS.crowdModerate, bg: COLORS.crowdModerateBg, border: COLORS.crowdModerateBorder },
              { key: 'CROWDED', icon: '🔴', label: 'CROWDED', desc: 'Standing / Packed', color: COLORS.crowdHigh, bg: COLORS.crowdHighBg, border: COLORS.crowdHighBorder }
            ].map(lvl => {
              const isSelected = selectedLevel === lvl.key;
              return (
                <TouchableOpacity
                  key={lvl.key}
                  style={[
                    styles.levelButton,
                    { borderColor: isSelected ? lvl.color : COLORS.border, backgroundColor: isSelected ? lvl.bg : '#F8FAFC' }
                  ]}
                  onPress={() => setSelectedLevel(lvl.key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.levelIcon}>{lvl.icon}</Text>
                  <Text style={[styles.levelLabel, { color: isSelected ? lvl.color : COLORS.textPrimary }]}>
                    {lvl.label}
                  </Text>
                  <Text style={styles.levelSubText}>{lvl.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selectors for Route & Stop */}
          <View style={styles.fieldsGrid}>
            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Transit Line / Route</Text>
              <select
                style={styles.nativeSelect}
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
              >
                {KOTA_ROUTES.map(r => (
                  <option key={r.id} value={r.id}>{r.id} - {r.name}</option>
                ))}
              </select>
            </View>

            <View style={styles.fieldCol}>
              <Text style={styles.fieldLabel}>Boarding / Alighting Stop</Text>
              <select
                style={styles.nativeSelect}
                value={stopId}
                onChange={(e) => setStopId(e.target.value)}
              >
                {KOTA_STOPS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </View>
          </View>

          {/* Vehicle ID & Comment */}
          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Vehicle / Bus ID (Optional)</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="e.g. RJ-20-EV-1008 or Bus No 4"
              value={vehicleId}
              onChangeText={setVehicleId}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>Commuter Note (Optional)</Text>
            <TextInput
              style={[styles.inputBox, styles.inputMultiline]}
              placeholder="e.g. Fast moving, seats vacant towards the back."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={2}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <TouchableOpacity style={styles.broadcastBtn} onPress={handleQuickSubmit} activeOpacity={0.85}>
            <Text style={styles.broadcastBtnText}>Broadcast Real-Time Report 📡</Text>
          </TouchableOpacity>
        </View>

        {/* Live Feed Header & Route Filters */}
        <View style={styles.feedFilterHeader}>
          <View>
            <Text style={styles.feedHeaderTitle}>Live Community Reports ({filteredReports.length})</Text>
            <Text style={styles.feedHeaderSub}>Real-time crowd feedback in Kota</Text>
          </View>

          {/* Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterPillsScroll}>
            {['ALL', 'R101', 'R202', 'R303', 'R404'].map(r => {
              const active = filterRoute === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.filterPill, active && styles.filterPillActive]}
                  onPress={() => setFilterRoute(r)}
                >
                  <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>{r}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Live Reports Feed List */}
        <View style={styles.reportsList}>
          {filteredReports.map(item => (
            <View key={item.id} style={styles.reportCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.userInfoCol}>
                  <Text style={styles.userAvatar}>👤</Text>
                  <View>
                    <View style={styles.userNameRow}>
                      <Text style={styles.userName}>{item.userName}</Text>
                      {item.userBadge && (
                        <View style={styles.badgePill}>
                          <Text style={styles.badgePillText}>{item.userBadge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.routeMetaText}>
                      {item.routeName} • {item.stopName}
                    </Text>
                  </View>
                </View>

                <CrowdBadge level={item.crowdLevel} />
              </View>

              {item.comment ? (
                <Text style={styles.commentText}>"{item.comment}"</Text>
              ) : null}

              <View style={styles.cardBottomRow}>
                <Text style={styles.timeTag}>
                  Vehicle: {item.vehicleId} • {Math.round((Date.now() - item.timestamp) / 60000)}m ago
                </Text>
                <TouchableOpacity style={styles.upvoteBtn}>
                  <Text style={styles.upvoteText}>👍 {item.upvotes || 1} helpful</Text>
                </TouchableOpacity>
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
  karmaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.md
  },
  karmaTextGroup: {
    flex: 1,
    marginRight: 10
  },
  karmaTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2DD4BF',
    letterSpacing: 0.8,
    marginBottom: 4
  },
  karmaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textWhite
  },
  karmaSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  karmaPointsBadge: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary
  },
  karmaPointsVal: {
    color: '#2DD4BF',
    fontSize: 14,
    fontWeight: '900'
  },
  karmaPointsLab: {
    color: COLORS.textWhite,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2
  },
  formCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 20,
    ...SHADOWS.md
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  formSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 12
  },
  statusBox: {
    padding: 10,
    borderRadius: RADIUS.sm,
    marginBottom: 12,
    borderWidth: 1
  },
  statusBoxSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0'
  },
  statusBoxWarn: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A'
  },
  statusBoxText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46'
  },
  levelRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  levelButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5
  },
  levelIcon: {
    fontSize: 22,
    marginBottom: 4
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '800'
  },
  levelSubText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center'
  },
  fieldsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  fieldCol: {
    flex: 1
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4
  },
  nativeSelect: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '10px',
    border: '1.5px solid #E2E8F0',
    fontSize: '11px',
    fontWeight: '600',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    outline: 'none'
  },
  fieldItem: {
    marginBottom: 10
  },
  inputBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.textPrimary
  },
  inputMultiline: {
    height: 50,
    textAlignVertical: 'top'
  },
  broadcastBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
    ...SHADOWS.sm
  },
  broadcastBtnText: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '800'
  },
  feedFilterHeader: {
    marginBottom: 12
  },
  feedHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  feedHeaderSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 8
  },
  filterPillsScroll: {
    gap: 6,
    paddingVertical: 4
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  filterPillTextActive: {
    color: COLORS.textWhite
  },
  reportsList: {
    gap: 10
  },
  reportCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  userInfoCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8
  },
  userAvatar: {
    fontSize: 18,
    marginRight: 8
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  userName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  badgePill: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6
  },
  badgePillText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '700'
  },
  routeMetaText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  commentText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    marginVertical: 6,
    lineHeight: 16
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight
  },
  timeTag: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  upvoteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F1F5F9'
  },
  upvoteText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.secondary
  }
});

