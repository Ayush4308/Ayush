import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FarmMap } from '../components/FarmMap';
import { SATELLITE_FLOOD_OBSERVATIONS, RIVER_GAUGES } from '../data/mockFloodData';
import { calculateFloodOverlap } from '../utils/geo';
import {
  Map,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Compass,
  Cpu
} from 'lucide-react';

export const FloodMapPage: React.FC = () => {
  const { t, activeFarm, farms, setActiveFarmId } = useApp();
  const [selectedObsId, setSelectedObsId] = useState<string>(SATELLITE_FLOOD_OBSERVATIONS[0].id);

  const activeObservation = useMemo(() => {
    return SATELLITE_FLOOD_OBSERVATIONS.find((o) => o.id === selectedObsId) || SATELLITE_FLOOD_OBSERVATIONS[0];
  }, [selectedObsId]);

  // Geospatial Overlap Analysis Calculation
  const overlapAnalysis = useMemo(() => {
    if (!activeFarm || !activeObservation) return null;
    return calculateFloodOverlap(
      activeFarm.polygon,
      activeObservation.geoJson,
      activeFarm.id,
      activeObservation.observationDate,
      activeObservation.satelliteSensor
    );
  }, [activeFarm, activeObservation]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {t.floodMap.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.floodMap.subtitle}
            </p>
          </div>
        </div>

        {/* Farm Selector */}
        {farms.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Field:</span>
            <select
              value={activeFarm?.id}
              onChange={(e) => setActiveFarmId(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farmerName} — {f.village} ({f.district})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Observation Selector & Metadata Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Active Radar Flood Observation:
            </span>
          </div>

          <select
            value={selectedObsId}
            onChange={(e) => setSelectedObsId(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100"
          >
            {SATELLITE_FLOOD_OBSERVATIONS.map((obs) => (
              <option key={obs.id} value={obs.id}>
                {obs.title} {obs.isSimulatedOrHistorical ? '[SIMULATION / HISTORICAL]' : '[OBSERVED RADAR]'}
              </option>
            ))}
          </select>
        </div>

        {activeObservation && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Sensor & Provider</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {activeObservation.satelliteSensor}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Observation Timestamp</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {new Date(activeObservation.observationDate).toLocaleString()} (Resolution: {activeObservation.resolutionMeters}m)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Dataset Classification</span>
              <span className={`font-bold inline-block px-2 py-0.5 rounded text-[10px] ${
                activeObservation.isSimulatedOrHistorical
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              }`}>
                {activeObservation.isSimulatedOrHistorical ? 'CALIBRATED SIMULATION / HISTORICAL' : 'OBSERVED SATELLITE RADAR'}
              </span>
            </div>
            <div className="sm:col-span-3 text-[11px] text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700 italic">
              {activeObservation.disclaimer}
            </div>
          </div>
        )}
      </div>

      {/* Main Map Visualizer */}
      <div className="space-y-4">
        <FarmMap
          initialCenter={activeFarm?.centerLocation}
          initialPolygon={activeFarm?.polygon}
          isEditable={false}
          showFloodOverlays={true}
          showRiverGauges={true}
          heightClass="h-[520px]"
        />
      </div>

      {/* Overlap Calculation Results Panel */}
      {overlapAnalysis && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-500" />
              <span>{t.floodMap.overlapResultTitle}</span>
            </h2>
            <div className="text-xs text-slate-500">
              Calculation method: Projected WGS84 Geodesic Intersection
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Total Farm Area</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {overlapAnalysis.farmAreaSqm.toLocaleString()} m²
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                ≈ {(overlapAnalysis.farmAreaSqm / 4046.856).toFixed(2)} Acres
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Flooded Overlap Area</div>
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {overlapAnalysis.floodedAreaSqm.toLocaleString()} m²
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Radar intersection
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Exposure Percentage</div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {overlapAnalysis.overlapPercentage}%
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                of mapped boundary
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-xs text-slate-500">Exposure Classification</div>
              <div className={`text-xl sm:text-2xl font-black uppercase mt-1 ${
                overlapAnalysis.exposureCategory === 'severe'
                  ? 'text-red-600 dark:text-red-400'
                  : overlapAnalysis.exposureCategory === 'high'
                  ? 'text-orange-500'
                  : overlapAnalysis.exposureCategory === 'moderate'
                  ? 'text-amber-500'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {overlapAnalysis.exposureCategory}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Exposure Tier
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-500" />
              <span>Scientific Disclaimer & Agronomic Truth:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {overlapAnalysis.disclaimer}
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Technical Caveats:</span>
              <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-1">
                {overlapAnalysis.caveats.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
