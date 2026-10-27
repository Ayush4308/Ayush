import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ArrowRight,
  MapPin,
  AlertTriangle,
  CloudRain,
  PhoneCall,
  CheckCircle2,
  Map,
  FileCheck2,
  CalendarCheck,
  RotateCcw,
  ShieldCheck,
  Layers,
  Sparkles,
  Bot,
  Waves,
  Dna
} from 'lucide-react';
import { OFFICIAL_FLOOD_WARNINGS } from '../data/mockFloodData';

export const HomePage: React.FC = () => {
  const { t, setActivePage } = useApp();

  const activeRedWarnings = OFFICIAL_FLOOD_WARNINGS.filter((w) => w.severity === 'red');

  return (
    <div className="space-y-12 pb-12 font-sans">
      {/* Active Warning Notification Ticker (Refined Bar) */}
      <div className="bg-rose-50 border border-rose-200 text-rose-950 px-4 py-3 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-rose-700">
              Active Official Flood Alert Watch (CWC / IMD)
            </div>
            <div className="text-sm font-semibold text-rose-900">
              {activeRedWarnings[0]?.headline || t.home.statusBanner}
            </div>
          </div>
        </div>

        <button
          onClick={() => setActivePage('warnings')}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
        >
          <span>{t.home.checkWarningsCta}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-14 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          {/* Metadata Kicker (Anti-slop clean text with separators) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-medium">
            <span className="text-emerald-400 font-semibold">KrishiRakshak AI</span>
            <span aria-hidden="true">·</span>
            <span>Agricultural Flood Resilience Platform</span>
            <span aria-hidden="true">·</span>
            <span>CWC & IMD Verified Grounding</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
            {t.home.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed font-normal max-w-2xl">
            {t.home.heroSubtitle}
          </p>

          {/* Primary Question Box (Clean Hairline Callout) */}
          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-2xl mb-8 text-slate-200">
            <div className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-1">
              Core Mission: Answering the Farmer's Vital Question
            </div>
            <div className="text-base sm:text-lg font-bold italic text-white">
              "{t.primaryQuestion}"
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('register')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <FileCheck2 className="w-5 h-5 text-white" />
              <span>{t.home.registerCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('dashboard')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base px-5 py-3.5 rounded-xl border border-slate-700 shadow-xs transition flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{t.nav.dashboard}</span>
            </button>

            <button
              onClick={() => setActivePage('floodMap')}
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base px-5 py-3.5 rounded-xl border border-slate-700 shadow-xs transition flex items-center gap-2"
            >
              <Map className="w-5 h-5 text-blue-400" />
              <span>{t.home.viewMapCta}</span>
            </button>
          </div>
        </div>

        {/* Structured Quantitative Baseline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">100%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Official IMD & CWC Data</div>
          </div>
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="text-2xl font-black text-blue-400 font-mono tabular-nums">10m</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Sentinel-1 Radar Resolution</div>
          </div>
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="text-2xl font-black text-amber-400 font-mono tabular-nums">15+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Verified Regional Land Units</div>
          </div>
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="text-2xl font-black text-rose-400 font-mono tabular-nums">24x7</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Disaster Helplines Linked</div>
          </div>
        </div>
      </section>

      {/* Advanced Agricultural Technology Showcase */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">
            Groundbreaking AI & Simulation Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Integrated Agro-Geospatial & Bioscience Toolkit
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Bridging satellite radar geospatial mapping, 3D fluid inundation physics, real-time Gemini web grounding, and molecular flood genetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1: 3D Simulator */}
          <div
            onClick={() => setActivePage('3dSimulator')}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-md transition space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center transition group-hover:bg-blue-600 group-hover:text-white">
              <Waves className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">3D Terrain Flood Simulator</h3>
              <span className="text-[11px] font-mono text-slate-500">Three.js PBR</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive 3D elevation model with dynamic water surge slider, tractor dewatering pump rig,
              elevated homestead plinth checks, and crop root submergence thresholds.
            </p>
            <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
              <span>Launch 3D Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: AI Sahayak */}
          <div
            onClick={() => setActivePage('assistant')}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition group-hover:bg-emerald-600 group-hover:text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">KrishiRakshak Sahayak</h3>
              <span className="text-[11px] font-mono text-slate-500">Gemini AI</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-turn agronomy chat, speech microphone transcription via <code>gemini-3.5-transcribe</code>,
              Google Search river grounding, and Google Maps emergency shelter finder.
            </p>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
              <span>Chat with AI Sahayak</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Crop Genomics */}
          <div
            onClick={() => setActivePage('genomics')}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-500 hover:shadow-md transition space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center transition group-hover:bg-purple-600 group-hover:text-white">
              <Dna className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Crop Flood Genomics</h3>
              <span className="text-[11px] font-mono text-slate-500">UniProt Q8LP47</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Molecular dive into Rice <em>SUB1A-1</em>, ethylene-ERF dormancy signaling,
              root lysigenous aerenchyma, AlphaFold pLDDT scores, and post-flood blights.
            </p>
            <div className="text-xs font-semibold text-purple-600 flex items-center gap-1 pt-1 group-hover:translate-x-1 transition-transform">
              <span>Explore Crop Science</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: 4 Editorial Steps */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
            End-to-End Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.home.howItWorksTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.home.howItWorksSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.home.step1Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t.home.step1Desc}
              </p>
            </div>
            <button
              onClick={() => setActivePage('register')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 pt-2"
            >
              <span>Draw Boundary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.home.step2Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t.home.step2Desc}
              </p>
            </div>
            <button
              onClick={() => setActivePage('warnings')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-2"
            >
              <span>View River Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.home.step3Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t.home.step3Desc}
              </p>
            </div>
            <button
              onClick={() => setActivePage('planner')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 pt-2"
            >
              <span>Open Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {t.home.step4Title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {t.home.step4Desc}
              </p>
            </div>
            <button
              onClick={() => setActivePage('recovery')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 pt-2"
            >
              <span>Recovery Steps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Principles & Integrity Section */}
      <section className="bg-slate-100/80 p-8 sm:p-10 rounded-3xl border border-slate-200">
        <div className="max-w-3xl mb-8">
          <div className="text-xs uppercase tracking-wider font-bold text-emerald-700 mb-1">
            {t.home.corePrinciplesTitle}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.home.corePrinciplesSubtitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{t.home.safetyFirstTitle}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.home.safetyFirstDesc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{t.home.noFabricationTitle}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.home.noFabricationDesc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <Layers className="w-4 h-4 shrink-0" />
              <span>{t.home.regionalUnitsTitle}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.home.regionalUnitsDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Helpline Banner */}
      <section className="bg-rose-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-rose-200 font-semibold text-xs tracking-wider uppercase">
            <PhoneCall className="w-4 h-4" />
            <span>Emergency Lifeline</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Facing Rapidly Rising Water Right Now?
          </h3>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl leading-relaxed">
            Never attempt to rescue standing crops or diesel pumps in surging currents. Contact official 24x7 National and State Disaster Control Rooms immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:1078"
            className="bg-white hover:bg-slate-100 text-rose-900 font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call NDRF: 1078</span>
          </a>
          <button
            onClick={() => setActivePage('safety')}
            className="bg-rose-800/80 hover:bg-rose-800 text-white font-semibold text-sm px-5 py-3.5 rounded-xl border border-rose-700/80 transition"
          >
            {t.nav.safety}
          </button>
        </div>
      </section>
    </div>
  );
};
