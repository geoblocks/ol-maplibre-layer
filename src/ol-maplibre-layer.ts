import Layer from 'ol/layer/Layer.js';
import {toDegrees} from 'ol/math.js';
import {toLonLat} from 'ol/proj.js';

import {Map as MaplibreMap} from 'maplibre-gl';
import type {FrameState} from 'ol/Map.js';
import type {Options as LayerOptions} from 'ol/layer/Layer.js';
import type {MapOptions} from 'maplibre-gl';
import {EventsKey} from 'ol/events';
import BaseEvent from 'ol/events/Event';
import MaplibreLayerRenderer from './MaplibreLayerRenderer';
import {unByKey} from 'ol/Observable';

export type MapLibreOptions = Omit<MapOptions, 'container'>;

export type MapLibreLayerOptions = LayerOptions & {
  maplibreOptions: MapLibreOptions;
  queryRenderedFeaturesOptions?: maplibregl.QueryRenderedFeaturesOptions;
};

export default class MapLibreLayer extends Layer {
  maplibreMap?: MaplibreMap;

  loaded: boolean = false;

  private olListenersKeys: EventsKey[] = [];

  constructor(options: MapLibreLayerOptions) {
    super(options);
  }

  override disposeInternal() {
    unByKey(this.olListenersKeys);
    this.loaded = false;
    if (this.maplibreMap) {
      // Some asynchrone repaints are triggered even if the maplibreMap has been removed,
      // to avoid display of errors we set an empty function.
      this.maplibreMap.triggerRepaint = () => {};
      this.maplibreMap.remove();
    }
    super.disposeInternal();
  }

  // @ts-expect-error - this is a mixin
  override setMapInternal(map: Map) {
    super.setMapInternal(map);
    if (map) {
      this.loadMaplibreMap();
    } else {
      // TODO: I'm not sure if it's the right call
      this.dispose();
    }
  }

  /**
   * Load the Maplibre map.
   * @private
   */
  private loadMaplibreMap() {
    // this.loaded = false;
    const map = this.getMapInternal();
    if (map) {
      this.olListenersKeys.push(
        map.on('change:target', this.loadMaplibreMap.bind(this)),
      );
    }

    if (!map?.getTargetElement()) {
      return;
    }

    if (!this.getVisible()) {
      // On next change of visibility we load the map
      this.olListenersKeys.push(
        this.once('change:visible', this.loadMaplibreMap.bind(this)),
      );
      return;
    }

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';

    const maplibreOptions = this.get('maplibreOptions') as MapLibreOptions;

    this.maplibreMap = new MaplibreMap(
      Object.assign({}, maplibreOptions, {
        container: container,
        attributionControl: false,
        interactive: false,
        trackResize: false,
      }),
    );

    this.maplibreMap.on('sourcedata', () => {
      this.getSource()?.refresh(); // Refresh attribution
    });

    this.maplibreMap.once('load', () => {
      this.loaded = true;
      this.dispatchEvent(new BaseEvent('load'));
    });
  }

  override createRenderer() {
    return new MaplibreLayerRenderer(this);
  }
}
