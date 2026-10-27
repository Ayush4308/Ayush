import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoPoint, LandUnit } from '../types';
import { calculateGeodesicAreaSqm, calculatePolygonCenter } from '../utils/geo';
import { convertFromSqm } from '../data/regionalUnits';
import { RIVER_GAUGES, SATELLITE_FLOOD_OBSERVATIONS } from '../data/mockFloodData';
import {
  Layers,
  MapPin,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ZoomIn,
  Compass,
  Maximize2
} from 'lucide-react';

// Fix Leaflet marker icons in Vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface FarmMapProps {
  initialCenter?: GeoPoint;
  initialPolygon?: GeoPoint[];
  isEditable?: boolean;
  onPolygonChange?: (points: GeoPoint[], areaSqm: number) => void;
  showFloodOverlays?: boolean;
  showRiverGauges?: boolean;
  selectedUnit?: LandUnit;
  heightClass?: string;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  initialCenter = { lat: 29.855, lng: 76.015 },
  initialPolygon = [],
  isEditable = false,
  onPolygonChange,
  showFloodOverlays = true,
  showRiverGauges = true,
  selectedUnit,
  heightClass = 'h-[480px]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const floodOverlaysGroupRef = useRef<L.LayerGroup | null>(null);
  const riverGaugesGroupRef = useRef<L.LayerGroup | null>(null);

  const [points, setPoints] = useState<GeoPoint[]>(initialPolygon);
  const [mapLayerType, setMapLayerType] = useState<'satellite' | 'street'>('satellite');
  const [activeFloodDataset, setActiveFloodDataset] = useState<string>('all');
  const [isBoundaryConfirmed, setIsBoundaryConfirmed] = useState<boolean>(initialPolygon.length >= 3);

  const currentAreaSqm = calculateGeodesicAreaSqm(points);
  const convertedArea = selectedUnit ? convertFromSqm(currentAreaSqm, selectedUnit.id) : 0;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialPos = initialPolygon.length >= 3
      ? calculatePolygonCenter(initialPolygon)
      : initialCenter;

    const map = L.map(mapContainerRef.current, {
      center: [initialPos.lat, initialPos.lng],
      zoom: 14,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Satellite Imagery (Esri World Imagery)
    const satelliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
      }
    );

    // Street / Topo Layer (OpenStreetMap)
    const streetLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }
    );

    satelliteLayer.addTo(map);

    // Store layer references
    (map as any)._customSatelliteLayer = satelliteLayer;
    (map as any)._customStreetLayer = streetLayer;

    // Layer groups for dynamic elements
    const markersGroup = L.layerGroup().addTo(map);
    const floodOverlaysGroup = L.layerGroup().addTo(map);
    const riverGaugesGroup = L.layerGroup().addTo(map);

    markersGroupRef.current = markersGroup;
    floodOverlaysGroupRef.current = floodOverlaysGroup;
    riverGaugesGroupRef.current = riverGaugesGroup;
    mapInstanceRef.current = map;

    // Handle user drawing if editable
    if (isEditable) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newPoint: GeoPoint = {
          lat: Number(e.latlng.lat.toFixed(6)),
          lng: Number(e.latlng.lng.toFixed(6))
        };
        setPoints((prev) => {
          const updated = [...prev, newPoint];
          return updated;
        });
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const sat = (map as any)._customSatelliteLayer;
    const street = (map as any)._customStreetLayer;

    if (mapLayerType === 'satellite') {
      if (map.hasLayer(street)) map.removeLayer(street);
      if (!map.hasLayer(sat)) sat.addTo(map);
    } else {
      if (map.hasLayer(sat)) map.removeLayer(sat);
      if (!map.hasLayer(street)) street.addTo(map);
    }
  }, [mapLayerType]);

  // Sync Farm Polygon and Vertex Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }

    if (points.length === 0) return;

    // Add vertex markers
    points.forEach((p, idx) => {
      const vertexIcon = L.divIcon({
        className: 'custom-vertex-marker',
        html: `<div style="background-color: #10b981; border: 2px solid #ffffff; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; color: #fff;">${idx + 1}</div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([p.lat, p.lng], { icon: vertexIcon });
      if (isEditable) {
        marker.bindPopup(`
          <div style="font-size: 11px;">
            <b>Vertex ${idx + 1}</b><br/>
            Lat: ${p.lat}<br/>Lng: ${p.lng}
          </div>
        `);
      }
      markersGroup.addLayer(marker);
    });

    // Render polygon if 3 or more points
    if (points.length >= 3) {
      const latlngs: [number, number][] = points.map((p) => [p.lat, p.lng]);
      const polygon = L.polygon(latlngs, {
        color: '#10b981', // Emerald green
        weight: 3,
        opacity: 0.9,
        fillColor: '#34d399',
        fillOpacity: 0.25,
        dashArray: isEditable && !isBoundaryConfirmed ? '6, 6' : undefined
      });

      polygon.bindPopup(`
        <div style="font-size: 12px; font-family: sans-serif; padding: 2px;">
          <b style="color: #065f46;">Registered Farm Field</b><br/>
          Area: <b>${calculateGeodesicAreaSqm(points).toLocaleString()} m²</b><br/>
          ${selectedUnit ? `(${convertFromSqm(calculateGeodesicAreaSqm(points), selectedUnit.id)} ${selectedUnit.name})` : ''}
        </div>
      `);

      polygon.addTo(map);
      polygonLayerRef.current = polygon;
    }

    // Notify parent
    if (onPolygonChange) {
      onPolygonChange(points, currentAreaSqm);
    }
  }, [points, isBoundaryConfirmed, selectedUnit]);

  // Render Flood Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const floodGroup = floodOverlaysGroupRef.current;
    if (!map || !floodGroup) return;

    floodGroup.clearLayers();

    if (!showFloodOverlays) return;

    SATELLITE_FLOOD_OBSERVATIONS.forEach((obs) => {
      if (activeFloodDataset !== 'all' && obs.id !== activeFloodDataset) return;

      const coordinates = obs.geoJson.coordinates[0];
      // Leaflet expects [lat, lng] while GeoJSON has [lng, lat]
      const latlngs: [number, number][] = coordinates.map((c: any) => [c[1], c[0]]);

      const floodPoly = L.polygon(latlngs, {
        color: obs.isSimulatedOrHistorical ? '#f97316' : '#2563eb', // Orange for simulation, Blue for radar
        weight: 2,
        opacity: 0.9,
        fillColor: obs.isSimulatedOrHistorical ? '#fb923c' : '#3b82f6',
        fillOpacity: 0.35
      });

      floodPoly.bindPopup(`
        <div style="font-size: 12px; font-family: sans-serif; max-width: 250px;">
          <div style="font-weight: bold; color: ${obs.isSimulatedOrHistorical ? '#c2410c' : '#1e40af'}; margin-bottom: 4px;">
            ${obs.title}
          </div>
          <div style="font-size: 11px; color: #4b5563; margin-bottom: 4px;">
            <b>Sensor:</b> ${obs.satelliteSensor}<br/>
            <b>Date:</b> ${new Date(obs.observationDate).toLocaleDateString()}<br/>
            <b>Type:</b> ${obs.isSimulatedOrHistorical ? 'Historical / Simulation Model' : 'Observed Sentinel-1 Radar Water'}
          </div>
          <div style="font-size: 10px; background: #f3f4f6; padding: 4px; border-radius: 4px; color: #374151;">
            ${obs.disclaimer}
          </div>
        </div>
      `);

      floodGroup.addLayer(floodPoly);
    });
  }, [showFloodOverlays, activeFloodDataset]);

  // Render River Gauges
  useEffect(() => {
    const map = mapInstanceRef.current;
    const riverGroup = riverGaugesGroupRef.current;
    if (!map || !riverGroup) return;

    riverGroup.clearLayers();

    if (!showRiverGauges) return;

    RIVER_GAUGES.forEach((gauge) => {
      const isDanger = gauge.status === 'danger';
      const color = isDanger ? '#dc2626' : '#eab308';

      const gaugeIcon = L.divIcon({
        className: 'custom-gauge-marker',
        html: `<div style="background-color: ${color}; width: 22px; height: 22px; border: 2px solid #ffffff; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: bold;">≋</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([gauge.lat, gauge.lng], { icon: gaugeIcon });
      marker.bindPopup(`
        <div style="font-size: 12px; font-family: sans-serif; min-width: 200px;">
          <div style="font-weight: bold; color: ${isDanger ? '#b91c1c' : '#854d0e'}; margin-bottom: 2px;">
            ${gauge.stationName}
          </div>
          <div style="font-size: 11px; color: #374151; margin-bottom: 4px;">
            <b>River:</b> ${gauge.river} (${gauge.basin})<br/>
            <b>Current Water Level:</b> <span style="font-weight: bold; color: ${isDanger ? '#dc2626' : '#b45309'};">${gauge.currentLevelMeters} m</span><br/>
            <b>Danger Mark:</b> ${gauge.dangerLevelMeters} m<br/>
            <b>Trend:</b> ${gauge.trend.toUpperCase()}<br/>
            <b>Status:</b> ${gauge.status.toUpperCase()}
          </div>
          <div style="font-size: 10px; color: #6b7280;">
            Source: ${gauge.source} • ${gauge.lastObserved}
          </div>
        </div>
      `);

      riverGroup.addLayer(marker);
    });
  }, [showRiverGauges]);

  const handleClearPoints = () => {
    setPoints([]);
    setIsBoundaryConfirmed(false);
  };

  const handleConfirmBoundary = () => {
    if (points.length < 3) return;
    setIsBoundaryConfirmed(true);
    if (mapInstanceRef.current && polygonLayerRef.current) {
      mapInstanceRef.current.fitBounds(polygonLayerRef.current.getBounds(), { padding: [40, 40] });
    }
  };

  const handleCenterOnFarm = () => {
    if (points.length >= 3 && mapInstanceRef.current && polygonLayerRef.current) {
      mapInstanceRef.current.fitBounds(polygonLayerRef.current.getBounds(), { padding: [50, 50] });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([initialCenter.lat, initialCenter.lng], 14);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 shadow-md bg-slate-900">
      {/* Map Header Toolbar */}
      <div className="bg-slate-900/90 backdrop-blur-sm text-slate-200 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-2 text-xs">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-100">Interactive Map View:</span>

          <div className="flex bg-slate-800 rounded p-0.5 border border-slate-700">
            <button
              onClick={() => setMapLayerType('satellite')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                mapLayerType === 'satellite'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapLayerType('street')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                mapLayerType === 'street'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Street / Topo
            </button>
          </div>
        </div>

        {/* Flood Observation Filter */}
        {showFloodOverlays && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Radar Flood:</span>
            <select
              value={activeFloodDataset}
              onChange={(e) => setActiveFloodDataset(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs rounded px-2 py-1 border border-slate-700 focus:border-emerald-500"
            >
              <option value="all">All Sentinel-1 Flood Overlays</option>
              {SATELLITE_FLOOD_OBSERVATIONS.map((obs) => (
                <option key={obs.id} value={obs.id}>
                  {obs.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>
        )}

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCenterOnFarm}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs font-medium border border-slate-700 transition"
            title="Recenter Map on Field"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Recenter</span>
          </button>
        </div>
      </div>

      {/* Actual Leaflet Map Canvas */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-0`} />

      {/* Editing Toolbar & Calculated Area Badge */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Area Calculation Card */}
        <div className="bg-slate-900/90 backdrop-blur-md text-slate-100 p-2.5 rounded-xl border border-slate-700 shadow-xl pointer-events-auto max-w-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>Geospatial Farm Area:</span>
          </div>
          <div className="text-sm font-extrabold text-white mt-0.5">
            {currentAreaSqm.toLocaleString()} m²
            {selectedUnit && currentAreaSqm > 0 && (
              <span className="text-xs text-emerald-300 font-semibold ml-1.5">
                ≈ {convertedArea} {selectedUnit.nativeNames.en}
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-400">
            {points.length} boundary points marked (WGS84 Geodesic)
          </div>
        </div>

        {/* Right: Drawing & Confirmation Buttons if Editable */}
        {isEditable && (
          <div className="flex items-center gap-2 pointer-events-auto">
            {points.length > 0 && (
              <button
                onClick={handleClearPoints}
                className="flex items-center gap-1 bg-slate-800/95 hover:bg-red-900/80 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 shadow-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Clear</span>
              </button>
            )}

            {points.length >= 3 && !isBoundaryConfirmed && (
              <button
                onClick={handleConfirmBoundary}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Field Boundary</span>
              </button>
            )}

            {isBoundaryConfirmed && (
              <div className="flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 px-3 py-2 rounded-xl text-xs font-bold border border-emerald-700 shadow-lg">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Boundary Confirmed</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Legend Overlay in top-left */}
      <div className="absolute top-14 left-3 z-10 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-200 shadow-lg hidden sm:block max-w-[210px]">
        <div className="font-bold text-slate-300 mb-1.5 flex items-center gap-1">
          <Layers className="w-3 h-3 text-emerald-400" />
          <span>Legend</span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/40 border border-emerald-400 inline-block"></span>
            <span>Farm Boundary</span>
          </div>
          {showFloodOverlays && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-blue-500/40 border border-blue-500 inline-block"></span>
              <span>Observed Water (Radar)</span>
            </div>
          )}
          {showRiverGauges && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-red-600 text-[8px] text-white flex items-center justify-center font-bold">
                ≋
              </span>
              <span>CWC River Danger Gauge</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
