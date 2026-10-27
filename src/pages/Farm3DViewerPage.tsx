import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Farm3DScene } from '../components/Farm3DScene';
import {
  Waves,
  ShieldAlert,
  ArrowUpRight,
  Droplets,
  Layers,
  Sprout,
  Compass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Farm3DViewerPage: React.FC = () => {
  const { activeFarm, farms, setActiveFarmId } = useApp();
  const [waterLevel, setWaterLevel] = useState<number>(0.45);
  const [selectedProfile, setSelectedProfile] = useState<'paddy' | 'cotton' | 'maize' | 'sugarcane'>('paddy');

  const cropToleranceData = {
    paddy: {
      name: 'Rice / Paddy (Oryza sativa)',
      maxSubmergenceDays: '12-14 days (with SUB1A gene) / 3-4 days (standard PR)',
      criticalDepth: '0.80 m',
      anoxiaTolerance: 'High (via lysigenous aerenchyma)',
      salvageAction: 'Do not dewater too abruptly if submerged in scorching direct sun; wash silt off leaves within 48h.'
    },
    cotton: {
      name: 'Cotton (Gossypium hirsutum)',
      maxSubmergenceDays: '24 - 48 hours',
      criticalDepth: '0.15 m',
      anoxiaTolerance: 'Very Low (extreme square & boll shedding)',
      salvageAction: 'Emergency trenching required immediately. Stagnant water >48 hours leads to irreversible taproot rot.'
    },
    maize: {
      name: 'Maize / Corn (Zea mays)',
      maxSubmergenceDays: '48 - 72 hours',
      criticalDepth: '0.25 m',
      anoxiaTolerance: 'Low (rapid yellowing & adventitious root collapse)',
      salvageAction: 'Drain below crown roots immediately. Foliar spray 1.5% Urea + 0.5% Zinc Sulfate after water recedes.'
    },
    sugarcane: {
      name: 'Sugarcane (Saccharum officinarum)',
      maxSubmergenceDays: '7 - 10 days',
      criticalDepth: '1.20 m',
      anoxiaTolerance: 'Moderate (aerial root sprouting along internodes)',
      salvageAction: 'Trash mulching around stool once surface is dry; apply Carbendazim drenching to arrest red rot.'
    }
  };

  const currentCropInfo = cropToleranceData[selectedProfile];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <Waves className="w-4 h-4 text-blue-400" />
              <span>Three.js PBR Digital Elevation Simulation</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Submergence Dynamics</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              3D Farm Terrain & Floodwater Simulator
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
              Simulate dynamic flood surges, inspect perimeter bund defenses, observe crop root anoxia thresholds,
              and test dewatering tractor pump layouts on real alluvial ground topography.
            </p>
          </div>

          {/* Farm Switcher */}
          <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700/80 shrink-0">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Active Farm Profile:
            </label>
            <select
              value={activeFarm?.id || ''}
              onChange={(e) => setActiveFarmId(e.target.value)}
              className="bg-slate-900 text-white text-xs rounded-xl px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farmerName}'s Farm ({f.district}, {f.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3D Simulation Viewport */}
      <Farm3DScene
        farmName={activeFarm ? `${activeFarm.farmerName}'s Farm` : 'Ghaggar River Basin Farm #1'}
        cropType={activeFarm?.cropType || 'paddy'}
        waterLevelMeters={waterLevel}
        onWaterLevelChange={(lvl) => setWaterLevel(lvl)}
      />

      {/* Interactive Crop Hypoxia & Inundation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crop Profile Switcher */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <h3>Crop Flood Tolerance Profile</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Select a crop to compare its biological endurance limits against the current 3D simulated flood surge of{' '}
            <span className="font-bold text-slate-900">{(waterLevel * 100).toFixed(0)} cm</span>:
          </p>

          <div className="grid grid-cols-2 gap-2">
            {(['paddy', 'cotton', 'maize', 'sugarcane'] as const).map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedProfile(crop)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                  selectedProfile === crop
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="capitalize">{crop}</div>
                <div className="text-[10px] text-slate-500 font-normal">
                  {crop === 'paddy' ? 'Submergence Pro' : crop === 'cotton' ? 'High Risk' : 'Moderate'}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-2">
              {currentCropInfo.name}
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Submergence Survival:</span>
              <span className="font-semibold text-slate-800">{currentCropInfo.maxSubmergenceDays}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Critical Water Depth:</span>
              <span className="font-semibold text-slate-800">{currentCropInfo.criticalDepth}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Root Anoxia Tolerance:</span>
              <span className="font-semibold text-slate-800">{currentCropInfo.anoxiaTolerance}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block text-[11px] mb-1">Agronomic Protocol:</span>
              <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                {currentCropInfo.salvageAction}
              </p>
            </div>
          </div>
        </div>

        {/* Drainage Engineering & Bund Mechanics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3>Bund & Drainage Engineering</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluation of physical farm defenses rendered in the 3D terrain:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
              <div className="font-bold text-blue-900 flex items-center justify-between">
                <span>North Embankment Bund</span>
                <span className="text-blue-700 font-mono">1.60 m Height</span>
              </div>
              <p className="text-blue-800 text-[11px]">
                {waterLevel < 1.6
                  ? `Active freeboard buffer: ${(1.6 - waterLevel).toFixed(2)}m remaining before overtopping.`
                  : 'CRITICAL OVERTOPPING: Floodwater has breached northern field bund.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Homestead Plinth Height</span>
                <span className="text-slate-700 font-mono">1.20 m Elevated</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                {waterLevel < 1.2
                  ? 'Granary, seed stock, and domestic shelter remain completely dry and safe.'
                  : 'WARNING: Evacuate granary seeds to highest ceiling shelves.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>PTO Dewatering Pump Capacity</span>
                <span className="text-slate-700 font-mono">45,000 Litres/Hour</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Can lower 1 acre inundated by 10cm depth within ~9 hours once external river backflow stops.
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Field Action Checklist */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Compass className="w-5 h-5 text-amber-600" />
            <h3>Topographic Drainage Guidelines</h3>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Follow natural contour gradient:</strong> Open perimeter cuts on the south-west low corner into village drainage nallahs.
              </span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Elevate tubewell electrical starters:</strong> Ensure starters and capacitors are at least 1.5m above ground level to avoid electrocution.
              </span>
            </div>
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Avoid wading during flash surges:</strong> Fast silt-laden water produces underwater vortexes around tubewell bores and open culverts.
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 border border-slate-200">
            <strong>3D Simulation Note:</strong> Rendered with Three.js r160+ using ACES Filmic Tone Mapping, PBR metalness-roughness workflow, and zero external binary asset dependencies.
          </div>
        </div>
      </div>
    </div>
  );
};
