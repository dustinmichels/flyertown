<script setup lang="ts">
import type { EventRecord } from '../lib/pocketbase'
import EventRow from './EventRow.vue'

defineProps<{ events: EventRecord[] }>()
</script>

<template>
  <p v-if="!events.length" class="empty">No events posted yet.</p>
  <ul v-else class="list">
    <li v-for="event in events" :key="event.id">
      <EventRow :event="event" />
    </li>
  </ul>
</template>

<style scoped>
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}

li {
  border-bottom: 1px solid var(--line);
}

.empty {
  color: var(--muted);
}
</style>
