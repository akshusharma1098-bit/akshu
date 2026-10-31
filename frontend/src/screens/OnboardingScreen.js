import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../config/theme';

export default function OnboardingScreen({ onFinish }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Know the Crowd Before You Go',
      subtitle: 'See real-time occupancy on Kota buses, metro feeders and trains. Green for empty seats, yellow for moderate, red for packed.',
      icon: '🟢🟡🔴',
      tag: 'REAL-TIME CROWD INTEL'
    },
    {
      title: 'AI Prediction Engine',
      subtitle: 'Our smart algorithm analyzes historical patterns, day of the week, and live reports to forecast crowd levels 1 to 4 hours in advance.',
      icon: '🔮⚡',
      tag: 'PREDICTIVE TRANSIT'
    },
    {
      title: 'Optimal Route Recommendation',
      subtitle: 'Compare alternative routes balancing travel time, intermediate stops, and passenger density for a comfortable commute.',
      icon: '🧭✨',
      tag: 'SMART DISPATCH'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{slide.tag}</Text>
        </View>
        <TouchableOpacity onPress={onFinish} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Illustration */}
      <View style={styles.heroContainer}>
        <View style={styles.heroCircle}>
          <Text style={styles.heroEmoji}>{slide.icon}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentCard}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        {/* Indicators */}
        <View style={styles.dotsRow}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index && styles.dotActive
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.mainBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.mainBtnText}>
            {currentSlide === slides.length - 1 ? 'Get Started in Demo Mode 🚀' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'space-between',
    padding: 24
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16
  },
  tagBadge: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.secondary
  },
  tagText: {
    color: '#2DD4BF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  skipText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600'
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40
  },
  heroCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    ...SHADOWS.lg
  },
  heroEmoji: {
    fontSize: 50
  },
  contentCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.xl,
    padding: 24,
    ...SHADOWS.lg
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 28,
    marginBottom: 10
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 20
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0'
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.secondary
  },
  mainBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md
  },
  mainBtnText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '700'
  }
});

