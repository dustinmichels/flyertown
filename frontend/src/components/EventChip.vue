<script setup lang="ts">
import type { EventRecord } from '../lib/pocketbase'

defineProps<{ event: EventRecord; time: string; selected: boolean }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <button type="button" class="chip" :aria-pressed="selected" @click="emit('select', event.id)">
    <span v-if="time" class="time">{{ time }}</span>
    <span class="title">{{ event.title }}</span>
  </button>
</template>

<style scoped>
.chip {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.25rem 0.4rem;
  border: 0;
  border-left: 3px solid var(--accent);
  border-radius: 4px;
  background: var(--wash);
  color: var(--ink);
  font: inherit;
  font-size: 0.8rem;
  line-height: 1.25;
  text-align: left;
  cursor: pointer;
}

.chip:hover {
  background: var(--line);
}

.chip[aria-pressed='true'] {
  background: var(--accent);
  color: #fff;
}

.chip:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}

.time {
  color: var(--muted);
  font-size: 0.75rem;
}

.chip[aria-pressed='true'] .time {
  color: inherit;
}

.title {
  font-weight: 600;
  overflow-wrap: anywhere;
}

/* Narrow screens: agenda rows, time in a fixed column beside the title. */
@media (max-width: 40rem) {
  .chip {
    flex-direction: row;
    gap: 0.75rem;
    padding: 0.5rem 0.6rem;
    font-size: 0.9rem;
  }

  .time {
    flex: 0 0 4.5rem;
    font-size: inherit;
  }
}
</style>
