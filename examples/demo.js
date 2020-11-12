import 'ol/ol.css';
import './style.css';

import Map from 'ol/Map.js'

import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import {OSM, TileDebug} from 'ol/source.js';

import MapBoxLayer from '../src/MapBoxLayer.js';

const mapBoxStyle = 'https://vectortiles.geoportail.lu/styles/roadmap/style.json'

const osmSource = new OSM();

window.map = new Map({
  layers: [
    window.mbl = new MapBoxLayer({
      style: mapBoxStyle,
      container: 'map'
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
