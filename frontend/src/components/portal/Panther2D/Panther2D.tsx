import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export const Panther2D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 9.0);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // --- ENVIRONMENT & LIGHTING ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00e5ff, 1.5);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
    backLight.position.set(0, 5, -8);
    scene.add(backLight);

    let mixer: THREE.AnimationMixer | null = null;
    let pantherModel: THREE.Object3D | null = null;

    // Load actual GLB Model
    const loader = new GLTFLoader();
    loader.load(
      '/models/black-panther.glb',
      (gltf) => {
        pantherModel = gltf.scene;

        // Enhance Materials for Realism
        pantherModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const material = mesh.material as THREE.MeshStandardMaterial;
            if (material) {
              material.envMapIntensity = 1.5;
              material.needsUpdate = true;
            }
          }
        });

        // Position & Scale - Larger and Adjusted
        pantherModel.scale.set(3.0, 3.0, 3.0);
        pantherModel.position.set(0.3, -1.2, 0);
        pantherModel.rotation.y = Math.PI * 0.15;

        scene.add(pantherModel);

        // Play ONLY the single animation clip that actually exists in GLB ("Animation")
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(pantherModel);
          const clip = gltf.animations[0]; // "Animation" (16.458s duration)
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
        }
      },
      undefined,
      (error) => {
        console.warn('GLB load error:', error);
      }
    );

    // Animation Loop (Updates only the real GLB AnimationMixer clip)
    let animId: number;
    const clock = new THREE.Clock();
    let isVisible = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      
      if (!isVisible) return;

      const delta = clock.getDelta();

      if (mixer) {
        mixer.update(delta);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || 450;
      const newH = container.clientHeight || 450;

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();

      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[440px] sm:h-[480px] lg:h-[510px] flex items-center justify-center select-none overflow-hidden"
    >
      {/* 3D GLB Panther Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full object-contain pointer-events-auto"
      />
    </div>
  );
};
