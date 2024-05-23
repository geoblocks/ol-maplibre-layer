import {Map as MapLibreMap} from 'maplibre-gl';
import type {MapOptions, QueryRenderedFeaturesOptions } from 'maplibre-gl';
import type {Map} from 'ol';
import Layer from 'ol/layer/Layer.js';
import type {Options as LayerOptions} from 'ol/layer/Layer.js';
import type {EventsKey} from 'ol/events';
import BaseEvent from 'ol/events/Event';
import {unByKey} from 'ol/Observable';
import {Source} from 'ol/source';
import MapLibreLayerRenderer from './MapLibreLayerRenderer';
import getMapLibreAttributions from './getMapLibreAttributions';

export type MapLibreOptions = Omit<MapOptions, 'container'>;

export type MapLibreLayerOptions = LayerOptions & {
  mapLibreOptions: MapLibreOptions;
  queryRenderedFeaturesOptions?: QueryRenderedFeaturesOptions;
};

export default class MapLibreLayer extends Layer {
  mapLibreMap?: MapLibreMap;

  loaded: boolean = false;

  private olListenersKeys: EventsKey[] = [];

  constructor(options: MapLibreLayerOptions) {
    super({
      source: new Source({
        attributions: () => {
          return getMapLibreAttributions(this.mapLibreMap);
        },
      }),
      ...options,
    });
  }

  override disposeInternal() {
    unByKey(this.olListenersKeys);
    this.loaded = false;
    if (this.mapLibreMap) {
      // Some asynchronous repaints are triggered even if the MapLibreMap has been removed,
      // to avoid display of errors we set an empty function.
      this.mapLibreMap.triggerRepaint = () => {};
      this.mapLibreMap.remove();
    }
    super.disposeInternal();
  }

  override setMapInternal(map: Map) {
    super.setMapInternal(map);
    if (map) {
      this.loadMapLibreMap();
    } else {
      // TODO: I'm not sure if it's the right call
      this.dispose();
    }
  }

  private loadMapLibreMap() {
    this.loaded = false;
    const map = this.getMapInternal();
    if (map) {
      this.olListenersKeys.push(
        map.on('change:target', this.loadMapLibreMap.bind(this)),
      );
    }

    if (!map?.getTargetElement()) {
      return;
    }

    if (!this.getVisible()) {
      // On next change of visibility we load the map
      this.olListenersKeys.push(
        this.once('change:visible', this.loadMapLibreMap.bind(this)),
      );
      return;
    }

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';

    const mapLibreOptions = this.get('mapLibreOptions') as MapLibreOptions;

    this.mapLibreMap = new MapLibreMap(
      Object.assign({}, mapLibreOptions, {
        container: container,
        attributionControl: false,
        interactive: false,
        trackResize: false,
      }),
    );

    this.mapLibreMap.on('sourcedata', () => {
      this.getSource()?.refresh(); // Refresh attribution
    });

    this.mapLibreMap.once('load', () => {
      this.loaded = true;
      this.dispatchEvent(new BaseEvent('load'));
    });
  }

  override createRenderer(): MapLibreLayerRenderer {
    return new MapLibreLayerRenderer(this);
  }
}
