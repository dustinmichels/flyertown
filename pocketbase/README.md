# Pocketbase

`pb_data/` is gitignored. The `pocketbase` binary (v0.40.6) is managed by mise
(`mise.toml` at the repo root); run `mise install` to get it.

Run (from anywhere in the repo):

```sh
mise run pb
```

The task passes `--dir pb_data` explicitly: the mise-installed binary otherwise defaults
its data dir to the mise install directory, not this folder.

`pb_migrations/` runs automatically on `serve`:

- `1793160000_flyers_public_read.js`: anyone can list/view `flyers` (the frontend has no
  auth); `poster_email` is hidden from the public API.
- `1793160001_seed_dummy_flyers.js`: 11 dummy events, 6 with a generated SVG poster. Only
  inserts when `PB_SEED_DUMMY=1`, which `mise run pb` sets; any other `serve` records it as
  applied without seeding. To remove the dummy events (with the server stopped):

  ```sh
  echo y | pocketbase migrate down 1 --dir pb_data
  rm pb_migrations/1793160001_seed_dummy_flyers.js  # else the next `mise run pb` re-seeds
  ```

Upgrading: back up `pb_data/` first (`cp -Rp pb_data pb_data.bak-<old-version>`); the new
binary migrates the data on first start.
