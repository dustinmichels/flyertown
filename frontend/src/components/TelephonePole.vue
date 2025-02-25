<script setup lang="ts">
import * as THREE from "three";
import { onUnmounted, ref, watchEffect } from "vue";
import CommitHash from "./CommitHash.vue";
import Flyer from "./Flyer.vue";
import ProgressBar from "./ProgressBar.vue";
import VerticalTag from "./VerticalTag.vue";

const container = ref<HTMLDivElement | null>(null);
const scrollContainer = ref<HTMLDivElement | null>(null);
let pole: THREE.Mesh | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
const flyerQueue: THREE.Mesh[] = []; // Store flyers temporarily if pole isn't ready
const rotationProgress = ref(0); // Stores percentage for the progress bar

const handleScroll = () => {
  if (pole && scrollContainer.value) {
    const scrollY = scrollContainer.value.scrollTop;
    const maxScroll = scrollContainer.value.scrollHeight - window.innerHeight;

    // Calculate rotation
    const rotation = scrollY * 0.005;
    pole.rotation.y = rotation;

    // Normalize rotation progress (0 to 100%)
    rotationProgress.value = (scrollY / maxScroll) * 100;
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
    }
  }
};

// Function to handle adding flyers
const addFlyerToPole = (flyer: THREE.Mesh) => {
  if (pole) {
    pole.add(flyer);
  } else {
    flyerQueue.push(flyer);
  }
};

// Handle icon clicks
const handleIconClick = (iconName: string) => {
  console.log(`Icon clicked: ${iconName}`);

  // Implement specific actions for each icon
  switch (iconName) {
    case "settings":
      // alert("Settings clicked!");
      break;
    case "favorites":
      // alert("Added to favorites!");
      break;
    case "refresh":
      break;
    case "upload":
      // Handle upload functionality
      // Could open a file dialog or show an upload interface
      console.log("Upload functionality triggered");
      break;
  }
};

// Watch for Vue refs and setup Three.js scene
watchEffect(() => {
  if (!container.value || !scrollContainer.value) return;

  // Scene setup
  scene = new THREE.Scene();

  const bgTextureLoader = new THREE.TextureLoader();
  const backgroundTexture = bgTextureLoader.load("/assets/background.jpg");
  scene.background = backgroundTexture;

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
  }

  // Load textures
  const textureLoader = new THREE.TextureLoader();
  const woodTexture = textureLoader.load("/assets/wood-texture.jpg");

  // Create the telephone pole
  const poleGeometry = new THREE.CylinderGeometry(1, 1, 7.3, 64);
  const poleMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.8,
    metalness: 0.0,
  });
  pole = new THREE.Mesh(poleGeometry, poleMaterial);
  scene.add(pole);

  // Now that pole is ready, add any queued flyers
  addQueuedFlyers();

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 2, 20);
  pointLight.position.set(5, 5, 5);
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

  <!-- Fixed icon panel that doesn't rotate -->
  <div class="fixed-icons">
    <button
      v-for="(icon, _) in ['settings', 'favorites', 'upload', 'refresh']"
      :key="icon"
      class="icon-button"
      @click="handleIconClick(icon)"
    >
      <i
        :class="`fas fa-${
          icon === 'settings'
            ? 'gear'
            : icon === 'favorites'
            ? 'heart'
            : icon === 'refresh'
            ? 'arrows-rotate'
            : 'upload'
        }`"
      ></i>
      <span class="tooltip">{{
        icon.charAt(0).toUpperCase() + icon.slice(1)
      }}</span>
    </button>
  </div>

  <!-- Using the ProgressBar component -->
  <ProgressBar :progress="rotationProgress" />

  <!-- New VerticalTag component - replaces the 3D one -->
  <VerticalTag
    text="FLYER  TOWN"
    backgroundColor="rgba(240, 240, 240, 0.8)"
    textColor="#546a7b"
  />

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

  <!-- Commit Hash Display -->
  <CommitHash />
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

/* Responsive icon panel styling */
.fixed-icons {
  position: fixed;
  top: 50%;
  right: 20px; /* Smaller value for mobile */
  transform: translateY(-50%); /* Center vertically */
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Slightly smaller gap for mobile */
}

/* For tablets and larger screens */
@media screen and (min-width: 768px) {
  .fixed-icons {
    right: 40px;
    gap: 20px;
  }
}

/* For desktops and larger screens */
@media screen and (min-width: 1024px) {
  .fixed-icons {
    right: 80px;
  }
}

/* For larger desktops */
@media screen and (min-width: 1440px) {
  .fixed-icons {
    right: 140px; /* Original value for very large screens */
  }
}

/* Icon button styling with mobile adjustments */
.icon-button {
  position: relative;
  width: 45px;
  height: 45px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  color: #ffffff;
}

.icon-button i {
  font-size: 18px;
  transition: color 0.2s;
}

/* Restore icon size for larger screens */
@media screen and (min-width: 768px) {
  .icon-button {
    width: 60px;
    height: 60px;
  }

  .icon-button i {
    font-size: 24px;
  }
}

.icon-button:hover {
  transform: scale(1.1);
  background-color: rgba(0, 0, 0, 0.8);
  color: #ff4500;
}

.tooltip {
  position: absolute;
  right: 70px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.2s, transform 0.2s;
  pointer-events: none;
  white-space: nowrap;
}

/* Adjust tooltip position for mobile */
@media screen and (max-width: 767px) {
  .tooltip {
    right: 55px;
    padding: 3px 8px;
    font-size: 12px;
  }
}

.icon-button:hover .tooltip {
  opacity: 1;
  transform: translateX(0);
}
</style>
