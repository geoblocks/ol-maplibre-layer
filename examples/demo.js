import 'ol/ol.css';
import './style.css';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileDebug from 'ol/source/TileDebug';

import {MapLibreLayer} from '../src/index';

window.map = new Map({
  layers: [
    new MapLibreLayer({
      mapLibreOptions: {
        style: 'https://tiles.openfreemap.org/styles/bright',
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

window.map.on('rendercomplete', () => {
  console.log('rendercomplete');
});

window.map.on('singleclick', (evt) => {
  const features = window.map.getFeaturesAtPixel(evt.pixel);
  features.forEach((feature) => {
    console.log(feature);
  });
});
