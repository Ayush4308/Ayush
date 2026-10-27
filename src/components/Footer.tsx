import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, PhoneCall, CheckCircle2, Bot, Waves, Dna } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setActivePage } = useApp();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 mt-20 pt-14 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Slogan */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">{t.appName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-assisted agricultural flood preparedness, geospatial Sentinel-1 flood mapping,
              and crop recovery platform for Indian farmers.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
              <span className="font-semibold text-emerald-400 block mb-0.5">Project Slogan:</span>
              "{t.appSlogan}"
            </div>
          </div>

          {/* Col 2: Farmer Action Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-3">
              Farmer Action Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-emerald-400 transition">
                  {t.nav.dashboard}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('register')} className="hover:text-emerald-400 transition">
                  {t.nav.register}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('warnings')} className="hover:text-emerald-400 transition">
                  {t.nav.warnings}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('floodMap')} className="hover:text-emerald-400 transition">
                  {t.nav.floodMap}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('planner')} className="hover:text-emerald-400 transition">
                  {t.nav.planner}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('safety')} className="text-red-400 font-semibold hover:underline">
                  {t.nav.safety}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Advanced Intelligence & Biology */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-3">
              Advanced Technology
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActivePage('assistant')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KrishiRakshak Sahayak (AI)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('3dSimulator')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-blue-400" />
                  <span>3D Flood Terrain Simulator</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('genomics')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-purple-400" />
                  <span>Crop Flood Genomics (SUB1A)</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('recovery')} className="hover:text-emerald-400 transition">
                  {t.nav.recovery}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('photoAssess')} className="hover:text-emerald-400 transition">
                  {t.nav.photoAssess}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('dataSources')} className="hover:text-emerald-400 transition">
                  {t.nav.dataSources}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official 24x7 Helplines */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>Official 24x7 Helplines</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/80">
                <div className="text-[11px] text-slate-400">National Disaster Helpline (NDRF)</div>
                <a href="tel:1078" className="font-bold text-red-400 hover:underline text-sm block mt-0.5">
                  1078 (Toll-Free)
                </a>
              </div>
              <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/80">
                <div className="text-[11px] text-slate-400">State Disaster Management Authority</div>
                <a href="tel:1070" className="font-bold text-amber-400 hover:underline text-sm block mt-0.5">
                  1070 / District: 1077
                </a>
              </div>
              <div className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/80">
                <div className="text-[11px] text-slate-400">National Kisan Call Centre (Agri Advice)</div>
                <a href="tel:18001801551" className="font-bold text-emerald-400 hover:underline text-sm block mt-0.5">
                  1800-180-1551
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Data Standards & Disclaimer (Anti-slop clean typography) */}
        <div className="border-t border-slate-800 pt-6 text-[11px] text-slate-400 space-y-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-300">
            <span className="font-semibold text-white flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Data Integrity Standards:
            </span>
            <span>India Meteorological Department (IMD)</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Central Water Commission (CWC)</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Copernicus Sentinel-1 SAR</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>ISRO Bhuvan</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>State Revenue Land Manuals</span>
          </div>

          <p className="leading-relaxed text-slate-400">
            <strong className="text-slate-300">Important Advisory:</strong> KrishiRakshak AI does not fabricate forecasts, satellite radar data, or crop damage claims. All flood risk observations, river level alerts, and radar overlays represent official bulletins and satellite acquisitions. Overlap percentages estimate field exposure and do not guarantee or legally certify crop compensation. In case of imminent flood threat, prioritize human and animal safety above all farm assets.
          </p>

          <div className="flex flex-wrap justify-between items-center pt-4 text-slate-400 border-t border-slate-800/60 text-xs">
            <div>© 2026 KrishiRakshak AI · Built for Indian Farmers & Disaster Resilience.</div>
            <div className="flex gap-4">
              <button onClick={() => setActivePage('dataSources')} className="hover:text-emerald-400">
                Methodology & Sources
              </button>
              <button onClick={() => setActivePage('safety')} className="hover:text-emerald-400">
                Safety Protocol
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
