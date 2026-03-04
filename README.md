# MapLibre OpenLayers layer

Render a [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) map as an [OpenLayers](https://openlayers.org/) layer.

## Installation

```shell
npm i @geoblocks/ol-maplibre-layer
```

OpenLayers and MapLibre GL JS are peer dependencies, so you need to install them too.

```shell
npm i ol maplibre-gl
```

## Code example

```js
import {MapLibreLayer} from '@geoblocks/ol-maplibre-layer';

const layer = new MapLibreLayer({
  opacity: 0.7,
  mapLibreOptions: {
    style: 'https://www.example.com/path/to/style.json',
  },
});

// ...
map.addLayer(layer);
```

All the properties passed to the construction (except `mapLibreOptions`) are used to create the [OpenLayers layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html).
`mapLibreOptions` is used to create the [MapLibre map](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/).

The MapLibreLayer exposes the underlying MapLibre map as public property, so you can use it to interact with the map.

```js
layer.maplibreMap.setStyle('https://www.example.com/path/to/other/style.json');
```

## Online doc and demos

- [Documentation](https://geoblocks.github.io/ol-maplibre-layer/api/);
- [Demo](https://geoblocks.github.io/ol-maplibre-layer/demo.html);

## Local development

For local development we use a few demos.

```bash
npm install
npm run start
open http://localhost:1234
```

## Publish a new version to npm

The source is transpiled to standard ES modules and published on npm.

```bash
# update CHANGES.md
npm version patch
npm publish
git push --tags origin master
npm run gh-pages
```
