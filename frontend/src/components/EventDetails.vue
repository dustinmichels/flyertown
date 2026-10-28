<script setup lang="ts">
import { computed } from 'vue'
import { descriptionParagraphs, formatWhen } from '../lib/format'
import { posterUrl, type EventRecord } from '../lib/pocketbase'

const props = defineProps<{ event: EventRecord }>()

const when = computed(() => formatWhen(props.event.start_datetime, props.event.end_datetime))
const paragraphs = computed(() => descriptionParagraphs(props.event.description))
const poster = computed(() => posterUrl(props.event))
</script>

<template>
  <article class="details">
    <h2>{{ event.title }}</h2>
    <dl>
      <template v-if="when">
        <dt>When</dt>
        <dd>{{ when }}</dd>
      </template>
      <template v-if="event.location">
        <dt>Where</dt>
        <dd>{{ event.location }}</dd>
      </template>
      <template v-if="event.poster_name">
        <dt>Posted by</dt>
        <dd>{{ event.poster_name }}</dd>
      </template>
    </dl>
    <p v-for="(paragraph, i) in paragraphs" :key="i">{{ paragraph }}</p>
    <p class="links">
      <a v-if="event.website" :href="event.website" target="_blank" rel="noopener">
        Event website
      </a>
      <a v-if="poster" :href="poster" target="_blank" rel="noopener">Full-size flyer</a>
    </p>
  </article>
</template>

<style scoped>
h2 {
  margin: 0 0 1rem;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 1rem;
  margin: 0 0 1.25rem;
}

dt {
  color: var(--muted);
}

dd {
  margin: 0;
  font-weight: 600;
}

p {
  max-width: 38rem;
  margin: 0 0 0.85rem;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  margin-top: 1.25rem;
  font-weight: 600;
}

@media (max-width: 40rem) {
  dl {
    grid-template-columns: 1fr;
    gap: 0;
  }

  dd {
    margin-bottom: 0.5rem;
  }
}
</style>
