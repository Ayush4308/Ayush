import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FarmMap } from '../components/FarmMap';
import { OFFICIAL_FLOOD_WARNINGS, SATELLITE_FLOOD_OBSERVATIONS } from '../data/mockFloodData';
import { CROPS_DATA } from '../data/crops';
import { calculateFloodOverlap } from '../utils/geo';
import {
  ShieldAlert,
  AlertTriangle,
  CloudRain,
  MapPin,
  CalendarCheck,
  RotateCcw,
  Clock,
  ArrowRight,
  ExternalLink,
  Droplets,
  Wind,
  CheckCircle2,
  FileText,
  Bot,
  Waves,
  Dna
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    t,
    farms,
    activeFarmId,
    setActiveFarmId,
    activeFarm,
    setActivePage,
    weatherData,
    isLoadingWeather,
    checklistProgress,
    smsSimulatedLogs
  } = useApp();

  // Selected farm's crop definition
  const cropInfo = activeFarm ? CROPS_DATA[activeFarm.cropType] : null;

  // Filter warnings relevant to active farm state or district
  const relevantWarnings = useMemo(() => {
    if (!activeFarm) return OFFICIAL_FLOOD_WARNINGS.slice(0, 2);
    const matched = OFFICIAL_FLOOD_WARNINGS.filter(
      (w) => w.district.toLowerCase() === activeFarm.district.toLowerCase() ||
             w.state.toLowerCase() === activeFarm.state.toLowerCase()
    );
    return matched.length > 0 ? matched : OFFICIAL_FLOOD_WARNINGS.slice(0, 1);
  }, [activeFarm]);

  // Compute flood overlap with first relevant satellite observation
  const primaryObservation = SATELLITE_FLOOD_OBSERVATIONS[0];
  const overlapResult = useMemo(() => {
    if (!activeFarm || !primaryObservation) return null;
    return calculateFloodOverlap(
      activeFarm.polygon,
      primaryObservation.geoJson,
      activeFarm.id,
      primaryObservation.observationDate,
      primaryObservation.satelliteSensor
    );
  }, [activeFarm, primaryObservation]);

  // Checklist items completion count
  const completedChecklistCount = useMemo(() => {
    if (!cropInfo) return 0;
    return cropInfo.preFloodChecklist.filter((item) => !!checklistProgress[item.id]).length;
  }, [cropInfo, checklistProgress]);

  if (!activeFarm) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
        <p className="text-slate-600 font-medium">No farms registered yet.</p>
        <button
          onClick={() => setActivePage('register')}
          className="mt-4 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-xs hover:bg-emerald-700 transition"
        >
          {t.register.title}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* 1. Selected Farm and Crop Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Active Monitored Field:
            </span>
            <select
              value={activeFarmId}
              onChange={(e) => setActiveFarmId(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farmerName} ({f.village}, {f.district})
                </option>
              ))}
            </select>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeFarm.farmerName}'s Farm — {activeFarm.village}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {activeFarm.district}, {activeFarm.state}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {cropInfo?.nativeNames.en} ({activeFarm.growthStage.toUpperCase()})
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {activeFarm.enteredArea} {activeFarm.enteredUnit.split('_')[0]} ({activeFarm.areaSqm.toLocaleString()} m²)
            </span>
          </div>
        </div>

        {/* Quick Tech Actions */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={() => setActivePage('assistant')}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-800 text-xs font-semibold px-3 py-2 rounded-xl border border-emerald-200 transition"
          >
            <Bot className="w-4 h-4 text-emerald-600" />
            <span>AI Sahayak</span>
          </button>
          <button
            onClick={() => setActivePage('3dSimulator')}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100/70 text-blue-800 text-xs font-semibold px-3 py-2 rounded-xl border border-blue-200 transition"
          >
            <Waves className="w-4 h-4 text-blue-600" />
            <span>3D Flood Sim</span>
          </button>
          <button
            onClick={() => setActivePage('reports')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-xs transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
        </div>
      </div>

      {/* Primary Question Direct Summary Callout */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-1.5">
          Farmer Direct Advisory
        </div>
        <div className="text-sm sm:text-base font-medium leading-relaxed text-slate-200 space-y-1">
          <div>
            📍 <strong>Near your farm:</strong> {relevantWarnings[0]?.headline || 'No severe river flood alerts active.'}
          </div>
          <div>
            🌾 <strong>Crop stage risk:</strong> {cropInfo?.stages.find((s) => s.stage === activeFarm.growthStage)?.vulnerabilityNotice.en}
          </div>
          <div>
            ⚡ <strong>Immediate priority:</strong> Clear low perimeter drainage ditches; elevate tubewell pump electrical starters at least 1.5m above ground.
          </div>
        </div>
      </div>

      {/* 2. Latest Relevant Official Warnings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>{t.dashboard.latestWarningsTitle}</span>
          </h2>
          <button
            onClick={() => setActivePage('warnings')}
            className="text-xs text-emerald-600 font-semibold hover:underline"
          >
            View All Bulletins →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relevantWarnings.map((warn) => {
            const isRed = warn.severity === 'red';
            return (
              <div
                key={warn.id}
                className={`p-5 rounded-2xl border transition ${
                  isRed
                    ? 'bg-red-50/60 border-red-200 text-red-950'
                    : 'bg-amber-50/60 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide ${
                      isRed ? 'bg-red-600 text-white' : 'bg-amber-500 text-slate-900'
                    }`}
                  >
                    {warn.severity.toUpperCase()} ALERT
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {warn.lastUpdated}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-2">
                  {warn.headline}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {warn.description}
                </p>

                <div className="bg-white/80 p-3 rounded-xl text-xs text-slate-600 border border-slate-200/60 space-y-1">
                  <div>
                    <strong>Threat Window:</strong> {warn.expectedThreatPeriod}
                  </div>
                  <div>
                    <strong>Official Source:</strong> {warn.source}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Weather Near The Farm & Rain Forecast */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {t.dashboard.weatherTitle}
            </h2>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {isLoadingWeather ? 'Refreshing live readings...' : `Updated: ${weatherData?.lastUpdated || 'Recent'}`}
          </div>
        </div>

        {weatherData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div className="text-xs text-slate-500">Current Temp & Sky</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                {weatherData.temp}°C
              </div>
              <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                {weatherData.condition}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div className="text-xs text-slate-500">Past 24h Rainfall</div>
              <div className="text-2xl font-bold text-blue-600 font-mono tabular-nums mt-1">
                {weatherData.rainfall24h} mm
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Humidity: {weatherData.humidity}%
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div className="text-xs text-slate-500">Forecast 24h Rain</div>
              <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
                {weatherData.forecastRainfall24h} mm
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                48h Total: {weatherData.forecastRainfall48h} mm
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              <div className="text-xs text-slate-500">Surface Wind</div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                {weatherData.windSpeed} km/h
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Cloud Cover: {weatherData.cloudCover}%
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
          <strong>Data Source & Limits:</strong> {weatherData?.sourceName} · {weatherData?.limitations}
        </div>
      </div>

      {/* 4. Estimated Farm Overlap & Interactive Map */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>{t.dashboard.estimatedOverlapTitle}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Sensor: Sentinel-1 C-SAR · Comparison with mapped farm boundary
            </p>
          </div>

          {overlapResult && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Estimated Overlap:</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                overlapResult.overlapPercentage > 40
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : overlapResult.overlapPercentage > 0
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {overlapResult.overlapPercentage}% ({overlapResult.exposureCategory.toUpperCase()})
              </span>
            </div>
          )}
        </div>

        {/* Leaflet Map Frame */}
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <FarmMap
            initialCenter={activeFarm.centerLocation}
            initialPolygon={activeFarm.polygon}
            showFloodOverlays={true}
            showRiverGauges={true}
            heightClass="h-[420px]"
          />
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <div className="font-semibold text-slate-800">
            Geospatial Analysis Transparency:
          </div>
          <p className="text-[11px] leading-relaxed">
            The calculated overlap indicates the mathematical intersection of the Sentinel-1 radar water mask with your mapped parcel. It does not automatically confirm financial crop loss or insurance settlement status. Ground inspection after floodwaters recede is strongly advised.
          </p>
        </div>
      </div>

      {/* 5. Pre-Flood Action Planner & Checklist Progress */}
      {cropInfo && (
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-amber-600" />
                <span>Pre-Flood Action Checklist ({cropInfo.nativeNames.en})</span>
              </h2>
              <p className="text-xs text-slate-500">
                Growth Stage: {cropInfo.stages.find((s) => s.stage === activeFarm.growthStage)?.name.en}
              </p>
            </div>

            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Completed: {completedChecklistCount} / {cropInfo.preFloodChecklist.length} Tasks
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {cropInfo.preFloodChecklist.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-1"
              >
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">
                    {item.urgency}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActivePage('planner')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Manage Full Interactive Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
