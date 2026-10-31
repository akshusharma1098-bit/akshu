import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../config/theme';
import Header from '../components/Header';

export default function ProfileScreen({
  user = { displayName: 'Neha Sharma', email: 'neha.sharma@commute.demo', role: 'user' },
  onLogout,
  onNavigate
}) {
  const [avoidPeakHours, setAvoidPeakHours] = useState(true);
  const [crowdAlerts, setCrowdAlerts] = useState(true);
  const [ecoMode, setEcoMode] = useState(true);

  return (
    <View style={styles.container}>
      <Header
        title="My Profile"
        subtitle="Commuter Account"
        showBack={true}
        onBack={() => onNavigate('dashboard')}
        onPressNotifications={() => onNavigate('notifications')}
        onPressAdmin={() => onNavigate('admin')}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Badge Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🧑‍🎓</Text>
          </View>
          <Text style={styles.userName}>{user.displayName || 'Guest Commuter'}</Text>
          <Text style={styles.userEmail}>{user.email || 'guest@smartcommute.demo'}</Text>

          <View style={styles.roleBadgeRow}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {user.role === 'admin' ? '🛡️ Transit Admin' : '⭐ Verified Kota Commuter'}
              </Text>
            </View>
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DEMO MODE</Text>
            </View>
          </View>
        </View>

        {/* Commute Impact Metrics */}
        <Text style={styles.sectionTitle}>Your Commute Impact & Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>18</Text>
            <Text style={styles.statLab}>Reports Shared</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>3.4 hrs</Text>
            <Text style={styles.statLab}>Congestion Avoided</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>42 kg</Text>
            <Text style={styles.statLab}>CO₂ Offset</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>180</Text>
            <Text style={styles.statLab}>Karma Points</Text>
          </View>
        </View>

        {/* Travel Preferences */}
        <Text style={styles.sectionTitle}>Commute & Alert Preferences</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>AI Peak-Hour Avoidance</Text>
              <Text style={styles.settingDesc}>Prioritize routes with 50%+ empty seats</Text>
            </View>
            <Switch
              value={avoidPeakHours}
              onValueChange={setAvoidPeakHours}
              trackColor={{ false: '#CBD5E1', true: COLORS.secondary }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>Real-time Crowd Surge Alerts</Text>
              <Text style={styles.settingDesc}>Notify when routes become packed</Text>
            </View>
            <Switch
              value={crowdAlerts}
              onValueChange={setCrowdAlerts}
              trackColor={{ false: '#CBD5E1', true: COLORS.secondary }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingTitle}>Sustainable Public Transit Priority</Text>
              <Text style={styles.settingDesc}>Recommend electric feeders and buses over cabs</Text>
            </View>
            <Switch
              value={ecoMode}
              onValueChange={setEcoMode}
              trackColor={{ false: '#CBD5E1', true: COLORS.secondary }}
            />
          </View>
        </View>

        {/* Quick Admin Switch */}
        <TouchableOpacity
          style={styles.adminSwitchBtn}
          onPress={() => onNavigate('admin')}
          activeOpacity={0.8}
        >
          <Text style={styles.adminSwitchIcon}>🛡️</Text>
          <View style={styles.adminSwitchTexts}>
            <Text style={styles.adminSwitchTitle}>Open Admin Control Panel</Text>
            <Text style={styles.adminSwitchSub}>View moderation, reports queue, and city metrics</Text>
          </View>
          <Text style={styles.adminSwitchArrow}>→</Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={onLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Sign Out / Switch Demo Persona</Text>
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
  content: {
    padding: 16,
    paddingBottom: 40
  },
  profileCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    ...SHADOWS.md
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.secondary
  },
  avatarEmoji: {
    fontSize: 30
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: 12
  },
  roleBadgeRow: {
    flexDirection: 'row',
    gap: 8
  },
  roleBadge: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  roleBadgeText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '700'
  },
  demoBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  demoBadgeText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800'
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.cardBackground,
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.sm
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.secondary
  },
  statLab: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  settingsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
    ...SHADOWS.sm
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingTextGroup: {
    flex: 1,
    marginRight: 10
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  settingDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12
  },
  adminSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: RADIUS.md,
    marginBottom: 16,
    ...SHADOWS.md
  },
  adminSwitchIcon: {
    fontSize: 22,
    marginRight: 12
  },
  adminSwitchTexts: {
    flex: 1
  },
  adminSwitchTitle: {
    color: COLORS.textWhite,
    fontSize: 13,
    fontWeight: '800'
  },
  adminSwitchSub: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2
  },
  adminSwitchArrow: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700'
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    alignItems: 'center'
  },
  logoutText: {
    color: COLORS.crowdHigh,
    fontSize: 13,
    fontWeight: '700'
  }
});

