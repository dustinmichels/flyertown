// Bun loads .env automatically.
import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.POCKETBASE_URL ?? 'http://127.0.0.1:8090')

async function fetchFlyers(): Promise<void> {
  const email = process.env.POCKETBASE_EMAIL
  const password = process.env.POCKETBASE_PASSWORD
  if (!email || !password) {
    throw new Error('Set POCKETBASE_EMAIL and POCKETBASE_PASSWORD in .env')
  }

  await pb.collection('_superusers').authWithPassword(email, password)
  const { items } = await pb.collection('flyers').getList(1, 50)

  for (const record of items) {
    console.log({ ...record, imageUrl: pb.files.getURL(record, record.image) })
  }
}

fetchFlyers().catch((error) => {
  console.error('Error fetching records:', error)
  process.exitCode = 1
})
