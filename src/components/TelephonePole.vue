<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref } from "vue";

const container = ref<HTMLDivElement | null>(null);
const scrollContainer = ref<HTMLDivElement | null>(null);
let pole: THREE.Mesh | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let flyer: THREE.Mesh | null = null; // Added flyer as a tracked object

const handleScroll = () => {
  if (pole && flyer && scrollContainer.value) {
    const scrollY = scrollContainer.value.scrollTop;
    const rotation = scrollY * 0.005;
    pole.rotation.y = rotation;
    flyer.rotation.y = rotation; // Sync flyer rotation with pole
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
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.value.appendChild(renderer.domElement);

  // Load textures
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin("anonymous");

  const woodTexture = textureLoader.load(
    "/assets/wood-texture.jpg",
    () => console.log("Wood texture loaded successfully"),
    undefined,
    (error) => console.error("Error loading wood texture:", error)
  );
  woodTexture.wrapS = THREE.RepeatWrapping;
  woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(1, 3);

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

  // Create the flyer as a curved surface wrapping around the pole
  const flyerGeometry = new THREE.CylinderGeometry(
    1.05, // Slightly larger radius than the pole
    1.05,
    2, // Height of the flyer
    32, // Segments around cylinder
    1, // Height segments
    true, // Open-ended cylinder
    0, // Start angle
    Math.PI / 2 // End angle (90 degrees around the pole)
  );
  const flyerMaterial = new THREE.MeshBasicMaterial({
    map: flyerTexture,
    transparent: true,
    side: THREE.DoubleSide, // Show both sides of the geometry
  });
  flyer = new THREE.Mesh(flyerGeometry, flyerMaterial);
  flyer.position.set(0, 0, 0); // Center with pole
  scene.add(flyer);

  // Lighting adjustments
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
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
