import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070707, 0.0012);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 400;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070707, 1);
    containerRef.current.appendChild(renderer.domElement);

    const particleCount = 1050;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1000;
      positions[i + 1] = (Math.random() - 0.5) * 1000;
      positions[i + 2] = (Math.random() - 0.5) * 1000;

      velocities.push(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      );
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xFF1A1A,
      size: 1.5,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xFF1A1A,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const onMouseMove = (event: MouseEvent) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = -(event.clientY / window.innerHeight) * 2 + 1;
      setCursorPos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const positions = particleSystem.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        if (Math.abs(positions[i]) > 500) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 500) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 500) velocities[i + 2] *= -1;
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;

      linePositions.length = 0;
      const maxDistance = 100;

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < maxDistance) {
            linePositions.push(
              positions[i * 3],
              positions[i * 3 + 1],
              positions[i * 3 + 2],
              positions[j * 3],
              positions[j * 3 + 1],
              positions[j * 3 + 2]
            );
          }
        }
      }

      lines.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      );

      camera.position.x += (mouseX.current * 50 - camera.position.x) * 0.05;
      camera.position.y += (mouseY.current * 50 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      particleSystem.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      particleMaterial.dispose();
      particles.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* Layer 1: Base black bg + radial red glow */}
      <div
        ref={containerRef}
        className="fixed inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 26, 26, 0.12) 0%, #070707 70%)',
        }}
      />
      {/* Layer 2: Animated red grid */}
      <div
        className="fixed inset-0 -z-[9] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255, 0, 0, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          animation: 'gridScroll 20s linear infinite',
        }}
      />
      {/* Layer 3: AI core rotating glow sphere */}
      <div
        className="fixed inset-0 -z-[8] pointer-events-none flex items-center justify-center"
      >
        <div
          style={{
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 26, 26, 0.08) 0%, rgba(139, 0, 0, 0.04) 40%, transparent 70%)',
            animation: 'sphereRotate 30s linear infinite',
          }}
        />
      </div>
      {/* Layer 4: Scan lines overlay */}
      <div
        className="fixed inset-0 -z-[7] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 26, 26, 0.04) 2px, rgba(255, 26, 26, 0.04) 4px)',
          animation: 'scanLine 10s linear infinite',
          opacity: 0.04,
        }}
      />
      {/* Layer 5: Dark overlay */}
      <div
        className="fixed inset-0 -z-[6] pointer-events-none"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      />
      {/* Layer 6: Red ambient cursor shadow */}
      <div
        className="fixed inset-0 -z-[5] pointer-events-none"
        style={{
          background: `radial-gradient(circle 150px at ${cursorPos.x}px ${cursorPos.y}px, rgba(255, 0, 0, 0.15), transparent)`,
        }}
      />
    </>
  );
}
