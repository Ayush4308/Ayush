import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Menu,
  X,
  PhoneCall,
  Globe,
  MapPin,
  FileCheck2,
  AlertTriangle,
  Map,
  ShieldCheck,
  RotateCcw,
  Camera,
  FileText,
  SlidersHorizontal,
  Info,
  ChevronDown,
  Building2,
  Bot,
  Waves,
  Dna,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, activePage, setActivePage, farms, activeFarmId, setActiveFarmId, activeFarm } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [farmDropdownOpen, setFarmDropdownOpen] = useState(false);

  const primaryNavItems = [
    { id: 'home', label: t.nav.home, icon: Building2 },
    { id: 'dashboard', label: t.nav.dashboard, icon: ShieldCheck },
    { id: 'assistant', label: 'AI Sahayak', icon: Bot, isHighlight: true },
    { id: '3dSimulator', label: '3D Simulator', icon: Waves },
    { id: 'genomics', label: 'Crop Science', icon: Dna },
    { id: 'warnings', label: t.nav.warnings, icon: AlertTriangle },
    { id: 'floodMap', label: t.nav.floodMap, icon: Map },
    { id: 'safety', label: t.nav.safety, icon: PhoneCall, isEmergency: true }
  ];

  const secondaryNavItems = [
    { id: 'planner', label: t.nav.planner, icon: ShieldAlert },
    { id: 'recovery', label: t.nav.recovery, icon: RotateCcw },
    { id: 'photoAssess', label: t.nav.photoAssess, icon: Camera },
    { id: 'reports', label: t.nav.reports, icon: FileText },
    { id: 'settings', label: t.nav.settings, icon: SlidersHorizontal },
    { id: 'dataSources', label: t.nav.dataSources, icon: Info }
  ];

  const handleNav = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 shadow-xs">
      {/* Top Utility & Emergency Strip (Refined Executive Styling) */}
      <div className="bg-slate-900 text-slate-300 px-4 sm:px-6 py-2 text-xs font-medium border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Official Authority Status */}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="font-semibold text-emerald-400">
            {t.appName}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="hidden sm:inline text-slate-400">
            Agro-Hydrological Flood Early Warning & Recovery Platform
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
          <span className="hidden md:inline text-slate-400">
            CWC & IMD Official Grounding
          </span>
        </div>

        {/* Right: Emergency Line & Language Switcher */}
        <div className="flex items-center gap-3">
          <a
            href="tel:1078"
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-md text-xs font-semibold transition"
            title="National Disaster Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>NDRF 1078 / SDMA 1070</span>
          </a>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md text-xs transition border border-slate-700/80 font-medium"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {language === 'hi' ? 'हिन्दी' : language === 'pa' ? 'ਪੰਜਾਬੀ' : 'English'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition ${
                    language === 'en' ? 'font-bold text-emerald-600 bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition ${
                    language === 'hi' ? 'font-bold text-emerald-600 bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  onClick={() => {
                    setLanguage('pa');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 transition ${
                    language === 'pa' ? 'font-bold text-emerald-600 bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  ਪੰਜਾਬੀ (Punjabi)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Slogan */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-xs transition group-hover:bg-emerald-700">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  {t.appName}
                </div>
                <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Detect the Flood · Protect the Crop · Reduce the Loss
                </div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5">
              {/* Farm Selector */}
              {farms.length > 0 && (
                <div className="relative mr-2">
                  <button
                    onClick={() => setFarmDropdownOpen(!farmDropdownOpen)}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg text-xs border border-slate-200/80 font-medium transition"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <div className="text-left">
                      <div className="text-[10px] text-slate-500 leading-none">
                        Active Farm:
                      </div>
                      <div className="font-semibold text-slate-900 truncate max-w-[130px]">
                        {activeFarm?.farmerName || 'My Farm'}
                      </div>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
                  </button>

                  {farmDropdownOpen && (
                    <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 tracking-wider">
                        Registered Farms
                      </div>
                      {farms.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setActiveFarmId(f.id);
                            setFarmDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex items-center justify-between transition ${
                            f.id === activeFarmId ? 'bg-emerald-50/70 font-semibold text-emerald-800' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{f.farmerName}'s Farm</div>
                            <div className="text-[11px] text-slate-500">
                              {f.village}, {f.district} ({f.cropType.toUpperCase()})
                            </div>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                            {f.enteredArea} {f.enteredUnit.split('_')[0]}
                          </span>
                        </button>
                      ))}
                      <div className="border-t border-slate-100 mt-1 pt-1.5 px-3">
                        <button
                          onClick={() => {
                            setFarmDropdownOpen(false);
                            handleNav('register');
                          }}
                          className="w-full text-center py-1 text-xs text-emerald-600 font-semibold hover:underline"
                        >
                          + Add New Farm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Primary Links */}
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : item.isEmergency
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/80'
                        : item.isHighlight
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/60'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.isEmergency ? 'text-red-600' : item.isHighlight ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Secondary More Dropdown */}
              <div className="relative group ml-1">
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    secondaryNavItems.some((s) => s.id === activePage)
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                <div className="absolute right-0 hidden group-hover:block w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.id)}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition ${
                          isActive ? 'bg-emerald-50/70 font-bold text-emerald-800' : 'text-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Action: Register CTA */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleNav('register')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <FileCheck2 className="w-4 h-4 text-white" />
                <span>Register Farm</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => handleNav('register')}
                className="bg-emerald-600 text-white font-semibold text-xs px-3 py-1.5 rounded-lg"
              >
                Register
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3">
            <div className="text-[11px] font-semibold text-slate-500 mb-1">
              Select Active Farm:
            </div>
            <select
              value={activeFarmId}
              onChange={(e) => setActiveFarmId(e.target.value)}
              className="w-full bg-white text-slate-800 text-xs rounded-lg p-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farmerName}'s Farm — {f.village}, {f.district} ({f.cropType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {[...primaryNavItems, ...secondaryNavItems].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
