import { ref, shallowRef } from 'vue'
import { fetchEvents, sampleEvents, type EventRecord } from '../lib/pocketbase'

export function useEvents() {
  const events = shallowRef<EventRecord[]>([])
  const status = ref<'loading' | 'ready' | 'sample'>('loading')
  /** Why PocketBase couldn't be loaded; set when status is 'sample'. */
  const error = ref('')

  fetchEvents()
    .then((items) => {
      events.value = items
      status.value = 'ready'
    })
    .catch((err: unknown) => {
      error.value = err instanceof Error ? err.message : String(err)
      events.value = sampleEvents
      status.value = 'sample'
    })

  return { events, status, error }
}
