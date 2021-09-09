import Layer from 'ol/layer/Layer';
import {toDegrees} from 'ol/math';
import {toLonLat} from 'ol/proj';

import maplibregl from 'maplibre-gl';

/**
 * @typedef {Object} Options
 * @property {string} [accessToken]
 * @property {Object<string, *} maplibreOptions
 */


export default class MapLibreLayer extends Layer {

  /**
   * @param {Options} options
   */
  constructor(options) {

    const baseOptions = Object.assign({}, options);

    delete baseOptions.accessToken;
    delete baseOptions.maplibreOptions;

    super(baseOptions);

    if (options.accessToken) {
      maplibregl.accessToken = options.accessToken;
    }

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';

    this.map_ = new maplibregl.Map(Object.assign(options.maplibreOptions, {
      container: container,
      attributionControl: false,
      interactive: false
    }));
  }

  /**
   * @param {import('ol/PluggableMap').FrameState} frameState
   * @return {HTMLCanvasElement} canvas
   */
  render(frameState) {
    const canvas = this.map_.getCanvas();
    const viewState = frameState.viewState;

    const visible = this.getVisible();
    canvas.style.display = visible ? 'block' : 'none';

    const opacity = this.getOpacity().toString();
    if (opacity !== canvas.style.opacity) {
      canvas.style.opacity = opacity;
    }

    // adjust view parameters in mapbox
    this.map_.jumpTo({
      center: toLonLat(viewState.center),
      zoom: viewState.zoom - 1,
      bearing: toDegrees(-viewState.rotation),
      animate: false
    });

    this.map_.resize();
    this.map_.redraw();

    return this.map_.getContainer();
  }

  /**
   * @return {maplibregl.Map}
   */
  getMapLibreMap() {
    return this.map_;
  }

  /**
   * @param {string} name
   * @param {boolean} visible
   */
  setLayerVisibility(name, visible) {
    this.map_.setLayoutProperty(name, 'visibility', visible ? 'visible' : 'none');
  }

  /**
   * @return {maplibregl.Style}
   */
  getStyle() {
    return this.map_.getStyle();
  }
}
