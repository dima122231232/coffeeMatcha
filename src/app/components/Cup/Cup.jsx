"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// ===== НАСТРОЙКИ =====
const CAM = { x: 0, y: 0, z: 4, fov: 45 };
const ROT = { x: 0, y: -90, z: -0.25 };

export default function Cup({ modelUrl = "/images/cup.glb" }) {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const scene = new THREE.Scene();

    // Камера (начальные параметры)
    const cam = new THREE.PerspectiveCamera(CAM.fov, 1, 0.1, 1000);

    // Рендерер
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight, false);

    // Освещение
    scene.add(new THREE.AmbientLight(0xffffff, 2.5));
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Группа для модели
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    let model = null;
    let rafId = null;

    // Точка, на которую камера всегда смотрит
    const lookTarget = new THREE.Vector3(0, -0.05, 1.75);

    // --- ВАЖНО: фиксируем горизонтальное FOV один раз (чтобы размер по ширине был единственным фактором) ---
    const initialAspect = (canvas.clientWidth || window.innerWidth) / (canvas.clientHeight || window.innerHeight);
    cam.aspect = initialAspect;
    cam.updateProjectionMatrix();
    // горизонтальный FOV (в радианах) на основе заданного вертикального FOV и начального аспекта
    const hFovConst = 2 * Math.atan(Math.tan((cam.fov * Math.PI) / 180 / 2) * initialAspect);

    // Подгоняем камеру, чтобы модель влезла, используя фиксированный горизонтальный FOV
    function fitCameraToObject(object, camera, offset = 1.25) {
      const box = new THREE.Box3().setFromObject(object);
      const sphere = box.getBoundingSphere(new THREE.Sphere());
      const radius = sphere.radius;

      // используем фиксированный горизонтальный FOV (hFovConst)
      const fovToUse = hFovConst; // радианы

      // расстояние от цели до камеры, чтобы объект полностью помещался по ширине
      const distance = Math.abs(radius / Math.sin(fovToUse / 2)) * offset;

      // направление от центра к месту камеры (используем CAM как ориентацию)
      const initialDir = new THREE.Vector3(CAM.x, CAM.y, CAM.z).sub(new THREE.Vector3(0, 0, 0));
      if (initialDir.lengthSq() === 0) initialDir.set(0, 0, 1);
      initialDir.normalize();

      // Позиционируем камеру относительно lookTarget
      camera.position.copy(lookTarget).add(initialDir.multiplyScalar(distance));
      camera.near = Math.max(0.1, distance / 1000);
      camera.far = distance * 1000;
      camera.updateProjectionMatrix();
    }

    // Ресайз: пересчитываем вертикальный FOV так, чтобы горизонтальный оставался фиксированным
    function onResize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      cam.aspect = w / h;

      // вычисляем вертикальный FOV (в градусах) из фиксированного горизонтального FOV и текущего аспекта:
      // vFov = 2 * atan( tan(hFov/2) / aspect )
      const vFovRad = 2 * Math.atan(Math.tan(hFovConst / 2) / cam.aspect);
      cam.fov = (vFovRad * 180) / Math.PI;
      cam.updateProjectionMatrix();

      if (model) fitCameraToObject(model, cam);
    }

    // Загрузка модели
    new GLTFLoader().load(
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

        // Центрируем модель: сдвигаем так, чтобы её центр оказался в (0,0,0)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        modelGroup.add(model);

        // Перед подгонкой убедимся, что aspect камеры соответствует текущему размеру canvas
        cam.aspect = (canvas.clientWidth || window.innerWidth) / (canvas.clientHeight || window.innerHeight);
        // Обновим вертикальный FOV из hFovConst и текущего aspect (чтобы камера была корректной сразу)
        const initialVFovRad = 2 * Math.atan(Math.tan(hFovConst / 2) / cam.aspect);
        cam.fov = (initialVFovRad * 180) / Math.PI;
        cam.updateProjectionMatrix();

        // Подгоняем камеру под загруженную модель (по ширине, т.к. hFovConst фиксирован)
        fitCameraToObject(model, cam);
        renderer.render(scene, cam);
      },
      undefined
    );

    // Анимация / рендер-loop
    function renderLoop() {
      if (model) {
        model.rotation.y += 0.005;
      }
      cam.lookAt(lookTarget);
      renderer.render(scene, cam);
      rafId = requestAnimationFrame(renderLoop);
    }
    renderLoop();

    window.addEventListener("resize", onResize, { passive: true });
    onResize();

    // Очистка
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
      renderer.dispose();
      scene.clear();
    };
  }, [modelUrl]);

  return <canvas ref={ref} className="cup-canvas" />;
}
