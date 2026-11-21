import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { generateCakeAndFlowerParticles, ParticleData } from '../../utils/mathShapes';
import { ScenePhase } from '../../types/card';
import { Sparkles } from 'lucide-react';

interface ParticleSceneProps {
  phase: ScenePhase;
  onCakeClick: () => void;
  onMorphComplete: () => void;
}

export const ParticleScene: React.FC<ParticleSceneProps> = ({
  phase,
  onCakeClick,
  onMorphComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Lưu progress morphing (0.0: Cake, 1.0: Flower)
  const progressRef = useRef(0.0);
  const isMorphingRef = useRef(false);

  // Tương tác chuột / cảm ứng xoay góc nhìn
  const isDraggingRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.2, y: 0 });
  const currentRotationRef = useRef({ x: 0.2, y: 0 });

  const [hintVisible, setHintVisible] = useState(true);

  // Kích hoạt morphing khi phase chuyển sang 'morphing'
  useEffect(() => {
    if (phase === 'morphing' && !isMorphingRef.current) {
      isMorphingRef.current = true;
      setHintVisible(false);

      // Bắn pháo hoa hạt lấp lánh confetti sau 1 giây khi hoa bắt đầu bung nở
      setTimeout(() => {
        triggerConfetti();
      }, 1100);
    }
  }, [phase]);

  const triggerConfetti = () => {
    const count = 180;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#ffe27d', '#ffaec5', '#ffd043', '#ffffff', '#ff6b8b']
    };

    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.6),
      spread: 70,
      startVelocity: 45,
    });
    confetti({
      ...defaults,
      particleCount: Math.floor(count * 0.4),
      spread: 100,
      startVelocity: 55,
      decay: 0.92,
    });
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera FOV và vị trí tối ưu đặc biệt cho màn hình dọc điện thoại (Mobile Portrait)
    const isMobile = width < 640;
    const fov = isMobile ? 58 : 45;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
    camera.position.set(0, isMobile ? 0.15 : 0.4, isMobile ? 10.2 : 7.2);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Tạo dữ liệu hạt Bánh kem và Bông hoa
    const particleData: ParticleData = generateCakeAndFlowerParticles(isMobile ? 18000 : 22000);
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', new THREE.BufferAttribute(particleData.cakePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(particleData.cakeColors, 3));
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(particleData.flowerPositions, 3));
    geometry.setAttribute('aColorTarget', new THREE.BufferAttribute(particleData.flowerColors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(particleData.sizes, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(particleData.randomSpeeds, 1));
    geometry.setAttribute('aIsFlame', new THREE.BufferAttribute(new Float32Array(particleData.isFlame), 1));

    // 4. Custom GLSL Shader Material cho hiệu ứng hạt mịn, glow & vortex morphing
    const vertexShader = `
      uniform float uProgress;
      uniform float uTime;
      uniform float uPixelRatio;

      attribute vec3 color;
      attribute vec3 aTarget;
      attribute vec3 aColorTarget;
      attribute float size;
      attribute float aSpeed;
      attribute float aIsFlame;

      varying vec3 vColor;

      void main() {
        // Hiệu ứng 5 ngọn nến bập bùng độc lập khi ở trạng thái bánh kem (Ảnh mẫu 2)
        vec3 pSource = position;
        if (aIsFlame > 0.5 && uProgress < 0.15) {
          float flameWiggle = sin(uTime * 14.0 + position.y * 12.0 + position.x * 6.0) * 0.05 * (position.y - 1.55);
          pSource.x += flameWiggle;
          pSource.z += cos(uTime * 12.0 + position.y * 10.0 + position.z * 6.0) * 0.04 * (position.y - 1.55);
          pSource.y += sin(uTime * 10.0 + position.x * 5.0) * 0.025;
        }

        // Chuyển động morphing với hàm nội suy mượt mà
        float t = uProgress;
        float smoothT = smoothstep(0.0, 1.0, t);
        vec3 p = mix(pSource, aTarget, smoothT);

        // Hiệu ứng lốc xoáy hạt (Vortex Swirl) ma thuật trong quá trình chuyển trạng thái
        if (t > 0.001 && t < 0.999) {
          float swirlStrength = sin(t * 3.14159265);
          float swirlAngle = swirlStrength * (3.8 - length(p.xz) * 0.35) * aSpeed;
          float cosA = cos(swirlAngle);
          float sinA = sin(swirlAngle);
          p.xz = vec2(p.x * cosA - p.z * sinA, p.x * sinA + p.z * cosA);
          
          // Hạt bay bung nhẹ theo phương thẳng đứng
          p.y += sin(t * 3.14159265) * (sin(aSpeed * 6.28) * 0.6);
        }

        // Chuyển động dập dềnh không gian thở (Breathing ambient motion)
        p.y += sin(uTime * 1.6 + p.x * 2.0) * 0.035;

        // Nội suy màu sắc từ bánh kem sang hoa rực rỡ
        vec3 c = mix(color, aColorTarget, smoothT);
        if (t > 0.8) {
          // Ánh sáng nhũ hoa lấp lánh
          c += vec3(sin(uTime * 3.0 + aSpeed * 12.0) * 0.08);
        }
        vColor = c;

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Kích thước hạt sắc nét theo khoảng cách và Retina Display
        gl_PointSize = size * (340.0 / -mvPosition.z) * uPixelRatio;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;

      void main() {
        // Điểm tròn với độ viền mờ mềm mại (Soft Radial Glow)
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float alpha = smoothstep(0.5, 0.02, dist);
        alpha = pow(alpha, 1.35); // Làm mềm tâm hạt

        gl_FragColor = vec4(vColor, alpha * 0.95);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0.0 },
        uTime: { value: 0.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    // 5. Vòng lặp Render (Animation Loop)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Cập nhật time uniform
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsedTime;

        // Xử lý chuyển đổi morphing
        if (isMorphingRef.current && progressRef.current < 1.0) {
          progressRef.current = Math.min(1.0, progressRef.current + 0.012);
          materialRef.current.uniforms.uProgress.value = progressRef.current;

          if (progressRef.current >= 1.0) {
            onMorphComplete();
          }
        }
      }

      // Xoay tự động nhẹ nhàng + nội suy góc xoay từ tương tác người dùng
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.06;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.06;

      if (pointsRef.current) {
        // Tự động xoay quanh trục Y nhẹ nhàng
        const autoSpin = elapsedTime * (progressRef.current > 0.8 ? 0.15 : 0.22);
        pointsRef.current.rotation.y = autoSpin + currentRotationRef.current.y;
        pointsRef.current.rotation.x = currentRotationRef.current.x;

        // Khi đã nở hoa và hiển thị card:
        // Trên mobile: nâng hoa lên nửa trên màn hình (y = 0.9) để card hiển thị ở nửa dưới không bị che khuất
        // Trên desktop: hạ nhẹ hoa xuống làm nền sang trọng
        if (phase === 'revealed') {
          const targetY = isMobile ? 0.95 : -0.6;
          const targetScale = isMobile ? 0.72 : 0.85;
          pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.03;
          pointsRef.current.scale.setScalar(
            pointsRef.current.scale.x + (targetScale - pointsRef.current.scale.x) * 0.03
          );
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // 6. Xử lý Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;

      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(w, h);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (materialRef.current) {
        materialRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Xử lý tương tác Vuốt/Kéo xoay và Chạm vào Bánh kem
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - mousePosRef.current.x;
    const deltaY = e.clientY - mousePosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.007;
    targetRotationRef.current.x = Math.max(
      -0.3,
      Math.min(0.6, targetRotationRef.current.x + deltaY * 0.007)
    );

    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const isClick =
      Math.abs(e.clientX - mousePosRef.current.x) < 5 &&
      Math.abs(e.clientY - mousePosRef.current.y) < 5;

    isDraggingRef.current = false;

    // Nếu chạm vào bánh kem khi đang ở trạng thái 'cake', kích hoạt morphing
    if (isClick && phase === 'cake') {
      onCakeClick();
    }
  };

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Gợi ý tương tác chạm vào bánh kem (tối ưu cho điện thoại) */}
      {phase === 'cake' && hintVisible && (
        <div className="absolute bottom-16 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-[90%] max-w-xs flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-midnight-900/85 backdrop-blur-md border border-rose-400/40 text-rose-200 text-xs sm:text-sm font-medium shadow-xl shadow-rose-950/50 animate-pulse text-center">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0 animate-spin-slow" />
            <span>Chạm vào bánh kem để gửi điều ước...</span>
          </div>
        </div>
      )}
    </div>
  );
};
