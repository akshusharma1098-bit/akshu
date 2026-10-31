import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, CROWD_CONFIG } from '../config/theme';

export default function CrowdBadge({ level = 'MODERATE', size = 'medium', showLabel = true, customText = null }) {
  const normalizedLevel = (level || 'MODERATE').toUpperCase();
  const config = CROWD_CONFIG[normalizedLevel] || CROWD_CONFIG.MODERATE;

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <View style={[
      styles.badgeContainer,
      { backgroundColor: config.bg, borderColor: config.borderColor },
      isSmall && styles.badgeSmall,
      isLarge && styles.badgeLarge
    ]}>
      <View style={[
        styles.dot,
        { backgroundColor: config.color },
        isSmall && styles.dotSmall,
        isLarge && styles.dotLarge
      ]} />
      {showLabel && (
        <Text style={[
          styles.text,
          { color: config.color },
          isSmall && styles.textSmall,
          isLarge && styles.textLarge
        ]}>
          {customText || config.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  badgeSmall: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12
  },
  badgeLarge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  dotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4
  },
  dotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  textSmall: {
    fontSize: 10
  },
  textLarge: {
    fontSize: 14
  }
});

