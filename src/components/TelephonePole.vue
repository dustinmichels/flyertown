<script setup lang="ts">
import * as THREE from "three";
import { onMounted, ref } from "vue";

const container = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!container.value) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.value.clientWidth, container.value.clientHeight);
  container.value.appendChild(renderer.domElement);

  // Create a cylinder (telephone pole)
  const geometry = new THREE.CylinderGeometry(1, 1, 5, 32);
  const material = new THREE.MeshStandardMaterial({ color: "brown" });
  const pole = new THREE.Mesh(geometry, material);
  scene.add(pole);

  // Add some lighting
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // Add flyers (simple plane meshes)
  const flyerTexture = new THREE.TextureLoader().load("/flyer.jpg");
  const flyerMaterial = new THREE.MeshBasicMaterial({ map: flyerTexture });
  for (let i = 0; i < 6; i++) {
    const flyer = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1.5),
      flyerMaterial
    );
    const angle = (i / 6) * Math.PI * 2;
    flyer.position.set(
      Math.cos(angle) * 1.2,
      Math.random() * 2 - 1,
      Math.sin(angle) * 1.2
    );
    flyer.lookAt(new THREE.Vector3(0, flyer.position.y, 0)); // Face the camera
    pole.add(flyer);
  }

  // Rotation logic
  let isDragging = false;
  let prevX = 0;

  const onMouseDown = (event: MouseEvent) => {
    isDragging = true;
    prevX = event.clientX;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = (event.clientX - prevX) * 0.01;
    pole.rotation.y += deltaX;
    prevX = event.clientX;
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  container.value.addEventListener("mousedown", onMouseDown);
  container.value.addEventListener("mousemove", onMouseMove);
  container.value.addEventListener("mouseup", onMouseUp);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
});
</script>

<template>
  <div ref="container" class="three-container"></div>
</template>

<style scoped>
.three-container {
  width: 100vw;
  height: 100vh;
  touch-action: none;
}
</style>
