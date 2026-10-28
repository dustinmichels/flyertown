<script setup lang="ts">
export type EventsView = 'calendar' | 'list' | 'pole'

const view = defineModel<EventsView>({ required: true })

const options: { value: EventsView; label: string }[] = [
  { value: 'calendar', label: 'Calendar' },
  { value: 'list', label: 'List' },
  { value: 'pole', label: 'Telephone pole' },
]
</script>

<template>
  <div class="toggle" role="group" aria-label="Event view">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :aria-pressed="view === option.value"
      @click="view = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.toggle {
  display: inline-flex;
  padding: 0.2rem;
  border-radius: 999px;
  background: var(--wash);
}

button {
  padding: 0.4rem 1rem;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--muted);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

button[aria-pressed='true'] {
  background: var(--ink);
  color: var(--paper);
}

button:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
</style>
