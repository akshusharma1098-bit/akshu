import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../config/theme';
import Header from '../components/Header';
import { KOTA_STOPS } from '../data/demoData';

export default function SearchScreen({
  initialOrigin = 'Aerodrome Circle Interchange',
  initialDestination = 'Medical College & Rangbari Hospital',
  onSearchRoutes,
  onNavigate
}) {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [selectedPreference, setSelectedPreference] = useState('least_crowded'); // 'least_crowded' | 'fastest' | 'balanced'

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (onSearchRoutes) {
      onSearchRoutes({ origin, destination, preference: selectedPreference });
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Find Routes"
        subtitle="AI Route Optimizer"
        showBack={true}
        onBack={() => onNavigate('dashboard')}
        onPressNotifications={() => onNavigate('notifications')}
        onPressProfile={() => onNavigate('profile')}
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Input Card */}
        <View style={styles.routeInputCard}>
          <View style={styles.indicatorCol}>
            <View style={styles.originDot} />
            <View style={styles.dashedVertical} />
            <View style={styles.destDot} />
          </View>

          <View style={styles.inputsCol}>
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldTag}>ORIGIN</Text>
              <TextInput
                style={styles.textInput}
                value={origin}
                onChangeText={setOrigin}
                placeholder="Enter starting location or stop..."
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldTag}>DESTINATION</Text>
              <TextInput
                style={styles.textInput}
                value={destination}
                onChangeText={setDestination}
                placeholder="Enter destination stop in Kota..."
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.swapBtn} onPress={swapLocations} activeOpacity={0.7}>
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>
        </View>

        {/* Optimization Preference */}
        <Text style={styles.sectionTitle}>Smart Route Recommendation Criteria</Text>
        <View style={styles.criteriaGroup}>
          {[
            {
              id: 'least_crowded',
              icon: '🟢',
              title: 'Least Crowded (AI Priority)',
              desc: 'Selects routes with highest probability of vacant seats'
            },
            {
              id: 'balanced',
              icon: '⚖️',
              title: 'Balanced Route',
              desc: 'Optimizes combined travel duration and crowd density'
            },
            {
              id: 'fastest',
              icon: '⚡',
              title: 'Shortest Time',
              desc: 'Direct routes regardless of passenger density'
            }
          ].map(crit => {
            const isSelected = selectedPreference === crit.id;
            return (
              <TouchableOpacity
                key={crit.id}
                style={[styles.criteriaCard, isSelected && styles.criteriaCardActive]}
                onPress={() => setSelectedPreference(crit.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.criteriaIcon}>{crit.icon}</Text>
                <View style={styles.criteriaInfo}>
                  <Text style={[styles.criteriaTitle, isSelected && styles.criteriaTitleActive]}>
                    {crit.title}
                  </Text>
                  <Text style={styles.criteriaDesc}>{crit.desc}</Text>
                </View>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Location Shortcuts */}
        <Text style={styles.sectionTitle}>Popular Transit Hubs in Kota</Text>
        <View style={styles.popularHubsList}>
          {KOTA_STOPS.slice(0, 5).map(stop => (
            <TouchableOpacity
              key={stop.id}
              style={styles.hubItem}
              onPress={() => setDestination(stop.name)}
              activeOpacity={0.7}
            >
              <View style={styles.hubIconBg}>
                <Text style={styles.hubEmoji}>
                  {stop.type === 'railway' ? '🚂' : (stop.type === 'metro_junction' ? '🚇' : '🚏')}
                </Text>
              </View>
              <View style={styles.hubDetails}>
                <Text style={styles.hubName}>{stop.name}</Text>
                <Text style={styles.hubMeta}>Serving: {stop.routesServing.join(', ')} • {stop.type.replace('_', ' ')}</Text>
              </View>
              <Text style={styles.hubSelectArrow}>Set →</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA Search Button */}
        <TouchableOpacity style={styles.searchSubmitBtn} onPress={handleSearch} activeOpacity={0.85}>
          <Text style={styles.searchSubmitText}>Find Less-Crowded Routes 🚀</Text>
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
  routeInputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 20,
    ...SHADOWS.md
  },
  indicatorCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 8
  },
  originDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary
  },
  dashedVertical: {
    width: 2,
    height: 28,
    backgroundColor: COLORS.border,
    marginVertical: 4
  },
  destDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary
  },
  inputsCol: {
    flex: 1
  },
  inputWrapper: {
    paddingVertical: 2
  },
  fieldTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2
  },
  textInput: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    paddingVertical: 4
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 6
  },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  },
  swapIcon: {
    fontSize: 18,
    color: COLORS.textPrimary
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10
  },
  criteriaGroup: {
    gap: 8,
    marginBottom: 22
  },
  criteriaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm
  },
  criteriaCardActive: {
    borderColor: COLORS.secondary,
    backgroundColor: '#F0FDFA'
  },
  criteriaIcon: {
    fontSize: 22,
    marginRight: 12
  },
  criteriaInfo: {
    flex: 1
  },
  criteriaTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  criteriaTitleActive: {
    color: COLORS.secondary
  },
  criteriaDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.cardBackground
  },
  popularHubsList: {
    gap: 8,
    marginBottom: 24
  },
  hubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.sm,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  hubIconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  hubEmoji: {
    fontSize: 16
  },
  hubDetails: {
    flex: 1
  },
  hubName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  hubMeta: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  hubSelectArrow: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary
  },
  searchSubmitBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    ...SHADOWS.md
  },
  searchSubmitText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '800'
  }
});

