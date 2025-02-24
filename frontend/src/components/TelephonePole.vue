<script setup lang="ts">
import * as THREE from "three";
import { onUnmounted, ref, watchEffect } from "vue";
import Flyer from "./Flyer.vue"; // Import the Flyer component

const container = ref<HTMLDivElement | null>(null);
const scrollContainer = ref<HTMLDivElement | null>(null);
let pole: THREE.Mesh | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
const flyerQueue: THREE.Mesh[] = []; // Store flyers temporarily if pole isn't ready

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

// Ensure queued flyers are added once the pole is ready
const addQueuedFlyers = () => {
  if (!pole) return;
  while (flyerQueue.length > 0) {
    const flyer = flyerQueue.shift();
    if (flyer) {
      pole.add(flyer);
      console.log("✅ Flyer added from queue:", flyer);
    }
  }
};

// Function to handle adding flyers
const addFlyerToPole = (flyer: THREE.Mesh) => {
  if (pole) {
    pole.add(flyer);
    console.log("✅ Flyer added to the pole:", flyer);
  } else {
    console.warn("⚠️ Pole not found yet. Adding flyer to queue.");
    flyerQueue.push(flyer); // Store flyer temporarily
  }
};

// Watch for Vue refs and setup Three.js scene
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

  // Create the telephone pole
  const poleGeometry = new THREE.CylinderGeometry(1, 1, 7, 64);
  const poleMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.8,
    metalness: 0.0,
  });
  pole = new THREE.Mesh(poleGeometry, poleMaterial);
  scene.add(pole);

  console.log("✅ Pole created");

  // Now that pole is ready, add any queued flyers
  addQueuedFlyers();

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

  <!-- Use the Flyer component -->
  <Flyer
    textureUrl="/assets/flyer1.png"
    :position="{ x: 0, y: 1, z: 0 }"
    @flyerCreated="addFlyerToPole"
  />
  <Flyer
    textureUrl="/assets/flyer2.jpg"
    :position="{ x: 0, y: 2, z: 0 }"
    @flyerCreated="addFlyerToPole"
    :rotationY="(2 * Math.PI) / 3"
  />
  <Flyer
    textureUrl="/assets/flyer2.jpg"
    :position="{ x: 0, y: -1, z: 0 }"
    :rotationY="Math.PI"
    @flyerCreated="addFlyerToPole"
  />
  <Flyer
    textureUrl="/assets/flyer1.png"
    :position="{ x: 0, y: -3, z: 0 }"
    :rotationY="Math.PI / 2"
    @flyerCreated="addFlyerToPole"
  />
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
