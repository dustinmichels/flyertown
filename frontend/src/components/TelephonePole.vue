<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { flyers } from '../data/flyers'
import { createPoleScene, type PoleScene } from '../scene/poleScene'

/** Pole rotation (radians) per pixel scrolled. */
const ROTATION_PER_PX = 0.005

/** Scroll position as a percentage (0-100). */
const progress = defineModel<number>('progress', { default: 0 })

const sceneContainer = useTemplateRef('sceneContainer')
const scrollContainer = useTemplateRef('scrollContainer')
let poleScene: PoleScene | undefined

function onScroll() {
  const el = scrollContainer.value
  if (!el || !poleScene) return
  poleScene.setRotation(el.scrollTop * ROTATION_PER_PX)
  progress.value = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
}

onMounted(() => {
  if (sceneContainer.value) poleScene = createPoleScene(sceneContainer.value, flyers)
})

onUnmounted(() => poleScene?.dispose())
</script>

<template>
  <!-- Invisible scroller on top of the canvas; scrolling it spins the pole. -->
  <div ref="scrollContainer" class="scroll-container" @scroll.passive="onScroll">
    <div class="scroll-content"></div>
  </div>
  <div ref="sceneContainer" class="scene-container"></div>
</template>

<style scoped>
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
  height: 3000px;
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
