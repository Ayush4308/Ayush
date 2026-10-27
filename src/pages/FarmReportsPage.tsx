import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CROPS_DATA } from '../data/crops';
import { SATELLITE_FLOOD_OBSERVATIONS, OFFICIAL_FLOOD_WARNINGS } from '../data/mockFloodData';
import { calculateFloodOverlap } from '../utils/geo';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';

export const FarmReportsPage: React.FC = () => {
  const { t, activeFarm, checklistProgress, photoAssessments } = useApp();
  const reportRef = useRef<HTMLDivElement>(null);

  const cropInfo = activeFarm ? CROPS_DATA[activeFarm.cropType] : null;
  const primaryObs = SATELLITE_FLOOD_OBSERVATIONS[0];

  const overlap = activeFarm && primaryObs
    ? calculateFloodOverlap(activeFarm.polygon, primaryObs.geoJson, activeFarm.id, primaryObs.observationDate)
    : null;

  const relevantWarning = OFFICIAL_FLOOD_WARNINGS[0];

  const handlePrint = () => {
    window.print();
  };

  if (!activeFarm) {
    return (
      <div className="text-center py-12 text-slate-500">
        Please register or select a farm first.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header and Print Action */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t.reports.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.reports.subtitle}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>{t.reports.printReport}</span>
        </button>
      </div>

      {/* Printable Report Document */}
      <div
        ref={reportRef}
        className="bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-300 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-emerald-800">
              KrishiRakshak AI • Flood Exposure Dossier
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Agricultural Flood Risk & Exposure Certificate
            </h2>
            <div className="text-xs text-slate-500 mt-1">
              Document Reference: KR-{activeFarm.id}-{new Date().getFullYear()} • Generated: {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-bold text-slate-800">Intended Purpose:</div>
            <div className="text-slate-500">KVK / PMFBY Crop Insurance Evidence</div>
          </div>
        </div>

        {/* 1. Farmer & Holding Baseline */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Section 1: Farmer & Field Baseline
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Farmer Name</span>
              <span className="font-bold text-slate-900">{activeFarm.farmerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Mobile Number</span>
              <span className="font-bold text-slate-900">
                {activeFarm.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')} (Verified)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Location</span>
              <span className="font-bold text-slate-900">
                {activeFarm.village}, {activeFarm.district}, {activeFarm.state}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Registration Date</span>
              <span className="font-bold text-slate-900">
                {new Date(activeFarm.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Crop & Land Area Calculation */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Section 2: Crop Profile & Regional Land Area
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Primary Crop</span>
              <span className="font-bold text-slate-900">{cropInfo?.nativeNames.en}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Variety & Sowing</span>
              <span className="font-bold text-slate-900">
                {activeFarm.cropVariety || 'Standard'} • {activeFarm.plantingDate || 'Seasonal'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Growth Stage</span>
              <span className="font-bold text-slate-900 uppercase">{activeFarm.growthStage}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Mapped Geodesic Area</span>
              <span className="font-bold text-emerald-800">
                {activeFarm.areaSqm.toLocaleString()} m² (≈ {(activeFarm.areaSqm / 4046.856).toFixed(2)} Acres / {activeFarm.enteredArea} {activeFarm.enteredUnit.split('_')[0]})
              </span>
            </div>
          </div>
        </div>

        {/* 3. Official Meteorological & River Warning Records */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Section 3: Documented Official Flood Warnings During Threat Period
          </h3>
          {relevantWarning && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-700 uppercase">
                  {relevantWarning.severity} Alert: {relevantWarning.headline}
                </span>
                <span className="text-[11px] text-slate-500">{relevantWarning.lastUpdated}</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {relevantWarning.description}
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                Basin: {relevantWarning.riverBasin} • Water Level: {relevantWarning.waterLevelCurrent || 'Above Danger Level'} • Source: {relevantWarning.source}
              </div>
            </div>
          )}
        </div>

        {/* 4. Satellite Radar (Sentinel-1) Geospatial Overlap */}
        {overlap && primaryObs && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              Section 4: Satellite Radar Flood Overlap Evidence (Sentinel-1 C-SAR)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Satellite Sensor</span>
                <span className="font-bold text-slate-900">{primaryObs.satelliteSensor}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Observation Date</span>
                <span className="font-bold text-slate-900">
                  {new Date(primaryObs.observationDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Overlapping Inundated Area</span>
                <span className="font-bold text-blue-800">
                  {overlap.floodedAreaSqm.toLocaleString()} m²
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Exposure Percentage</span>
                <span className="font-black text-red-700 text-sm">
                  {overlap.overlapPercentage}% ({overlap.exposureCategory.toUpperCase()})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5. Pre-Flood Mitigation Checklist Log */}
        {cropInfo && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              Section 5: Farmer Mitigation & Protective Measures Taken
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {cropInfo.preFloodChecklist.map((item) => {
                const isDone = !!checklistProgress[item.id];
                return (
                  <div key={item.id} className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isDone ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                    }`}>
                      {isDone ? '✓' : '—'}
                    </span>
                    <span className={isDone ? 'font-semibold text-slate-900' : 'text-slate-500'}>
                      {item.title} ({isDone ? 'Completed' : 'Pending'})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Attached Visual Crop Assessments */}
        {photoAssessments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
              Section 6: Attached Visual Crop Photo Evidence
            </h3>
            <div className="space-y-2 text-xs">
              {photoAssessments.slice(0, 2).map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                  <img src={item.imageUrl} alt="Symptom" className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <div className="font-bold text-slate-900">
                      Symptoms: {item.visibleSymptoms.join(', ')}
                    </div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Suspected Impact: {item.suspectedConditions.join('; ')} • Severity: {item.severity.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legal Disclaimer & Signatures */}
        <div className="border-t-2 border-slate-900 pt-6 space-y-4 text-[10px] text-slate-500 leading-relaxed">
          <p>
            <strong>Official Submission Notice & Statutory Limitation:</strong> This report compiles geospatial boundary coordinates, official bulletins issued by the India Meteorological Department (IMD) and Central Water Commission (CWC), and European Space Agency Copernicus Sentinel-1 SAR observations. The overlap percentage reflects surface water presence at the satellite capture window and does not unilaterally constitute proof of absolute crop mortality, total financial loss, or guaranteed insurance settlement under PMFBY guidelines. Field ground-truthing with the local Patwari, Revenue Inspector, or Krishi Vigyan Kendra (KVK) is required.
          </p>

          <div className="grid grid-cols-2 pt-8 text-center text-xs text-slate-800">
            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
              <span className="font-bold">Farmer Signature / Thumb Impression</span>
            </div>
            <div>
              <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
              <span className="font-bold">Agricultural Officer / KVK Scientist Seal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
