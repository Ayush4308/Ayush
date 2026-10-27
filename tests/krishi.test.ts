import { describe, it, expect } from 'vitest';
import {
  convertToSqm,
  convertFromSqm,
  getLandUnitsForState,
  ALL_LAND_UNITS
} from '../src/data/regionalUnits';
import {
  calculateGeodesicAreaSqm,
  calculateFloodOverlap,
  isValidPolygonPoints,
  calculatePolygonCenter
} from '../src/utils/geo';
import { translations } from '../src/data/translations';
import { CROPS_DATA } from '../src/data/crops';
import { GeoPoint } from '../src/types';

describe('Indian Regional Land Units Conversion Engine', () => {
  it('converts standard Acre and Hectare to Sqm accurately', () => {
    // 1 Acre = 4046.856 m²
    const acreInSqm = convertToSqm(1, 'acre');
    expect(acreInSqm).toBeCloseTo(4046.86, 1);

    // 1 Hectare = 10,000 m²
    const haInSqm = convertToSqm(1, 'hectare');
    expect(haInSqm).toBe(10000);
  });

  it('correctly converts Punjab and Haryana Kanal and Marla', () => {
    // 8 Kanals = 1 Acre (~4046.86 m²) -> 1 Kanal = 505.857 m²
    const kanalInSqm = convertToSqm(1, 'punjab_kanal');
    expect(kanalInSqm).toBeCloseTo(505.86, 1);

    // 8 Kanals converted to Sqm
    const eightKanals = convertToSqm(8, 'punjab_kanal');
    expect(eightKanals).toBeCloseTo(4046.86, 0);

    // 1 Kanal = 20 Marlas -> 1 Marla = 25.29 m²
    const marlaInSqm = convertToSqm(1, 'punjab_marla');
    expect(marlaInSqm).toBeCloseTo(25.29, 1);
  });

  it('correctly converts Uttar Pradesh Pucca Bigha and Biswa', () => {
    // UP Standard Pucca Bigha = 2529.285 m²
    const puccaBighaSqm = convertToSqm(1, 'up_pucca_bigha');
    expect(puccaBighaSqm).toBeCloseTo(2529.29, 1);

    // 20 Biswa = 1 Pucca Bigha
    const biswaSqm = convertToSqm(20, 'up_biswa');
    expect(biswaSqm).toBeCloseTo(2529.28, 0);
  });

  it('correctly converts Bihar Bigha, Kattha and Dhur', () => {
    // Bihar standard Bigha = 2529 m² = 20 Kattha = 400 Dhur
    const biharBigha = convertToSqm(1, 'bihar_bigha');
    expect(biharBigha).toBe(2529);

    const kattha = convertToSqm(20, 'bihar_kattha');
    expect(kattha).toBeCloseTo(2529, 0);

    const dhur = convertToSqm(400, 'bihar_dhur');
    expect(dhur).toBeCloseTo(2529, 0);
  });

  it('correctly converts Maharashtra & Gujarat Guntha', () => {
    // 1 Guntha = 101.17 m² (40 Guntha = 1 Acre)
    const gunthaSqm = convertToSqm(1, 'guntha');
    expect(gunthaSqm).toBeCloseTo(101.17, 1);

    const fortyGuntha = convertToSqm(40, 'guntha');
    expect(fortyGuntha).toBeCloseTo(4046.86, 0);
  });

  it('filters units by state properly', () => {
    const punjabUnits = getLandUnitsForState('Punjab');
    expect(punjabUnits.some((u) => u.id === 'punjab_kanal')).toBe(true);
    expect(punjabUnits.some((u) => u.id === 'up_pucca_bigha')).toBe(false);

    const upUnits = getLandUnitsForState('Uttar Pradesh');
    expect(upUnits.some((u) => u.id === 'up_pucca_bigha')).toBe(true);
    expect(upUnits.some((u) => u.id === 'punjab_kanal')).toBe(false);
  });
});

describe('Geospatial Calculations & Edge Cases', () => {
  it('validates polygon vertices strictly', () => {
    expect(isValidPolygonPoints([])).toBe(false);
    expect(isValidPolygonPoints([{ lat: 10, lng: 10 }])).toBe(false);
    expect(isValidPolygonPoints([{ lat: 10, lng: 10 }, { lat: 11, lng: 11 }])).toBe(false);

    const validTriangle: GeoPoint[] = [
      { lat: 29.85, lng: 76.01 },
      { lat: 29.86, lng: 76.01 },
      { lat: 29.86, lng: 76.02 }
    ];
    expect(isValidPolygonPoints(validTriangle)).toBe(true);
  });

  it('computes non-zero geodesic area for real agricultural field', () => {
    const farmPoints: GeoPoint[] = [
      { lat: 29.852, lng: 76.010 },
      { lat: 29.858, lng: 76.012 },
      { lat: 29.859, lng: 76.022 },
      { lat: 29.853, lng: 76.020 }
    ];
    const area = calculateGeodesicAreaSqm(farmPoints);
    expect(area).toBeGreaterThan(10000); // Should be several hectares
  });

  it('handles zero overlap when farm is far away from flood polygon', () => {
    // Farm in Punjab
    const farmInPunjab: GeoPoint[] = [
      { lat: 29.852, lng: 76.010 },
      { lat: 29.858, lng: 76.012 },
      { lat: 29.859, lng: 76.022 },
      { lat: 29.853, lng: 76.020 }
    ];

    // Flood polygon in Bihar
    const floodInBihar = {
      type: 'Polygon' as const,
      coordinates: [
        [
          [86.58, 26.10],
          [86.64, 26.11],
          [86.66, 26.15],
          [86.58, 26.10]
        ]
      ]
    };

    const result = calculateFloodOverlap(farmInPunjab, floodInBihar);
    expect(result.overlapPercentage).toBe(0);
    expect(result.floodedAreaSqm).toBe(0);
    expect(result.exposureCategory).toBe('none');
  });

  it('calculates partial overlap when farm intersects flood extent', () => {
    // Square field: [0,0] to [2,2]
    const squareField: GeoPoint[] = [
      { lat: 30.0, lng: 76.0 },
      { lat: 30.02, lng: 76.0 },
      { lat: 30.02, lng: 76.02 },
      { lat: 30.0, lng: 76.02 }
    ];

    // Overlapping flood polygon covering right half of square field
    const overlappingFlood = {
      type: 'Polygon' as const,
      coordinates: [
        [
          [76.01, 29.99],
          [76.03, 29.99],
          [76.03, 30.03],
          [76.01, 30.03],
          [76.01, 29.99]
        ]
      ]
    };

    const result = calculateFloodOverlap(squareField, overlappingFlood);
    expect(result.overlapPercentage).toBeGreaterThan(30);
    expect(result.overlapPercentage).toBeLessThan(70);
    expect(['moderate', 'high']).toContain(result.exposureCategory);
  });
});

describe('Language System & Crop Knowledge Base', () => {
  it('has identical top-level and navigation keys across en, hi, and pa', () => {
    const enKeys = Object.keys(translations.en.nav);
    const hiKeys = Object.keys(translations.hi.nav);
    const paKeys = Object.keys(translations.pa.nav);

    expect(hiKeys).toEqual(enKeys);
    expect(paKeys).toEqual(enKeys);
  });

  it('defines valid flood tolerances for all 8 Indian crops', () => {
    const crops = Object.keys(CROPS_DATA) as (keyof typeof CROPS_DATA)[];
    expect(crops.length).toBe(8);

    for (const cropKey of crops) {
      const crop = CROPS_DATA[cropKey];
      expect(['low', 'moderate', 'high']).toContain(crop.floodTolerance);
      expect(crop.maxSubmergenceHours).toBeGreaterThan(0);
      expect(crop.preFloodChecklist.length).toBeGreaterThan(0);
      expect(crop.postFloodRecoveryGuidelines.steps.length).toBeGreaterThan(0);
    }
  });
});
