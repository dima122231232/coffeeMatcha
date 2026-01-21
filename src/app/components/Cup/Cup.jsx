"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// вращение модели
const ROT = { x: 0, y: -Math.PI / 2, z: -0.25 };
const BREAKPOINT = 768;

export default function Cup({
  modelUrl = "/images/cup.glb",
  onLoaded,
  camLarge = { x: 0, y: 0, z: 8, fov: 45 },
  camSmall = { x: 0, y: 0, z: 1.6, fov: 45 },
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // сцена
    const scene = new THREE.Scene();

    // камера
    const camera = new THREE.PerspectiveCamera(camLarge.fov, 1, 0.1, 100);
    camera.position.set(camLarge.x, camLarge.y, camLarge.z);

    // рендерер
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      depth: true,
      stencil: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    // освещение
    scene.add(new THREE.AmbientLight(0xffffff, 2.2));
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(4, 6, 5);
    scene.add(dir);

    // загрузка модели
    let model;
    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
      model = gltf.scene;
      model.traverse((o) => {
        if (o.isMesh) {
          o.castShadow = false;
          o.receiveShadow = false;
          if (o.material && o.material.map) {
            o.material.map.colorSpace = THREE.SRGBColorSpace;
          }
        }
      });
      model.rotation.set(ROT.x, ROT.y, ROT.z);
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      scene.add(model);
      resize();
      renderer.render(scene, camera);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (onLoaded) onLoaded();
        })
      );
    });

    // изменение размера
    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      if (window.innerWidth < BREAKPOINT) {
        camera.position.set(camSmall.x, camSmall.y, camSmall.z);
        camera.aspect = aspect;
        camera.fov = camSmall.fov;
        camera.updateProjectionMatrix();
      } else {
        camera.position.set(camLarge.x, camLarge.y, camLarge.z);
        camera.aspect = aspect;
        const baseFovRad = THREE.MathUtils.degToRad(camLarge.fov);
        const newFovRad = 2 * Math.atan(Math.tan(baseFovRad / 2) * (h / w));
        camera.fov = THREE.MathUtils.radToDeg(newFovRad);
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", resize, { passive: true });
    resize();

    // анимационный цикл
    let raf;
    const loop = () => {
      if (model) {
        model.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // очистка
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      scene.traverse((o) => {
        if (o.isMesh) {
          if (o.geometry) o.geometry.dispose();
          if (Array.isArray(o.material)) {
            o.material.forEach((m) => m.dispose());
          } else if (o.material) {
            o.material.dispose();
          }
        }
      });
      renderer.dispose();
      scene.clear();
    };
  }, [modelUrl, onLoaded, camLarge, camSmall]);

  return (
    <canvas
      ref={canvasRef}
      className="cup-canvas"
    />
  );
}
