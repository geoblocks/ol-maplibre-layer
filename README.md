# MapLibre OpenLayers layer

Render a [MapLibre GL JS](https://maplibre.org/projects/#js) map as an [OpenLayers](https://openlayers.org/) layer.

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
import MapLibreLayer from '@geoblocks/ol-maplibre-layer';

const layer = new MapLibreLayer({
  opacity: 0.7,
  maplibreOptions: {
    style: 'https://www.example.com/path/to/style.json',
  },
});

// ...
map.addLayer(layer);
```

All the properties passed to the construction (except `maplibreOptions`) are used to create the [OpenLayers layer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Layer-Layer.html).
`maplibreOptions` is used to create the [MapLibre map](https://maplibre.org/maplibre-gl-js-docs/api/map/).

## Live examples

[Basic example](https://geoblocks.github.io/ol-maplibre-layer/demo.html)
