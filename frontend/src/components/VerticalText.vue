<script setup lang="ts">
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { onMounted } from 'vue'

// Props definition
const props = defineProps({
  text: { type: String, default: 'FLYER TOWN' },
  position: {
    type: Object,
    default: () => ({ x: -1.5, y: 0, z: 0 }),
  },
  letterSize: { type: Number, default: 0.3 },
  letterSpacing: { type: Number, default: 0.5 },
  frontColor: { type: String, default: '#ffffff' },
  sideColor: { type: String, default: '#ff9900' },
  metalness: { type: Number, default: 0.4 },
  roughness: { type: Number, default: 0.2 },
  fontPath: {
    type: String,
    default: '/assets/fonts/Acme_Regular.json',
  },
  depth: { type: Number, default: 0.1 },
})

const emit = defineEmits(['textCreated'])

// Use plain variable instead of ref to avoid Three.js proxy issues
let letterGroup: THREE.Group | null = null

// Method to set rotation - can be called from parent
const setRotation = (y: number) => {
  if (letterGroup) {
    letterGroup.rotation.y = y
  }
}

onMounted(() => {
  createVerticalText()
})

const createVerticalText = () => {
  // Create the letter group first
  letterGroup = new THREE.Group()

  const fontLoader = new FontLoader()
  fontLoader.load(props.fontPath, (font) => {
    // Create individual letters for vertical stacking
    const letters = props.text.split('')

    // Pre-calculate total height to center later
    const totalHeight = letters.length * props.letterSpacing

    letters.forEach((letter, index) => {
      const textGeometry = new TextGeometry(letter, {
        font: font,
        size: props.letterSize,
        depth: props.depth,
        curveSegments: 12,
        bevelEnabled: false,
      })

      // Center each letter geometry horizontally
      textGeometry.computeBoundingBox()
      // Safe access to boundingBox properties
      const boundingBox = textGeometry.boundingBox
      if (boundingBox) {
        const textWidth = boundingBox.max.x - boundingBox.min.x
        textGeometry.translate(-textWidth / 2, 0, 0)
      }

      // Create materials for front/back and sides
      const frontMaterial = new THREE.MeshStandardMaterial({
        color: props.frontColor, // This now accepts a CSS color string
        metalness: props.metalness,
        roughness: props.roughness,
      })

      const sideMaterial = new THREE.MeshStandardMaterial({
        color: props.sideColor, // This now accepts a CSS color string
        metalness: props.metalness,
        roughness: props.roughness,
      })

      // Use an array of materials
      // The first material is for the front and back
      // The second material is for the sides
      const textMesh = new THREE.Mesh(textGeometry, [frontMaterial, sideMaterial])

      // Position each letter vertically with spacing
      textMesh.position.y = -index * props.letterSpacing

      // Add to group
      if (letterGroup) {
        letterGroup.add(textMesh)
      }
    })

    // Position the entire text group and center it vertically
    if (letterGroup) {
      // Apply vertical centering by offsetting by half the total height
      const verticalOffset = totalHeight / 2 - props.letterSpacing / 2
      letterGroup.position.set(
        props.position.x,
        props.position.y + verticalOffset,
        props.position.z
      )

      // Emit the created text group for the parent to add to the scene
      emit('textCreated', letterGroup)
    }
  })
}

// Expose the letterGroup and setRotation method to the parent
defineExpose({
  letterGroup: null as THREE.Group | null,
  setRotation,
})
</script>

<template>
  <!-- This component doesn't have a visual template as it creates Three.js objects -->
</template>
