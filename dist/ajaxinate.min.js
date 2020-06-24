'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ajaxinate = Ajaxinate;
/* @preserve
 * https://github.com/Elkfox/Ajaxinate
 * Copyright (c) 2017 Elkfox Co Pty Ltd (elkfox.com)
 * MIT License (do not remove above copyright!)
 */

/* Configurable options;
 *
 * method: scroll or click
 * container: selector of repeating content
 * pagination: selector of pagination container
 * offset: number of pixels before the bottom to start loading more on scroll
 * loadingText: 'Loading', The text shown during when appending new content
 * callback: null, callback function after new content is appended
 *
 * Usage;
 *
 * import {Ajaxinate} from 'ajaxinate';
 *
 * new Ajaxinate({
 *   offset: 5000,
 *   loadingText: 'Loading more...',
 * });
 */

/* eslint-env browser */
function Ajaxinate(config) {
  var settings = config || {};

  var defaults = {
    method: 'scroll',
    container: '#AjaxinateContainer',
    pagination: '#AjaxinatePagination',
    offset: 0,
    loadingText: 'Loading',
    callback: null
  };

  // Merge custom configs with defaults
  this.settings = Object.assign(defaults, settings);

  // Functions
  this.addScrollListeners = this.addScrollListeners.bind(this);
  this.addClickListener = this.addClickListener.bind(this);
  this.checkIfPaginationInView = this.checkIfPaginationInView.bind(this);
  this.preventMultipleClicks = this.preventMultipleClicks.bind(this);
  this.removeClickListener = this.removeClickListener.bind(this);
  this.removeScrollListener = this.removeScrollListener.bind(this);
  this.removePaginationElement = this.removePaginationElement.bind(this);
  this.destroy = this.destroy.bind(this);

  // Selectors
  this.containerElement = document.querySelector(this.settings.container);
  this.paginationElement = document.querySelector(this.settings.pagination);
  this.initialize();
}

Ajaxinate.prototype.initialize = function initialize() {
  if (!this.containerElement) {
    return;
  }

  var initializers = {
    click: this.addClickListener,
    scroll: this.addScrollListeners
  };

  initializers[this.settings.method]();
};

Ajaxinate.prototype.addScrollListeners = function addScrollListeners() {
  if (!this.paginationElement) {
    return;
  }

  document.addEventListener('scroll', this.checkIfPaginationInView);
  window.addEventListener('resize', this.checkIfPaginationInView);
  window.addEventListener('orientationchange', this.checkIfPaginationInView);
};

Ajaxinate.prototype.addClickListener = function addClickListener() {
  if (!this.paginationElement) {
    return;
  }

  this.nextPageLinkElement = this.paginationElement.querySelector('a');
  this.clickActive = true;

  if (typeof this.nextPageLinkElement !== 'undefined' && this.nextPageLinkElement !== null) {
    this.nextPageLinkElement.addEventListener('click', this.preventMultipleClicks);
  }
};

Ajaxinate.prototype.preventMultipleClicks = function preventMultipleClicks(event) {
  event.preventDefault();

  if (!this.clickActive) {
    return;
  }

  this.nextPageLinkElement.innerText = this.settings.loadingText;
  this.nextPageUrl = this.nextPageLinkElement.href;
  this.clickActive = false;

  this.loadMore();
};

Ajaxinate.prototype.checkIfPaginationInView = function checkIfPaginationInView() {
  var top = this.paginationElement.getBoundingClientRect().top - this.settings.offset;
  var bottom = this.paginationElement.getBoundingClientRect().bottom + this.settings.offset;

  if (top <= window.innerHeight && bottom >= 0) {
    this.nextPageLinkElement = this.paginationElement.querySelector('a');
    this.removeScrollListener();

    if (this.nextPageLinkElement) {
      this.nextPageLinkElement.innerText = this.settings.loadingText;
      this.nextPageUrl = this.nextPageLinkElement.href;

      this.loadMore();
    }
  }
};

Ajaxinate.prototype.loadMore = function loadMore() {
  this.request = new XMLHttpRequest();

  this.request.onreadystatechange = function success() {
    if (!this.request.responseXML) {
      return;
    }
    if (!this.request.readyState === 4 || !this.request.status === 200) {
      return;
    }

    var newContainer = this.request.responseXML.querySelectorAll(this.settings.container)[0];
    var newPagination = this.request.responseXML.querySelectorAll(this.settings.pagination)[0];

    this.containerElement.insertAdjacentHTML('beforeend', newContainer.innerHTML);

    if (typeof newPagination === 'undefined') {
      this.removePaginationElement();
    } else {
      this.paginationElement.innerHTML = newPagination.innerHTML;

      if (this.settings.callback && typeof this.settings.callback === 'function') {
        this.settings.callback(this.request.responseXML);
      }

      this.initialize();
    }
  }.bind(this);

  this.request.open('GET', this.nextPageUrl);
  this.request.responseType = 'document';
  this.request.send();
};

Ajaxinate.prototype.removeClickListener = function removeClickListener() {
  this.nextPageLinkElement.removeEventListener('click', this.preventMultipleClicks);
};

Ajaxinate.prototype.removePaginationElement = function removePaginationElement() {
  this.paginationElement.innerHTML = '';
  this.destroy();
};

Ajaxinate.prototype.removeScrollListener = function removeScrollListener() {
  document.removeEventListener('scroll', this.checkIfPaginationInView);
  window.removeEventListener('resize', this.checkIfPaginationInView);
  window.removeEventListener('orientationchange', this.checkIfPaginationInView);
};

Ajaxinate.prototype.destroy = function destroy() {
  var destroyers = {
    click: this.removeClickListener,
    scroll: this.removeScrollListener
  };

  destroyers[this.settings.method]();

  return this;
};

exports.default = Ajaxinate;