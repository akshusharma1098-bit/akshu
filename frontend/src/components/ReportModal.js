import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { COLORS, RADIUS, SHADOWS, CROWD_CONFIG } from '../config/theme';
import { KOTA_STOPS, KOTA_ROUTES } from '../data/demoData';

export default function ReportModal({
  visible = false,
  onClose,
  onSubmitReport,
  initialStop = null,
  initialRoute = null
}) {
  const [selectedLevel, setSelectedLevel] = useState('MODERATE');
  const [selectedRouteId, setSelectedRouteId] = useState(initialRoute?.id || 'R101');
  const [selectedStopId, setSelectedStopId] = useState(initialStop?.id || 'stop_nayapura');
  const [vehicleId, setVehicleId] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastSubmittedTime, setLastSubmittedTime] = useState(0);

  const levels = [
    {
      key: 'EMPTY',
      title: 'EMPTY (Green)',
      subtitle: 'Plenty of seats available',
      color: COLORS.crowdLow,
      bg: COLORS.crowdLowBg,
      border: COLORS.crowdLowBorder,
      icon: '🟢'
    },
    {
      key: 'MODERATE',
      title: 'MODERATE (Yellow)',
      subtitle: 'Most seats occupied, standing OK',
      color: COLORS.crowdModerate,
      bg: COLORS.crowdModerateBg,
      border: COLORS.crowdModerateBorder,
      icon: '🟡'
    },
    {
      key: 'CROWDED',
      title: 'CROWDED (Red)',
      subtitle: 'Standing room only or packed',
      color: COLORS.crowdHigh,
      bg: COLORS.crowdHighBg,
      border: COLORS.crowdHighBorder,
      icon: '🔴'
    }
  ];

  const handleSubmit = () => {
    setErrorMsg('');

    // Anti-spam validation: 15 seconds threshold between user submissions
    const now = Date.now();
    if (now - lastSubmittedTime < 15000) {
      setErrorMsg('Anti-Spam Shield: Please wait 15 seconds before reporting again.');
      return;
    }

    if (!selectedStopId) {
      setErrorMsg('Please select a station or stop.');
      return;
    }

    const routeObj = KOTA_ROUTES.find(r => r.id === selectedRouteId) || KOTA_ROUTES[0];
    const stopObj = KOTA_STOPS.find(s => s.id === selectedStopId) || KOTA_STOPS[0];

    setIsSubmitting(true);

    const reportData = {
      id: 'rep_' + Date.now(),
      routeId: routeObj.id,
      routeName: routeObj.name,
      vehicleId: vehicleId.trim() || routeObj.activeVehicles?.[0] || 'RJ-20-EB-4102',
      stopId: stopObj.id,
      stopName: stopObj.name,
      crowdLevel: selectedLevel,
      crowdScore: selectedLevel === 'EMPTY' ? 20 : (selectedLevel === 'MODERATE' ? 50 : 88),
      comment: comment.trim() || (selectedLevel === 'EMPTY' ? 'Seats easily available' : selectedLevel === 'MODERATE' ? 'Moderate rush' : 'Heavy crowd, packed vehicle'),
      timestamp: Date.now(),
      userName: 'Live Commuter (You)',
      userBadge: 'Active Contributor',
      upvotes: 1
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setLastSubmittedTime(now);
      if (onSubmitReport) {
        onSubmitReport(reportData);
      }
      setComment('');
      setVehicleId('');
      if (onClose) onClose();
    }, 400);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>📢 Live Crowd Report</Text>
              <Text style={styles.subtitle}>Help fellow Kota commuters travel smarter</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          {/* Crowd Level Selector (1. EMPTY, 2. MODERATE, 3. CROWDED) */}
          <Text style={styles.sectionLabel}>1. SELECT CURRENT CROWD DENSITY</Text>
          <View style={styles.levelGroup}>
            {levels.map(lvl => {
              const isSelected = selectedLevel === lvl.key;
              return (
                <TouchableOpacity
                  key={lvl.key}
                  style={[
                    styles.levelCard,
                    { borderColor: isSelected ? lvl.color : COLORS.border, backgroundColor: isSelected ? lvl.bg : COLORS.cardBackground }
                  ]}
                  onPress={() => setSelectedLevel(lvl.key)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.levelIcon}>{lvl.icon}</Text>
                  <View style={styles.levelInfo}>
                    <Text style={[styles.levelTitle, { color: isSelected ? lvl.color : COLORS.textPrimary }]}>
                      {lvl.title}
                    </Text>
                    <Text style={styles.levelSubtitle}>{lvl.subtitle}</Text>
                  </View>
                  <View style={[styles.radioCircle, isSelected && { borderColor: lvl.color, backgroundColor: lvl.color }]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Route & Stop Selectors */}
          <View style={styles.rowPickers}>
            <View style={styles.pickerField}>
              <Text style={styles.fieldLabel}>Transit Route</Text>
              <select
                style={styles.nativeSelect}
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
              >
                {KOTA_ROUTES.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </View>

            <View style={styles.pickerField}>
              <Text style={styles.fieldLabel}>Station / Stop Name</Text>
              <select
                style={styles.nativeSelect}
                value={selectedStopId}
                onChange={(e) => setSelectedStopId(e.target.value)}
              >
                {KOTA_STOPS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </View>
          </View>

          {/* Vehicle ID & Comment */}
          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>Vehicle / Bus Reg. No. (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. RJ-20-EB-4102 or City Bus 12"
              value={vehicleId}
              onChangeText={setVehicleId}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputField}>
            <Text style={styles.fieldLabel}>Live Comment / Observation (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="e.g. AC working great, standing crowd near rear door..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={2}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Syncing with Firebase...' : 'Submit Real-Time Report 🚀'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: COLORS.cardBackground,
    borderRadius: RADIUS.lg,
    padding: 18,
    ...SHADOWS.lg
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.cardMuted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '700'
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 10
  },
  errorText: {
    color: COLORS.crowdHigh,
    fontSize: 11,
    fontWeight: '600'
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8
  },
  levelGroup: {
    gap: 8,
    marginBottom: 14
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5
  },
  levelIcon: {
    fontSize: 20,
    marginRight: 10
  },
  levelInfo: {
    flex: 1
  },
  levelTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  levelSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1
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
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.cardBackground
  },
  rowPickers: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  pickerField: {
    flex: 1
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4
  },
  nativeSelect: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '10px',
    border: '1.5px solid #E2E8F0',
    fontSize: '12px',
    fontWeight: '600',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    outline: 'none'
  },
  inputField: {
    marginBottom: 10
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: COLORS.textPrimary,
    backgroundColor: '#FAFAFA'
  },
  textArea: {
    height: 54,
    textAlignVertical: 'top'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.cardMuted
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondary
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textWhite
  }
});

