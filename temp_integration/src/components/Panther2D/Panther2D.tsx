import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0.3, 7.2);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x222533, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 2.8);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    let mixer: THREE.AnimationMixer | null = null;
    let pantherModel: THREE.Object3D | null = null;

    // Load actual GLB Model
    const loader = new GLTFLoader();
    loader.load(
      '/models/black-panther.glb',
      (gltf) => {
        pantherModel = gltf.scene;

        // Position & Scale
        pantherModel.scale.set(1.95, 1.95, 1.95);
        pantherModel.position.set(0.3, -0.55, 0);
        pantherModel.rotation.y = Math.PI * 0.12;

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

    const animate = () => {
      animId = requestAnimationFrame(animate);
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
