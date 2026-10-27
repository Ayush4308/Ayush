import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Droplets, Eye, Info, Play, RotateCcw, ShieldAlert, Waves, ZoomIn } from 'lucide-react';

interface Farm3DSceneProps {
  farmName?: string;
  cropType?: string;
  waterLevelMeters?: number;
  onWaterLevelChange?: (level: number) => void;
}

export const Farm3DScene: React.FC<Farm3DSceneProps> = ({
  farmName = 'Punjab Model Farm (Sangrur Basin)',
  cropType = 'paddy',
  waterLevelMeters = 0.4,
  onWaterLevelChange
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(waterLevelMeters);
  const [cameraView, setCameraView] = useState<'perspective' | 'overhead' | 'bund'>('perspective');
  const [showMetrics, setShowMetrics] = useState<boolean>(true);

  // References to live 3D objects for dynamic manipulation
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const waterMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    setCurrentLevel(waterLevelMeters);
  }, [waterLevelMeters]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js skill directive
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xdbeafe); // Soft morning sky blue
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.015);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    camera.position.set(24, 18, 28);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. OrbitControls with smooth damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go below ground
    controls.minDistance = 8;
    controls.maxDistance = 80;
    controls.target.set(0, 1.5, 0);

    // 5. Lighting Rig (Warm Key + Cool Fill HemisphereLight)
    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x93c5fd, 0.75);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffedd5, 1.8);
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = !isSoftwareGl;
    if (dirLight.shadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 120;
      const d = 30;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    scene.add(dirLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xbfdbfe, 0.5);
    fillLight.position.set(-25, 20, -20);
    scene.add(fillLight);

    // 6. Procedural Terrain & Soil Beds
    const terrainGroup = new THREE.Group();

    // Base ground slab
    const groundGeo = new THREE.BoxGeometry(60, 2, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x452b14, // Rich Indo-Gangetic alluvial soil
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1;
    ground.receiveShadow = true;
    terrainGroup.add(ground);

    // Elevated Protective Flood Bund (Embankment) along North & East border
    const bundGeo = new THREE.BoxGeometry(40, 1.6, 3);
    const bundMat = new THREE.MeshStandardMaterial({
      color: 0x5c4033,
      roughness: 0.85
    });
    const bundNorth = new THREE.Mesh(bundGeo, bundMat);
    bundNorth.position.set(0, 0.8, -18);
    bundNorth.castShadow = true;
    bundNorth.receiveShadow = true;
    terrainGroup.add(bundNorth);

    // Furrows & Crop Beds (Paddy Fields with waterlogged furrows)
    const cropGroup = new THREE.Group();
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.06, 1.2, 5);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x3f6212, // Lush paddy green
      roughness: 0.6,
      metalness: 0.1
    });

    // 120 procedural crop tufts in neat agricultural rows
    for (let row = -14; row <= 14; row += 2.8) {
      for (let col = -14; col <= 14; col += 2.2) {
        if (Math.abs(row) > 10 && Math.abs(col) < 4) continue; // Pathway
        const tuft = new THREE.Group();

        // 3 stalks per cluster
        for (let i = 0; i < 3; i++) {
          const stalk = new THREE.Mesh(stemGeo, leafMat);
          stalk.position.set(
            (Math.random() - 0.5) * 0.2,
            0.6,
            (Math.random() - 0.5) * 0.2
          );
          stalk.rotation.z = (Math.random() - 0.5) * 0.25;
          stalk.rotation.x = (Math.random() - 0.5) * 0.25;
          stalk.castShadow = true;
          tuft.add(stalk);
        }
        tuft.position.set(col, 0, row);
        cropGroup.add(tuft);
      }
    }
    terrainGroup.add(cropGroup);
    scene.add(terrainGroup);

    // 7. COMPOSITE PROCEDURAL MODELS (3-12 parts per threejs skill directive)
    // A. Farmer's Homestead & Raised Granary (6 distinct parts)
    const houseGroup = new THREE.Group();

    // 1. Raised concrete plinth (Flood defense platform)
    const plinthGeo = new THREE.BoxGeometry(6, 1.2, 5);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.8 });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = 0.6;
    plinth.castShadow = true;
    plinth.receiveShadow = true;
    houseGroup.add(plinth);

    // 2. Brick house walls
    const wallGeo = new THREE.BoxGeometry(5.2, 2.6, 4.2);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7 });
    const walls = new THREE.Mesh(wallGeo, wallMat);
    walls.position.y = 2.5;
    walls.castShadow = true;
    walls.receiveShadow = true;
    houseGroup.add(walls);

    // 3. Pitched Terracotta Roof
    const roofGeo = new THREE.ConeGeometry(4.2, 1.6, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5, metalness: 0.1 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 4.6;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    // 4. Wooden Entrance Door
    const doorGeo = new THREE.BoxGeometry(0.8, 1.8, 0.1);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 2.1, 2.15);
    houseGroup.add(door);

    // 5. Raised Seed Granary Drum (Protected emergency seed storage)
    const granaryGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.8, 12);
    const granaryMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.85, roughness: 0.25 });
    const granary = new THREE.Mesh(granaryGeo, granaryMat);
    granary.position.set(2, 2.1, -1.2);
    granary.castShadow = true;
    houseGroup.add(granary);

    // 6. Solar Panel Flood Light on Roof
    const solarGeo = new THREE.BoxGeometry(1.2, 0.08, 0.8);
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.1 });
    const solar = new THREE.Mesh(solarGeo, solarMat);
    solar.position.set(-1.2, 4.6, 0.5);
    solar.rotation.x = 0.3;
    houseGroup.add(solar);

    houseGroup.position.set(-12, 0, -10);
    scene.add(houseGroup);

    // B. Tractor & Submersible Irrigation Pump Rig (8 distinct parts)
    const tractorGroup = new THREE.Group();

    // 1. Chassis / Engine body
    const chassisGeo = new THREE.BoxGeometry(2.4, 1.0, 1.4);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4, metalness: 0.4 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 1.0;
    chassis.castShadow = true;
    tractorGroup.add(chassis);

    // 2. Engine Hood / Bonnet
    const hoodGeo = new THREE.BoxGeometry(1.4, 0.7, 1.2);
    const hoodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3, metalness: 0.5 });
    const hood = new THREE.Mesh(hoodGeo, hoodMat);
    hood.position.set(0.6, 1.35, 0);
    hood.castShadow = true;
    tractorGroup.add(hood);

    // 3. Driver Safety Roll Cage (ROPS)
    const ropsGeo = new THREE.BoxGeometry(1.2, 1.8, 1.3);
    const ropsMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.9, roughness: 0.2 });
    const rops = new THREE.Mesh(ropsGeo, ropsMat);
    rops.position.set(-0.6, 2.3, 0);
    tractorGroup.add(rops);

    // 4. Large Rear Wheels (left & right)
    const wheelLargeGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.35, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const wheelRL = new THREE.Mesh(wheelLargeGeo, wheelMat);
    wheelRL.rotation.x = Math.PI / 2;
    wheelRL.position.set(-0.6, 0.7, 0.85);
    wheelRL.castShadow = true;
    tractorGroup.add(wheelRL);

    const wheelRR = new THREE.Mesh(wheelLargeGeo, wheelMat);
    wheelRR.rotation.x = Math.PI / 2;
    wheelRR.position.set(-0.6, 0.7, -0.85);
    wheelRR.castShadow = true;
    tractorGroup.add(wheelRR);

    // 5. Front Wheels (left & right)
    const wheelSmallGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.25, 16);
    const wheelFL = new THREE.Mesh(wheelSmallGeo, wheelMat);
    wheelFL.rotation.x = Math.PI / 2;
    wheelFL.position.set(1.0, 0.45, 0.75);
    wheelFL.castShadow = true;
    tractorGroup.add(wheelFL);

    const wheelFR = new THREE.Mesh(wheelSmallGeo, wheelMat);
    wheelFR.rotation.x = Math.PI / 2;
    wheelFR.position.set(1.0, 0.45, -0.75);
    wheelFR.castShadow = true;
    tractorGroup.add(wheelFR);

    // 6. High Exhaust Pipe (Snorkel for flood wading)
    const pipeGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6, 8);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, metalness: 0.9, roughness: 0.1 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.set(0.8, 2.3, 0.5);
    tractorGroup.add(pipe);

    // 7. PTO Driven Emergency Dewatering Pump
    const pumpGeo = new THREE.BoxGeometry(0.8, 0.6, 0.6);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4, metalness: 0.6 });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.position.set(-1.6, 0.8, 0);
    tractorGroup.add(pump);

    // 8. Drainage Suction Hose
    const hoseGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 8);
    const hoseMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
    const hose = new THREE.Mesh(hoseGeo, hoseMat);
    hose.position.set(-2.4, 0.4, 0);
    hose.rotation.z = Math.PI / 3;
    tractorGroup.add(hose);

    tractorGroup.position.set(-8, 0, 8);
    tractorGroup.rotation.y = 0.4;
    scene.add(tractorGroup);

    // C. Procedural Trees on High Bund (4 composite trees)
    const treePositions = [
      [-16, -14],
      [14, -16],
      [-18, 14],
      [16, 12]
    ];
    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      // Trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 3, 6),
        new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 })
      );
      trunk.position.y = 1.5;
      trunk.castShadow = true;
      tree.add(trunk);

      // Lower Canopy
      const canopy1 = new THREE.Mesh(
        new THREE.ConeGeometry(2.2, 2.5, 6),
        new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.6 })
      );
      canopy1.position.y = 3.6;
      canopy1.castShadow = true;
      tree.add(canopy1);

      // Upper Canopy
      const canopy2 = new THREE.Mesh(
        new THREE.ConeGeometry(1.6, 2.0, 6),
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 })
      );
      canopy2.position.y = 4.8;
      canopy2.castShadow = true;
      tree.add(canopy2);

      tree.position.set(tx, 0, tz);
      scene.add(tree);
    });

    // 8. PROCEDURAL FLOODWATER SURFACE
    const waterGeo = new THREE.PlaneGeometry(64, 64, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x785634, // Silt-laden floodwater brown/amber
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.88,
      depthWrite: false
    });
    waterMaterialRef.current = waterMat;

    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = currentLevel;
    waterMeshRef.current = water;
    scene.add(water);

    // 9. ANIMATION LOOP with software WebGL guard & clock
    const clock = new THREE.Clock();
    let animId = 0;

    const tick = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Animate gentle flood ripples
      if (waterMeshRef.current) {
        const baseLevel = currentLevel;
        const wave = Math.sin(elapsed * 2.5) * 0.03;
        waterMeshRef.current.position.y = THREE.MathUtils.damp(
          waterMeshRef.current.position.y,
          baseLevel + wave,
          4,
          delta
        );
      }

      controls.update();
      renderer.render(scene, camera);

      if (!isSoftwareGl) {
        animId = requestAnimationFrame(tick);
      } else {
        animId = window.setTimeout(tick, 80);
      }
    };

    tick();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) {
        cancelAnimationFrame(animId);
        clearTimeout(animId);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync water level changes dynamically
  useEffect(() => {
    if (waterMeshRef.current && waterMaterialRef.current) {
      if (currentLevel < 0.3) {
        waterMaterialRef.current.color.setHex(0x22c55e); // Greenish irrigation water
        waterMaterialRef.current.opacity = 0.75;
      } else if (currentLevel < 1.2) {
        waterMaterialRef.current.color.setHex(0xb45309); // Turbid canal overflow
        waterMaterialRef.current.opacity = 0.85;
      } else {
        waterMaterialRef.current.color.setHex(0x713f12); // Deep silt river flood
        waterMaterialRef.current.opacity = 0.94;
      }
    }
  }, [currentLevel]);

  // Handle Preset Views
  const setView = (mode: 'perspective' | 'overhead' | 'bund') => {
    setCameraView(mode);
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;

    if (mode === 'overhead') {
      cam.position.set(0, 45, 0.1);
      ctrl.target.set(0, 0, 0);
    } else if (mode === 'bund') {
      cam.position.set(-6, 4, 18);
      ctrl.target.set(-12, 2.5, -10);
    } else {
      cam.position.set(24, 18, 28);
      ctrl.target.set(0, 1.5, 0);
    }
    ctrl.update();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentLevel(val);
    if (onWaterLevelChange) onWaterLevelChange(val);
  };

  // Determine stage severity
  const getSubmergenceState = (level: number) => {
    if (level <= 0.15) return { stage: 'Normal Irrigation', risk: 'Safe', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (level <= 0.6) return { stage: 'Root Zone Saturation', risk: 'Watch', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (level <= 1.4) return { stage: 'Canopy Submergence', risk: 'High Danger', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    return { stage: 'Full Field Inundation', risk: 'Critical', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const status = getSubmergenceState(currentLevel);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[480px] sm:h-[560px] cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating HUD: Farm Identification & Submergence Status */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 text-white px-4 py-2.5 rounded-xl border border-slate-700 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-bold text-sm tracking-wide">{farmName}</h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 uppercase">
              {cropType}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Interactive Three.js PBR Floodwater Dynamics</p>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700 shadow-lg">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${status.color}`}>
            {status.stage} • {status.risk}
          </div>
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition"
            title="Toggle Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collapsible Agricultural Metrics HUD */}
      {showMetrics && (
        <div className="absolute top-20 right-4 w-72 pointer-events-auto bg-slate-900/95 text-slate-100 p-3.5 rounded-xl border border-slate-700 shadow-2xl space-y-2 text-xs">
          <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1.5 flex items-center justify-between">
            <span>Crop Hypoxia Parameters</span>
            <span className="text-emerald-400 font-mono">{(currentLevel * 100).toFixed(0)} cm Depth</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Root Aeration</span>
              <span className="font-semibold text-white">
                {currentLevel > 0.4 ? 'Anaerobic (<2% O₂)' : 'Aerobic Adequate'}
              </span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">SUB1A Dormancy</span>
              <span className="font-semibold text-white">
                {currentLevel > 0.8 ? 'Activated (14d)' : 'Inactive'}
              </span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Homestead Plinth</span>
              <span className="font-semibold text-emerald-400">
                {currentLevel < 1.2 ? '+1.2m Elevated' : 'Breach Warning'}
              </span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
              <span className="text-slate-400 block text-[10px]">Tractor Rig</span>
              <span className="font-semibold text-amber-400">
                {currentLevel < 0.7 ? 'Operational' : 'Snorkel Limit'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Dock */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto bg-slate-900/95 text-white p-3.5 sm:p-4 rounded-2xl border border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Flood Surge Water Level Slider */}
        <div className="w-full md:w-5/12 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300 shrink-0">
            <Waves className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-semibold">Flood Surge:</span>
          </div>
          <input
            type="range"
            min="0"
            max="2.5"
            step="0.05"
            value={currentLevel}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="font-mono text-sm font-bold text-blue-400 shrink-0 w-16 text-right">
            {currentLevel.toFixed(2)} m
          </span>
        </div>

        {/* Quick Flood Stage Presets */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto justify-center">
          <button
            onClick={() => { setCurrentLevel(0.1); if (onWaterLevelChange) onWaterLevelChange(0.1); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
              currentLevel <= 0.2 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Normal (0.1m)
          </button>
          <button
            onClick={() => { setCurrentLevel(0.6); if (onWaterLevelChange) onWaterLevelChange(0.6); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
              currentLevel > 0.2 && currentLevel <= 0.9 ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Watch (0.6m)
          </button>
          <button
            onClick={() => { setCurrentLevel(1.5); if (onWaterLevelChange) onWaterLevelChange(1.5); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
              currentLevel > 0.9 && currentLevel <= 1.8 ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Peak Flood (1.5m)
          </button>
          <button
            onClick={() => { setCurrentLevel(2.2); if (onWaterLevelChange) onWaterLevelChange(2.2); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
              currentLevel > 1.8 ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            Severe (2.2m)
          </button>
        </div>

        {/* Camera Views & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setView('perspective')}
              className={`px-2 py-1 text-xs font-medium rounded ${
                cameraView === 'perspective' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Perspective
            </button>
            <button
              onClick={() => setView('overhead')}
              className={`px-2 py-1 text-xs font-medium rounded ${
                cameraView === 'overhead' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top-Down
            </button>
            <button
              onClick={() => setView('bund')}
              className={`px-2 py-1 text-xs font-medium rounded ${
                cameraView === 'bund' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bund View
            </button>
          </div>
          <button
            onClick={() => {
              setCurrentLevel(0.35);
              setView('perspective');
              if (onWaterLevelChange) onWaterLevelChange(0.35);
            }}
            className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
