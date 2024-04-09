import 'ol/ol.css';
import './style.css';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {TileDebug} from 'ol/source';

import MapLibreLayer from '../src/ol-maplibre-layer';

window.map = new Map({
  layers: [
    new MapLibreLayer({
      maplibreOptions: {
        style:
          'https://maps.geops.io/styles/travic_v2/style.json?key=5cc87b12d7c5370001c1d655200a40164917492f8a22331dbf108820',
      },
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
