'use strict';

/* ===================================================================================== @preserve =
 ___  _   _    _
/   || | | |  | |
\__  | | | |  | |  __
/    |/  |/_) |/  /  \_/\/
\___/|__/| \_/|__/\__/  /\_/
              |\
              |/
Ajaxinate
version v2.0.11
https://github.com/Elkfox/Ajaxinate
Copyright (c) 2017 Elkfox Co Pty Ltd
https://elkfox.com
MIT License
================================================================================================= */

var Ajaxinate = function ajaxinateConstructor(config) {
  var settings = config || {};
  /*
    pagination: Selector of pagination container
    method: [options are 'scroll', 'click']
    container: Selector of repeating content
    offset: 0, offset the number of pixels before the bottom to start loading more on scroll
    loadingText: 'Loading', The text changed during loading
    callback: null, function to callback after a new page is loaded
  */
  var defaultSettings = {
    pagination: '#AjaxinatePagination',
    method: 'scroll',
    container: '#AjaxinateLoop',
    offset: 0,
    loadingText: 'Loading',
    callback: null
  };
  // Merge configs
  this.settings = Object.assign(defaultSettings, settings);

  // Bind 'this' to applicable prototype functions
  this.addScrollListeners = this.addScrollListeners.bind(this);
  this.addClickListener = this.addClickListener.bind(this);
  this.checkIfPaginationInView = this.checkIfPaginationInView.bind(this);
  this.stopMultipleClicks = this.stopMultipleClicks.bind(this);
  this.destroy = this.destroy.bind(this);

  // Set up our element selectors
  this.containerElement = document.querySelector(this.settings.container);
  this.paginationElement = document.querySelector(this.settings.pagination);

  this.initialize();
};

Ajaxinate.prototype.initialize = function initializeTheCorrectFunctionsBasedOnTheMethod() {
  // Find and initialise the correct function based on the method set in the config
  if (this.containerElement) {
    var initializers = {
      click: this.addClickListener,
      scroll: this.addScrollListeners
    };
    initializers[this.settings.method]();
  }
};

Ajaxinate.prototype.addScrollListeners = function addEventListenersForScrolling() {
  if (this.paginationElement) {
    document.addEventListener('scroll', this.checkIfPaginationInView);
    window.addEventListener('resize', this.checkIfPaginationInView);
    window.addEventListener('orientationchange', this.checkIfPaginationInView);
  }
};

Ajaxinate.prototype.addClickListener = function addEventListenerForClicking() {
  if (this.paginationElement) {
    this.nextPageLinkElement = this.paginationElement.querySelector('a');
    this.clickActive = true;
    if (this.nextPageLinkElement !== null) {
      this.nextPageLinkElement.addEventListener('click', this.stopMultipleClicks);
    }
  }
};

Ajaxinate.prototype.stopMultipleClicks = function handleClickEvent(event) {
  event.preventDefault();
  if (this.clickActive) {
    this.nextPageLinkElement.innerHTML = this.settings.loadingText;
    this.nextPageUrl = this.nextPageLinkElement.href;
    this.clickActive = false;
    this.loadMore();
  }
};

Ajaxinate.prototype.checkIfPaginationInView = function handleScrollEvent() {
  var top = this.paginationElement.getBoundingClientRect().top - this.settings.offset;
  var bottom = this.paginationElement.getBoundingClientRect().bottom + this.settings.offset;
  if (top <= window.innerHeight && bottom >= 0) {
    this.nextPageLinkElement = this.paginationElement.querySelector('a');
    this.removeScrollListener();
    if (this.nextPageLinkElement) {
      this.nextPageLinkElement.innerHTML = this.settings.loadingText;
      this.nextPageUrl = this.nextPageLinkElement.href;
      this.loadMore();
    }
  }
};

Ajaxinate.prototype.loadMore = function getTheHtmlOfTheNextPageWithAnAjaxRequest() {
  this.request = new XMLHttpRequest();
  this.request.onreadystatechange = function success() {
    if (this.request.readyState === 4 && this.request.status === 200) {
      var newContainer = this.request.responseXML.querySelectorAll(this.settings.container)[0];
      var newPagination = this.request.responseXML.querySelectorAll(this.settings.pagination)[0];
      this.containerElement.insertAdjacentHTML('beforeend', newContainer.innerHTML);
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

Ajaxinate.prototype.removeClickListener = function removeClickEventListener() {
  this.nextPageLinkElement.addEventListener('click', this.stopMultipleClicks);
};

Ajaxinate.prototype.removeScrollListener = function removeScrollEventListener() {
  document.removeEventListener('scroll', this.checkIfPaginationInView);
  window.removeEventListener('resize', this.checkIfPaginationInView);
  window.removeEventListener('orientationchange', this.checkIfPaginationInView);
};

Ajaxinate.prototype.destroy = function removeEventListenersAndReturnThis() {
  // This method is used to unbind event listeners from the DOM
  // This function is called manually to destroy "this" Ajaxinate instance
  var destroyers = {
    click: this.removeClickListener,
    scroll: this.removeScrollListener
  };
  destroyers[this.settings.method]();
  return this;
};