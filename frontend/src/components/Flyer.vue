<script setup lang="ts">
import * as THREE from "three";
import { defineEmits, defineProps, onMounted } from "vue";

const props = defineProps<{
  textureUrl: string;
  position: { x: number; y: number; z: number };
  rotationY?: number;
}>();

const emit = defineEmits(["flyerCreated"]);

onMounted(() => {
  const textureLoader = new THREE.TextureLoader();
  const flyerTexture = textureLoader.load(
    props.textureUrl,
    () => console.log(`✅ Flyer texture loaded: ${props.textureUrl}`),
    undefined,
    (error) => console.error(`❌ Error loading flyer texture: ${error}`)
  );

  // Create flyer geometry (slightly above pole surface)
  const flyerGeometry = new THREE.CylinderGeometry(
    1.02, // Slightly larger radius than the pole
    1.02,
    1.5, // Flyer height
    32,
    1,
    true,
    0,
    Math.PI / 2 // Wraps 90 degrees around the pole
  );

  const flyerMaterial = new THREE.MeshBasicMaterial({
    map: flyerTexture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const flyer = new THREE.Mesh(flyerGeometry, flyerMaterial);
  flyer.position.set(props.position.x, props.position.y, props.position.z);
  flyer.rotation.y = props.rotationY || 0;

  emit("flyerCreated", flyer); // Send flyer mesh back to the parent component
});
</script>

<!-- ✅ Empty template to fix the warning -->
<template></template>
