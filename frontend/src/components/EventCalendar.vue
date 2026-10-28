<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import {
  addMonths,
  eventsByDay,
  initialMonth,
  monthDays,
  monthLabelFmt,
  startOfMonth,
  weekdayNames,
} from '../lib/calendar'
import { parseDate } from '../lib/format'
import type { EventRecord } from '../lib/pocketbase'
import CalendarDay from './CalendarDay.vue'
import EventChip from './EventChip.vue'
import EventDetails from './EventDetails.vue'

const props = defineProps<{ events: EventRecord[] }>()

const today = new Date()
const thisMonth = startOfMonth(today)
// Events are already loaded when this mounts (App shows a loading state until then).
const month = ref(initialMonth(props.events, today))

const byDay = computed(() => eventsByDay(props.events))
const days = computed(() => monthDays(month.value, byDay.value, today))
const monthIsEmpty = computed(() => !days.value.some((day) => day.inMonth && day.events.length))
const isThisMonth = computed(() => month.value.getTime() === thisMonth.getTime())
// No start date means no day cell, so these get their own list under the grid.
const undated = computed(() => props.events.filter((event) => !parseDate(event.start_datetime)))

const selectedId = ref<string | null>(null)
const selected = computed(() => props.events.find((event) => event.id === selectedId.value))
const panel = useTemplateRef<HTMLElement>('panel')

async function select(id: string) {
  selectedId.value = selectedId.value === id ? null : id
  if (!selectedId.value) return
  await nextTick()
  panel.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
</script>

<template>
  <p v-if="!events.length" class="hint">No events posted yet.</p>
  <div v-else class="calendar">
    <div class="head">
      <h2 aria-live="polite">{{ monthLabelFmt.format(month) }}</h2>
      <div class="nav">
        <button
          type="button"
          class="arrow"
          aria-label="Previous month"
          @click="month = addMonths(month, -1)"
        >
          ‹
        </button>
        <button type="button" :disabled="isThisMonth" @click="month = thisMonth">Today</button>
        <button
          type="button"
          class="arrow"
          aria-label="Next month"
          @click="month = addMonths(month, 1)"
        >
          ›
        </button>
      </div>
    </div>

    <div class="weekdays" aria-hidden="true">
      <span v-for="name in weekdayNames" :key="name">{{ name }}</span>
    </div>
    <ol class="days">
      <CalendarDay
        v-for="day in days"
        :key="day.key"
        :day="day"
        :selected-id="selectedId"
        @select="select"
      />
    </ol>
    <p v-if="monthIsEmpty" class="hint month-empty">No events this month.</p>

    <section v-if="undated.length" class="undated">
      <h3>Date TBA</h3>
      <ul>
        <li v-for="event in undated" :key="event.id">
          <EventChip :event="event" time="" :selected="event.id === selectedId" @select="select" />
        </li>
      </ul>
    </section>

    <aside ref="panel" class="panel" aria-live="polite">
      <EventDetails v-if="selected" :key="selected.id" :event="selected" />
      <p v-else class="hint">Pick an event to read the details.</p>
    </aside>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.nav {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.2rem;
  border-radius: 999px;
  background: var(--wash);
}

.nav button {
  min-width: 2.25rem;
  padding: 0.35rem 0.9rem;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.nav button:hover:not(:disabled) {
  background: var(--line);
}

.nav button:disabled {
  color: var(--muted);
  cursor: default;
}

.nav .arrow {
  font-size: 1.25rem;
  line-height: 1;
}

.nav button:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}

.weekdays,
.days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.weekdays {
  padding-bottom: 0.35rem;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 650;
  text-align: center;
}

/* 1px gaps over a line-coloured background draw the cell borders. */
.days {
  gap: 1px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  list-style: none;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: var(--line);
}

.hint {
  margin: 0;
  color: var(--muted);
}

.month-empty {
  display: none;
}

.undated {
  margin-top: 1.5rem;
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 650;
  color: var(--accent);
}

.undated ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.panel {
  margin-top: 2rem;
  scroll-margin: 1.5rem;
}

@media (max-width: 40rem) {
  .weekdays {
    display: none;
  }

  .days {
    display: block;
    border: 0;
    border-top: 1px solid var(--line);
    border-radius: 0;
    background: none;
  }

  .days:has(+ .month-empty) {
    border-top: 0;
  }

  .month-empty {
    display: block;
  }
}
</style>
