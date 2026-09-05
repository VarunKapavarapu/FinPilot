import React, { useState, useEffect } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { Toast } from './components/common/Toast';

// Landing Page Components
import { HeroSection } from './components/landing/HeroSection';
import { ProductShowcase } from './components/landing/ProductShowcase';
import { TrustCenter } from './components/landing/TrustCenter';
import { FinalCTA } from './components/landing/FinalCTA';
import { Footer } from './components/landing/Footer';

// Dashboard Views
import { OverviewView } from './components/dashboard/OverviewView';
import { ReconciliationView } from './components/dashboard/ReconciliationView';
import { ExceptionsView } from './components/dashboard/ExceptionsView';
import { CashForecastView } from './components/dashboard/CashForecastView';
import { AIControllerView } from './components/dashboard/AIControllerView';
import { DataImportView } from './components/dashboard/DataImportView';
import { PerformanceView } from './components/dashboard/PerformanceView';
import { AuditLogView } from './components/dashboard/AuditLogView';
import { TrustSecurityView } from './components/dashboard/TrustSecurityView';
import { TaxLineMatcher } from './components/dashboard/TaxLineMatcher';
import { SettlementQAView } from './components/dashboard/SettlementQAView';

// Modals
import { ExplanationPanel } from './components/dashboard/ExplanationPanel';
import { InvestigatorModal } from './components/dashboard/InvestigatorModal';
import { RunTheBooksModal } from './components/dashboard/RunTheBooksModal';
import { AIModelSettingsModal } from './components/dashboard/AIModelSettingsModal';
import { CinematicPreloader } from './components/common/CinematicPreloader';
import { ProjectLogo } from './components/common/Logo';

import { Search, Play, Sliders, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, setCurrentView, metrics, executeRunTheBooksLoop, aiSettings } = useFinance();
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [isModelSettingsOpen, setIsModelSettingsOpen] = useState<boolean>(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>('overview');
  const [showPreloader, setShowPreloader] = useState<boolean>(true);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const launchDashboard = (tab: string = 'overview') => {
    setActiveDashboardTab(tab);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#07090D] text-slate-100 flex flex-col selection:bg-[#00F59B]/20 selection:text-[#00F59B]">
        {showPreloader && <CinematicPreloader onComplete={() => setShowPreloader(false)} />}

        <Navbar
          onLaunch={() => launchDashboard('overview')}
          onNavigateSection={id => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <main className="flex-1">
          <HeroSection onLaunch={() => launchDashboard('overview')} />
          <ProductShowcase onLaunch={() => launchDashboard('reconciliation')} />
          <TrustCenter />
          <FinalCTA onLaunch={() => launchDashboard('overview')} />
        </main>

        <Footer
          onNavigate={id => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <CommandPalette
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          onSelectView={view => launchDashboard(view)}
        />
        <RunTheBooksModal />
        <Toast />
      </div>
    );
  }

  // Dashboard Application Layout
  return (
    <div className="flex h-screen bg-[#07090D] text-slate-100 overflow-hidden selection:bg-[#00F59B]/20 selection:text-[#00F59B]">
      {showPreloader && <CinematicPreloader onComplete={() => setShowPreloader(false)} />}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={activeDashboardTab}
        onSelectView={tab => setActiveDashboardTab(tab)}
        onGoHome={() => setCurrentView('landing')}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Header */}
        <header className="h-16 px-6 bg-[#080C14]/85 backdrop-blur-xl border-b border-white/[0.07] flex items-center justify-between flex-shrink-0 select-none z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.16] text-xs text-slate-400 hover:text-slate-200 transition-all shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search or jump to...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400 border border-white/[0.08]">
                ⌘K
              </kbd>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/[0.02] border border-white/[0.05] px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] animate-pulse" />
              <span>Reconciled:</span>
              <span className="text-[#00F59B] font-bold">{metrics.matchRate}%</span>
              <span className="text-slate-600">|</span>
              <span>Exceptions:</span>
              <span className="text-amber-400 font-bold">{metrics.exceptionsCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Run the Books Header Button */}
            <button
              onClick={executeRunTheBooksLoop}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#00F59B] to-[#2CEAA0] hover:from-[#05DF72] hover:to-[#00F59B] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,245,155,0.25)] hover:shadow-[0_0_22px_rgba(0,245,155,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <ProjectLogo size={16} />
              <span className="hidden sm:inline">Run the Books</span>
            </button>

            {/* AI Model Badge */}
            <button
              onClick={() => setIsModelSettingsOpen(true)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-200 flex items-center gap-2 transition-all"
              title="Click to configure AI Model"
            >
              <Sliders className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden md:inline font-mono text-[11px]">
                {aiSettings.selectedModel.split(' ')[0]}
              </span>
            </button>

            <button
              onClick={() => setActiveDashboardTab('audit')}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              title="Audit Log"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 fintech-grid-subtle">
          {activeDashboardTab === 'overview' && (
            <OverviewView onNavigate={tab => setActiveDashboardTab(tab)} />
          )}
          {(activeDashboardTab === 'reconciliation' || activeDashboardTab === 'transactions') && (
            <ReconciliationView />
          )}
          {activeDashboardTab === 'taxlines' && <TaxLineMatcher />}
          {activeDashboardTab === 'settlements' && <SettlementQAView />}
          {activeDashboardTab === 'exceptions' && <ExceptionsView />}
          {activeDashboardTab === 'forecast' && <CashForecastView />}
          {activeDashboardTab === 'controller' && (
            <AIControllerView onNavigate={tab => setActiveDashboardTab(tab)} />
          )}
          {activeDashboardTab === 'performance' && (
            <PerformanceView onNavigate={tab => setActiveDashboardTab(tab)} />
          )}
          {activeDashboardTab === 'datasources' && (
            <DataImportView onNavigate={tab => setActiveDashboardTab(tab)} />
          )}
          {activeDashboardTab === 'audit' && <AuditLogView />}
          {activeDashboardTab === 'trust' && <TrustSecurityView />}
        </main>
      </div>

      {/* Global Modals */}
      <ExplanationPanel />
      <InvestigatorModal />
      <RunTheBooksModal />
      <AIModelSettingsModal
        isOpen={isModelSettingsOpen}
        onClose={() => setIsModelSettingsOpen(false)}
      />
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectView={view => setActiveDashboardTab(view)}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainLayout />
    </FinanceProvider>
  );
}
