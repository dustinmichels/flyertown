<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { posterUrl, type EventRecord } from '../lib/pocketbase'
import { createPoleScene, type PoleScene } from '../lib/poleScene'

/** Pole rotation (radians) per pixel scrolled. */
const ROTATION_PER_PX = 0.005

const props = defineProps<{
  /** Events that have a poster. */
  events: EventRecord[]
  selectedId: string | null
}>()

const emit = defineEmits<{ select: [id: string] }>()

const sceneContainer = useTemplateRef('sceneContainer')
const scroller = useTemplateRef('scroller')
let poleScene: PoleScene | undefined

function onScroll() {
  if (scroller.value) poleScene?.setRotation(scroller.value.scrollTop * ROTATION_PER_PX)
}

function onClick(e: MouseEvent) {
  const id = poleScene?.pick(e.clientX, e.clientY)
  if (id) emit('select', id)
}

function onPointerMove(e: PointerEvent) {
  if (!scroller.value || e.pointerType !== 'mouse') return
  scroller.value.style.cursor = poleScene?.pick(e.clientX, e.clientY) ? 'pointer' : ''
}

onMounted(() => {
  if (!sceneContainer.value) return
  poleScene = createPoleScene(
    sceneContainer.value,
    props.events.map((event) => ({ id: event.id, imageUrl: posterUrl(event)! }))
  )
  poleScene.setSelected(props.selectedId)
})

watch(
  () => props.selectedId,
  (id) => poleScene?.setSelected(id)
)

onUnmounted(() => poleScene?.dispose())
</script>

<template>
  <div class="stage">
    <div ref="sceneContainer" class="scene" aria-hidden="true"></div>
    <!-- Invisible scroller over the canvas: scrolling it spins the pole, clicking picks a flyer. -->
    <div
      ref="scroller"
      class="scroller"
      aria-hidden="true"
      @scroll.passive="onScroll"
      @click="onClick"
      @pointermove="onPointerMove"
    >
      <div class="scroll-content"></div>
    </div>
    <!-- The canvas is opaque to assistive tech and keyboards, so offer the flyers as buttons too. -->
    <ul class="visually-hidden" aria-label="Flyers on the pole">
      <li v-for="event in events" :key="event.id">
        <button
          type="button"
          :aria-pressed="event.id === selectedId"
          @click="emit('select', event.id)"
        >
          {{ event.title }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  aspect-ratio: 1 / 2;
  max-height: min(80vh, 46rem);
  overflow: hidden;
  border-radius: 6px;
  background: url('/assets/background.jpg') center / cover;
}

.scene,
.scroller {
  position: absolute;
  inset: 0;
}

.scroller {
  overflow-y: scroll;
  overscroll-behavior: contain;
  scrollbar-width: none;
}

.scroller::-webkit-scrollbar {
  display: none;
}

.scroll-content {
  height: 3000px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
