import Layer from 'ol/layer/Layer';
import {toDegrees} from 'ol/math';
import {toLonLat} from 'ol/proj';

import maplibregl from 'maplibre-gl';

/**
 * @typedef {Object} Options
 * @property {string} [accessToken]
 * @property {string} style
 * @property {string|HTMLElement} container
 */


export default class MapLibreLayer extends Layer {

  /**
   * @param {Options} options
   */
  constructor(options) {

    const baseOptions = Object.assign({}, options);

    delete baseOptions.accessToken;
    delete baseOptions.style;
    delete baseOptions.container;

    super(baseOptions);

    if (options.accessToken) {
      maplibregl.accessToken = options.accessToken;
    }

    this.map_ = new maplibregl.Map({
      container: options.container,
      style: options.style,
      attributionControl: false,
      interactive: false
    });
  }

  /**
   * @param {import('ol/PluggableMap').FrameState} frameState
   */
  render(frameState) {
    const canvas = this.map_.getCanvas();
    const viewState = frameState.viewState;

    canvas.style.position = 'absolute';

    const visible = this.getVisible();
    canvas.style.display = visible ? 'block' : 'none';

    const opacity = this.getOpacity().toString();
    if (opacity !== canvas.style.opacity) {
      canvas.style.opacity = opacity;
    }

    // adjust view parameters in mapbox
    const rotation = viewState.rotation;
    this.map_.jumpTo({
      center: toLonLat(viewState.center),
      zoom: viewState.zoom - 1,
      bearing: toDegrees(-rotation),
      animate: false
    });

    this.map_.redraw();

    return canvas;
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
