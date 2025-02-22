<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref } from "vue";

const container = ref<HTMLDivElement | null>(null);
const scrollContainer = ref<HTMLDivElement | null>(null);
let pole: THREE.Mesh | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;

const handleScroll = () => {
  if (pole && scrollContainer.value) {
    const scrollY = scrollContainer.value.scrollTop;
    pole.rotation.y = scrollY * 0.005; // Adjust rotation sensitivity
  }
};

const onWindowResize = () => {
  if (renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

onMounted(() => {
  if (!container.value || !scrollContainer.value) {
    console.error("Container not found!");
    return;
  }

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // Set background to black

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 10); // Move the camera further back
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
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
  scrollContainer.value.addEventListener("scroll", handleScroll, {
    passive: true,
  });
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
