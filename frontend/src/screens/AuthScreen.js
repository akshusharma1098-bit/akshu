import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '../config/theme';

export default function AuthScreen({ onAuthSuccess, onGuestLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [preferredMode, setPreferredMode] = useState('bus');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = () => {
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    const userData = {
      uid: 'usr_' + Date.now(),
      email: email.trim(),
      displayName: isLogin ? (email.split('@')[0]) : (fullName.trim() || 'Commuter'),
      preferredMode,
      role: email.includes('admin') ? 'admin' : 'user',
      isGuest: false
    };

    if (onAuthSuccess) onAuthSuccess(userData);
  };

  const handleDemoLogin = (role = 'student') => {
    const demoUser = role === 'admin' ? {
      uid: 'admin_demo_01',
      email: 'admin@smartcommute.kota',
      displayName: 'Kota Transit Controller (Admin)',
      preferredMode: 'all',
      role: 'admin',
      isGuest: false
    } : {
      uid: 'guest_demo_user',
      email: 'guest.rider@kota.demo',
      displayName: 'Guest Commuter (Demo)',
      preferredMode: 'bus',
      role: 'user',
      isGuest: true
    };

    if (onGuestLogin) onGuestLogin(demoUser);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <Text style={styles.brandTitle}>SmartCommute</Text>
          <Text style={styles.brandSubtitle}>AI-Powered Smart Transport & Crowd Predictor</Text>
        </View>

        {/* Auth Card */}
        <View style={styles.card}>
          {/* Tab Switcher */}
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => { setIsLogin(true); setErrorMsg(''); }}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => { setIsLogin(false); setErrorMsg(''); }}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Register</Text>
            </TouchableOpacity>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          {/* Form */}
          {!isLogin && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Neha Sharma"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. commuter@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          {!isLogin && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Primary Travel Preference</Text>
              <View style={styles.preferenceRow}>
                {['bus', 'metro', 'train'].map(mode => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.prefBtn, preferredMode === mode && styles.prefBtnActive]}
                    onPress={() => setPreferredMode(mode)}
                  >
                    <Text style={[styles.prefBtnText, preferredMode === mode && styles.prefBtnTextActive]}>
                      {mode === 'bus' ? '🚌 Bus' : mode === 'metro' ? '🚇 Metro Feeder' : '🚂 Train'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={handleAuth} activeOpacity={0.85}>
            <Text style={styles.submitBtnText}>
              {isLogin ? 'Sign In with Email' : 'Create Free Account'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR HACKATHON DEMO</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Instant Guest / Demo Modes */}
          <TouchableOpacity
            style={styles.demoGuestBtn}
            onPress={() => handleDemoLogin('student')}
            activeOpacity={0.8}
          >
            <Text style={styles.demoGuestText}>⚡ Instant Guest / Commuter Demo Mode</Text>
            <Text style={styles.demoGuestSub}>1-click access without signup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoAdminBtn}
            onPress={() => handleDemoLogin('admin')}
            activeOpacity={0.8}
          >
            <Text style={styles.demoAdminText}>🛡️ Open Admin Dashboard Demo Mode</Text>
            <Text style={styles.demoAdminSub}>Review real-time stats & moderation tools</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background
  },
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%'
  },
  header: {
    alignItems: 'center',
    marginBottom: 24
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...SHADOWS.md
  },
  logoIcon: {
    fontSize: 28
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5
  },
  brandSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center'
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: 22,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardMuted,
    borderRadius: RADIUS.sm,
    padding: 4,
    marginBottom: 18
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8
  },
  tabActive: {
    backgroundColor: COLORS.cardBackground,
    ...SHADOWS.sm
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '800'
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 14
  },
  errorText: {
    color: COLORS.crowdHigh,
    fontSize: 12,
    fontWeight: '600'
  },
  fieldGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary
  },
  preferenceRow: {
    flexDirection: 'row',
    gap: 6
  },
  prefBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center'
  },
  prefBtnActive: {
    backgroundColor: '#CCFBF1',
    borderColor: COLORS.secondary
  },
  prefBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  prefBtnTextActive: {
    color: COLORS.secondary,
    fontWeight: '800'
  },
  submitBtn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: 8,
    ...SHADOWS.sm
  },
  submitBtnText: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '700'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.6
  },
  demoGuestBtn: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  demoGuestText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '800'
  },
  demoGuestSub: {
    color: '#0F766E',
    fontSize: 10,
    marginTop: 2
  },
  demoAdminBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  demoAdminText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800'
  },
  demoAdminSub: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2
  }
});

