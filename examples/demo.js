import 'ol/ol.css';
import './style.css';

import Map from 'ol/Map';
import Source from 'ol/source/Source';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {TileDebug} from 'ol/source';

import MapLibreLayer from '../src/MapLibreLayer';

window.map = new Map({
  layers: [
    new MapLibreLayer({
      maplibreOptions: {
        style: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte_world.vt/style.json',
      },
      source: new Source({
        attributions: [
          '<a href="https://www.geo.admin.ch/en/geo-services/geo-services/portrayal-services-web-mapping/vector_tiles_service.html" target="_blank">© swisstopo</a>',
        ],
      }),
    }),
    new TileLayer({
      source: new TileDebug()
    })
  ],
  target: 'map',
  view: new View({
    center: [924582, 5950164],
    zoom: 8
  })
});
