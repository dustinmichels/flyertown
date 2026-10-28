# UEPvents

Vue 3 + TypeScript app (Vite, bun), deployed to Netlify. Styling follows the uep-alumni frontend: Public Sans, the color tokens in `src/style.css`, and the masthead in `src/App.vue`.

Events come from the PocketBase `flyers` collection (see `../pocketbase`). Three views:

- **Telephone pole** (default): only events with a poster (`image` field), wrapped around a 3D (three.js) pole. Scrolling over the pole spins it (on touch screens, swipe sideways; vertical swipes still scroll the page), and clicking a flyer shows its details to the right. On narrow screens the pole spans the width and the details stack below it.
- **Calendar**: a month grid with each day's events stacked in its cell (multi-day events repeat on every day they cover); prev/next/today buttons change the month, and clicking an event shows its details below. Events without a start date are listed under the grid as "Date TBA". Opens on the month of the next upcoming event. On narrow screens it collapses to an agenda of that month's event days.
- **List**: one row per event, date down the left, description clamped to two lines.

The PocketBase URL defaults to `http://127.0.0.1:8090`; set `VITE_POCKETBASE_URL` to override it (e.g. in Netlify's build environment).

## Develop

```sh
bun install
bun run dev
bun run build    # type-check + production build into dist/
bun run format
```
