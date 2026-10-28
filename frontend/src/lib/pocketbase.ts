import sampleEventsJson from './sampleEvents.json'

const PB_URL: string = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

/** A record from the PocketBase `flyers` collection. Unset fields come back as ''. */
export interface EventRecord {
  id: string
  collectionId: string
  title: string
  /** HTML from PocketBase's rich-text editor field. */
  description: string
  start_datetime: string
  end_datetime: string
  location: string
  website: string
  poster_name: string
  /** Poster filename; '' when the event has no flyer. */
  image: string
}

export async function fetchEvents(): Promise<EventRecord[]> {
  const url = new URL('/api/collections/flyers/records', PB_URL)
  url.search = new URLSearchParams({
    perPage: '500',
    skipTotal: '1',
    sort: 'start_datetime',
  }).toString()

  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url.origin} responded ${res.status} ${res.statusText}`)
  const body: { items: EventRecord[] } = await res.json()
  return body.items
}

/** `collectionId` of the bundled sample events; their posters live in `public/sample-posters/`. */
const SAMPLE_COLLECTION = 'sample'

/** Served when PocketBase can't be reached (e.g. the GitHub Pages demo). Same data as the PocketBase dev seed. */
export const sampleEvents: EventRecord[] = sampleEventsJson

export function posterUrl(event: EventRecord): string | null {
  if (!event.image) return null
  if (event.collectionId === SAMPLE_COLLECTION) {
    return `${import.meta.env.BASE_URL}sample-posters/${encodeURIComponent(event.image)}`
  }
  return `${PB_URL}/api/files/${event.collectionId}/${event.id}/${encodeURIComponent(event.image)}`
}
