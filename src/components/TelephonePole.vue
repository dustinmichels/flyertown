<script setup lang="ts">
import * as THREE from "three";
import { onUnmounted, ref, watchEffect } from "vue";

const container = ref<HTMLDivElement | null>(null);
const scrollContainer = ref<HTMLDivElement | null>(null);
let pole: THREE.Mesh | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let flyer1: THREE.Mesh | null = null;
let flyer2: THREE.Mesh | null = null;

const handleScroll = () => {
  if (pole && scrollContainer.value) {
    const scrollY = scrollContainer.value.scrollTop;
    const rotation = scrollY * 0.005;
    pole.rotation.y = rotation;
  }
};

const onWindowResize = () => {
  if (renderer && camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

// Wait for container to exist before setting up Three.js
watchEffect(() => {
  if (!container.value || !scrollContainer.value) return;

  console.log("✅ Three.js Initializing...");

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 2, 10);
  camera.lookAt(0, 0, 0);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  if (container.value) {
    container.value.appendChild(renderer.domElement);
  } else {
    console.error("❌ Renderer container not found!");
    return;
  }

  console.log("✅ Scene, Camera, and Renderer Initialized");

  // Load textures
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin("anonymous");

  const woodTexture = textureLoader.load(
    "/assets/wood-texture.jpg",
    () => console.log("✅ Wood texture loaded"),
    undefined,
    (error) => console.error("❌ Error loading wood texture:", error)
  );

  const flyer1Texture = textureLoader.load(
    "/assets/flyer1.png",
    () => console.log("✅ Flyer 1 texture loaded"),
    undefined,
    (error) => console.error("❌ Error loading flyer 1 texture:", error)
  );

  const flyer2Texture = textureLoader.load(
    "/assets/flyer2.jpg",
    () => console.log("✅ Flyer 2 texture loaded"),
    undefined,
    (error) => console.error("❌ Error loading flyer 2 texture:", error)
  );

  // Create the telephone pole
  const poleGeometry = new THREE.CylinderGeometry(1, 1, 7, 64); // Height changed to 8
  const poleMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.8,
    metalness: 0.0,
  });
  pole = new THREE.Mesh(poleGeometry, poleMaterial);
  scene.add(pole);

  // Create flyer geometry (slightly above pole surface)
  const flyerGeometry = new THREE.CylinderGeometry(
    1.06, // Slightly larger radius than the pole
    1.06,
    1.5, // Flyer height
    32,
    1,
    true,
    0,
    Math.PI / 2 // Wraps 90 degrees around the pole
  );

  // First flyer
  const flyerMaterial1 = new THREE.MeshBasicMaterial({
    map: flyer1Texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  flyer1 = new THREE.Mesh(flyerGeometry, flyerMaterial1);
  flyer1.position.set(0, 1, 0);
  pole.add(flyer1); // Attach to pole

  // Second flyer (opposite side)
  const flyerMaterial2 = new THREE.MeshBasicMaterial({
    map: flyer2Texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  flyer2 = new THREE.Mesh(flyerGeometry, flyerMaterial2);
  flyer2.position.set(0, -1, 0);
  flyer2.rotation.y = Math.PI; // Flip to opposite side
  pole.add(flyer2); // Attach to pole

  console.log("✅ Flyers added to pole");

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 2, 20);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  console.log("✅ Lights added");

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    } else {
      console.error("❌ Renderer or Camera missing in animation loop!");
    }
  };
  animate();

  console.log("✅ Animation started");

  // Scroll listener
  scrollContainer.value.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  window.addEventListener("resize", onWindowResize);
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
  }
  window.removeEventListener("resize", onWindowResize);
});
</script>

<template>
  <div ref="scrollContainer" class="scroll-container">
    <div class="scroll-content"></div>
  </div>
  <div ref="container" class="scene-container"></div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  overflow: hidden;
}

.scroll-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  z-index: 2;
  opacity: 0;
}

.scroll-content {
  height: 3000px; /* Creates enough space to scroll */
}

.scene-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  z-index: 1;
}
</style>
