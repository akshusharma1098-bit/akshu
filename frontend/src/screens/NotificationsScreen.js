import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../config/theme';
import Header from '../components/Header';
import { INITIAL_NOTIFICATIONS } from '../data/demoData';

export default function NotificationsScreen({ onNavigate }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('ALL');

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.read;
    return n.type === filter;
  });

  const getIconForType = (type) => {
    switch (type) {
      case 'CROWD_SURGE': return '🚨';
      case 'SMART_RECOMMENDATION': return '✨';
      case 'COMMUNITY_REPORT': return '🙌';
      case 'SYSTEM_UPDATE': return '🔔';
      default: return '📢';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        subtitle="Live Transit Alerts"
        showBack={true}
        onBack={() => onNavigate('dashboard')}
        onPressProfile={() => onNavigate('profile')}
        onPressAdmin={() => onNavigate('admin')}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Actions Bar */}
        <View style={styles.actionBar}>
          <Text style={styles.alertCount}>
            {notifications.filter(n => !n.read).length} Unread Alerts
          </Text>
          <TouchableOpacity onPress={markAllRead} style={styles.markReadBtn}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['ALL', 'UNREAD', 'CROWD_SURGE', 'SMART_RECOMMENDATION'].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                {f.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Notifications List */}
        <View style={styles.listContainer}>
          {filtered.map(item => {
            const isHigh = item.severity === 'high';
            return (
              <View
                key={item.id}
                style={[
                  styles.notifCard,
                  !item.read && styles.notifCardUnread,
                  isHigh && styles.notifCardHigh
                ]}
              >
                <View style={styles.notifTopRow}>
                  <View style={styles.notifIconCircle}>
                    <Text style={styles.notifIcon}>{getIconForType(item.type)}</Text>
                  </View>
                  <View style={styles.notifTitleGroup}>
                    <Text style={styles.notifTitle}>{item.title}</Text>
                    <Text style={styles.notifTime}>{item.time}</Text>
                  </View>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.notifMessage}>{item.message}</Text>

                <View style={styles.cardActionsRow}>
                  {item.type === 'CROWD_SURGE' && (
                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      onPress={() => onNavigate('routes')}
                    >
                      <Text style={styles.actionBtnPrimaryText}>View Less Crowded Route →</Text>
                    </TouchableOpacity>
                  )}

                  {item.type === 'SMART_RECOMMENDATION' && (
                    <TouchableOpacity
                      style={styles.actionBtnSecondary}
                      onPress={() => onNavigate('search')}
                    >
                      <Text style={styles.actionBtnSecondaryText}>Optimize Departure ⏱️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
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
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  alertCount: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  markReadBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  markReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary
  },
  filterScroll: {
    gap: 8,
    marginBottom: 16
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary
  },
  filterChipTextActive: {
    color: COLORS.textWhite
  },
  listContainer: {
    gap: 12
  },
  notifCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm
  },
  notifCardUnread: {
    borderColor: COLORS.secondary,
    backgroundColor: '#FAFEFF'
  },
  notifCardHigh: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.crowdHigh
  },
  notifTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  notifIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  notifIcon: {
    fontSize: 16
  },
  notifTitleGroup: {
    flex: 1
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  notifTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary
  },
  notifMessage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 10
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm
  },
  actionBtnPrimaryText: {
    color: COLORS.textWhite,
    fontSize: 11,
    fontWeight: '700'
  },
  actionBtnSecondary: {
    backgroundColor: COLORS.cardMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm
  },
  actionBtnSecondaryText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700'
  }
});

