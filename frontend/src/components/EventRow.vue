<script setup lang="ts">
import { computed } from 'vue'
import { dateParts, descriptionParagraphs, formatTimeRange } from '../lib/format'
import type { EventRecord } from '../lib/pocketbase'

const props = defineProps<{ event: EventRecord }>()

const date = computed(() => dateParts(props.event.start_datetime))
const time = computed(() => formatTimeRange(props.event.start_datetime, props.event.end_datetime))
const excerpt = computed(() => descriptionParagraphs(props.event.description).join(' '))
</script>

<template>
  <article class="row">
    <p class="date">
      <template v-if="date">
        <span class="day">{{ date.day }}</span>
        <span class="month">{{ date.month }}</span>
        <span class="weekday">{{ date.weekday }}</span>
      </template>
    </p>
    <div class="body">
      <h2>{{ event.title }}</h2>
      <p v-if="time || event.location" class="meta">
        <span v-if="time">{{ time }}</span>
        <span v-if="event.location">{{ event.location }}</span>
      </p>
      <p v-if="excerpt" class="excerpt">{{ excerpt }}</p>
      <a v-if="event.website" class="website" :href="event.website" target="_blank" rel="noopener">
        Event website
      </a>
    </div>
  </article>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 4.5rem minmax(0, 1fr);
  gap: 1.25rem;
  padding: 1.25rem 0;
}

p {
  margin: 0;
}

/* Stacked calendar tile; stays empty (but keeps the column) for undated events. */
.date {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--accent);
  line-height: 1.2;
}

.day {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

.month {
  font-weight: 650;
}

.weekday {
  color: var(--muted);
  font-size: 0.9rem;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 650;
  line-height: 1.25;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0 1rem;
  color: var(--muted);
  font-size: 0.9rem;
}

.excerpt {
  display: -webkit-box;
  max-width: 44rem;
  overflow: hidden;
  font-size: 0.9rem;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.website {
  font-size: 0.9rem;
  font-weight: 600;
}

@media (max-width: 40rem) {
  .row {
    grid-template-columns: 3.25rem minmax(0, 1fr);
    gap: 0.9rem;
  }

  .day {
    font-size: 1.75rem;
  }
}
</style>
