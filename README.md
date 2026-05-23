# qrworker
Generate QR code worker

## Prepare
```bash
cp node_modules/@resvg/resvg-wasm/index_bg.wasm ./src/vendor
```

## Development

CLI tools (`lefthook`) are managed by [aqua](https://aquaproj.github.io/) with versions pinned in [aqua.yaml](aqua.yaml).

### Install tools

Install aqua itself first (see the [aqua installation guide](https://aquaproj.github.io/docs/install)), then install the pinned tools:

```bash
aqua install
```

### Set up git hooks

[lefthook](lefthook.yml) runs lint and format checks on staged files before each commit. Register the hooks once after cloning:

```bash
lefthook install
```


---
The word "QR Code" is registered trademark of:
DENSO WAVE INCORPORATED
