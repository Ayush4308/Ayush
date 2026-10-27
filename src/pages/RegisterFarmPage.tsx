import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FarmMap } from '../components/FarmMap';
import { INDIAN_AGRI_STATES, getLandUnitsForState, convertToSqm, convertFromSqm } from '../data/regionalUnits';
import { CROPS_DATA } from '../data/crops';
import { CropGrowthStage, CropType, GeoPoint } from '../types';
import {
  FileCheck2,
  MapPin,
  Sprout,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Phone,
  Info
} from 'lucide-react';

export const RegisterFarmPage: React.FC = () => {
  const { t, addFarm, setActivePage, setAlertPhone, setSmsConsent } = useApp();

  // Form State
  const [farmerName, setFarmerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedState, setSelectedState] = useState('Punjab');
  const [selectedDistrict, setSelectedDistrict] = useState('Sangrur');
  const [village, setVillage] = useState('');
  const [cropType, setCropType] = useState<CropType>('paddy');
  const [cropVariety, setCropVariety] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [growthStage, setGrowthStage] = useState<CropGrowthStage>('vegetative');
  const [enteredArea, setEnteredArea] = useState<number>(10);
  const [preferredUnitCode, setPreferredUnitCode] = useState<string>('punjab_kanal');
  const [smsConsentAgreed, setSmsConsentAgreed] = useState<boolean>(true);

  // Map Polygon State
  const [polygonPoints, setPolygonPoints] = useState<GeoPoint[]>([
    { lat: 29.852, lng: 76.010 },
    { lat: 29.858, lng: 76.012 },
    { lat: 29.859, lng: 76.022 },
    { lat: 29.853, lng: 76.020 }
  ]);
  const [calculatedMapAreaSqm, setCalculatedMapAreaSqm] = useState<number>(40468.56);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Get available districts for selected state
  const availableDistricts = useMemo(() => {
    const found = INDIAN_AGRI_STATES.find((s) => s.state === selectedState);
    return found ? found.districts : [];
  }, [selectedState]);

  // Get available land units for selected state
  const availableUnits = useMemo(() => {
    return getLandUnitsForState(selectedState);
  }, [selectedState]);

  // Current active unit object
  const activeUnit = useMemo(() => {
    return availableUnits.find((u) => u.id === preferredUnitCode) || availableUnits[0];
  }, [availableUnits, preferredUnitCode]);

  // Handle state change: update district and default regional unit
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const foundState = INDIAN_AGRI_STATES.find((s) => s.state === newState);
    if (foundState && foundState.districts.length > 0) {
      setSelectedDistrict(foundState.districts[0]);
    }
    const units = getLandUnitsForState(newState);
    if (units.length > 0) {
      // Pick first state-specific regional unit if available
      const regional = units.find((u) => !['acre', 'hectare', 'sqm'].includes(u.id));
      setPreferredUnitCode(regional ? regional.id : units[0].id);
    }
  };

  // Converted value of entered area to square meters
  const enteredSqm = useMemo(() => {
    if (!activeUnit || enteredArea <= 0) return 0;
    return convertToSqm(enteredArea, activeUnit.id);
  }, [enteredArea, activeUnit]);

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!farmerName.trim()) {
      setValidationError('Please enter farmer name.');
      return;
    }
    if (!village.trim()) {
      setValidationError('Please enter village or farm address.');
      return;
    }
    if (polygonPoints.length < 3) {
      setValidationError('Please place at least 3 points on the interactive map to form your farm boundary.');
      return;
    }

    // Save Farm
    const finalAreaSqm = calculatedMapAreaSqm > 0 ? calculatedMapAreaSqm : enteredSqm;
    const center = polygonPoints[0] || { lat: 29.855, lng: 76.015 };

    addFarm({
      farmerName,
      phone: phone.trim() || '9876543210',
      smsConsent: smsConsentAgreed,
      state: selectedState,
      district: selectedDistrict,
      village,
      centerLocation: center,
      polygon: polygonPoints,
      cropType,
      cropVariety: cropVariety.trim() || undefined,
      plantingDate: plantingDate || undefined,
      growthStage,
      areaSqm: finalAreaSqm,
      enteredArea,
      enteredUnit: activeUnit?.id || 'acre'
    });

    if (phone.trim()) {
      setAlertPhone(phone.trim());
      setSmsConsent(smsConsentAgreed);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setActivePage('dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {t.register.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.register.subtitle}
            </p>
          </div>
        </div>
      </div>

      {isSuccess && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg animate-pulse">
          <CheckCircle className="w-6 h-6 shrink-0" />
          <div className="font-bold text-sm">
            {t.register.successMessage}
          </div>
        </div>
      )}

      {validationError && (
        <div className="bg-red-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <div className="font-bold text-sm">
            {validationError}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Farmer & Location */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <MapPin className="w-5 h-5 text-emerald-500" />
            <span>{t.register.stepBasic} & {t.register.stepLocation}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.register.farmerNameLabel} *
              </label>
              <input
                type="text"
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder={t.register.farmerNamePlaceholder}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>{t.register.phoneLabel}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">Optional SMS Alerts</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.register.phonePlaceholder}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                {t.register.phoneHelp}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.register.stateLabel} *
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {INDIAN_AGRI_STATES.map((s) => (
                  <option key={s.state} value={s.state}>
                    {s.state} ({s.primaryRiverBasin.split(',')[0]} Basin)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.register.districtLabel} *
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.register.villageLabel} *
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder={t.register.villagePlaceholder}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Interactive Field Boundary Map */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <span>{t.register.stepBoundary}</span>
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {polygonPoints.length} points marked
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
            <strong>How to mark your field:</strong> Click on the satellite map around the edges of your farm to place markers. Once 3 or more points are marked, your boundary will close and calculate geodesic land area automatically.
          </div>

          <FarmMap
            initialCenter={polygonPoints[0]}
            initialPolygon={polygonPoints}
            isEditable={true}
            onPolygonChange={(pts, area) => {
              setPolygonPoints(pts);
              setCalculatedMapAreaSqm(area);
            }}
            selectedUnit={activeUnit}
            heightClass="h-[420px]"
          />
        </div>

        {/* Step 3: Crop Details & State Regional Land Units */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Sprout className="w-5 h-5 text-emerald-500" />
            <span>{t.register.stepCrop}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.register.cropTypeLabel} *
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value as CropType)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                {Object.values(CROPS_DATA).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nativeNames.en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.register.cropVarietyLabel}
              </label>
              <input
                type="text"
                value={cropVariety}
                onChange={(e) => setCropVariety(e.target.value)}
                placeholder="e.g. PR-126 / Co 0238 / HD-3086"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.register.growthStageLabel} *
              </label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value as CropGrowthStage)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="seedling">Seedling / Early Nursery</option>
                <option value="vegetative">Vegetative / Tillering</option>
                <option value="flowering">Flowering / Heading / Boll</option>
                <option value="maturity">Grain Filling / Maturity</option>
              </select>
            </div>
          </div>

          {/* Regional Land Unit Selector Section */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Regional Land Measurement System ({selectedState})
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select your state's verified local revenue unit. Values are converted with verified Revenue Department conversion factors.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.register.preferredUnitLabel}
                </label>
                <select
                  value={preferredUnitCode}
                  onChange={(e) => setPreferredUnitCode(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  {availableUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nativeNames.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.register.enteredAreaLabel}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={enteredArea}
                  onChange={(e) => setEnteredArea(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>

            {/* Conversion Details Card */}
            {activeUnit && (
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Official Definition:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {activeUnit.definition}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Converted Equivalent:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {enteredSqm.toLocaleString()} m² (≈ {(enteredSqm / 4046.856).toFixed(2)} Acres)
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  Source: {activeUnit.source} • Verified Status: {activeUnit.verified ? 'Verified Official' : 'Unverified'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: SMS Alert Consent & Submission */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Phone className="w-5 h-5 text-emerald-500" />
            <span>{t.register.stepConsent}</span>
          </h2>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsConsentAgreed}
                onChange={(e) => setSmsConsentAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {t.register.smsConsentTitle}
                </div>
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t.register.smsConsentText}
                </div>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-xl transition transform active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{t.register.submitButton}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
