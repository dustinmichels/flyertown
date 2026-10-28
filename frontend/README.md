# FlyerTown

Vue 3 + Three.js app (Vite, bun), deployed to Netlify.

## Layout

```
src/
  App.vue              page composition
  components/          UI overlays + TelephonePole (scroll-driven 3D scene host)
  scene/poleScene.ts   Three.js scene: pole, flyers, lights, render loop
  data/flyers.ts       flyer textures and their placement on the pole
public/assets/         textures loaded at runtime
```

The commit hash shown in the corner is injected by `vite.config.ts` (`git rev-parse --short HEAD`, falls back to `dev`).

## Develop

```sh
bun install
bun run dev
bun run build    # type-check + production build into dist/
bun run format
```
