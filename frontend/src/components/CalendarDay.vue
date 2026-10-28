<script setup lang="ts">
import { computed } from 'vue'
import { dayKey, fullDateFmt, type CalendarDay } from '../lib/calendar'
import { formatStartTime, parseDate } from '../lib/format'
import EventChip from './EventChip.vue'

const props = defineProps<{ day: CalendarDay; selectedId: string | null }>()
const emit = defineEmits<{ select: [id: string] }>()

// Multi-day events repeat on each day they cover; only the first day gets a start time.
const entries = computed(() =>
  props.day.events.map((event) => {
    const start = parseDate(event.start_datetime)
    const startsToday = start !== null && dayKey(start) === props.day.key
    return { event, time: startsToday ? formatStartTime(event.start_datetime) : 'cont.' }
  })
)
</script>

<template>
  <li class="day" :class="{ outside: !day.inMonth, today: day.isToday, empty: !entries.length }">
    <time class="date" :datetime="day.key">
      <span class="number" aria-hidden="true">{{ day.date.getDate() }}</span>
      <span class="full">{{ fullDateFmt.format(day.date) }}</span>
    </time>
    <ul v-if="entries.length" class="events">
      <li v-for="{ event, time } in entries" :key="event.id">
        <EventChip
          :event="event"
          :time="time"
          :selected="event.id === selectedId"
          @select="emit('select', $event)"
        />
      </li>
    </ul>
  </li>
</template>

<style scoped>
.day {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-height: 7rem;
  padding: 0.4rem;
  background: #fff;
}

.outside {
  background: var(--wash);
}

.outside .number {
  color: var(--muted);
}

.date {
  font-size: 0.85rem;
  font-weight: 650;
}

.number {
  display: inline-grid;
  place-items: center;
  min-width: 1.6rem;
  height: 1.6rem;
  border-radius: 999px;
}

.today .number {
  background: var(--accent);
  color: #fff;
}

/* Screen-reader text in the grid; becomes the visible heading in the narrow agenda layout. */
.full {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.events {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Narrow screens: an agenda of this month's event days instead of a seven-column grid. */
@media (max-width: 40rem) {
  .day {
    min-height: 0;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--line);
    background: none;
  }

  .outside,
  .empty {
    display: none;
  }

  .number {
    display: none;
  }

  .full {
    position: static;
    width: auto;
    height: auto;
    clip-path: none;
    color: var(--accent);
  }

  .today .full::after {
    content: ' · Today';
  }
}
</style>
