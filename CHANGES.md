# @geoblocks/ol-maplibre-layers changes

## v1.0.0
- Provide a dedicated Renderer (Thanks to @oterral) allowing to:
  - Load the Maplibre GL map only when visible;
  - Automatically update attributions when source data changes;
  - Reload the maplibre map on target change event;
  - Allow the use of map.getFeaturesAtPixel  to get vector tiles features as OpenLayer feature.
- Rename Maplibre to **MapLibre** for more coherency. **Check you classes and options!** 
- Update libraries;
- Better packaging.
- Update compilation target and options.

## v0.1.3 and before
- Publish a library+types with one class MapLibreLayer that extends OL Layer.
