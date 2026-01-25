"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ROT = { x: 0, y: -Math.PI / 2, z: -0.25 };
const TARGET_MODEL_SIZE = 1.1;

export default function Cup({
  modelUrl = "/images/cub-beta.glb",
  onLoaded,
  camLarge = { x: 0, y: 0, z: 8, fov: 45 },
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(camLarge.fov, 1, 0.1, 100);
    camera.position.set(camLarge.x, camLarge.y, camLarge.z);

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

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(4, 6, 5);
    scene.add(dir);

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

      const box0 = new THREE.Box3().setFromObject(model);
      const size0 = box0.getSize(new THREE.Vector3());
      const maxDim = Math.max(size0.x, size0.y, size0.z);
      if (maxDim > 0) {
        const s = TARGET_MODEL_SIZE / maxDim;
        model.scale.setScalar(s);
      }

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

    const resize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);

      camera.position.set(camLarge.x, camLarge.y, camLarge.z);
      camera.aspect = w / h;

      const baseFovRad = THREE.MathUtils.degToRad(camLarge.fov);
      const newFovRad = 2 * Math.atan(Math.tan(baseFovRad / 2) * (h / w));
      camera.fov = THREE.MathUtils.radToDeg(newFovRad);

      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resize, { passive: true });
    resize();

    let raf;
    const loop = () => {
      if (model) {
        model.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

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
  }, [modelUrl, onLoaded, camLarge]);

  return <canvas ref={canvasRef} className="cup-canvas" />;
}
