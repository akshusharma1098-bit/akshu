import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { COLORS } from './config/theme';

// Import Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import SearchScreen from './screens/SearchScreen';
import MapScreen from './screens/MapScreen';
import RouteComparisonScreen from './screens/RouteComparisonScreen';
import CrowdReportScreen from './screens/CrowdReportScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';

// Import Reusable Components
import BottomNav from './components/BottomNav';
import ReportModal from './components/ReportModal';
import { INITIAL_CROWD_REPORTS, KOTA_ROUTES, KOTA_STOPS } from './data/demoData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [user, setUser] = useState({
    uid: 'guest_demo_user',
    displayName: 'Kota Commuter (Demo)',
    email: 'guest@smartcommute.demo',
    role: 'user',
    isGuest: true
  });
  const [reports, setReports] = useState(INITIAL_CROWD_REPORTS);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportStop, setSelectedReportStop] = useState(null);
  const [selectedStopForMap, setSelectedStopForMap] = useState(KOTA_STOPS[0]);
  const [searchParams, setSearchParams] = useState({
    origin: 'Landmark City (Kunhari Hub)',
    destination: 'Medical College & Rangbari Hospital'
  });

  // Handle navigation
  const navigateTo = (screen, params = {}) => {
    if (params.destination) {
      setSearchParams(prev => ({ ...prev, destination: params.destination }));
    }
    setCurrentScreen(screen);
  };

  // Add new crowd report
  const handleAddNewReport = (newReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  // Delete/Moderate report
  const handleDeleteReport = (reportId) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  // Check which screens show the bottom nav bar
  const showBottomNav = [
    'dashboard',
    'search',
    'map',
    'routes',
    'report',
    'notifications',
    'profile',
    'admin'
  ].includes(currentScreen);

  // Map current screen to active tab
  const getActiveTab = () => {
    if (currentScreen === 'dashboard') return 'dashboard';
    if (currentScreen === 'search') return 'search';
    if (currentScreen === 'map') return 'map';
    if (currentScreen === 'routes') return 'routes';
    if (currentScreen === 'report') return 'report';
    return 'dashboard';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.appContainer}>
        {/* Render Screen Based on State */}
        {currentScreen === 'splash' && (
          <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingScreen onFinish={() => setCurrentScreen('auth')} />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen
            onAuthSuccess={(userData) => {
              setUser(userData);
              setCurrentScreen('dashboard');
            }}
            onGuestLogin={(guestData) => {
              setUser(guestData);
              if (guestData.role === 'admin') {
                setCurrentScreen('admin');
              } else {
                setCurrentScreen('dashboard');
              }
            }}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen
            user={user}
            reports={reports}
            onNavigate={navigateTo}
            onOpenReportModal={() => {
              setSelectedReportStop(null);
              setIsReportModalOpen(true);
            }}
            onSelectRoute={(route) => {
              setSearchParams({ origin: route.from, destination: route.to });
              setCurrentScreen('routes');
            }}
            onSelectStop={(stop) => {
              setSelectedStopForMap(stop);
              setCurrentScreen('map');
            }}
          />
        )}

        {currentScreen === 'search' && (
          <SearchScreen
            initialOrigin={searchParams.origin}
            initialDestination={searchParams.destination}
            onNavigate={navigateTo}
            onSearchRoutes={(query) => {
              setSearchParams(query);
              setCurrentScreen('routes');
            }}
          />
        )}

        {currentScreen === 'map' && (
          <MapScreen
            selectedStop={selectedStopForMap}
            onSelectStop={(stop) => setSelectedStopForMap(stop)}
            onNavigate={navigateTo}
            onOpenReportModal={(stop) => {
              setSelectedReportStop(stop);
              setIsReportModalOpen(true);
            }}
          />
        )}

        {currentScreen === 'routes' && (
          <RouteComparisonScreen
            searchQuery={searchParams}
            onNavigate={navigateTo}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {currentScreen === 'report' && (
          <CrowdReportScreen
            reports={reports}
            onAddNewReport={handleAddNewReport}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'notifications' && (
          <NotificationsScreen onNavigate={navigateTo} />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            user={user}
            onLogout={() => setCurrentScreen('auth')}
            onNavigate={navigateTo}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminDashboardScreen
            reports={reports}
            onDeleteReport={handleDeleteReport}
            onNavigate={navigateTo}
          />
        )}

        {/* Global Bottom Navigation */}
        {showBottomNav && (
          <BottomNav
            activeTab={getActiveTab()}
            onSelectTab={(tabKey) => {
              if (tabKey === 'report') {
                setIsReportModalOpen(true);
              } else {
                navigateTo(tabKey);
              }
            }}
          />
        )}

        {/* Global Report Modal */}
        <ReportModal
          visible={isReportModalOpen}
          initialStop={selectedReportStop}
          onClose={() => setIsReportModalOpen(false)}
          onSubmitReport={(newRep) => {
            handleAddNewReport(newRep);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary
  },
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
    position: 'relative'
  }
});

