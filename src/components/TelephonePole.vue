<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref } from "vue";

const container = ref<HTMLDivElement | null>(null);
let pole: THREE.Mesh | null = null;

const handleScroll = () => {
  if (pole) {
    const scrollY = window.scrollY;
    pole.rotation.y = scrollY * 0.005; // Adjust rotation sensitivity
  }
};

onMounted(() => {
  if (!container.value) {
    console.error("Container not found!");
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 10); // Move the camera further back
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value.appendChild(renderer.domElement);

  // Load textures
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin("anonymous"); // Handle CORS issues

  const woodTexture = textureLoader.load(
    "/assets/wood-texture.jpg",
    () => console.log("Wood texture loaded successfully"),
    undefined,
    (error) => console.error("Error loading wood texture:", error)
  );
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(1, 3); // Adjust scaling to make it look natural

  const flyerTexture = textureLoader.load(
    "/assets/flyer.png",
    () => console.log("Flyer texture loaded successfully"),
    undefined,
    (error) => console.error("Error loading flyer texture:", error)
  );

  // Create the telephone pole with wood texture
  const poleGeometry = new THREE.CylinderGeometry(1, 1, 5, 64);
  const poleMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.8,
    metalness: 0.0,
  });
  pole = new THREE.Mesh(poleGeometry, poleMaterial);
  scene.add(pole);

  // Create the flyer as a plane facing forward
  const flyerGeometry = new THREE.PlaneGeometry(1.5, 2);
  const flyerMaterial = new THREE.MeshBasicMaterial({
    map: flyerTexture,
    transparent: true, // Allow transparency if the flyer has transparent parts
  });
  const flyer = new THREE.Mesh(flyerGeometry, flyerMaterial);
  flyer.position.set(0, 0, 1.05); // Ensure flyer is just above the pole's surface
  flyer.rotation.y = 0; // Make sure the flyer is perfectly facing the camera
  scene.add(flyer);

  // Lighting adjustments
  const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Increase intensity
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 2, 20);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  };
  animate();

  // Scroll listener
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div ref="container" class="scene-container"></div>
</template>

<style>
.scene-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
