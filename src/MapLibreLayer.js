import Layer from 'ol/layer/Layer';
import {toDegrees} from 'ol/math';
import {toLonLat} from 'ol/proj';

import maplibregl from 'maplibre-gl';


/**
 * @typedef {Object} Options
 * @property {string} [className='ol-layer'] A CSS class name to set to the layer element.
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {import('ol/extent').Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
 * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
 * method was used.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will be visible.
 * @property {number} [minZoom] The minimum view zoom level (exclusive) above which this layer will be visible.
 * @property {number} [maxZoom] The maximum view zoom level (inclusive) at which this layer will be visible.
 * @property {import('ol/source/Source').default} [source] Source for this layer.  If not provided to the constructor,
 * the source can be set by calling {@link module:ol/layer/Layer~Layer#setSource layer.setSource(source)} after
 * construction.
 * @property {import('ol/PluggableMap').default|null} [map] Map.
 * @property {import('ol/layer/Layer').RenderFunction} [render] Render function. Takes the frame state as input and is expected to return an
 * HTML element. Will overwrite the default rendering for the layer.
 * @property {Object<string, *>} [properties] Arbitrary observable properties. Can be accessed with `#get()` and `#set()`.
 * @property {import('maplibre-gl').MapOptions} maplibreOptions Options for maplibre-gl.
 */


export default class MapLibreLayer extends Layer {

  /**
   * @param {Options} options
   */
  constructor(options) {

    const baseOptions = Object.assign({}, options);

    delete baseOptions.maplibreOptions;

    super(baseOptions);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';

    this.maplibreMap = new maplibregl.Map(Object.assign({}, options.maplibreOptions, {
      container: container,
      attributionControl: false,
      interactive: false
    }));

    this.applyOpacity_();
  }

  /**
   * @param {number} opacity
   */
  setOpacity(opacity) {
    super.setOpacity(opacity);
    this.applyOpacity_();
  }

  /**
   * @private
   */
  applyOpacity_() {
    const canvas = this.maplibreMap.getCanvas();
    const opacity = this.getOpacity().toString();
    if (opacity !== canvas.style.opacity) {
      canvas.style.opacity = opacity;
    }
  }

  /**
   * @param {import('ol/PluggableMap').FrameState} frameState
   * @return {HTMLElement} element
   */
  render(frameState) {
    const viewState = frameState.viewState;

    // adjust view parameters in maplibre
    this.maplibreMap.jumpTo({
      center: /** @type {[number, number]} */ (toLonLat(viewState.center)),
      zoom: viewState.zoom - 1,
      bearing: toDegrees(-viewState.rotation),
    });

    const maplibreCanvas = this.maplibreMap.getCanvas();
    if (maplibreCanvas.width !== frameState.size[0] || maplibreCanvas.height !== frameState.size[1]) {
      this.maplibreMap.resize();
    }

    this.maplibreMap.redraw();

    return this.maplibreMap.getContainer();
  }
}
