import 'ol/ol.css';
import './style.css';

import Map from 'ol/Map';
import Source from 'ol/source/Source';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {OSM, TileDebug} from 'ol/source';

import MapLibreLayer from '../src/MapLibreLayer';

const styleUrl = 'https://vectortiles.geoportail.lu/styles/roadmap/style.json';

const osmSource = new OSM();

window.map = new Map({
  layers: [
    new MapLibreLayer({
      maplibreOptions: {
        style: styleUrl,
      },
      source: new Source({
        attributions: [
          '<a href="https://map.geoportail.lu/" target="_blank">© map.geoportail.lu</a>',
        ],
      }),
    }),
    new TileLayer({
      source: new TileDebug({
        projection: 'EPSG:3857',
        tileGrid: osmSource.getTileGrid()
      })
    })
  ],
  target: 'map',
  view: new View({
    center: [668584, 6408478],
    zoom: 10
  })
});
