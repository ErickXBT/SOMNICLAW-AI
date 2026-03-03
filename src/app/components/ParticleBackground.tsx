import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0000, 0.001);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 400;

    // Renderer setup - gracefully handle environments without WebGL
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0b0000, 1);
    containerRef.current.appendChild(renderer.domElement);

    // Particles
    const particleCount = 2000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 1000;
      positions[i + 1] = (Math.random() - 0.5) * 1000;
      positions[i + 2] = (Math.random() - 0.5) * 1000;
      
      velocities.push(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      );
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle material with glow
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff1a1a,
      size: 3,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Create lines between nearby particles
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff3b3b,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse move handler
    const onMouseMove = (event: MouseEvent) => {
      mouseX.current = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY.current = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Handle resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Update particle positions
      const positions = particleSystem.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Boundary check
        if (Math.abs(positions[i]) > 500) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 500) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 500) velocities[i + 2] *= -1;
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Update lines between nearby particles
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

      // Mouse parallax effect
      camera.position.x += (mouseX.current * 50 - camera.position.x) * 0.05;
      camera.position.y += (mouseY.current * 50 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Rotate particle system slowly
      particleSystem.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
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
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ background: '#0b0000' }}
    />
  );
}
