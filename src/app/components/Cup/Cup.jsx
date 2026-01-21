"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// ===== НАСТРОЙКИ =====
const CAM = { x: 0, y: 0, z: 4, fov: 45 };
const ROT = { x: 0, y: -90, z: -0.25 };

export default function Cup({ modelUrl = "/images/cup.glb", onLoaded }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(CAM.fov, 1, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvas.clientWidth || innerWidth, canvas.clientHeight || innerHeight, false);

    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 5, 5);
    scene.add(light);

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let model = null;
    let rafId = null;

    const lookTarget = new THREE.Vector3(0, -0.05, 1.75);

    const initialAspect = (canvas.clientWidth || innerWidth) / (canvas.clientHeight || innerHeight);
    cam.aspect = initialAspect;
    cam.updateProjectionMatrix();

    const hFovConst = 2 * Math.atan(Math.tan((cam.fov * Math.PI) / 180 / 2) * initialAspect);

    const fitCameraToObject = (object, camera, offset = 1.25) => {
      const box = new THREE.Box3().setFromObject(object);
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const radius = sphere.radius;

      const distance = Math.abs(radius / Math.sin(hFovConst / 2)) * offset;

      const dir = new THREE.Vector3(CAM.x, CAM.y, CAM.z).sub(new THREE.Vector3(0, 0, 0));
      if (dir.lengthSq() === 0) dir.set(0, 0, 1);
      dir.normalize();

      camera.position.copy(lookTarget).add(dir.multiplyScalar(distance));
      camera.near = Math.max(0.1, distance / 1000);
      camera.far = distance * 1000;
      camera.updateProjectionMatrix();
    };

    const onResize = () => {
      const w = canvas.clientWidth || innerWidth;
      const h = canvas.clientHeight || innerHeight;

      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      cam.aspect = w / h;
      const vFovRad = 2 * Math.atan(Math.tan(hFovConst / 2) / cam.aspect);
      cam.fov = (vFovRad * 180) / Math.PI;
      cam.updateProjectionMatrix();

      if (model) fitCameraToObject(model, cam);
    };

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        model = gltf.scene;

        model.traverse((m) => {
          if (m.isMesh && m.material) {
            if (m.material.map) m.material.map.colorSpace = THREE.SRGBColorSpace;
            m.castShadow = true;
            m.receiveShadow = true;
          }
        });

        model.rotation.set(ROT.x, ROT.y, ROT.z);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        modelGroup.add(model);

        cam.aspect = (canvas.clientWidth || innerWidth) / (canvas.clientHeight || innerHeight);
        const vFovRad = 2 * Math.atan(Math.tan(hFovConst / 2) / cam.aspect);
        cam.fov = (vFovRad * 180) / Math.PI;
        cam.updateProjectionMatrix();

        fitCameraToObject(model, cam);

        // Первый кадр + 2 rAF, чтобы точно "показано на экране"
        renderer.render(scene, cam);
        requestAnimationFrame(() => requestAnimationFrame(() => onLoaded?.()));
      },
      undefined,
      () => {
        // если хочешь — тут можно сделать fallback (но я не трогаю)
      }
    );

    const renderLoop = () => {
      if (model) model.rotation.y += 0.005;
      cam.lookAt(lookTarget);
      renderer.render(scene, cam);
      rafId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    window.addEventListener("resize", onResize, { passive: true });
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
      renderer.dispose();
      scene.clear();
    };
  }, [modelUrl, onLoaded]);

  return <canvas ref={ref} className="cup-canvas" />;
}
