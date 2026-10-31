/**
 * SmartCommute Design System & Theme
 * Based on user specs: Dark navy blue, teal, white/light grey, crowd status colors
 */

export const COLORS = {
  // Brand
  primary: '#0F172A',       // Dark Navy Blue
  primaryLight: '#1E293B',  // Slate Navy
  primarySoft: '#334155',
  
  secondary: '#0D9488',     // Teal
  secondaryLight: '#14B8A6',
  secondarySoft: '#CCFBF1',
  
  // Backgrounds
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  cardMuted: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Typography
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',
  textTeal: '#0D9488',
  
  // Crowd Status Indicators (Crucial for project vision)
  crowdLow: '#10B981',       // Green - EMPTY / Low crowd
  crowdLowBg: '#ECFDF5',
  crowdLowBorder: '#A7F3D0',
  
  crowdModerate: '#F59E0B',  // Yellow/Amber - MODERATE
  crowdModerateBg: '#FFFBEB',
  crowdModerateBorder: '#FDE68A',
  
  crowdHigh: '#EF4444',      // Red - CROWDED / High crowd
  crowdHighBg: '#FEF2F2',
  crowdHighBorder: '#FECACA',
  
  // Accents
  accentBlue: '#2563EB',
  accentPurple: '#7C3AED',
  accentPink: '#EC4899',
  
  // Overlays
  overlay: 'rgba(15, 23, 42, 0.6)'
};

export const CROWD_CONFIG = {
  EMPTY: {
    label: 'EMPTY',
    display: 'Seats Available',
    color: COLORS.crowdLow,
    bg: COLORS.crowdLowBg,
    borderColor: COLORS.crowdLowBorder,
    icon: 'checkmark-circle',
    description: 'Plenty of vacant seats. Relaxed boarding.'
  },
  MODERATE: {
    label: 'MODERATE',
    display: 'Few Seats / Standing Room',
    color: COLORS.crowdModerate,
    bg: COLORS.crowdModerateBg,
    borderColor: COLORS.crowdModerateBorder,
    icon: 'alert-circle',
    description: 'Most seats occupied. Comfortable standing.'
  },
  CROWDED: {
    label: 'CROWDED',
    display: 'Packed / Standing Only',
    color: COLORS.crowdHigh,
    bg: COLORS.crowdHighBg,
    borderColor: COLORS.crowdHighBorder,
    icon: 'close-circle',
    description: 'Heavy rush. Standing room only or packed.'
  }
};

export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8
  }
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999
};

