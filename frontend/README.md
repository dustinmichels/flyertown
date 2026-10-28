# UEPvents

Vue 3 + TypeScript app (Vite, bun), deployed to Netlify. Styling follows the uep-alumni frontend: Public Sans, the color tokens in `src/style.css`, and the masthead in `src/App.vue`.

Events come from the PocketBase `flyers` collection (see `../pocketbase`). Three views:

- **Calendar** (default): a month grid with each day's events stacked in its cell (multi-day events repeat on every day they cover); prev/next/today buttons change the month, and clicking an event shows its details below. Events without a start date are listed under the grid as "Date TBA". Opens on the month of the next upcoming event. On narrow screens it collapses to an agenda of that month's event days.
- **List**: one row per event, date down the left, description clamped to two lines.
- **Telephone pole**: only events with a poster (`image` field), wrapped around a 3D (three.js) pole; scrolling over the pole spins it, and clicking a flyer shows its details to the right.

The PocketBase URL defaults to `http://127.0.0.1:8090`; set `VITE_POCKETBASE_URL` to override it (e.g. in Netlify's build environment).

## Develop

```sh
bun install
bun run dev
bun run build    # type-check + production build into dist/
bun run format
```
