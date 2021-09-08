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
        container: 'map'
      },
      source: new Source({
        attributions: [
          '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
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
