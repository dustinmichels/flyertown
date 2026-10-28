<script setup lang="ts">
import { ref } from 'vue'
import EventCalendar from './components/EventCalendar.vue'
import EventList from './components/EventList.vue'
import PoleView from './components/PoleView.vue'
import ViewToggle, { type EventsView } from './components/ViewToggle.vue'
import { useEvents } from './composables/useEvents'

const { events, status, error } = useEvents()
const view = ref<EventsView>('pole')
</script>

<template>
  <header class="masthead">
    <h1 aria-label="UEPvents"><span class="uep">UEP</span><span class="vents">vents</span></h1>
  </header>
  <main>
    <ViewToggle v-model="view" class="toggle" />
    <p v-if="status === 'loading'" class="status">Loading events…</p>
    <p v-else-if="status === 'error'" class="status error" role="alert">
      Couldn't load events: {{ error }}
    </p>
    <PoleView v-else-if="view === 'pole'" :events="events" />
    <EventCalendar v-else-if="view === 'calendar'" :events="events" />
    <EventList v-else :events="events" />
  </main>
</template>

<style scoped>
.masthead {
  padding: 3rem 0 2.5rem;
}

h1 {
  margin: 0;
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
}

.uep {
  color: #1f9d5c;
}

.vents {
  font-style: italic;
}

.toggle {
  margin-bottom: 1.75rem;
}

.status {
  color: var(--muted);
}

.error {
  color: var(--error);
}

@media (max-width: 40rem) {
  .masthead {
    padding: 1.75rem 0 1.25rem;
  }

  .toggle {
    margin-bottom: 1.25rem;
  }
}
</style>
