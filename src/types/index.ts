export type Language = 'en' | 'hi' | 'pa';

export type CropType = 
  | 'paddy'
  | 'wheat'
  | 'cotton'
  | 'sugarcane'
  | 'maize'
  | 'mustard'
  | 'pulses'
  | 'vegetables';

export type CropGrowthStage = 
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'grain_filling'
  | 'maturity';

export type WarningSeverity = 'red' | 'orange' | 'yellow' | 'green';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Farm {
  id: string;
  farmerName: string;
  phone: string;
  smsConsent: boolean;
  state: string;
  district: string;
  village: string;
  centerLocation: GeoPoint;
  polygon: GeoPoint[]; // Array of points representing field boundary
  cropType: CropType;
  cropVariety?: string;
  plantingDate?: string;
  growthStage: CropGrowthStage;
  areaSqm: number;
  enteredArea: number;
  enteredUnit: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandUnit {
  id: string;
  code: string;
  name: string;
  nativeNames: {
    en: string;
    hi: string;
    pa: string;
  };
  states: string[]; // State names where this unit is officially used
  factorToSqm: number; // Multiply by this factor to obtain square meters
  definition: string;
  source: string;
  verified: boolean;
  effectiveYear?: number;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rainfall24h: number;
  forecastRainfall24h: number;
  forecastRainfall48h: number;
  windSpeed: number;
  condition: string;
  cloudCover: number;
  lastUpdated: string;
  sourceName: string;
  sourceUrl: string;
  forecastHorizon: string;
  limitations: string;
}

export interface FloodWarning {
  id: string;
  severity: WarningSeverity;
  headline: string;
  description: string;
  state: string;
  district: string;
  riverBasin: string;
  waterLevelCurrent?: string;
  dangerLevel?: string;
  expectedThreatPeriod: string;
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  uncertaintyNotes: string;
}

export interface FloodObservation {
  id: string;
  title: string;
  observationDate: string;
  satelliteSensor: string; // e.g. "Sentinel-1 C-SAR"
  provider: string;
  resolutionMeters: number;
  dataType: 'satellite_radar' | 'hydrological_gauge' | 'historical_event' | 'simulation_model';
  isSimulatedOrHistorical: boolean;
  disclaimer: string;
  // GeoJSON Polygon coordinates or MultiPolygon
  geoJson: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][]; // [lng, lat]
  };
}

export interface OverlapAnalysisResult {
  farmId: string;
  farmAreaSqm: number;
  floodedAreaSqm: number;
  overlapPercentage: number;
  exposureCategory: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  observationDate: string;
  sensorUsed: string;
  calculatedAt: string;
  disclaimer: string;
  caveats: string[];
}

export interface CropChecklistItem {
  id: string;
  category: 'drainage' | 'storage' | 'crops' | 'machinery' | 'livestock' | 'safety';
  title: string;
  description: string;
  urgency: 'immediate' | 'high' | 'moderate';
  safetyWarning?: string;
  completed: boolean;
}

export interface CropPhotoAssessment {
  id: string;
  farmId?: string;
  timestamp: string;
  imageUrl: string;
  cropType: string;
  visibleSymptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  suspectedConditions: string[];
  immediateSteps: string[];
  recoveryPotential: 'high' | 'moderate' | 'low' | 'uncertain';
  officialExtensionNotice: string;
  isPreliminary: boolean;
  modelConfidence?: string;
}

export interface EmergencyContact {
  id: string;
  state: string;
  district?: string;
  agencyName: string;
  nativeAgencyName: {
    en: string;
    hi: string;
    pa: string;
  };
  phone: string;
  tollFree?: string;
  type: 'state_disaster' | 'ndrf' | 'district_control' | 'cwc_flood' | 'kvk_extension';
  hours: string;
}

export interface AlertSubscription {
  phone: string;
  farmerName: string;
  state: string;
  district: string;
  language: Language;
  consentRecordedAt: string;
  verified: boolean;
  lastAlertSentAt?: string;
}
