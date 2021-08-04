import Map from './components/map';
import Tabs from './components/tabs';
import Filters from './components/filters';
import Preview from './components/preview';

import { createObjectCard } from './helpers';

class Widget {
  constructor(node) {
    this.node = node;

    this.Map = null;
    this.Tabs = null;
    this.Filters = null;

    this.createEventListeners();
    this.createComponentInstances();

    this.activeObject = null;
    this.objectList = this.getInitObjectList();
    this.apiUrl = this.getAPIUrl();

    this.handleInitActiveObject();
  }

  createComponentInstances() {
    this.Map = Map.createInstance(this.node.querySelector('.js-map'));
    this.Filters = Filters.createInstance(this.node.querySelector('.js-filters'));
    this.Tabs = Tabs.createInstance(this.node.querySelector('.js-tabs'));
    this.Preview = Preview.createInstance(this.node.querySelector('.js-preview'));
  }

  createEventListeners() {
    document.addEventListener('onMapInit', (e) => {
      console.log('on map init', e);
      this.handleMapInit();
    });

    document.addEventListener('onMarkerClick', (e) => {
      console.log('on marker click', e);
      this.handleMarkerClick(e.detail.id);
      this.setActiveObject(e.detail.id);
    });

    document.addEventListener('onFiltersChange', (e) => {
      console.log('on filters change', e);
      this.handleFiltersChange(e.detail.center);
      this.removeActiveObject();
    });

    document.addEventListener('onTabsChange', (e) => {
      console.log('on tabs change', e);
      this.Map.removeActiveMarker();
      this.removeActiveObject();
    });

    document.addEventListener('onPreviewClose', (e) => {
      console.log('on preview close', e);
      this.Map.removeActiveMarker();
      this.removeActiveObject();
    });
  }

  getInitObjectList() {
    const objectListNode = this.getObjectListNode(this.Tabs.activeTab);
    const objectList = objectListNode.querySelectorAll('.js-object');

    return [].map.call(objectList, (node) => {
      const object = node.dataset;

      const { markerColor, markerIcon, closed, coords = '' } = object;
      const marker = { color: markerColor, icon: markerIcon, closed };
      const coordsArray = coords.split(',');

      const isActive = node.classList.contains('active');

      node.addEventListener('click', () => {
        this.handleObjectClick(object.id);
      });

      return {
        id: object.id,
        name: object.name,
        location: object.location,
        schedule: object.schedule,
        coords: coordsArray,
        isActive,
        marker,
      };
    });
  }

  fetchObjectList() {
    const params = {
      category: this.Tabs.activeTab,
      ...this.Filters.options,
    };

    const currTab = this.Tabs.activeTab;

    this.makeRequest(createURL(`${this.apiUrl}/list.json`, params))
      .then(objectList => this.handleSuccessFetchObjectList(objectList, currTab))
      .catch(error => console.error(error));
  }

  handleSuccessFetchObjectList(objectList, targetTab) {
    if (targetTab !== this.Tabs.activeTab) {
      return false;
    }

    this.objectList = objectList;
    this.renderObjectList(targetTab);

    this.Map.removeAllMarkers();
    this.renderMapMarkers();
  }

  renderMapMarkers() {
    const markerList = this.selectMarkerList();
    this.Map.renderMarkers(markerList);
  }

  selectMarkerList() {
    return this.objectList.map((object) => ({
      coords: object.coords,
      marker: object.marker,
      name: object.name,
      id: object.id,
    }));
  }

  renderObjectList(targetTab) {
    const documentFragment = new DocumentFragment();
    const objectListNode = this.getObjectListNode(targetTab);

    this.objectList.forEach((object) => {
      const objectCard = createObjectCard(object);

      objectCard.querySelector('[data-container]')
        .addEventListener('click', () => {
          this.handleObjectClick(object.id);
        });

      documentFragment.appendChild(objectCard);
    });

    objectListNode.innerHTML = '';
    objectListNode.scrollTo(0, 0);
    objectListNode.appendChild(documentFragment);
  }

  getObjectListNode(category) {
    return this.node.querySelector(`.js-objects[data-category=${category}]`);
  }

  fetchObjectDetails(id) {
    this.makeRequest(createURL(`${this.apiUrl}/details.json`, { id }))
      .then(objectDetails => this.handleSuccessFetchObjectDetails(objectDetails))
      .catch(error => console.error(error));
  }

  handleSuccessFetchObjectDetails(data) {
    this.Preview.renderObjectDetails(data);
    this.Preview.showPreview();
  }

  handleMapInit() {
    this.renderMapMarkers();

    if (!this.activeObject) return;
    this.Map.setActiveMarker(this.activeObject);
    this.Map.centerOnActiveMarker();
  }

  handleFiltersChange(center) {
    this.Map.centerOnActiveArea(center);
    this.Map.removeActiveMarker();
    this.fetchObjectList();
  }

  handleInitActiveObject() {
    const activeObject =
      this.objectList.find((object) => {
        return object.isActive;
      });

    if (activeObject) {
      this.handleMarkerClick(activeObject.id);
      this.activeObject = activeObject.id;
    }
  }

  handleObjectClick(objectId) {
    this.setActiveObject(objectId);
    this.fetchObjectDetails(objectId);

    this.Map.setActiveMarker(objectId);
    this.Map.centerOnActiveMarker();

    this.Preview.clearObjectDetails();
    this.Preview.showPreview();
  }

  handleMarkerClick(objectId) {
    this.fetchObjectDetails(objectId);
    this.Preview.clearObjectDetails();
    this.Preview.showPreview();
  }

  setActiveObject(objectId) {
    this.activeObject = objectId;
    this.objectList = this.objectList.map((object) => {
      return { ...object, isActive: object.id === objectId };
    });
  }

  removeActiveObject() {
    this.activeObject = null;
    this.objectList = this.objectList.map((object) => {
      return { ...object, isActive: false };
    });
  }

  makeRequest(url) {
    return fetch(url, {
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => {
      return response.json();
    });
  }

  getAPIUrl() {
    return this.node.dataset.apiUrl;
  }

  static createInstance(node) {
    return new Widget(node);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.querySelector('.js-map-widget');
  if (node) Widget.createInstance(node);
});
