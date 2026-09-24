import 'ol/ol.css';
import './style.css';

import Map from 'ol/Map';
import Source from 'ol/source/Source';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileDebug from 'ol/source/TileDebug';

import {setWorkerUrl} from 'maplibre-gl';
import {MapLibreLayer} from '../src/index';

// Needed by mapLibre-gl v6. See: https://github.com/maplibre/maplibre-gl-js/blob/v6.0.0/docs/index.md#installation
// This resource is copied during the build.
setWorkerUrl(new URL('./workers/maplibre-gl-worker.mjs', import.meta.url).toString());

window.map = new Map({
  layers: [
    new MapLibreLayer({
      mapLibreOptions: {
        style:
          'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json',
      },
      source: new Source({
        attributions: [
          '<a href="https://www.geo.admin.ch/en/vector-tiles-service-available-services-and-data" target="_blank">© swisstopo</a>',
        ],
      }),
    }),
    new TileLayer({
      source: new TileDebug(),
    }),
  ],
  target: 'map',
  view: new View({
    center: [924582, 5950164],
    zoom: 8,
  }),
});

window.map.on('singleclick', (evt) => {
  const features = window.map.getFeaturesAtPixel(evt.pixel);
  features.forEach((feature) => {
    console.log(feature);
  });
});
