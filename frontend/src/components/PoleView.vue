<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import type { EventRecord } from '../lib/pocketbase'
import EventDetails from './EventDetails.vue'
import TelephonePole from './TelephonePole.vue'

const props = defineProps<{ events: EventRecord[] }>()

const withFlyers = computed(() => props.events.filter((event) => event.image))
const selectedId = ref<string | null>(null)
const selected = computed(() => withFlyers.value.find((event) => event.id === selectedId.value))
const panel = useTemplateRef<HTMLElement>('panel')

async function select(id: string) {
  selectedId.value = id
  await nextTick()
  // Beside the pole this is a no-op; stacked under it on narrow screens, it reveals the details.
  panel.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
</script>

<template>
  <p v-if="!withFlyers.length" class="hint">No flyers on the pole yet.</p>
  <div v-else class="pole-view">
    <TelephonePole :events="withFlyers" :selected-id="selectedId" @select="select" />
    <aside ref="panel" class="panel" aria-live="polite">
      <EventDetails v-if="selected" :key="selected.id" :event="selected" />
      <p v-else class="hint">Scroll or swipe to spin the pole, then pick a flyer to read it.</p>
    </aside>
  </div>
</template>

<style scoped>
.pole-view {
  display: grid;
  grid-template-columns: minmax(0, 24rem) minmax(0, 1fr);
  gap: 2.5rem;
  align-items: start;
}

.panel {
  position: sticky;
  top: 1.5rem;
  scroll-margin: 1rem;
}

.hint {
  margin: 0;
  color: var(--muted);
}

@media (max-width: 40rem) {
  .pole-view {
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }

  .panel {
    position: static;
  }
}
</style>
