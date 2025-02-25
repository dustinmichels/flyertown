<script setup lang="ts">
import * as THREE from 'three'
import { onMounted, ref } from 'vue'

// Props for positioning and customization
const props = defineProps({
  position: {
    type: Object,
    default: () => ({ x: 1.5, y: 0, z: 0 }),
  },
  scale: { type: Number, default: 0.5 },
  color: { type: String, default: '#ffffff' },
  hoverColor: { type: String, default: '#ff4500' },
})

const emit = defineEmits(['iconClicked'])

// HTML overlay element reference
const overlayContainer = ref<HTMLDivElement | null>(null)

// State for hover effects
const hoveredIcon = ref<string | null>(null)

// Add responsive state to detect mobile
const isMobile = ref(false)

// Icons to display
const icons = [
  { name: 'settings', icon: 'gear', tooltip: 'Settings' },
  { name: 'favorites', icon: 'heart', tooltip: 'Favorites' },
  { name: 'upload', icon: 'upload', tooltip: 'Upload' },
  { name: 'refresh', icon: 'arrows-rotate', tooltip: 'Refresh' },
]

// Handle icon click
const handleIconClick = (iconName: string) => {
  emit('iconClicked', iconName)
  // On mobile, clear any hover state after click
  if (isMobile.value) {
    hoveredIcon.value = null
  }
}

// Handle hover only if not mobile
const handleHover = (iconName: string) => {
  if (!isMobile.value) {
    hoveredIcon.value = iconName
  }
}

// Handle mouse leave
const handleMouseLeave = () => {
  hoveredIcon.value = null
}

// Set up the 3D world position to 2D screen position mapping
let camera: THREE.PerspectiveCamera | null = null
let worldPosition: THREE.Vector3 | null = null

// Function to check if we're on mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  // Initial check for mobile
  checkMobile()

  // Get the camera from the parent scene
  // This will be set by the parent component that renders this one
  const updateIconPositions = () => {
    if (!overlayContainer.value || !camera || !worldPosition) return

    // Convert 3D position to screen position
    const vector = worldPosition.clone()
    vector.project(camera)

    // Convert to CSS coordinates
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth
    const y = (-(vector.y - 0.1) * 0.5 + 0.5) * window.innerHeight

    // Update overlay position
    overlayContainer.value.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
  }

  // Listen for window resize to update positions and check mobile
  window.addEventListener('resize', () => {
    updateIconPositions()
    checkMobile()
  })

  // Initial update will be triggered when the parent sets the camera and position
})

// Method to set the camera and position - will be called by parent
const setSceneReferences = (cameraRef: THREE.PerspectiveCamera, position: THREE.Vector3) => {
  camera = cameraRef
  worldPosition = position

  // Trigger initial position update
  requestAnimationFrame(() => {
    if (overlayContainer.value && camera && worldPosition) {
      // Convert 3D position to screen position
      const vector = worldPosition.clone()
      vector.project(camera)

      // Convert to CSS coordinates
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth
      const y = (-(vector.y - 0.1) * 0.5 + 0.5) * window.innerHeight

      // Update overlay position
      overlayContainer.value.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
    }
  })
}

// Expose methods to parent
defineExpose({
  setSceneReferences,
})
</script>

<template>
  <div ref="overlayContainer" class="icon-panel" :class="{ 'is-mobile': isMobile }">
    <div
      v-for="(icon, index) in icons"
      :key="icon.name"
      class="icon-button"
      :class="{ hovered: hoveredIcon === icon.name }"
      @click="handleIconClick(icon.name)"
      @mouseover="handleHover(icon.name)"
      @mouseleave="handleMouseLeave"
      :style="{
        transform: `translateY(${(index - 1.5) * 70}px)`,
      }"
    >
      <i
        :class="`fas fa-${icon.icon}`"
        :style="{
          color: hoveredIcon === icon.name ? props.hoverColor : props.color,
        }"
      ></i>
      <span class="tooltip">{{ icon.tooltip }}</span>
    </div>
  </div>
</template>

<style scoped>
.icon-panel {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: none;
}

.icon-button {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.2s,
    background-color 0.2s;
  pointer-events: auto;
}

.icon-button i {
  font-size: 24px;
  transition: color 0.2s;
}

/* Apply hover effects only on non-mobile */
@media (min-width: 768px) {
  .icon-button:hover,
  .icon-button.hovered {
    transform: scale(1.1) translateY(calc((index - 1.5) * 70px));
    background-color: rgba(0, 0, 0, 0.8);
  }

  .icon-button:hover .tooltip,
  .icon-button.hovered .tooltip {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Fix an issue with the transform calculation in the original code */
.icon-button.hovered {
  transform: scale(1.1);
}

/* Mobile specific styles */
.is-mobile .icon-button:active {
  background-color: rgba(0, 0, 0, 0.8);
}

.tooltip {
  position: absolute;
  right: -80px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  opacity: 0;
  transform: translateX(-10px);
  transition:
    opacity 0.2s,
    transform 0.2s;
  pointer-events: none;
}

/* Mobile tooltip adjustments */
.is-mobile .tooltip {
  display: none;
}
</style>
