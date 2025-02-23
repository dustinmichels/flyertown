<script setup lang="ts">
import * as THREE from "three";
import { onMounted, onUnmounted, ref, watchEffect } from "vue";

const props = defineProps<{
  scene: THREE.Scene;
  texturePath: string; // Path to the flyer image
  position: [number, number, number]; // Full (x, y, z) position on the pole
  rotation: number; // Current rotation value
}>();

const flyer = ref<THREE.Mesh | null>(null);

onMounted(() => {
  const textureLoader = new THREE.TextureLoader();
  const flyerTexture = textureLoader.load(
    props.texturePath,
    () => console.log(`Texture loaded: ${props.texturePath}`),
    undefined,
    (error) =>
      console.error(`Error loading texture: ${props.texturePath}`, error)
  );

  // Create the flyer as a curved surface wrapping around the pole
  const flyerGeometry = new THREE.CylinderGeometry(
    1.05, // Slightly larger radius than the pole
    1.05,
    2, // Height of the flyer
    32, // Segments around the cylinder
    1, // Height segments
    true, // Open-ended cylinder
    0, // Start angle
    Math.PI / 2 // End angle (90 degrees around the pole)
  );

  const flyerMaterial = new THREE.MeshBasicMaterial({
    map: flyerTexture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  flyer.value = new THREE.Mesh(flyerGeometry, flyerMaterial);

  // Use full (x, y, z) positioning
  const [x, y, z] = props.position;
  flyer.value.position.set(x, y, z);

  props.scene.add(flyer.value);
});

watchEffect(() => {
  if (flyer.value) {
    flyer.value.rotation.y = props.rotation;
  }
});

onUnmounted(() => {
  if (flyer.value) {
    props.scene.remove(flyer.value);
    flyer.value.geometry.dispose();
    (flyer.value.material as THREE.Material).dispose();
    flyer.value = null;
  }
});
</script>
