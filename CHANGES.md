# @geoblocks/ol-maplibre-layers changes

## v2.0.0

- Update peer dependencies to maplibre-gl >=5.11.0.
  - `MapLibreMap.style.sourceCaches` is now `MapLibreMap.style.tileManager`.
- Adapt the example to work with MapLibre GL v6. It's now required to set its
  worker URL. In your project you can manually copy the files, use a bundler that supports 
  urls to the `node_modules` folder, or to use a url to a hosted worker.
  [See the MapLibre-GL doc](https://github.com/maplibre/maplibre-gl-js/blob/v6.0.0/docs/index.md#installation).

## v1.0.1

- Add support for OpenLayers 10.

## v1.0.0

- Provide a dedicated Renderer (Thanks to @oterral) allowing to:
  - Load the Maplibre GL map only when visible;
  - Automatically update attributions when source data changes;
  - Reload the maplibre map on target change events;
  - Allow the use of map.getFeaturesAtPixel to get vector tiles features as OpenLayer feature.
- Rename Maplibre to **MapLibre** for more coherency. **Check your classes and options!**
- Update libraries;
- Better packaging.
- Update compilation target and options.

## v0.1.3 and before

- Publish a library+types with one class MapLibreLayer that extends OL Layer.
