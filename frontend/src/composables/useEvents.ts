import { ref, shallowRef } from 'vue'
import { fetchEvents, type EventRecord } from '../lib/pocketbase'

export function useEvents() {
  const events = shallowRef<EventRecord[]>([])
  const status = ref<'loading' | 'ready' | 'error'>('loading')
  const error = ref('')

  fetchEvents()
    .then((items) => {
      events.value = items
      status.value = 'ready'
    })
    .catch((err: unknown) => {
      error.value = err instanceof Error ? err.message : String(err)
      status.value = 'error'
    })

  return { events, status, error }
}
