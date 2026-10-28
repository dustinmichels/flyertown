<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EventRecord } from '../lib/pocketbase'
import EventDetails from './EventDetails.vue'
import TelephonePole from './TelephonePole.vue'

const props = defineProps<{ events: EventRecord[] }>()

const withFlyers = computed(() => props.events.filter((event) => event.image))
const selectedId = ref<string | null>(null)
const selected = computed(() => withFlyers.value.find((event) => event.id === selectedId.value))
</script>

<template>
  <p v-if="!withFlyers.length" class="hint">No flyers on the pole yet.</p>
  <div v-else class="pole-view">
    <TelephonePole :events="withFlyers" :selected-id="selectedId" @select="selectedId = $event" />
    <aside class="panel" aria-live="polite">
      <EventDetails v-if="selected" :key="selected.id" :event="selected" />
      <p v-else class="hint">Pick a flyer off the pole to read the details.</p>
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
}

.hint {
  margin: 0;
  color: var(--muted);
}

@media (max-width: 40rem) {
  .pole-view {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 1rem;
  }

  .panel {
    font-size: 0.9rem;
  }
}
</style>
