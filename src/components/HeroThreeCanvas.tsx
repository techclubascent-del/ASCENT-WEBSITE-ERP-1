import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export type Model3DStyle = 'apex' | 'gyroscope' | 'torus';

interface HeroThreeCanvasProps {
  accentColor1?: string;
  accentColor2?: string;
  interactive?: boolean;
  modelStyle?: Model3DStyle;
  className?: string;
}

export const HeroThreeCanvas: React.FC<HeroThreeCanvasProps> = ({
  accentColor1 = '#004AAD',
  accentColor2 = '#AA0044',
  interactive = true,
  modelStyle = 'apex',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setIsWebGLSupported(false);
        return;
      }
    } catch {
      setIsWebGLSupported(false);
      return;
    }

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 28;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const disposables: { dispose: () => void }[] = [];

    // Geometry & Materials based on modelStyle
    let innerMesh: THREE.Mesh | null = null;
    let ring1: THREE.Mesh | null = null;
    let ring2: THREE.Mesh | null = null;
    let ring3: THREE.Mesh | null = null;

    if (modelStyle === 'gyroscope') {
      // Gyroscope Gimbal Rings
      const ringGeo1 = new THREE.TorusGeometry(8.2, 0.08, 16, 120);
      const ringMat1 = new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentColor1),
        metalness: 0.85,
        roughness: 0.2,
      });
      ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      mainGroup.add(ring1);
      disposables.push(ringGeo1, ringMat1);

      const ringGeo2 = new THREE.TorusGeometry(6.6, 0.07, 16, 100);
      const ringMat2 = new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentColor2),
        metalness: 0.9,
        roughness: 0.25,
      });
      ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.x = Math.PI / 2;
      mainGroup.add(ring2);
      disposables.push(ringGeo2, ringMat2);

      const ringGeo3 = new THREE.TorusGeometry(5.0, 0.06, 16, 80);
      const ringMat3 = new THREE.MeshStandardMaterial({
        color: isLight ? new THREE.Color('#545454') : new THREE.Color('#FFFFFF'),
        metalness: 0.8,
        roughness: 0.3,
      });
      ring3 = new THREE.Mesh(ringGeo3, ringMat3);
      ring3.rotation.y = Math.PI / 2;
      mainGroup.add(ring3);
      disposables.push(ringGeo3, ringMat3);

      const coreGeo = new THREE.SphereGeometry(2.4, 24, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: isLight ? 0x1e1e1e : 0xffffff,
        metalness: 0.95,
        roughness: 0.15,
        wireframe: true,
      });
      innerMesh = new THREE.Mesh(coreGeo, coreMat);
      mainGroup.add(innerMesh);
      disposables.push(coreGeo, coreMat);
    } else if (modelStyle === 'torus') {
      // Quantum Torus Knot
      const knotGeo = new THREE.TorusKnotGeometry(5.2, 1.3, 128, 32, 2, 3);
      const knotMat = new THREE.MeshStandardMaterial({
        color: isLight ? new THREE.Color('#545454') : new THREE.Color('#FFFFFF'),
        wireframe: true,
        transparent: true,
        opacity: isLight ? 0.6 : 0.5,
      });
      const knotMesh = new THREE.Mesh(knotGeo, knotMat);
      mainGroup.add(knotMesh);
      disposables.push(knotGeo, knotMat);

      const ringGeo1 = new THREE.TorusGeometry(8.5, 0.06, 16, 100);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentColor1),
        transparent: true,
        opacity: 0.9,
      });
      ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      ring1.rotation.x = Math.PI / 3;
      mainGroup.add(ring1);
      disposables.push(ringGeo1, ringMat1);

      const ringGeo2 = new THREE.TorusGeometry(9.8, 0.05, 16, 100);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentColor2),
        transparent: true,
        opacity: 0.85,
      });
      ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.y = Math.PI / 4;
      mainGroup.add(ring2);
      disposables.push(ringGeo2, ringMat2);
    } else {
      // Default: Central Ascent Geometric Polyhedron (Wireframe)
      const icosaGeometry = new THREE.IcosahedronGeometry(6.5, 1);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: isLight ? 0x545454 : 0xa6a6a6,
        wireframe: true,
        transparent: true,
        opacity: isLight ? 0.45 : 0.35,
      });
      const icosaMesh = new THREE.Mesh(icosaGeometry, wireframeMaterial);
      mainGroup.add(icosaMesh);
      disposables.push(icosaGeometry, wireframeMaterial);

      // Inner Nested Apex Crystal
      const innerGeometry = new THREE.OctahedronGeometry(4.2, 0);
      const innerMaterial = new THREE.MeshStandardMaterial({
        color: isLight ? 0x1e1e1e : 0xffffff,
        roughness: isLight ? 0.25 : 0.2,
        metalness: isLight ? 0.85 : 0.8,
        wireframe: false,
      });
      innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
      mainGroup.add(innerMesh);
      disposables.push(innerGeometry, innerMaterial);

      // Orbital Dual Accent Rings
      const ring1Geo = new THREE.TorusGeometry(8.5, 0.06, 16, 100);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentColor1),
        transparent: true,
        opacity: isLight ? 0.95 : 0.85,
      });
      ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 3;
      mainGroup.add(ring1);
      disposables.push(ring1Geo, ring1Mat);

      const ring2Geo = new THREE.TorusGeometry(9.8, 0.05, 16, 100);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentColor2),
        transparent: true,
        opacity: isLight ? 0.9 : 0.8,
      });
      ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.y = Math.PI / 4;
      ring2.rotation.x = -Math.PI / 6;
      mainGroup.add(ring2);
      disposables.push(ring2Geo, ring2Mat);
    }

    // Constellation / Orbit Particle Cloud
    const particleCount = 320;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cWhite = new THREE.Color(isLight ? 0x1e1e1e : 0xffffff);
    const cSilver = new THREE.Color(isLight ? 0x545454 : 0xa6a6a6);
    const cAccent1 = new THREE.Color(accentColor1);
    const cAccent2 = new THREE.Color(accentColor2);
    const cOchreGold = new THREE.Color('#D4A373');

    for (let i = 0; i < particleCount; i++) {
      const radius = 9 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const colorPick = Math.random();
      let chosenColor = cSilver;
      if (colorPick > 0.82) chosenColor = cAccent1;
      else if (colorPick > 0.65) chosenColor = cAccent2;
      else if (colorPick > 0.48) chosenColor = cOchreGold;
      else if (colorPick > 0.25) chosenColor = cWhite;

      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: isLight ? 0.38 : 0.32,
      vertexColors: true,
      transparent: true,
      opacity: isLight ? 0.85 : 0.75,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);
    disposables.push(particleGeometry, particleMaterial);

    // Lighting with a warm touch of #D4A373
    const ambientLight = new THREE.AmbientLight(isLight ? 0x94a3b8 : 0x545454, isLight ? 1.8 : 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(accentColor1, 2.8, 60);
    pointLight1.position.set(14, 14, 12);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(accentColor2, 2.4, 60);
    pointLight2.position.set(-14, -12, 12);
    scene.add(pointLight2);

    const goldRimLight = new THREE.PointLight(0xd4a373, 2.2, 55);
    goldRimLight.position.set(0, -14, -8);
    scene.add(goldRimLight);

    // Interaction Variables (Drag-to-orbit + cursor parallax + mouse wheel zoom)
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      isDragging = true;
      setIsDraggingState(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!interactive) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;
        prevPointerX = clientX;
        prevPointerY = clientY;

        velocityX = deltaX * 0.006;
        velocityY = deltaY * 0.006;

        mainGroup.rotation.y += velocityX;
        mainGroup.rotation.x += velocityY;
      } else {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        mouseX = (x / (rect.width / 2)) * 0.35;
        mouseY = (y / (rect.height / 2)) * 0.35;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsDraggingState(false);
    };

    // Zoom on wheel (clamped)
    const onWheel = (e: WheelEvent) => {
      if (!interactive) return;
      // Only zoom if within container
      const newZ = camera.position.z + e.deltaY * 0.02;
      camera.position.z = THREE.MathUtils.clamp(newZ, 16, 42);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: true });

    // Responsive Canvas Resizing with ResizeObserver
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

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Inertia decay
      if (!isDragging) {
        velocityX *= 0.94;
        velocityY *= 0.94;
        mainGroup.rotation.y += velocityX;
        mainGroup.rotation.x += velocityY;

        // Smooth subtle cursor parallax
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Idle floating & rotation
        mainGroup.rotation.y += delta * 0.16 + targetX * 0.015;
        mainGroup.rotation.x += targetY * 0.02;
        mainGroup.position.y = Math.sin(elapsed * 1.4) * 0.4;
      }

      // Dynamic sub-rotations
      if (innerMesh) {
        innerMesh.rotation.y -= delta * 0.35;
        innerMesh.rotation.z += delta * 0.15;
      }

      if (ring1) ring1.rotation.z += delta * 0.25;
      if (ring2) ring2.rotation.z -= delta * 0.2;
      if (ring3) ring3.rotation.y += delta * 0.3;

      particles.rotation.y -= delta * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      resizeObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      disposables.forEach((d) => d.dispose());
    };
  }, [accentColor1, accentColor2, interactive, isLight, modelStyle]);

  if (!isWebGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center text-[#545454] dark:text-[#A6A6A6] font-body text-sm">
        <div className="border border-[#545454]/30 rounded-xl p-6 bg-white/50 dark:bg-black/40 backdrop-blur-md">
          <p className="font-heading text-[#1E1E1E] dark:text-white mb-2 font-bold">3D ACCELERATION DISABLED</p>
          <p>WebGL fallback mode active. Rendering optimized vector view.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${
        isDraggingState ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      id="hero-threejs-canvas"
    />
  );
};

export default HeroThreeCanvas;

