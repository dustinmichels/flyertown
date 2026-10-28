# Pocketbase

`pb_data/` is gitignored. The `pocketbase` binary (v0.40.6) is managed by mise
(`mise.toml` at the repo root); run `mise install` to get it.

Run (from anywhere in the repo):

```sh
mise run pb
```

The task passes `--dir pb_data` explicitly: the mise-installed binary otherwise defaults
its data dir to the mise install directory, not this folder.

Upgrading: back up `pb_data/` first (`cp -Rp pb_data pb_data.bak-<old-version>`); the new
binary migrates the data on first start.
