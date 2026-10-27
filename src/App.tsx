import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { RegisterFarmPage } from './pages/RegisterFarmPage';
import { DashboardPage } from './pages/DashboardPage';
import { WeatherWarningsPage } from './pages/WeatherWarningsPage';
import { FloodMapPage } from './pages/FloodMapPage';
import { CropPlannerPage } from './pages/CropPlannerPage';
import { DuringFloodSafetyPage } from './pages/DuringFloodSafetyPage';
import { PostFloodRecoveryPage } from './pages/PostFloodRecoveryPage';
import { CropPhotoAssessmentPage } from './pages/CropPhotoAssessmentPage';
import { FarmReportsPage } from './pages/FarmReportsPage';
import { SettingsAlertsPage } from './pages/SettingsAlertsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { Farm3DViewerPage } from './pages/Farm3DViewerPage';
import { BioscienceGenomicsPage } from './pages/BioscienceGenomicsPage';
import { AiAssistantPage } from './pages/AiAssistantPage';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'register':
        return <RegisterFarmPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'warnings':
        return <WeatherWarningsPage />;
      case 'floodMap':
        return <FloodMapPage />;
      case 'planner':
        return <CropPlannerPage />;
      case 'safety':
        return <DuringFloodSafetyPage />;
      case 'recovery':
        return <PostFloodRecoveryPage />;
      case 'photoAssess':
        return <CropPhotoAssessmentPage />;
      case 'reports':
        return <FarmReportsPage />;
      case 'settings':
        return <SettingsAlertsPage />;
      case 'dataSources':
        return <DataSourcesPage />;
      case '3dSimulator':
        return <Farm3DViewerPage />;
      case 'genomics':
        return <BioscienceGenomicsPage />;
      case 'assistant':
        return <AiAssistantPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
