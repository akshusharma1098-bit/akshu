import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS } from '../config/theme';

export default function Header({
  title = 'SmartCommute',
  subtitle = 'Kota, Rajasthan',
  showBack = false,
  onBack,
  unreadCount = 2,
  onPressNotifications,
  onPressProfile,
  onPressAdmin
}) {
  return (
    <View style={styles.header}>
      <View style={styles.leftGroup}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
        )}
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.brandTitle}>{title}</Text>
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DEMO MODE</Text>
            </View>
          </View>
          <Text style={styles.subtitleText}>📍 {subtitle}</Text>
        </View>
      </View>

      <View style={styles.rightGroup}>
        {onPressAdmin && (
          <TouchableOpacity onPress={onPressAdmin} style={styles.iconButton} activeOpacity={0.7}>
            <Text style={styles.iconText}>🛡️</Text>
          </TouchableOpacity>
        )}

        {onPressNotifications && (
          <TouchableOpacity onPress={onPressNotifications} style={styles.iconButton} activeOpacity={0.7}>
            <Text style={styles.iconText}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {onPressProfile && (
          <TouchableOpacity onPress={onPressProfile} style={styles.avatarButton} activeOpacity={0.7}>
            <Text style={styles.avatarText}>👤</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    ...SHADOWS.md
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  logoIcon: {
    fontSize: 20
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  backButtonText: {
    color: COLORS.textWhite,
    fontSize: 20,
    fontWeight: '700'
  },
  titleContainer: {
    justifyContent: 'center'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandTitle: {
    color: COLORS.textWhite,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3
  },
  demoBadge: {
    backgroundColor: 'rgba(20, 184, 166, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary
  },
  demoBadgeText: {
    color: '#2DD4BF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  subtitleText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500'
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  iconText: {
    fontSize: 16
  },
  unreadBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: COLORS.crowdHigh,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary
  },
  unreadText: {
    color: COLORS.textWhite,
    fontSize: 9,
    fontWeight: '800'
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 16
  }
});

