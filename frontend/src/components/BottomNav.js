import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS } from '../config/theme';

export default function BottomNav({ activeTab = 'home', onSelectTab }) {
  const tabs = [
    { key: 'dashboard', label: 'Home', icon: '🏠' },
    { key: 'search', label: 'Search', icon: '🔍' },
    { key: 'map', label: 'Map', icon: '🗺️' },
    { key: 'routes', label: 'Routes', icon: '⚡' },
    { key: 'report', label: 'Report', icon: '📢', highlight: true }
  ];

  return (
    <View style={styles.navContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        if (tab.highlight) {
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.highlightTab}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.8}
            >
              <View style={styles.highlightCircle}>
                <Text style={styles.highlightIcon}>{tab.icon}</Text>
              </View>
              <Text style={[styles.tabLabel, styles.highlightLabel]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    ...SHADOWS.md
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.6
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }]
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 3
  },
  tabLabelActive: {
    color: COLORS.secondary,
    fontWeight: '700'
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
    marginTop: 2
  },
  highlightTab: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -12,
    flex: 1
  },
  highlightCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.cardBackground,
    ...SHADOWS.md
  },
  highlightIcon: {
    fontSize: 20
  },
  highlightLabel: {
    marginTop: 2,
    color: COLORS.secondary,
    fontWeight: '700'
  }
});

