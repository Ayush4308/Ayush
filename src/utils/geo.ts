import * as turf from '@turf/turf';
import { GeoPoint, OverlapAnalysisResult } from '../types';

/**
 * Validates whether a given array of points constitutes a valid polygon.
 * Requires at least 3 unique non-collinear vertices.
 */
export function isValidPolygonPoints(points: GeoPoint[]): boolean {
  if (!points || points.length < 3) return false;
  // Check for NaN or out of bounds coordinates
  for (const pt of points) {
    if (isNaN(pt.lat) || isNaN(pt.lng)) return false;
    if (pt.lat < -90 || pt.lat > 90 || pt.lng < -180 || pt.lng > 180) return false;
  }
  return true;
}

/**
 * Converts GeoPoint array [lat, lng] to GeoJSON Polygon format:
 * GeoJSON uses [lng, lat] order and requires the polygon ring to be closed (first point === last point).
 */
export function pointsToGeoJsonPolygon(points: GeoPoint[]): any {
  if (!isValidPolygonPoints(points)) {
    throw new Error('Cannot construct polygon: insufficient or invalid coordinate points.');
  }

  // Turf expects [lng, lat]
  const coordinates: number[][] = points.map((p) => [p.lng, p.lat]);

  // Ensure closed ring
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    coordinates.push([first[0], first[1]]);
  }

  return turf.polygon([coordinates]);
}

/**
 * Calculates geodesic area in square meters using WGS84 ellipsoid.
 * Does NOT treat latitude/longitude as planar Cartesian units.
 */
export function calculateGeodesicAreaSqm(points: GeoPoint[]): number {
  if (!isValidPolygonPoints(points)) return 0;
  try {
    const polygonFeature = pointsToGeoJsonPolygon(points);
    // turf.area calculates geodesic area on WGS84 in square meters
    const area = turf.area(polygonFeature);
    return Number(area.toFixed(2));
  } catch (err) {
    console.warn('Geodesic area calculation error:', err);
    return 0;
  }
}

/**
 * Calculates polygon centroid [lat, lng] for centering maps or markers.
 */
export function calculatePolygonCenter(points: GeoPoint[]): GeoPoint {
  if (!points || points.length === 0) {
    return { lat: 31.15, lng: 74.95 }; // Default Punjab Harike
  }
  if (points.length === 1) return points[0];

  try {
    const polygonFeature = pointsToGeoJsonPolygon(points);
    const center = turf.centerOfMass(polygonFeature);
    return {
      lat: center.geometry.coordinates[1],
      lng: center.geometry.coordinates[0]
    };
  } catch {
    // Fallback arithmetic mean
    const avgLat = points.reduce((acc, p) => acc + p.lat, 0) / points.length;
    const avgLng = points.reduce((acc, p) => acc + p.lng, 0) / points.length;
    return { lat: avgLat, lng: avgLng };
  }
}

/**
 * Calculates intersection area between farm boundary and satellite flood extent polygon.
 * Implements strict geospatial validation and returns detailed exposure breakdown.
 */
export function calculateFloodOverlap(
  farmPoints: GeoPoint[],
  floodGeoJson: { type: 'Polygon' | 'MultiPolygon'; coordinates: any },
  farmId: string = 'farm-1',
  observationDate: string = new Date().toISOString(),
  sensorUsed: string = 'Copernicus Sentinel-1 C-SAR'
): OverlapAnalysisResult {
  const farmAreaSqm = calculateGeodesicAreaSqm(farmPoints);

  if (farmAreaSqm <= 0 || !isValidPolygonPoints(farmPoints)) {
    return {
      farmId,
      farmAreaSqm: 0,
      floodedAreaSqm: 0,
      overlapPercentage: 0,
      exposureCategory: 'none',
      observationDate,
      sensorUsed,
      calculatedAt: new Date().toISOString(),
      disclaimer: 'Invalid or empty farm boundary geometry provided.',
      caveats: ['Farm boundary must contain at least 3 valid geospatial points.']
    };
  }

  try {
    const farmPoly = pointsToGeoJsonPolygon(farmPoints);
    let floodFeature: any;

    if (floodGeoJson.type === 'MultiPolygon') {
      floodFeature = turf.multiPolygon(floodGeoJson.coordinates);
    } else {
      floodFeature = turf.polygon(floodGeoJson.coordinates);
    }

    // Perform intersection
    const intersection = turf.intersect(turf.featureCollection([farmPoly, floodFeature]));

    if (!intersection) {
      return {
        farmId,
        farmAreaSqm,
        floodedAreaSqm: 0,
        overlapPercentage: 0,
        exposureCategory: 'none',
        observationDate,
        sensorUsed,
        calculatedAt: new Date().toISOString(),
        disclaimer: 'Estimated intersection between farm boundary and satellite flood extent indicates 0% overlap.',
        caveats: [
          'Zero radar overlap does not rule out localized groundwater seepage, blocked internal drainage, or flash runoff outside satellite pass window.',
          'Satellite observation reflects status at acquisition timestamp only.'
        ]
      };
    }

    const floodedAreaSqm = Number(turf.area(intersection).toFixed(2));
    const overlapPercentage = Math.min(100, Number(((floodedAreaSqm / farmAreaSqm) * 100).toFixed(1)));

    let exposureCategory: OverlapAnalysisResult['exposureCategory'] = 'none';
    if (overlapPercentage > 75) exposureCategory = 'severe';
    else if (overlapPercentage > 40) exposureCategory = 'high';
    else if (overlapPercentage > 15) exposureCategory = 'moderate';
    else if (overlapPercentage > 0) exposureCategory = 'low';

    return {
      farmId,
      farmAreaSqm,
      floodedAreaSqm,
      overlapPercentage,
      exposureCategory,
      observationDate,
      sensorUsed,
      calculatedAt: new Date().toISOString(),
      disclaimer: 'Calculated geospatial intersection estimates the portion of the mapped farm inside the observed flood extent. It does NOT automatically establish total crop loss, yield loss percentage, or official insurance compensation.',
      caveats: [
        'Submergence duration, crop variety tolerance (e.g. Sub1 rice), and silt load significantly dictate actual crop survival.',
        'High radar reflection over dense crop canopies can occasionally mask shallow water underneath.',
        'Field ground-truthing with local Krishi Vigyan Kendra or Revenue Patwari is necessary for official damage validation.'
      ]
    };
  } catch (err: any) {
    console.error('Flood overlap intersection failed:', err);
    return {
      farmId,
      farmAreaSqm,
      floodedAreaSqm: 0,
      overlapPercentage: 0,
      exposureCategory: 'none',
      observationDate,
      sensorUsed,
      calculatedAt: new Date().toISOString(),
      disclaimer: 'Could not compute overlap due to geometry complexity or topology inconsistency.',
      caveats: ['Check that field boundary does not self-intersect or contain collinear loops.']
    };
  }
}
