import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Eye, Sparkles, Layers, Box, Cpu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface InteractiveHolodeck3DProps {
  accentColor1?: string;
  accentColor2?: string;
  title?: string;
  subtitle?: string;
}

export const InteractiveHolodeck3D: React.FC<InteractiveHolodeck3DProps> = ({
  accentColor1 = '#004AAD',
  accentColor2 = '#AA0044',
  title = 'ASCENT 3D SPECIFICATION LAB',
  subtitle = 'Interactive hardware & structural telemetry viewport',
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState<boolean>(true);
  const [activeShape, setActiveShape] = useState<'prism' | 'satellite' | 'lattice'>('satellite');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [accentMode, setAccentMode] = useState<'dual' | 'blue' | 'crimson'>('dual');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for dynamic mesh
    const meshGroup = new THREE.Group();
    meshGroupRef.current = meshGroup;
    scene.add(meshGroup);

    // Grid Plane (Engineering grid floor)
    const gridHelper = new THREE.GridHelper(
      24,
      24,
      isLight ? 0x94a3b8 : 0x545454,
      isLight ? 0xcbd5e1 : 0x222222
    );
    gridHelper.position.y = -4.5;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isLight ? 0.9 : 0.4);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(new THREE.Color(accentColor1), 3.0, 30);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(new THREE.Color(accentColor2), 2.8, 30);
    light2.position.set(-10, -5, 10);
    scene.add(light2);

    // Function to rebuild geometry based on state
    const rebuildModel = () => {
      // Clear previous
      while (meshGroup.children.length > 0) {
        const obj = meshGroup.children[0];
        meshGroup.remove(obj);
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      }
      materialsRef.current = [];

      const primaryHex = accentMode === 'crimson' ? accentColor2 : accentColor1;
      const secondaryHex = accentMode === 'blue' ? accentColor1 : accentColor2;

      if (activeShape === 'satellite') {
        // Core Chassis (Hexagonal prism / cylinder)
        const coreGeo = new THREE.CylinderGeometry(2, 2, 4, 6);
        const coreMat = new THREE.MeshStandardMaterial({
          color: isLight ? 0x334155 : 0x1a1a1a,
          metalness: 0.9,
          roughness: 0.1,
          wireframe: wireframeMode,
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        meshGroup.add(coreMesh);
        materialsRef.current.push(coreMat);

        // Solar Array Wings (Left & Right)
        const wingGeo = new THREE.BoxGeometry(7, 0.1, 2.5);
        const wingMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(primaryHex),
          metalness: 0.7,
          roughness: 0.3,
          wireframe: wireframeMode,
        });
        materialsRef.current.push(wingMat);

        const leftWing = new THREE.Mesh(wingGeo, wingMat);
        leftWing.position.set(5.5, 0, 0);
        meshGroup.add(leftWing);

        const rightWing = new THREE.Mesh(wingGeo, wingMat);
        rightWing.position.set(-5.5, 0, 0);
        meshGroup.add(rightWing);

        // Communications Dish
        const dishGeo = new THREE.ConeGeometry(1.4, 0.8, 16, 1, true);
        const dishMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(secondaryHex),
          wireframe: true,
        });
        materialsRef.current.push(dishMat);
        const dish = new THREE.Mesh(dishGeo, dishMat);
        dish.position.set(0, 2.5, 0);
        dish.rotation.x = Math.PI;
        meshGroup.add(dish);
      } else if (activeShape === 'prism') {
        // Multi-faceted Kinetic Apex Polyhedron
        const geo = new THREE.DodecahedronGeometry(3.6, 0);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x242424,
          metalness: 0.85,
          roughness: 0.15,
          wireframe: wireframeMode,
        });
        materialsRef.current.push(mat);
        const mesh = new THREE.Mesh(geo, mat);
        meshGroup.add(mesh);

        // Concentric Orbit rings
        const ringGeo = new THREE.TorusGeometry(5.2, 0.08, 16, 80);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(primaryHex),
          wireframe: true,
        });
        materialsRef.current.push(ringMat);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5;
        meshGroup.add(ring);
      } else {
        // Quantum Lattice / Torus Knot
        const knotGeo = new THREE.TorusKnotGeometry(2.4, 0.7, 100, 16);
        const knotMat = new THREE.MeshStandardMaterial({
          color: wireframeMode ? new THREE.Color(secondaryHex) : 0x111111,
          metalness: 0.9,
          roughness: 0.2,
          wireframe: wireframeMode,
        });
        materialsRef.current.push(knotMat);
        const knot = new THREE.Mesh(knotGeo, knotMat);
        meshGroup.add(knot);
      }
    };

    rebuildModel();

    // Interaction controls: drag to rotate
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      meshGroup.rotation.y += deltaX * 0.01;
      meshGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Responsive observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging) {
        meshGroup.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeShape, wireframeMode, autoRotate, accentMode, accentColor1, accentColor2, isLight]);

  return (
    <div
      className="relative w-full rounded-2xl border border-slate-200 dark:border-[#545454]/50 bg-white/90 dark:bg-[#000000]/80 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none"
      id="ascent-interactive-holodeck"
    >
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-[#545454]/40 px-5 py-4 bg-slate-50/90 dark:bg-[#0a0a0a]/90">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#004AAD] animate-pulse" />
          {(title || subtitle) && (
            <div>
              {title && (
                <h4 className="font-heading text-xs md:text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                  {title}
                </h4>
              )}
              {subtitle && <p className="font-body text-[11px] text-slate-500 dark:text-[#A6A6A6]">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* HUD Status tags */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0 font-body text-xs text-slate-600 dark:text-[#A6A6A6]">
          <span className="px-2 py-0.5 rounded border border-slate-300 dark:border-[#545454]/60 bg-white dark:bg-[#111111]">
            WebGL 2.0 Realtime
          </span>
          <span className="px-2 py-0.5 rounded border border-[#004AAD]/40 text-[#004AAD] bg-[#004AAD]/10 font-button font-semibold">
            60 FPS
          </span>
        </div>
      </div>

      {/* Main 3D Viewport */}
      <div
        ref={mountRef}
        className={`relative w-full h-[320px] md:h-[420px] cursor-grab active:cursor-grabbing ${
          isLight ? 'bg-slate-100/70' : 'bg-radial from-[#151515] to-[#000000]'
        }`}
      >
        {/* Floating Hint */}
        <div className="absolute top-4 left-4 pointer-events-none z-10 text-[11px] font-body text-slate-600 dark:text-[#A6A6A6]/80 flex items-center gap-1.5 bg-white/80 dark:bg-black/60 px-2.5 py-1 rounded-md border border-slate-300 dark:border-[#545454]/30 backdrop-blur-sm shadow-sm">
          <RotateCw size={12} className="text-slate-800 dark:text-white animate-spin-slow" />
          <span>Click and drag to rotate in 3D space</span>
        </div>
      </div>

      {/* Control Deck Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-200 dark:border-[#545454]/40 bg-slate-50/90 dark:bg-[#0c0c0c]">
        {/* Shape Selector */}
        <div className="flex items-center gap-1.5">
          <span className="font-body text-xs text-slate-500 dark:text-[#A6A6A6] mr-1 hidden sm:inline">Model:</span>
          <button
            onClick={() => setActiveShape('satellite')}
            className={`font-button text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeShape === 'satellite'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-white dark:bg-[#181818] text-slate-600 dark:text-[#A6A6A6] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#545454]/40'
            }`}
          >
            Payload Satellite
          </button>
          <button
            onClick={() => setActiveShape('prism')}
            className={`font-button text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeShape === 'prism'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-white dark:bg-[#181818] text-slate-600 dark:text-[#A6A6A6] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#545454]/40'
            }`}
          >
            Ascent Apex
          </button>
          <button
            onClick={() => setActiveShape('lattice')}
            className={`font-button text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              activeShape === 'lattice'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-white dark:bg-[#181818] text-slate-600 dark:text-[#A6A6A6] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#545454]/40'
            }`}
          >
            Quantum Mesh
          </button>
        </div>

        {/* View Mode & Accent Toggles */}
        <div className="flex items-center gap-2">
          {/* Wireframe Toggle */}
          <button
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`font-button flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              wireframeMode
                ? 'border-[#004AAD] text-[#004AAD] dark:text-white bg-[#004AAD]/15 dark:bg-[#004AAD]/20'
                : 'border-slate-300 dark:border-[#545454]/60 text-slate-600 dark:text-[#A6A6A6] hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#181818]'
            }`}
          >
            <Layers size={13} />
            <span>{wireframeMode ? 'Wireframe' : 'Solid Shell'}</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`font-button flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              autoRotate
                ? 'border-[#AA0044] text-[#AA0044] dark:text-white bg-[#AA0044]/15 dark:bg-[#AA0044]/20'
                : 'border-slate-300 dark:border-[#545454]/60 text-slate-600 dark:text-[#A6A6A6] hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#181818]'
            }`}
          >
            <RotateCw size={13} className={autoRotate ? 'animate-spin-slow' : ''} />
            <span>{autoRotate ? 'Auto Orbit' : 'Paused'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveHolodeck3D;
