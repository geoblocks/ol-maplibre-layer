import {Map as MaplibreMap} from 'maplibre-gl';
import type {MapOptions, QueryRenderedFeaturesOptions } from 'maplibre-gl';
import type {Map} from 'ol';
import Layer from 'ol/layer/Layer.js';
import type {Options as LayerOptions} from 'ol/layer/Layer.js';
import type {EventsKey} from 'ol/events';
import BaseEvent from 'ol/events/Event';
import {unByKey} from 'ol/Observable';
import {Source} from 'ol/source';
import MaplibreLayerRenderer from './MaplibreLayerRenderer';
import getMaplibreAttributions from './getMaplibreAttributions';

export type MapLibreOptions = Omit<MapOptions, 'container'>;

export type MapLibreLayerOptions = LayerOptions & {
  maplibreOptions: MapLibreOptions;
  queryRenderedFeaturesOptions?: QueryRenderedFeaturesOptions;
};

export default class MapLibreLayer extends Layer {
  maplibreMap?: MaplibreMap;

  loaded: boolean = false;

  private olListenersKeys: EventsKey[] = [];

  constructor(options: MapLibreLayerOptions) {
    super({
      source: new Source({
        attributions: () => {
          return getMaplibreAttributions(this.maplibreMap);
        },
      }),
      ...options,
    });
  }

  override disposeInternal() {
    unByKey(this.olListenersKeys);
    this.loaded = false;
    if (this.maplibreMap) {
      // Some asynchronous repaints are triggered even if the maplibreMap has been removed,
      // to avoid display of errors we set an empty function.
      this.maplibreMap.triggerRepaint = () => {};
      this.maplibreMap.remove();
    }
    super.disposeInternal();
  }

  override setMapInternal(map: Map) {
    super.setMapInternal(map);
    if (map) {
      this.loadMaplibreMap();
    } else {
      // TODO: I'm not sure if it's the right call
      this.dispose();
    }
  }

  private loadMaplibreMap() {
    this.loaded = false;
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
