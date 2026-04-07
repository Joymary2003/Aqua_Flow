import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "@/components/ui/BottomNav";
import DashboardScreen from "@/screens/DashboardScreen";
import LeakDetectionScreen from "@/screens/LeakDetectionScreen";
import InsightsScreen from "@/screens/InsightsScreen";
import BillEstimationScreen from "@/screens/BillEstimationScreen";
import TipsScreen from "@/screens/TipsScreen";
import ProfileScreen from "@/screens/ProfileScreen";
import OnboardingScreen from "@/screens/OnboardingScreen";
import NotificationSettings from "@/screens/NotificationSettings";
import UnitsSettings from "@/screens/UnitsSettings";
import PrivacySettings from "@/screens/PrivacySettings";
import HelpSupport from "@/screens/HelpSupport";
import SplashScreen from "@/components/ui/SplashScreen";
import AuthScreen from "@/screens/AuthScreen";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type SubScreen = "notifications" | "units" | "privacy" | "help" | null;

const screens: Record<string, React.FC> = {
  dashboard: DashboardScreen,
  leaks: LeakDetectionScreen,
  insights: InsightsScreen,
  bills: BillEstimationScreen,
  tips: TipsScreen,
};

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [subScreen, setSubScreen] = useState<SubScreen>(null);
  const { logout, isAuthenticated } = useAuth();

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    const seen = localStorage.getItem("aquaflow-onboarded");
    if (!seen) {
      setShowOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("aquaflow-onboarded", "true");
    setShowOnboarding(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  // Sub-screens from Profile
  if (subScreen) {
    const subScreenMap: Record<string, React.ReactNode> = {
      notifications: <NotificationSettings onBack={() => setSubScreen(null)} />,
      units: <UnitsSettings onBack={() => setSubScreen(null)} />,
      privacy: <PrivacySettings onBack={() => setSubScreen(null)} />,
      help: <HelpSupport onBack={() => setSubScreen(null)} />,
    };

    return (
      <div className="min-h-screen bg-background max-w-lg mx-auto relative">
        <div className="h-11" />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {subScreenMap[subScreen]}
        </motion.div>
      </div>
    );
  }

  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully");
  };

  const renderScreen = () => {
    if (activeScreen === "profile") {
      return (
        <ProfileScreen
          onNotificationTap={() => setSubScreen("notifications")}
          onUnitsTap={() => setSubScreen("units")}
          onPrivacyTap={() => setSubScreen("privacy")}
          onHelpTap={() => setSubScreen("help")}
          onSignOut={handleSignOut}
        />
      );
    }
    const Screen = screens[activeScreen];
    return Screen ? <Screen /> : null;
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <div className="h-11" />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScreen}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="pb-24 overflow-y-auto"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      <BottomNav active={activeScreen} onNavigate={setActiveScreen} />
    </div>
  );
};

export default Index;
