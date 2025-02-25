<script setup lang="ts">
import * as THREE from "three";
import { onUnmounted, ref, watchEffect } from "vue";
import Flyer from "./Flyer.vue";
import ProgressBar from "./ProgressBar.vue";
import VerticalText from "./VerticalText.vue"; // Import the VerticalText component

const container = ref<HTMLDivElement | null>(null);
const scrollContainer = ref<HTMLDivElement | null>(null);
const verticalTextRef = ref<InstanceType<typeof VerticalText> | null>(null);
let pole: THREE.Mesh | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
const flyerQueue: THREE.Mesh[] = []; // Store flyers temporarily if pole isn't ready
const rotationProgress = ref(0); // Stores percentage for the progress bar

// Define the interface for what's exposed by VerticalText
interface VerticalTextExpose {
  letterGroup: THREE.Group | null;
  setRotation: (y: number) => void;
}

const handleScroll = () => {
  if (pole && scrollContainer.value) {
    const scrollY = scrollContainer.value.scrollTop;
    const maxScroll = scrollContainer.value.scrollHeight - window.innerHeight;

    // Calculate rotation
    const rotation = scrollY * 0.005;
    pole.rotation.y = rotation;

    // Update text rotation to match pole rotation if available using the setRotation method
    if (verticalTextRef.value) {
      const textComponent =
        verticalTextRef.value as unknown as VerticalTextExpose;
      if (textComponent.setRotation) {
        textComponent.setRotation(rotation);
      }
    }

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

// Function to handle adding the vertical text group to the scene
const addVerticalTextToScene = (textGroup: THREE.Group) => {
  if (scene) {
    scene.add(textGroup);
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
  const poleGeometry = new THREE.CylinderGeometry(1, 1, 7, 64);
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

  <!-- Using the ProgressBar component -->
  <ProgressBar :progress="rotationProgress" />

  <!-- Using the VerticalText component with ref -->
  <VerticalText
    ref="verticalTextRef"
    text="FLYER TOWN"
    :position="{ x: -1.5, y: 0, z: 0 }"
    :letterSize="0.3"
    :letterSpacing="0.5"
    frontColor="#62929e"
    sideColor="#546a7b"
    :metalness="0.4"
    :roughness="0.2"
    :depth="0.1"
    @textCreated="addVerticalTextToScene"
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
