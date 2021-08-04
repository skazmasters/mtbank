import { dispatchEvent } from '../utils';
import { createObjectMarker, getZoomControlTemplate } from '../helpers';

const API_KEY = '84d8106c-355a-444c-b536-a30654d8840e';

class Map {
  constructor(node) {
    this.map = null;
    this.objectManager = null;
    this.node = node;

    this.activeMarker = null;

    this.options = {
      controls: [],
      center: null,
      zoom: null,
    };

    this.init();
  }

  init() {
    if (window.ymaps) {
      this.onloadAPICallback();
      return;
    }

    const apiUrl = this.getAPIUrl();
    const params = { apikey: API_KEY };
    const onReady = this.onloadAPICallback.bind(this);

    getAPI({ type: 'js', apiUrl, params })
      .then(() => ymaps.ready(onReady))
      .catch(error => console.error(error));
  }

  onloadAPICallback() {
    this.setOptions(
      this.getInitOptions(),
    );

    this.createMapInstance();
    this.createObjectManager();
    this.createEventListeners();
    this.configureMap();

    dispatchEvent('onMapInit');
  }

  createMapInstance() {
    this.map = new ymaps.Map(this.node, {
      ...this.options,
    });
  }

  configureMap() {
    this.map.geoObjects.add(this.objectManager);
    this.map.controls.add(this.createZoomControl());
    this.map.behaviors.disable('scrollZoom');
  }

  createObjectManager() {
    this.objectManager = new ymaps.ObjectManager({
      ...this.createClusterIcon(),
      geoObjectOpenBalloonOnClick: false,
      clusterOpenBalloonOnClick: false,
      clusterize: true,
    });
  }

  createEventListeners() {
    this.objectManager.objects.events.add('click', (e) => {
      this.handleMarkerClick(e);
    });
  }

  handleMarkerClick(e) {
    this.removeActiveMarker();

    const objectId = e.get('objectId');

    this.setActiveMarker(objectId);
    dispatchEvent('onMarkerClick', {
      id: objectId,
    });
  }

  setActiveMarker(objectId) {
    this.objectManager.objects
      .setObjectProperties(objectId, {
        isActive: true,
      });

    this.objectManager.objects
      .setObjectOptions(objectId, {
        zIndex: 9998,
      });

    this.activeMarker = objectId;
  }

  removeActiveMarker() {
    this.objectManager.objects
      .setObjectProperties(this.activeMarker, {
        isActive: false,
      });

    this.objectManager.objects
      .setObjectOptions(this.activeMarker, {
        zIndex: null,
      });

    this.activeMarker = null;
  }

  renderMarkers(markerList) {
    const resultMarkerList = markerList
      .filter((marker) => marker.coords && marker.coords.length === 2)
      .map((marker) => this.createMarkerModel(marker));

    this.objectManager.add(resultMarkerList);
    this.map.geoObjects.add(this.objectManager);
  }

  createMarkerModel(marker) {
    return ({
      geometry: { type: 'Point', coordinates: marker.coords },
      options: { ...this.createMarkerIcon(marker) },
      properties: { isActive: false },
      type: 'Feature', id: marker.id,
    });
  }

  createMarkerIcon(data) {
    return {
      zIndexHover: 9999,
      iconOffset: [-19, -19],
      iconShape: { type: 'Circle', coordinates: [19, 19], radius: 19 },
      iconLayout: this.createIconLayout(data),
    };
  }

  createClusterIcon() {
    return {
      zIndexHover: 9999,
      iconOffset: [-19, -19],
      iconShape: { type: 'Circle', coordinates: [19, 19], radius: 19 },
      clusterIconLayout: this.createIconLayout({
        marker: { color: 'transparent', content: '{{ properties.geoObjects.length }}' },
      }),
    };
  }

  createIconLayout(data) {
    return ymaps.templateLayoutFactory.createClass(
      createObjectMarker(data.marker, { shadow: true })
        .firstElementChild
        .outerHTML,
    );
  }

  createZoomControl() {
    const zoomLayout = this.createZoomControlLayout();
    return new ymaps.control.ZoomControl({
      options: { layout: zoomLayout },
    });
  }

  createZoomControlLayout() {
    const ZoomLayout = ymaps.templateLayoutFactory.createClass(
      getZoomControlTemplate(), {
        build: function() {
          ZoomLayout.superclass.build.call(this);

          this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
          this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

          $('#zoom-in').bind('click', this.zoomInCallback);
          $('#zoom-out').bind('click', this.zoomOutCallback);
        },

        clear: function() {
          $('#zoom-in').unbind('click', this.zoomInCallback);
          $('#zoom-out').unbind('click', this.zoomOutCallback);

          ZoomLayout.superclass.clear.call(this);
        },

        zoomIn: function() {
          const map = this.getData().control.getMap();
          map.setZoom(map.getZoom() + 1, { checkZoomRange: true });
        },

        zoomOut: function() {
          const map = this.getData().control.getMap();
          map.setZoom(map.getZoom() - 1, { checkZoomRange: true });
        },
      });

    return ZoomLayout;
  }

  removeAllMarkers() {
    this.objectManager.removeAll();
  }

  centerOnActiveMarker() {
    const object = this.objectManager.objects
      .getById(this.activeMarker);

    if (!object) return;

    this.setOptions({
      center: object.geometry.coordinates,
      zoom: 16,
    });

    this.centerView();
  }

  centerOnActiveArea(coords) {
    if (!coords) return;

    this.setOptions({
      center: coords.split(','),
      zoom: 12,
    });

    this.centerView();
  }

  setOptions({ center, zoom }) {
    this.options.center = center;
    this.options.zoom = zoom;
  }

  centerView() {
    this.map.setCenter(this.options.center);
    this.map.setZoom(this.options.zoom);
  }

  getInitOptions() {
    const { center = '0,0', zoom = '12' } = this.node.dataset;
    return { center: center.split(','), zoom };
  }

  getAPIUrl() {
    return this.node.dataset.apiUrl;
  }

  static createInstance(node) {
    return new Map(node);
  }
}

export default Map;

