import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../config/theme';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>⚡</Text>
        </View>
        <Text style={styles.title}>SmartCommute</Text>
        <Text style={styles.tagline}>Travel Smarter. Beat the Crowd.</Text>
        <View style={styles.cityPill}>
          <Text style={styles.cityText}>📍 KOTA, RAJASTHAN</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.secondary} />
        <Text style={styles.loadingText}>Initializing AI Crowd Prediction Engine...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 120
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8
  },
  icon: {
    fontSize: 44
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textWhite,
    letterSpacing: 0.5
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
    fontWeight: '500'
  },
  cityPill: {
    marginTop: 18,
    backgroundColor: 'rgba(20, 184, 166, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.secondary
  },
  cityText: {
    color: '#2DD4BF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1
  },
  footer: {
    alignItems: 'center',
    gap: 12
  },
  loadingText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500'
  }
});

